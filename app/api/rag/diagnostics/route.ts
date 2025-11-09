/**
 * RAG Diagnostics API
 * Checks Pinecone document quality and quantity
 */

import { NextResponse } from 'next/server';
import { getPineconeClient } from '@/app/lib/vectordb/pinecone';
import { generateEmbedding } from '@/app/lib/ai/openai';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  try {
    const pinecone = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME || 'betriebsanlage-docs';
    const index = pinecone.index(indexName);

    // Get index stats
    const stats = await index.describeIndexStats();

    // Query for sample documents with a generic search
    const testQuery = 'Betriebsanlagengenehmigung Wien Restaurant';
    const embedding = await generateEmbedding(testQuery);

    const queryResponse = await index.query({
      vector: embedding,
      topK: 20,
      includeMetadata: true
    });

    // Analyze chunks
    const chunks = queryResponse.matches || [];

    interface ChunkSample {
      id: string;
      source: string;
      page: number;
      score: number;
      textLength: number;
      textPreview: string;
      hasSection: boolean;
      section?: string;
    }

    const chunkAnalysis = {
      total: chunks.length,
      avgTextLength: 0,
      minTextLength: Infinity,
      maxTextLength: 0,
      avgScore: 0,
      sources: new Set<string>(),
      pages: new Set<number>(),
      samples: [] as ChunkSample[]
    };

    let totalLength = 0;
    let totalScore = 0;

    chunks.forEach((match, idx) => {
      const text = match.metadata?.text as string || '';
      const source = match.metadata?.source as string || '';
      const page = match.metadata?.page as number || 0;

      totalLength += text.length;
      totalScore += match.score || 0;

      if (text.length < chunkAnalysis.minTextLength) {
        chunkAnalysis.minTextLength = text.length;
      }
      if (text.length > chunkAnalysis.maxTextLength) {
        chunkAnalysis.maxTextLength = text.length;
      }

      chunkAnalysis.sources.add(source);
      chunkAnalysis.pages.add(page);

      // Sample first 10
      if (idx < 10) {
        chunkAnalysis.samples.push({
          id: match.id,
          source,
          page,
          score: match.score,
          textLength: text.length,
          textPreview: text.substring(0, 200) + '...',
          hasSection: !!match.metadata?.section,
          section: match.metadata?.section
        });
      }
    });

    if (chunks.length > 0) {
      chunkAnalysis.avgTextLength = Math.round(totalLength / chunks.length);
      chunkAnalysis.avgScore = totalScore / chunks.length;
    }

    // Document quality assessment
    const qualityIssues = [];

    if (stats.totalRecordCount < 50) {
      qualityIssues.push({
        severity: 'HIGH',
        issue: 'Too few documents',
        detail: `Only ${stats.totalRecordCount} chunks in database. Should have 100+ for good coverage.`,
        recommendation: 'Run /api/rag/embed to process more PDFs'
      });
    }

    if (chunkAnalysis.avgTextLength < 100) {
      qualityIssues.push({
        severity: 'HIGH',
        issue: 'Chunks too small',
        detail: `Average chunk size: ${chunkAnalysis.avgTextLength} chars. Too small for meaningful context.`,
        recommendation: 'Increase chunk size in chunking config (min 200 chars)'
      });
    }

    if (chunkAnalysis.avgTextLength > 2000) {
      qualityIssues.push({
        severity: 'MEDIUM',
        issue: 'Chunks too large',
        detail: `Average chunk size: ${chunkAnalysis.avgTextLength} chars. May be too general.`,
        recommendation: 'Decrease chunk size for better specificity'
      });
    }

    if (chunkAnalysis.sources.size < 3) {
      qualityIssues.push({
        severity: 'HIGH',
        issue: 'Too few source documents',
        detail: `Only ${chunkAnalysis.sources.size} unique PDF sources found.`,
        recommendation: 'Add more PDF documents to public/documents/legal/'
      });
    }

    if (chunks.length > 0 && chunkAnalysis.avgScore < 0.4) {
      qualityIssues.push({
        severity: 'MEDIUM',
        issue: 'Low similarity scores',
        detail: `Average similarity: ${chunkAnalysis.avgScore.toFixed(3)}. Documents may not be relevant.`,
        recommendation: 'Check if documents are about Betriebsanlagengenehmigung'
      });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),

      pineconeStats: {
        totalVectors: stats.totalRecordCount,
        dimension: stats.dimension,
        indexName: indexName,
        namespaces: stats.namespaces
      },

      chunkAnalysis: {
        ...chunkAnalysis,
        sources: Array.from(chunkAnalysis.sources),
        pages: Array.from(chunkAnalysis.pages).sort((a, b) => a - b),
        minTextLength: chunkAnalysis.minTextLength === Infinity ? 0 : chunkAnalysis.minTextLength
      },

      qualityAssessment: {
        overallStatus: qualityIssues.length === 0 ? 'GOOD' :
                      qualityIssues.some(i => i.severity === 'HIGH') ? 'POOR' : 'NEEDS_IMPROVEMENT',
        issues: qualityIssues,
        summary: qualityIssues.length === 0
          ? 'Documents are well-structured and sufficient for RAG queries'
          : `Found ${qualityIssues.length} issues that may affect RAG quality`
      },

      recommendations: [
        qualityIssues.length === 0
          ? 'No action needed - system is working well'
          : 'Fix quality issues listed above',
        stats.totalRecordCount < 100
          ? 'Consider adding more PDF documents'
          : 'Document coverage looks good',
        chunkAnalysis.avgTextLength < 300
          ? 'Consider increasing chunk size for better context'
          : 'Chunk size is appropriate'
      ]
    });

  } catch (error) {
    console.error('Diagnostics failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
