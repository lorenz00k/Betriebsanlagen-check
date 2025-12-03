/**
 * RAG Response Caching Utilities
 *
 * Caches RAG query results to improve performance and reduce costs.
 * Uses Vercel KV (Redis) for distributed caching across serverless functions.
 */

import { kv } from '@vercel/kv';
import crypto from 'crypto';

export interface CachedRAGResponse {
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
  cached: boolean;
  cached_at?: string;
  original_timestamp?: string;
}

/**
 * Generate a cache key from the query and context
 */
export function generateCacheKey(query: string, context?: Record<string, unknown>): string {
  // Normalize query: lowercase, trim, remove extra spaces
  const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');

  // Include context in cache key if provided (business type, size, etc.)
  const contextString = context
    ? JSON.stringify(Object.entries(context).sort())
    : '';

  // Generate hash for efficient key storage
  const hash = crypto
    .createHash('sha256')
    .update(normalizedQuery + contextString)
    .digest('hex')
    .substring(0, 16); // Use first 16 chars of hash

  return `rag:query:${hash}`;
}

/**
 * Get cached response for a query
 */
export async function getCachedResponse(
  query: string,
  context?: Record<string, unknown>
): Promise<CachedRAGResponse | null> {
  try {
    const cacheKey = generateCacheKey(query, context);
    const cached = await kv.get<CachedRAGResponse>(cacheKey);

    if (cached) {
      console.log(`✅ Cache HIT for query: "${query.substring(0, 50)}..."`);
      return {
        ...cached,
        cached: true,
        cached_at: new Date().toISOString()
      };
    }

    console.log(`❌ Cache MISS for query: "${query.substring(0, 50)}..."`);
    return null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    // Don't fail the request if cache fails - just proceed without cache
    return null;
  }
}

/**
 * Store response in cache
 */
export async function setCachedResponse(
  query: string,
  response: Omit<CachedRAGResponse, 'cached' | 'cached_at' | 'original_timestamp'>,
  context?: Record<string, unknown>,
  ttl: number = 3600 // 1 hour default TTL
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(query, context);

    const cacheValue: CachedRAGResponse = {
      ...response,
      cached: false,
      original_timestamp: new Date().toISOString()
    };

    // Store with TTL (time-to-live)
    await kv.set(cacheKey, cacheValue, { ex: ttl });

    console.log(`💾 Cached response for query: "${query.substring(0, 50)}..." (TTL: ${ttl}s)`);
  } catch (error) {
    console.error('Cache storage error:', error);
    // Don't fail the request if cache fails
  }
}

/**
 * Invalidate cache for a specific query
 */
export async function invalidateCachedResponse(
  query: string,
  context?: Record<string, unknown>
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(query, context);
    await kv.del(cacheKey);
    console.log(`🗑️  Invalidated cache for query: "${query.substring(0, 50)}..."`);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Clear all RAG cache entries
 */
export async function clearAllRAGCache(): Promise<number> {
  try {
    // Get all keys matching our pattern
    const keys = await kv.keys('rag:query:*');

    if (keys.length === 0) {
      console.log('📭 No cache entries to clear');
      return 0;
    }

    // Delete all matching keys
    await Promise.all(keys.map(key => kv.del(key)));

    console.log(`🗑️  Cleared ${keys.length} cache entries`);
    return keys.length;
  } catch (error) {
    console.error('Cache clear error:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  total_entries: number;
  sample_keys: string[];
}> {
  try {
    const keys = await kv.keys('rag:query:*');

    return {
      total_entries: keys.length,
      sample_keys: keys.slice(0, 10) // Return first 10 keys as sample
    };
  } catch (error) {
    console.error('Cache stats error:', error);
    return {
      total_entries: 0,
      sample_keys: []
    };
  }
}

/**
 * Check if caching is enabled and available
 */
export async function isCacheAvailable(): Promise<boolean> {
  try {
    // Try a simple ping to check if KV is available
    await kv.set('cache:health', 'ok', { ex: 60 });
    const health = await kv.get('cache:health');
    return health === 'ok';
  } catch (error) {
    console.warn('Cache not available:', error);
    return false;
  }
}
