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
  console.log('\n🚀 Starting JSON processing...\n');

  // Read extracted.json
  const jsonPath = path.join(process.cwd(), 'documents', 'processed', 'extracted.json');

  let extractedData: ExtractedData;
  try {
    const fileContent = await readFile(jsonPath, 'utf-8');
    extractedData = JSON.parse(fileContent);
    console.log(`✅ Loaded extracted.json with ${Object.keys(extractedData).length} documents\n`);
  } catch (error) {
    console.error('❌ Failed to read extracted.json:', error);
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
    console.log(`📄 Processing: ${filename}`);

    // Skip documents with errors or empty text
    if (data.error || !data.text || data.text.trim().length === 0) {
      console.warn(`⚠️  Skipping ${filename}: ${data.error || 'No text found'}\n`);
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
      console.log(`   ✅ Created ${textChunks.length} chunks`);

      // Detect document type
      const documentType = detectDocumentType(filename);

      // Prepare texts for embedding
      const textsToEmbed = textChunks.map(chunk => chunk.text);

      // Generate embeddings (batched automatically by OpenAI client)
      console.log(`   🔄 Generating embeddings...`);
      const embeddings = await generateEmbeddings(textsToEmbed);
      console.log(`   ✅ Generated ${embeddings.length} embeddings`);

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

      console.log(`   ✅ Prepared ${vectors.length} vectors for upload\n`);

    } catch (error) {
      console.error(`   ❌ Failed to process ${filename}:`, error);
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
    console.log(`\n📤 Uploading ${allVectors.length} vectors to Pinecone...`);
    await upsertVectors(allVectors);
    console.log(`✅ Upload complete!\n`);
  } else {
    console.warn('⚠️  No vectors to upload\n');
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
  try {
    const body = await request.json();
    const action = body.action || 'process_all';

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Action: ${action}`);
    console.log('='.repeat(60));

    // Handle clear action
    if (action === 'clear_only' || action === 'clear_and_process') {
      console.log('\n🗑️  Clearing Pinecone index...');
      await deleteAllVectors();
      console.log('✅ Index cleared\n');

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

    console.log('\n' + '='.repeat(60));
    console.log('✅ PROCESSING COMPLETE');
    console.log('='.repeat(60));
    console.log(`📊 Total documents: ${result.stats.totalDocuments}`);
    console.log(`📊 Total chunks: ${result.stats.totalChunks}`);
    console.log(`📊 Total characters: ${result.stats.totalCharacters.toLocaleString()}`);
    console.log(`⚠️  Skipped documents: ${result.stats.skippedDocuments}`);
    console.log('='.repeat(60) + '\n');

    return NextResponse.json({
      success: true,
      message: 'Documents processed and uploaded successfully',
      stats: result.stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('\n❌ Processing failed:', error);

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
    } catch (error) {
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
