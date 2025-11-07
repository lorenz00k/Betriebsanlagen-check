/**
 * API Route: /api/rag/embed/status
 *
 * Returns status of Pinecone index (how many vectors are stored)
 *
 * GET /api/rag/embed/status
 */

import { NextResponse } from 'next/server';
import { getIndexStats } from '@/app/lib/vectordb/pinecone';
import { readdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('📊 Fetching Pinecone index stats...');

    // Get Pinecone stats
    const stats = await getIndexStats();

    // Get local PDF count
    const documentsPath = path.join(process.cwd(), 'documents', 'raw-pdfs');
    let localPDFCount = 0;
    try {
      const files = await readdir(documentsPath);
      localPDFCount = files.filter(f => f.toLowerCase().endsWith('.pdf')).length;
    } catch (error) {
      console.warn('⚠️  Could not read local PDF files');
    }

    // Calculate status
    const hasVectors = (stats.totalRecordCount || 0) > 0;
    const needsProcessing = localPDFCount > 0 && !hasVectors;

    return NextResponse.json({
      success: true,
      pinecone: {
        indexName: process.env.PINECONE_INDEX_NAME || 'gastro-genehmigung',
        totalVectors: stats.totalRecordCount || 0,
        dimension: stats.dimension || 0,
        namespaces: stats.namespaces || {}
      },
      local: {
        pdfFilesFound: localPDFCount,
        documentsPath: documentsPath
      },
      status: {
        hasVectors: hasVectors,
        needsProcessing: needsProcessing,
        message: hasVectors
          ? `✅ Index contains ${stats.totalRecordCount} vectors`
          : needsProcessing
          ? `⚠️  Found ${localPDFCount} PDFs but index is empty. Run /api/rag/embed to process them.`
          : '⚠️  No PDFs found and index is empty'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Status check failed:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to get status',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
