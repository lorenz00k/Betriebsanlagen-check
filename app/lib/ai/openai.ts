/**
 * OpenAI Client for Embeddings
 *
 * Generates vector embeddings for text using OpenAI's text-embedding-3-small model.
 * These embeddings are used for semantic search in Pinecone.
 */

import OpenAI from 'openai';

// Singleton pattern für OpenAI Client
let openaiClient: OpenAI | null = null;

/**
 * Initialize OpenAI Client
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }

  return openaiClient;
}

/**
 * Embedding Model Configuration
 */
export const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small',
  dimensions: 1536,  // text-embedding-3-small erzeugt 1536-dimensionale Vektoren
  encoding_format: 'float' as const
};

/**
 * Generate embedding for a single text
 *
 * @param text The text to embed
 * @returns Vector embedding (1536 dimensions)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();

    // Leere Strings verhindern
    if (!text || text.trim().length === 0) {
      throw new Error('Cannot generate embedding for empty text');
    }

    const response = await client.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: text,
      encoding_format: EMBEDDING_CONFIG.encoding_format,
      dimensions: EMBEDDING_CONFIG.dimensions
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No embedding returned from OpenAI');
    }

    return response.data[0].embedding;
  } catch (error) {
    console.error('❌ Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts (batch)
 *
 * @param texts Array of texts to embed
 * @returns Array of vector embeddings
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const client = getOpenAIClient();

    // Filter leere Strings
    const validTexts = texts.filter(t => t && t.trim().length > 0);

    if (validTexts.length === 0) {
      throw new Error('No valid texts to embed');
    }

    // OpenAI erlaubt max 2048 Inputs pro Request
    const BATCH_SIZE = 2048;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < validTexts.length; i += BATCH_SIZE) {
      const batch = validTexts.slice(i, i + BATCH_SIZE);

      const response = await client.embeddings.create({
        model: EMBEDDING_CONFIG.model,
        input: batch,
        encoding_format: EMBEDDING_CONFIG.encoding_format,
        dimensions: EMBEDDING_CONFIG.dimensions
      });

      const embeddings = response.data.map(item => item.embedding);
      allEmbeddings.push(...embeddings);

      console.log(`✅ Generated embeddings for batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(validTexts.length / BATCH_SIZE)}`);
    }

    return allEmbeddings;
  } catch (error) {
    console.error('❌ Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Calculate token count estimate
 *
 * OpenAI charges per token. Rough estimate: 1 token ≈ 4 characters
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculate embedding cost estimate
 *
 * text-embedding-3-small: $0.00002 per 1K tokens
 */
export function estimateEmbeddingCost(texts: string[]): number {
  const totalTokens = texts.reduce((sum, text) => sum + estimateTokens(text), 0);
  const costPerToken = 0.00002 / 1000;
  return totalTokens * costPerToken;
}

/**
 * Test OpenAI connection
 */
export async function testOpenAIConnection() {
  try {
    const testText = "Dies ist ein Test.";
    const embedding = await generateEmbedding(testText);

    return {
      success: true,
      message: 'OpenAI connection successful',
      model: EMBEDDING_CONFIG.model,
      dimensions: embedding.length,
      testEmbeddingSample: embedding.slice(0, 5) // Erste 5 Werte als Sample
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
}
