/**
 * RAG (Retrieval-Augmented Generation) Orchestration
 *
 * Orchestrates the complete RAG pipeline:
 * 1. Generate embedding for user query
 * 2. Search Pinecone for relevant documents
 * 3. Generate response with Claude using retrieved context
 */

import { generateEmbedding } from './openai';
import { queryVectors, queryByHierarchyPath } from '../vectordb/pinecone';
import { generateRAGResponse, type UserContext, type SourceDocument } from './anthropic';

/**
 * RAG Configuration
 * FIXED: Hardcoded to 0.5 because ENV variable was not being picked up
 */
export const RAG_CONFIG = {
  topK: parseInt(process.env.RAG_TOP_K || '8'),           // INCREASED: Get more documents (was 5)
  minScore: 0.15,  // ULTRA-LOW: Accept almost everything (was 0.25, still had edge cases)
  minDocsForFallback: 5,  // If no docs meet threshold, use top 5 anyway (was 3)
};

/**
 * RAG Query Response Interface
 */
export interface RAGQueryResponse {
  success: boolean;
  answer: string;
  sources: Array<{
    title: string;
    content: string;
    page?: number;
    section?: string;
    score: number;
  }>;
  metadata: {
    model: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
    };
    duration_ms: number;
    documents_found: number;
    documents_used: number;
  };
  error?: string;
}

/**
 * Main RAG Query Function
 *
 * @param userQuery Die Frage des Users
 * @param userContext Optionaler Kontext (Betriebsart, Größe, etc.)
 * @param filter Optional Pinecone metadata filter
 */
export async function performRAGQuery(
  userQuery: string,
  userContext?: UserContext,
  filter?: Record<string, unknown>
): Promise<RAGQueryResponse> {
  const startTime = Date.now();

  try {
    // Validierung
    if (!userQuery || userQuery.trim().length === 0) {
      return {
        success: false,
        answer: '',
        sources: [],
        metadata: {
          model: '',
          usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
          duration_ms: 0,
          documents_found: 0,
          documents_used: 0
        },
        error: 'User query cannot be empty'
      };
    }

    console.log('🔍 Starting RAG query:', userQuery.substring(0, 100));
    console.log('🎯 Using minScore threshold:', RAG_CONFIG.minScore);

    // STEP 1: Generate embedding for user query
    console.log('📊 Generating query embedding...');
    const queryEmbedding = await generateEmbedding(userQuery);

    // STEP 2: Search Pinecone for relevant documents
    console.log('🔎 Searching Pinecone for relevant documents...');
    let searchResults = await queryVectors(
      queryEmbedding,
      RAG_CONFIG.topK,
      filter
    );

    console.log(`✅ Found ${searchResults.length} documents`);

    // BACKUP QUERY: If Pinecone returns nothing at all, try a generic query
    if (searchResults.length === 0) {
      console.log('⚠️  No documents found. Trying backup query with generic keywords...');
      const backupQuery = 'Betriebsanlagengenehmigung Wien Gastronomie Restaurant Genehmigungsverfahren Unterlagen Antrag';
      const backupEmbedding = await generateEmbedding(backupQuery);
      searchResults = await queryVectors(backupEmbedding, RAG_CONFIG.topK, undefined);
      console.log(`✅ Backup query found ${searchResults.length} documents`);
    }

    // DEBUG: Log all document scores
    console.log('📊 Document scores:');
    searchResults.forEach((result, idx) => {
      console.log(`   ${idx + 1}. Score: ${result.score?.toFixed(4)} | Source: ${result.metadata?.source || 'Unknown'} | Text: ${(result.metadata?.text as string || '').substring(0, 100)}...`);
    });

    // Filter by minimum score
    let relevantDocs = searchResults.filter(
      result => (result.score || 0) >= RAG_CONFIG.minScore
    );

    console.log(`✅ ${relevantDocs.length} documents meet minimum score threshold (${RAG_CONFIG.minScore})`);

    // FALLBACK: If no docs meet threshold, use top N docs anyway
    // This ensures Claude always gets context to work with
    if (relevantDocs.length === 0 && searchResults.length > 0) {
      console.log(`⚠️  No documents above threshold. Using top ${RAG_CONFIG.minDocsForFallback} as fallback.`);
      relevantDocs = searchResults.slice(0, RAG_CONFIG.minDocsForFallback);
      console.log(`📊 Fallback document scores: ${relevantDocs.map(d => d.score?.toFixed(3)).join(', ')}`);
    }

    // Only fail if we literally have no documents at all
    if (relevantDocs.length === 0) {
      return {
        success: false,
        answer: 'Es tut mir leid, aber ich konnte keine Informationen in der Datenbank finden. Dies könnte bedeuten, dass die Dokumente noch nicht geladen wurden. Bitte versuchen Sie es später erneut oder kontaktieren Sie die MA 36 direkt.',
        sources: [],
        metadata: {
          model: '',
          usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
          duration_ms: Date.now() - startTime,
          documents_found: searchResults.length,
          documents_used: 0
        },
        error: 'No documents in database'
      };
    }

    // STEP 3: Enrich documents with parent context (hierarchical chunking)
    console.log('🔗 Checking for hierarchical parent context...');

    // Cache parent sections to avoid duplicate queries
    const parentContextCache = new Map<string, string>();
    let enrichedDocCount = 0;

    const sourceDocuments: SourceDocument[] = await Promise.all(
      relevantDocs.map(async (result) => {
        let text = result.metadata?.text as string || '';
        const source = result.metadata?.source as string || 'Unknown';

        // Check if this document has parent context
        const parentSection = result.metadata?.parent_section as string | undefined;
        const hierarchyPath = result.metadata?.hierarchy_path as string | undefined;

        if (parentSection && hierarchyPath) {
          // Check cache first
          let parentText = parentContextCache.get(parentSection);

          if (!parentText) {
            // Fetch parent section from Pinecone
            try {
              const parentDocs = await queryByHierarchyPath(parentSection, source);

              if (parentDocs.length > 0) {
                // Get the first chunk of the parent section (intro text)
                parentText = parentDocs[0].metadata?.text as string || '';
                parentContextCache.set(parentSection, parentText);

                console.log(`   📚 Found parent context: ${parentSection} (${parentText.length} chars)`);
              }
            } catch (error) {
              console.warn(`   ⚠️  Failed to fetch parent context for ${parentSection}:`, error);
            }
          }

          // Prepend parent context if available
          if (parentText && parentText !== text) {
            text = `[Parent Context: ${parentSection}]\n${parentText}\n\n[Current Section: ${hierarchyPath}]\n${text}`;
            enrichedDocCount++;
          }
        }

        return {
          text,
          source,
          page: result.metadata?.page as number | undefined,
          section: result.metadata?.section as string | undefined,
          score: result.score || 0
        };
      })
    );

    if (enrichedDocCount > 0) {
      console.log(`✨ Enriched ${enrichedDocCount}/${sourceDocuments.length} documents with parent context`);
    } else {
      console.log('ℹ️  No hierarchical documents found (or documents are top-level sections)');
    }

    // STEP 4: Generate response with Claude
    console.log('🤖 Generating response with Claude...');
    const claudeResponse = await generateRAGResponse(
      userQuery,
      sourceDocuments,
      userContext
    );

    console.log('✅ RAG query completed successfully');

    // STEP 5: Format response
    const queryTime = Date.now() - startTime;

    return {
      success: true,
      answer: claudeResponse.answer,
      sources: sourceDocuments.map(doc => ({
        title: `${doc.source}${doc.section ? ` - ${doc.section}` : ''}`,
        content: doc.text.substring(0, 500) + (doc.text.length > 500 ? '...' : ''),
        page: doc.page,
        section: doc.section,
        score: doc.score
      })),
      metadata: {
        model: claudeResponse.model,
        usage: {
          input_tokens: claudeResponse.usage.inputTokens,
          output_tokens: claudeResponse.usage.outputTokens,
          total_tokens: claudeResponse.usage.inputTokens + claudeResponse.usage.outputTokens
        },
        duration_ms: queryTime,
        documents_found: searchResults.length,
        documents_used: relevantDocs.length
      }
    };
  } catch (error) {
    console.error('❌ RAG query failed:', error);

    return {
      success: false,
      answer: '',
      sources: [],
      metadata: {
        model: '',
        usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
        duration_ms: Date.now() - startTime,
        documents_found: 0,
        documents_used: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Batch RAG Query
 * Führt mehrere Queries parallel aus
 */
export async function performBatchRAGQuery(
  queries: Array<{
    query: string;
    context?: UserContext;
    filter?: Record<string, unknown>;
  }>
): Promise<RAGQueryResponse[]> {
  console.log(`🔄 Processing ${queries.length} queries in batch...`);

  const results = await Promise.all(
    queries.map(({ query, context, filter }) =>
      performRAGQuery(query, context, filter)
    )
  );

  console.log('✅ Batch query completed');

  return results;
}

/**
 * Get RAG Statistics
 */
export function getRAGStats(response: RAGQueryResponse) {
  const inputCostPerToken = 0.25 / 1_000_000;  // Claude 3.5 Haiku
  const outputCostPerToken = 1.25 / 1_000_000;

  const cost =
    response.metadata.usage.input_tokens * inputCostPerToken +
    response.metadata.usage.output_tokens * outputCostPerToken;

  return {
    queryTimeMs: response.metadata.duration_ms,
    documentsFound: response.metadata.documents_found,
    documentsUsed: response.metadata.documents_used,
    tokensUsed: response.metadata.usage.total_tokens,
    estimatedCost: cost,
    averageSourceScore:
      response.sources.length > 0
        ? response.sources.reduce((sum, s) => sum + s.score, 0) / response.sources.length
        : 0
  };
}
