/**
 * API Route: /api/rag/embed
 *
 * Processes PDFs from /documents/raw-pdfs/ and uploads them to Pinecone
 *
 * POST /api/rag/embed
 * {
 *   "action": "process_all" | "clear_and_process" | "clear_only"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { processAllPDFs, type PDFChunk } from '@/app/lib/utils/pdf-processor';
import { generateEmbeddings } from '@/app/lib/ai/openai';
import { upsertVectors, deleteAllVectors } from '@/app/lib/vectordb/pinecone';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for PDF processing

interface EmbedRequest {
  action?: 'process_all' | 'clear_and_process' | 'clear_only';
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: EmbedRequest = await request.json();
    const action = body.action || 'process_all';

    console.log(`🚀 Starting embed process with action: ${action}`);

    // STEP 1: Clear existing vectors if requested
    if (action === 'clear_only' || action === 'clear_and_process') {
      console.log('🗑️  Clearing existing vectors from Pinecone...');
      await deleteAllVectors();
      console.log('✅ Vectors cleared');

      if (action === 'clear_only') {
        return NextResponse.json({
          success: true,
          message: 'All vectors cleared from Pinecone',
          processingTime: Date.now() - startTime
        });
      }
    }

    // STEP 2: Process PDFs
    console.log('📄 Processing PDFs...');
    const documentsPath = path.join(process.cwd(), 'documents', 'raw-pdfs');
    const { chunks, metadata } = await processAllPDFs(documentsPath);

    if (chunks.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No PDFs found or no text extracted',
        metadata: {
          filesFound: metadata.totalFiles,
          chunksCreated: 0
        }
      }, { status: 400 });
    }

    console.log(`✅ Created ${chunks.length} chunks from ${metadata.totalFiles} PDFs`);

    // STEP 3: Generate embeddings
    console.log('🔢 Generating embeddings with OpenAI...');
    const texts = chunks.map(chunk => chunk.text);

    let embeddings: number[][];
    try {
      embeddings = await generateEmbeddings(texts);
      console.log(`✅ Generated ${embeddings.length} embeddings`);
    } catch (error) {
      console.error('❌ Error generating embeddings:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to generate embeddings',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata
      }, { status: 500 });
    }

    // Verify embeddings count matches chunks
    if (embeddings.length !== chunks.length) {
      console.error(`❌ Embedding count mismatch: ${embeddings.length} vs ${chunks.length}`);
      return NextResponse.json({
        success: false,
        message: 'Embedding count does not match chunk count',
        metadata
      }, { status: 500 });
    }

    // STEP 4: Prepare vectors for Pinecone
    console.log('📦 Preparing vectors for Pinecone...');
    const dateAdded = new Date().toISOString();
    const vectors = chunks.map((chunk, index) => ({
      id: chunk.id,
      values: embeddings[index],
      metadata: {
        text: chunk.text,
        source: chunk.metadata.source,
        page: chunk.metadata.page,
        chunk_index: chunk.metadata.chunk_index,
        total_chunks: chunk.metadata.total_chunks,
        date_added: dateAdded
      }
    }));

    // STEP 5: Upload to Pinecone
    console.log('⬆️  Uploading to Pinecone...');
    try {
      await upsertVectors(vectors);
      console.log('✅ Upload complete!');
    } catch (error) {
      console.error('❌ Error uploading to Pinecone:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to upload vectors to Pinecone',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata
      }, { status: 500 });
    }

    // STEP 6: Calculate costs
    const totalTokens = texts.reduce((sum, text) => sum + Math.ceil(text.length / 4), 0);
    const embeddingCost = (totalTokens / 1_000_000) * 0.00002; // $0.00002 per 1K tokens

    const processingTime = Date.now() - startTime;

    // Success response
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${metadata.totalFiles} PDFs and uploaded ${chunks.length} chunks to Pinecone`,
      metadata: {
        files: metadata.files,
        totalFiles: metadata.totalFiles,
        totalChunks: metadata.totalChunks,
        totalCharacters: metadata.totalCharacters,
        embeddingsGenerated: embeddings.length,
        vectorsUploaded: vectors.length,
        estimatedCost: {
          embeddings: `$${embeddingCost.toFixed(4)}`,
          totalTokens: totalTokens
        },
        processingTime: `${(processingTime / 1000).toFixed(2)}s`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Embed process failed:', error);

    return NextResponse.json({
      success: false,
      message: 'Embed process failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET method for status/help
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/rag/embed',
    description: 'Process PDFs and upload to Pinecone vector database',
    method: 'POST',
    bodySchema: {
      action: {
        type: 'string',
        enum: ['process_all', 'clear_and_process', 'clear_only'],
        default: 'process_all',
        description: {
          process_all: 'Process PDFs and add to existing vectors',
          clear_and_process: 'Clear all vectors, then process PDFs',
          clear_only: 'Only clear vectors, do not process PDFs'
        }
      }
    },
    example: {
      action: 'process_all'
    },
    requirements: [
      'PDFs must be in /documents/raw-pdfs/',
      'OPENAI_API_KEY must be set',
      'PINECONE_API_KEY must be set',
      'PINECONE_INDEX_NAME must be set'
    ]
  });
}
