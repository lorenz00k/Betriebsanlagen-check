/**
 * API Route: /api/rag/embed
 *
 * Processes PDFs from /public/pdfs/sources/ and uploads them to Pinecone
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'path';
import { processAllPDFs } from '@/app/lib/utils/pdf-processor';
import { generateEmbeddings } from '@/app/lib/ai/openai';
import { upsertVectors, deleteAllVectors } from '@/app/lib/vectordb/pinecone';
import { logger } from '@/app/lib/utils/logger';
import { validateAdminAuth } from '@/app/lib/middleware/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Zod schema for request validation
const EmbedRequestSchema = z.object({
  action: z.enum(['process_all', 'clear_and_process', 'clear_only']).default('process_all'),
});

export async function POST(request: NextRequest) {
  // Validate admin authentication
  const authError = validateAdminAuth(request);
  if (authError) {
    return authError;
  }

  const startTime = Date.now();
  const endTimer = logger.time('embed-process');

  try {
    const body = await request.json();

    // Zod validation
    const parseResult = EmbedRequestSchema.safeParse(body);
    if (!parseResult.success) {
      logger.warn('Embed request validation failed', { component: 'embed' });
      return NextResponse.json({
        success: false,
        error: 'Invalid action parameter',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const { action } = parseResult.data;

    logger.info('Starting embed process', {
      component: 'embed',
      action: action
    });

    // STEP 1: Clear existing vectors if requested
    if (action === 'clear_only' || action === 'clear_and_process') {
      logger.info('Clearing existing vectors from Pinecone', { component: 'embed' });
      await deleteAllVectors();
      logger.info('Vectors cleared', { component: 'embed' });

      if (action === 'clear_only') {
        return NextResponse.json({
          success: true,
          message: 'All vectors cleared from Pinecone',
          processingTime: Date.now() - startTime
        });
      }
    }

    // STEP 2: Process PDFs
    logger.info('Processing PDFs', { component: 'embed' });
    const documentsPath = path.join(process.cwd(), 'public', 'pdfs', 'sources');
    const { chunks, metadata } = await processAllPDFs(documentsPath);

    if (chunks.length === 0) {
      logger.warn('No PDFs found or no text extracted', {
        component: 'embed',
        filesFound: metadata.totalFiles
      });
      return NextResponse.json({
        success: false,
        message: 'No PDFs found or no text extracted',
        metadata: {
          filesFound: metadata.totalFiles,
          chunksCreated: 0
        }
      }, { status: 400 });
    }

    logger.info('PDF processing complete', {
      component: 'embed',
      chunksCreated: chunks.length,
      filesProcessed: metadata.totalFiles
    });

    // STEP 3: Generate embeddings
    logger.info('Generating embeddings with OpenAI', { component: 'embed' });
    const texts = chunks.map(chunk => chunk.text);

    let embeddings: number[][];
    try {
      embeddings = await generateEmbeddings(texts);
      logger.info('Embeddings generated', {
        component: 'embed',
        count: embeddings.length
      });
    } catch (error) {
      logger.error('Error generating embeddings', error, { component: 'embed' });
      return NextResponse.json({
        success: false,
        message: 'Failed to generate embeddings',
        metadata
      }, { status: 500 });
    }

    // Verify embeddings count matches chunks
    if (embeddings.length !== chunks.length) {
      logger.error('Embedding count mismatch', null, {
        component: 'embed',
        embeddingsCount: embeddings.length,
        chunksCount: chunks.length
      });
      return NextResponse.json({
        success: false,
        message: 'Embedding count does not match chunk count',
        metadata
      }, { status: 500 });
    }

    // STEP 4: Prepare vectors for Pinecone
    logger.debug('Preparing vectors for Pinecone', { component: 'embed' });
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
    logger.info('Uploading to Pinecone', { component: 'embed', vectorCount: vectors.length });
    try {
      await upsertVectors(vectors);
      logger.info('Upload complete', { component: 'embed' });
    } catch (error) {
      logger.error('Error uploading to Pinecone', error, { component: 'embed' });
      return NextResponse.json({
        success: false,
        message: 'Failed to upload vectors to Pinecone',
        metadata
      }, { status: 500 });
    }

    // STEP 6: Calculate costs
    const totalTokens = texts.reduce((sum, text) => sum + Math.ceil(text.length / 4), 0);
    const embeddingCost = (totalTokens / 1_000_000) * 0.00002; // $0.00002 per 1K tokens

    const processingTime = Date.now() - startTime;
    endTimer();

    logger.info('Embed process completed successfully', {
      component: 'embed',
      duration: processingTime,
      filesProcessed: metadata.totalFiles,
      chunksCreated: chunks.length,
      vectorsUploaded: vectors.length
    });

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
    endTimer();
    logger.error('Embed process failed', error, { component: 'embed' });

    return NextResponse.json({
      success: false,
      message: 'Embed process failed',
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
      'PDFs must be in /public/pdfs/sources/',
      'OPENAI_API_KEY must be set',
      'PINECONE_API_KEY must be set',
      'PINECONE_INDEX_NAME must be set'
    ]
  });
}
