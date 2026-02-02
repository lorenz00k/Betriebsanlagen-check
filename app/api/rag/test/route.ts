/**
 * Test API Route for RAG System
 *
 * Tests all connections: Pinecone, OpenAI, Anthropic
 */

import { NextRequest, NextResponse } from 'next/server';
import { testPineconeConnection } from '@/app/lib/vectordb/pinecone';
import { testOpenAIConnection } from '@/app/lib/ai/openai';
import { testAnthropicConnection } from '@/app/lib/ai/anthropic';
import { logger } from '@/app/lib/utils/logger';
import { validateAdminAuth } from '@/app/lib/middleware/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Validate admin authentication
  const authError = validateAdminAuth(request);
  if (authError) {
    return authError;
  }

  try {
    logger.debug('Testing RAG system connections', { component: 'rag-test', action: 'start' });

    // Test all services in parallel
    const [pineconeTest, openaiTest, anthropicTest] = await Promise.all([
      testPineconeConnection(),
      testOpenAIConnection(),
      testAnthropicConnection()
    ]);

    // Check if all tests passed
    const allPassed =
      pineconeTest.success &&
      openaiTest.success &&
      anthropicTest.success;

    return NextResponse.json({
      success: allPassed,
      message: allPassed
        ? '✅ All RAG system components are working!'
        : '❌ Some components failed. Check details below.',
      tests: {
        pinecone: pineconeTest,
        openai: openaiTest,
        anthropic: anthropicTest
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('RAG test failed', error, { component: 'rag-test', action: 'GET' });

    return NextResponse.json(
      {
        success: false,
        message: 'Test failed with error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
