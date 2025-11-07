/**
 * RAG (Retrieval-Augmented Generation) Orchestration
 *
 * Orchestrates the complete RAG pipeline:
 * 1. Generate embedding for user query
 * 2. Search Pinecone for relevant documents
 * 3. Generate response with Claude using retrieved context
 */

import { generateEmbedding } from './openai';
import { queryVectors } from '../vectordb/pinecone';
import { generateRAGResponse, type UserContext, type SourceDocument } from './anthropic';

/**
 * RAG Configuration
 * FIXED: Hardcoded to 0.5 because ENV variable was not being picked up
 */
export const RAG_CONFIG = {
  topK: parseInt(process.env.RAG_TOP_K || '5'),           // Anzahl relevanter Dokumente
  minScore: 0.5,  // HARDCODED: Minimum similarity score (was 0.7, too strict!)
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
    const searchResults = await queryVectors(
      queryEmbedding,
      RAG_CONFIG.topK,
      filter
    );

    console.log(`✅ Found ${searchResults.length} documents`);

    // DEBUG: Log all document scores
    console.log('📊 Document scores:');
    searchResults.forEach((result, idx) => {
      console.log(`   ${idx + 1}. Score: ${result.score?.toFixed(4)} | Source: ${result.metadata?.source || 'Unknown'} | Text: ${(result.metadata?.text as string || '').substring(0, 100)}...`);
    });

    // Filter by minimum score
    const relevantDocs = searchResults.filter(
      result => (result.score || 0) >= RAG_CONFIG.minScore
    );

    console.log(`✅ ${relevantDocs.length} documents meet minimum score threshold (${RAG_CONFIG.minScore})`);

    // Check if we have any relevant documents
    if (relevantDocs.length === 0) {
      return {
        success: false,
        answer: 'Leider wurden keine relevanten Informationen zu Ihrer Frage gefunden. Bitte formulieren Sie Ihre Frage anders oder kontaktieren Sie direkt die MA 36 in Wien.',
        sources: [],
        metadata: {
          model: '',
          usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
          duration_ms: Date.now() - startTime,
          documents_found: searchResults.length,
          documents_used: 0
        },
        error: 'No relevant documents found'
      };
    }

    // STEP 3: Prepare source documents for Claude
    const sourceDocuments: SourceDocument[] = relevantDocs.map(result => ({
      text: result.metadata?.text as string || '',
      source: result.metadata?.source as string || 'Unknown',
      page: result.metadata?.page as number | undefined,
      section: result.metadata?.section as string | undefined,
      score: result.score || 0
    }));

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
