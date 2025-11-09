import { NextResponse } from 'next/server';
import { generateEmbedding } from '@/app/lib/ai/openai';
import { queryVectors, getIndexStats, getPineconeIndex } from '@/app/lib/vectordb/pinecone';

/**
 * Debug Route for Pinecone Vector Database
 *
 * Tests:
 * 1. Pinecone connection
 * 2. Index statistics (how many vectors)
 * 3. Test query with simple keywords
 * 4. Shows actual similarity scores
 */
export async function GET() {
  try {
    console.log('🔍 Starting Pinecone debug...');

    // Get Pinecone index
    const indexName = process.env.PINECONE_INDEX_NAME || 'gastro-genehmigung';
    getPineconeIndex(); // Initialize index connection

    // 1. Get index stats
    console.log('📊 Fetching index statistics...');
    const stats = await getIndexStats();

    // 2. Test simple query
    const testQueries = [
      'Restaurant Genehmigung Wien',
      'Betriebsanlagengenehmigung Gastro',
      'Schanigarten Außengastronomie',
      'MA 36 Unterlagen Antrag'
    ];

    const testResults = await Promise.all(
      testQueries.map(async (query) => {
        console.log(`🔎 Testing query: "${query}"`);

        // Generate embedding
        const embedding = await generateEmbedding(query);

        // Query Pinecone
        const results = await queryVectors(embedding, 5);

        return {
          query,
          resultsCount: results.length,
          topScores: results.map(r => ({
            score: r.score,
            source: r.metadata?.source as string || 'Unknown',
            text_preview: ((r.metadata?.text as string) || '').substring(0, 150)
          }))
        };
      })
    );

    // 3. Return comprehensive debug info
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      pinecone: {
        indexName,
        connected: true,
        stats: {
          totalVectors: stats.totalRecordCount || 0,
          dimensions: stats.dimension || 0,
          namespaces: stats.namespaces || {}
        }
      },
      testResults,
      interpretation: {
        vectorCount: stats.totalRecordCount || 0,
        expectedVectors: '~601 (if all documents are embedded)',
        scoringInfo: 'Scores range from 0 to 1. Higher is better. Typical good matches: 0.6-0.9',
        currentThreshold: 0.5,
        recommendation: stats.totalRecordCount === 0
          ? '⚠️ NO VECTORS IN INDEX - Need to re-embed documents!'
          : `✅ Index has ${stats.totalRecordCount} vectors`
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Pinecone debug failed:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
