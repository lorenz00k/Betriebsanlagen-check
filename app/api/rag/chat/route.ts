/**
 * API Route: /api/rag/chat
 *
 * RAG-powered Chat Interface
 * Accepts user questions and returns AI-generated answers with sources
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { performRAGQuery } from '@/app/lib/ai/rag';
import { getCachedResponse, setCachedResponse } from '@/app/lib/cache/rag-cache';
import { logger } from '@/app/lib/utils/logger';
import { sanitizeQuery } from '@/app/lib/utils/sanitize';
import { apiError } from '@/app/lib/api/response';
import { isRateLimited, getRateLimitInfo, getClientIdentifier, rateLimitPresets } from '@/app/lib/middleware/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Zod schemas for request validation
const UserContextSchema = z.object({
  businessType: z.string().optional(),
  businessSize: z.string().optional(),
  location: z.string().optional(),
  numberOfEmployees: z.number().optional(),
  outdoorSeating: z.boolean().optional(),
}).optional();

const ChatRequestSchema = z.object({
  query: z.string()
    .min(1, 'Query is required')
    .max(1000, 'Query too long (max 1000 characters)'),
  userContext: UserContextSchema,
  filter: z.record(z.string(), z.unknown()).optional(),
});

/**
 * POST handler - Process RAG query
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const endTimer = logger.time('rag-chat');

  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (isRateLimited(clientId, rateLimitPresets.chat)) {
    const limitInfo = getRateLimitInfo(clientId, rateLimitPresets.chat);
    logger.warn('Rate limit exceeded', {
      component: 'rag-chat',
      action: 'rate-limited',
      clientId: clientId.substring(0, 10) + '...'
    });
    return apiError.rateLimited(limitInfo.reset);
  }

  try {
    const body = await request.json();

    // Zod validation
    const parseResult = ChatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors[0]?.message ?? 'Invalid request';
      logger.warn('RAG chat validation failed', {
        component: 'rag-chat',
        action: 'validation'
      });
      return apiError.validation(errorMessage);
    }

    const { userContext, filter } = parseResult.data;
    // Sanitize query to prevent injection
    const query = sanitizeQuery(parseResult.data.query);

    logger.debug('RAG chat request received', {
      component: 'rag-chat',
      action: 'request',
      queryLength: query.length,
      hasUserContext: !!userContext,
      hasFilter: !!filter
    });

    // Try to get cached response first
    const cacheContext = userContext ? {
      businessType: userContext.businessType,
      businessSize: userContext.businessSize,
      location: userContext.location,
      numberOfEmployees: userContext.numberOfEmployees,
      outdoorSeating: userContext.outdoorSeating
    } : undefined;

    const cachedResponse = await getCachedResponse(query, cacheContext);

    if (cachedResponse) {
      const duration = Date.now() - startTime;
      endTimer();

      logger.debug('Cache hit - returning cached response', {
        component: 'rag-chat',
        action: 'cache-hit',
        duration,
        sourcesCount: cachedResponse.sources.length,
        model: cachedResponse.metadata.model
      });

      return NextResponse.json({
        success: true,
        answer: cachedResponse.answer,
        sources: cachedResponse.sources,
        metadata: {
          ...cachedResponse.metadata,
          duration_ms: duration,
          cached: true,
          cached_at: cachedResponse.cached_at,
          original_timestamp: cachedResponse.original_timestamp
        }
      });
    }

    logger.debug('Cache miss - performing RAG query', {
      component: 'rag-chat',
      action: 'cache-miss'
    });

    // Perform RAG query using existing orchestration
    const result = await performRAGQuery(query, userContext, filter);

    const duration = Date.now() - startTime;
    endTimer();

    // Safe access to usage data from metadata.usage
    const inputTokens = result.metadata?.usage?.input_tokens ?? 0;
    const outputTokens = result.metadata?.usage?.output_tokens ?? 0;
    const totalTokens = result.metadata?.usage?.total_tokens ?? 0;

    logger.info('RAG query completed', {
      component: 'rag-chat',
      action: 'response',
      duration,
      sourcesCount: result.sources.length,
      model: result.metadata?.model ?? 'unknown',
      tokensIn: inputTokens,
      tokensOut: outputTokens,
      tokensTotal: totalTokens
    });

    // Store response in cache for future requests
    await setCachedResponse(
      query,
      {
        answer: result.answer,
        sources: result.sources.map(source => ({
          title: source.title,
          content: source.content,
          page: source.page,
          section: source.section,
          score: source.score
        })),
        metadata: {
          model: result.metadata?.model ?? 'claude-3-5-haiku-20241022',
          usage: {
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            total_tokens: totalTokens
          },
          duration_ms: duration,
          documents_found: result.metadata?.documents_found ?? 0,
          documents_used: result.metadata?.documents_used ?? 0
        }
      },
      cacheContext,
      3600 // 1 hour TTL (Time-To-Live)
    );

    // Return response
    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources.map(source => ({
        title: source.title,
        content: source.content,
        page: source.page,
        section: source.section,
        score: source.score
      })),
      metadata: {
        model: result.metadata?.model ?? 'claude-3-5-haiku-20241022',
        usage: {
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          total_tokens: totalTokens
        },
        duration_ms: duration,
        documents_found: result.metadata?.documents_found ?? 0,
        documents_used: result.metadata?.documents_used ?? 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    endTimer();

    logger.error('RAG Chat failed', error, {
      component: 'rag-chat',
      action: 'error',
      duration
    });

    // Check for specific error types
    if (error instanceof Error) {
      // OpenAI API error
      if (error.message.includes('OpenAI')) {
        return apiError.serviceUnavailable('Embedding generation failed');
      }

      // Pinecone error
      if (error.message.includes('Pinecone')) {
        return apiError.serviceUnavailable('Vector search failed');
      }

      // Anthropic error
      if (error.message.includes('Anthropic') || error.message.includes('Claude')) {
        return apiError.serviceUnavailable('AI response generation failed');
      }
    }

    // Generic error - don't expose internal error details to client
    return apiError.internal('RAG query failed');
  }
}

/**
 * GET handler - API information
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: '/api/rag/chat',
    description: 'RAG-powered chat interface for answering questions about Betriebsanlagengenehmigungen',
    methods: {
      POST: {
        description: 'Submit a question and get an AI-generated answer with sources',
        body: {
          query: 'string (required, max 1000 chars) - The user\'s question',
          userContext: {
            businessType: 'string (optional) - Type of business (e.g., "restaurant", "cafe")',
            businessSize: 'string (optional) - Size in m² (e.g., "80")',
            location: 'string (optional) - Address in Vienna (e.g., "1010 Wien")',
            numberOfEmployees: 'number (optional)',
            outdoorSeating: 'boolean (optional)'
          },
          filter: 'object (optional) - Pinecone metadata filter'
        },
        response: {
          success: 'boolean',
          answer: 'string - AI-generated answer',
          sources: 'array - Relevant source documents with metadata',
          metadata: {
            model: 'string - Claude model used',
            usage: 'object - Token usage statistics',
            duration_ms: 'number - Request duration',
            timestamp: 'string - ISO timestamp'
          }
        }
      }
    },
    examples: [
      {
        description: 'Simple question',
        request: {
          query: 'Brauche ich eine UVP für ein Restaurant mit 80m²?'
        }
      },
      {
        description: 'Question with context',
        request: {
          query: 'Welche Dokumente brauche ich für meinen Antrag?',
          userContext: {
            businessType: 'restaurant',
            businessSize: '80',
            location: '1010 Wien'
          }
        }
      },
      {
        description: 'Question with filter',
        request: {
          query: 'Was steht in der Gewerbeordnung über Hygienevorschriften?',
          filter: {
            type: { '$eq': 'gewerbeordnung' }
          }
        }
      }
    ],
    model: 'claude-3-5-haiku-20241022',
    embeddings: 'text-embedding-3-small',
    vectorDatabase: 'Pinecone',
    timestamp: new Date().toISOString()
  });
}
