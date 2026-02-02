/**
 * API Route: /api/rag/embed-from-json
 *
 * Reads extracted.json from Python script and uploads to Pinecone
 *
 * POST /api/rag/embed-from-json
 * {
 *   "action": "process_all" | "clear_and_process" | "clear_only"
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { splitTextIntoChunks, DEFAULT_CHUNK_CONFIG } from '@/app/lib/utils/chunking';
import { generateEmbeddings } from '@/app/lib/ai/openai';
import { upsertVectors, deleteAllVectors } from '@/app/lib/vectordb/pinecone';
import type { DocumentMetadata } from '@/app/lib/vectordb/pinecone';
import { logger } from '@/app/lib/utils/logger';
import { validateAdminAuth } from '@/app/lib/middleware/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for large uploads

interface ExtractedPDF {
  text: string;
  pages: number;
  error?: string;
}

interface ExtractedData {
  [filename: string]: ExtractedPDF;
}

/**
 * Detect document type from filename
 */
function detectDocumentType(filename: string): string {
  const lower = filename.toLowerCase();

  if (lower.includes('gewerbe')) return 'gewerbeordnung';
  if (lower.includes('bau')) return 'bauordnung';
  if (lower.includes('lebensmittel')) return 'lebensmittelgesetz';
  if (lower.includes('hygiene')) return 'hygieneverordnung';
  if (lower.includes('gfvo')) return 'gfvo';
  if (lower.includes('gastgewerbe') || lower.includes('gastro')) return 'gastgewerbegesetz';
  if (lower.includes('genehmigung')) return 'genehmigungsverordnung';

  return 'gesetz';
}

/**
 * Process extracted JSON and upload to Pinecone
 */
async function processExtractedJSON(): Promise<{
  success: boolean;
  stats: {
    totalDocuments: number;
    totalChunks: number;
    totalCharacters: number;
    skippedDocuments: number;
    documents: Array<{
      filename: string;
      chunks: number;
      characters: number;
      error?: string;
    }>;
  };
}> {
  logger.info('Starting JSON processing', { component: 'embed-from-json', action: 'start' });

  // Read extracted.json
  const jsonPath = path.join(process.cwd(), 'documents', 'processed', 'extracted.json');

  let extractedData: ExtractedData;
  try {
    const fileContent = await readFile(jsonPath, 'utf-8');
    extractedData = JSON.parse(fileContent);
    logger.info('Loaded extracted.json', { component: 'embed-from-json', action: 'load', documentCount: Object.keys(extractedData).length });
  } catch (error) {
    logger.error('Failed to read extracted.json', error, { component: 'embed-from-json', action: 'load' });
    throw new Error(`Could not read extracted.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const documentsStats: Array<{
    filename: string;
    chunks: number;
    characters: number;
    error?: string;
  }> = [];

  let totalChunks = 0;
  let totalCharacters = 0;
  let skippedDocuments = 0;
  const allVectors: Array<{
    id: string;
    values: number[];
    metadata: DocumentMetadata;
  }> = [];

  // Process each document
  for (const [filename, data] of Object.entries(extractedData)) {
    logger.debug('Processing document', { component: 'embed-from-json', action: 'process', filename });

    // Skip documents with errors or empty text
    if (data.error || !data.text || data.text.trim().length === 0) {
      logger.warn('Skipping document', { component: 'embed-from-json', action: 'skip', filename, reason: data.error || 'No text found' });
      documentsStats.push({
        filename,
        chunks: 0,
        characters: 0,
        error: data.error || 'No text found'
      });
      skippedDocuments++;
      continue;
    }

    try {
      // Split text into chunks
      const textChunks = splitTextIntoChunks(data.text, DEFAULT_CHUNK_CONFIG);
      logger.debug('Created chunks', { component: 'embed-from-json', action: 'chunk', filename, chunkCount: textChunks.length });

      // Detect document type
      const documentType = detectDocumentType(filename);

      // Prepare texts for embedding
      const textsToEmbed = textChunks.map(chunk => chunk.text);

      // Generate embeddings (batched automatically by OpenAI client)
      logger.debug('Generating embeddings', { component: 'embed-from-json', action: 'embed', filename });
      const embeddings = await generateEmbeddings(textsToEmbed);
      logger.debug('Generated embeddings', { component: 'embed-from-json', action: 'embed', filename, embeddingCount: embeddings.length });

      // Create vectors with metadata
      const cleanFilename = filename.replace(/\.[^/.]+$/, '').toLowerCase();
      const sanitizedFilename = cleanFilename.replace(/[^a-z0-9-]/g, '-');

      const vectors = textChunks.map((chunk, index) => {
        // Estimate page number based on position
        const estimatedPage = Math.floor((chunk.start / data.text.length) * data.pages) + 1;

        // Try to detect section (e.g., "§ 74")
        const sectionMatch = chunk.text.match(/§\s*\d+[a-z]?/i);
        const section = sectionMatch ? sectionMatch[0] : undefined;

        const id = `${sanitizedFilename}_chunk_${index}`;

        return {
          id,
          values: embeddings[index],
          metadata: {
            text: chunk.text,
            source: filename,
            type: documentType,
            page: estimatedPage,
            section,
            chunk_index: index,
            total_chunks: textChunks.length,
            date_added: new Date().toISOString()
          }
        };
      });

      allVectors.push(...vectors);

      const docCharacters = textChunks.reduce((sum, c) => sum + c.text.length, 0);
      totalChunks += textChunks.length;
      totalCharacters += docCharacters;

      documentsStats.push({
        filename,
        chunks: textChunks.length,
        characters: docCharacters
      });

      logger.debug('Prepared vectors', { component: 'embed-from-json', action: 'vectors', filename, vectorCount: vectors.length });

    } catch (error) {
      logger.error('Failed to process document', error, { component: 'embed-from-json', action: 'process', filename });
      documentsStats.push({
        filename,
        chunks: 0,
        characters: 0,
        error: error instanceof Error ? error.message : 'Processing failed'
      });
      skippedDocuments++;
    }
  }

  // Upload all vectors to Pinecone
  if (allVectors.length > 0) {
    logger.info('Uploading vectors to Pinecone', { component: 'embed-from-json', action: 'upload', vectorCount: allVectors.length });
    await upsertVectors(allVectors);
    logger.info('Upload complete', { component: 'embed-from-json', action: 'upload' });
  } else {
    logger.warn('No vectors to upload', { component: 'embed-from-json', action: 'upload' });
  }

  return {
    success: true,
    stats: {
      totalDocuments: Object.keys(extractedData).length,
      totalChunks,
      totalCharacters,
      skippedDocuments,
      documents: documentsStats
    }
  };
}

/**
 * POST handler
 */
export async function POST(request: NextRequest) {
  // Validate admin authentication
  const authError = validateAdminAuth(request);
  if (authError) {
    return authError;
  }

  try {
    const body = await request.json();
    const action = body.action || 'process_all';

    logger.info('Embed-from-JSON action started', { component: 'embed-from-json', action });

    // Handle clear action
    if (action === 'clear_only' || action === 'clear_and_process') {
      logger.info('Clearing Pinecone index', { component: 'embed-from-json', action: 'clear' });
      await deleteAllVectors();
      logger.info('Index cleared', { component: 'embed-from-json', action: 'clear' });

      if (action === 'clear_only') {
        return NextResponse.json({
          success: true,
          message: 'Pinecone index cleared successfully',
          timestamp: new Date().toISOString()
        });
      }
    }

    // Process JSON
    const result = await processExtractedJSON();

    logger.info('Processing complete', {
      component: 'embed-from-json',
      action: 'complete',
      totalDocuments: result.stats.totalDocuments,
      totalChunks: result.stats.totalChunks,
      totalCharacters: result.stats.totalCharacters,
      skippedDocuments: result.stats.skippedDocuments
    });

    return NextResponse.json({
      success: true,
      message: 'Documents processed and uploaded successfully',
      stats: result.stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Processing failed', error, { component: 'embed-from-json', action: 'POST' });

    return NextResponse.json({
      success: false,
      message: 'Processing failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

/**
 * GET handler - returns info about extracted.json
 */
export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'documents', 'processed', 'extracted.json');

    // Check if file exists
    let fileExists = false;
    let documentCount = 0;
    let totalCharacters = 0;

    try {
      const fileContent = await readFile(jsonPath, 'utf-8');
      const data: ExtractedData = JSON.parse(fileContent);
      fileExists = true;
      documentCount = Object.keys(data).length;
      totalCharacters = Object.values(data).reduce((sum, doc) => sum + (doc.text?.length || 0), 0);
    } catch {
      // File doesn't exist or is invalid
    }

    return NextResponse.json({
      success: true,
      fileExists,
      filePath: jsonPath,
      stats: fileExists ? {
        documentCount,
        totalCharacters,
        averageCharactersPerDocument: Math.round(totalCharacters / documentCount)
      } : null,
      message: fileExists
        ? `Found ${documentCount} documents in extracted.json`
        : 'extracted.json not found. Run the Python script first: python scripts/extract_pdfs.py',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
