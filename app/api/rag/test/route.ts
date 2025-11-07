/**
 * Test API Route for RAG System
 *
 * Tests all connections: Pinecone, OpenAI, Anthropic
 */

import { NextResponse } from 'next/server';
import { testPineconeConnection } from '@/app/lib/vectordb/pinecone';
import { testOpenAIConnection } from '@/app/lib/ai/openai';
import { testAnthropicConnection } from '@/app/lib/ai/anthropic';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('🧪 Testing RAG system connections...');

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
    console.error('❌ Test failed:', error);

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
