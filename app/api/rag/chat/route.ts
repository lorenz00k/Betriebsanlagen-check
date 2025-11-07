/**
 * API Route: /api/rag/chat
 *
 * RAG-powered Chat Interface
 * Accepts user questions and returns AI-generated answers with sources
 *
 * POST /api/rag/chat
 * {
 *   "query": "User's question",
 *   "userContext": {              // Optional
 *     "businessType": "restaurant",
 *     "businessSize": "80",
 *     "location": "1010 Wien"
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { performRAGQuery } from '@/app/lib/ai/rag';
import type { UserContext } from '@/app/lib/ai/anthropic';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for RAG query

interface ChatRequest {
  query: string;
  userContext?: UserContext;
  filter?: Record<string, unknown>;
}

/**
 * POST handler - Process RAG query
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ChatRequest = await request.json();
    const { query, userContext, filter } = body;

    // Validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Query is required and must be a non-empty string',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (query.length > 1000) {
      return NextResponse.json({
        success: false,
        error: 'Query too long (max 1000 characters)',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    console.log('\n' + '='.repeat(70));
    console.log('💬 RAG CHAT REQUEST');
    console.log('='.repeat(70));
    console.log(`📝 Query: ${query}`);
    if (userContext) {
      console.log(`👤 User Context:`, JSON.stringify(userContext, null, 2));
    }
    if (filter) {
      console.log(`🔍 Filter:`, JSON.stringify(filter, null, 2));
    }
    console.log('='.repeat(70));

    // Perform RAG query using existing orchestration
    const result = await performRAGQuery(query, userContext, filter);

    const duration = Date.now() - startTime;

    console.log('\n' + '='.repeat(70));
    console.log('✅ RAG CHAT RESPONSE');
    console.log('='.repeat(70));
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📚 Sources found: ${result.sources.length}`);
    console.log(`🤖 Model: ${result.metadata?.model ?? 'unknown'}`);

    // Safe access to usage data from metadata.usage
    const inputTokens = result.metadata?.usage?.input_tokens ?? 0;
    const outputTokens = result.metadata?.usage?.output_tokens ?? 0;
    const totalTokens = result.metadata?.usage?.total_tokens ?? 0;

    console.log(`📊 Tokens: ${inputTokens} in / ${outputTokens} out / ${totalTokens} total`);
    console.log('='.repeat(70) + '\n');

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
    console.error('\n❌ RAG Chat failed:', error);

    // Check for specific error types
    if (error instanceof Error) {
      // OpenAI API error
      if (error.message.includes('OpenAI')) {
        return NextResponse.json({
          success: false,
          error: 'Embedding generation failed',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }

      // Pinecone error
      if (error.message.includes('Pinecone')) {
        return NextResponse.json({
          success: false,
          error: 'Vector search failed',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }

      // Anthropic error
      if (error.message.includes('Anthropic') || error.message.includes('Claude')) {
        return NextResponse.json({
          success: false,
          error: 'AI response generation failed',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 503 });
      }
    }

    // Generic error
    return NextResponse.json({
      success: false,
      error: 'RAG query failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration,
      timestamp: new Date().toISOString()
    }, { status: 500 });
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
