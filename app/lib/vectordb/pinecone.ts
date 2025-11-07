/**
 * Pinecone Vector Database Client
 *
 * Handles all interactions with Pinecone for storing and retrieving
 * document embeddings for the RAG system.
 */

import { Pinecone } from '@pinecone-database/pinecone';

// Singleton pattern für Pinecone Client
let pineconeClient: Pinecone | null = null;

/**
 * Initialize Pinecone Client
 */
export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    const apiKey = process.env.PINECONE_API_KEY;

    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }

    pineconeClient = new Pinecone({
      apiKey: apiKey,
    });
  }

  return pineconeClient;
}

/**
 * Get Pinecone Index
 */
export function getPineconeIndex() {
  const client = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME || 'gastro-genehmigung';

  return client.index(indexName);
}

/**
 * Document Metadata Interface
 */
export interface DocumentMetadata {
  text: string;           // Der eigentliche Text-Chunk
  source: string;         // Dateiname (z.B. "gewerbeordnung.pdf")
  page?: number;          // Seitenzahl im Original-PDF
  section?: string;       // z.B. "§ 74"
  category?: string;      // z.B. "genehmigung", "baurecht", "hygiene"
  chunk_index: number;    // Index des Chunks im Dokument
  total_chunks: number;   // Gesamtanzahl Chunks des Dokuments
  date_added: string;     // ISO Timestamp
}

/**
 * Upsert vectors to Pinecone
 *
 * @param vectors Array of vectors with metadata
 */
export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: DocumentMetadata;
  }>
) {
  try {
    const index = getPineconeIndex();

    // Pinecone hat ein Limit von 100 Vektoren pro Request
    const BATCH_SIZE = 100;

    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
      const batch = vectors.slice(i, i + BATCH_SIZE);
      await index.upsert(batch);

      console.log(`✅ Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(vectors.length / BATCH_SIZE)}`);
    }

    return {
      success: true,
      count: vectors.length
    };
  } catch (error) {
    console.error('❌ Error upserting vectors:', error);
    throw error;
  }
}

/**
 * Query vectors from Pinecone
 *
 * @param queryVector The embedding vector to search for
 * @param topK Number of results to return
 * @param filter Optional metadata filter
 */
export async function queryVectors(
  queryVector: number[],
  topK: number = 5,
  filter?: Record<string, any>
) {
  try {
    const index = getPineconeIndex();

    const queryResponse = await index.query({
      vector: queryVector,
      topK: topK,
      includeMetadata: true,
      filter: filter
    });

    return queryResponse.matches || [];
  } catch (error) {
    console.error('❌ Error querying vectors:', error);
    throw error;
  }
}

/**
 * Delete vectors by ID
 */
export async function deleteVectors(ids: string[]) {
  try {
    const index = getPineconeIndex();
    await index.deleteMany(ids);

    return {
      success: true,
      deleted: ids.length
    };
  } catch (error) {
    console.error('❌ Error deleting vectors:', error);
    throw error;
  }
}

/**
 * Delete all vectors in the index
 */
export async function deleteAllVectors() {
  try {
    const index = getPineconeIndex();
    await index.deleteAll();

    return {
      success: true,
      message: 'All vectors deleted'
    };
  } catch (error) {
    console.error('❌ Error deleting all vectors:', error);
    throw error;
  }
}

/**
 * Get index stats
 */
export async function getIndexStats() {
  try {
    const index = getPineconeIndex();
    const stats = await index.describeIndexStats();

    return stats;
  } catch (error) {
    console.error('❌ Error getting index stats:', error);
    throw error;
  }
}

/**
 * Test Pinecone connection
 */
export async function testPineconeConnection() {
  try {
    const stats = await getIndexStats();

    return {
      success: true,
      message: 'Pinecone connection successful',
      indexName: process.env.PINECONE_INDEX_NAME,
      totalVectors: stats.totalRecordCount || 0,
      dimension: stats.dimension || 0
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
}
