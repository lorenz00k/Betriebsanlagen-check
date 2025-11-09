/**
 * PDF Processing Utilities
 *
 * Extracts text from PDFs and prepares them for embedding
 */

import fs from 'fs/promises';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { splitTextIntoChunks, DEFAULT_CHUNK_CONFIG } from './chunking';

// Configure PDF.js worker for Node.js environment
// Disable worker in server-side rendering
if (typeof window === 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

export interface PDFChunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    page?: number;
    chunk_index: number;
    total_chunks: number;
    char_count: number;
  };
}

export interface ProcessingMetadata {
  totalFiles: number;
  totalChunks: number;
  totalCharacters: number;
  files: {
    filename: string;
    pages: number;
    chunks: number;
    characters: number;
  }[];
}

interface TextContentItem {
  str: string;
  [key: string]: unknown;
}

/**
 * Extract text from a single PDF file
 */
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = new Uint8Array(dataBuffer);

    const loadingTask = pdfjsLib.getDocument({
      data,
      verbosity: 0,
      standardFontDataUrl: undefined,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = (textContent.items as TextContentItem[])
        .map((item) => item.str)
        .join(' ');

      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error(`Error extracting text from ${pdfPath}:`, error);
    throw error;
  }
}

/**
 * Process all PDF files in a directory
 */
export async function processAllPDFs(
  documentsPath: string
): Promise<{ chunks: PDFChunk[]; metadata: ProcessingMetadata }> {
  try {
    // Check if directory exists
    try {
      await fs.access(documentsPath);
    } catch {
      console.log(`Directory ${documentsPath} does not exist. Creating it...`);
      await fs.mkdir(documentsPath, { recursive: true });
      return {
        chunks: [],
        metadata: {
          totalFiles: 0,
          totalChunks: 0,
          totalCharacters: 0,
          files: []
        }
      };
    }

    // Read all files in directory
    const files = await fs.readdir(documentsPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log(`No PDF files found in ${documentsPath}`);
      return {
        chunks: [],
        metadata: {
          totalFiles: 0,
          totalChunks: 0,
          totalCharacters: 0,
          files: []
        }
      };
    }

    console.log(`Found ${pdfFiles.length} PDF files`);

    const allChunks: PDFChunk[] = [];
    const fileMetadata: ProcessingMetadata['files'] = [];
    let totalCharacters = 0;

    // Process each PDF file
    for (const filename of pdfFiles) {
      const filePath = path.join(documentsPath, filename);
      console.log(`Processing: ${filename}...`);

      try {
        // Extract text
        const text = await extractTextFromPDF(filePath);

        if (!text || text.trim().length === 0) {
          console.log(`⚠️  No text extracted from ${filename}`);
          continue;
        }

        // Split into chunks
        const textChunks = splitTextIntoChunks(text, DEFAULT_CHUNK_CONFIG);

        if (textChunks.length === 0) {
          console.log(`⚠️  No chunks created from ${filename}`);
          continue;
        }

        const fileChars = text.length;
        totalCharacters += fileChars;

        // Convert to PDFChunk format with section extraction
        const pdfChunks: PDFChunk[] = textChunks.map((chunk, index) => {
          // Extract § paragraph references from chunk text
          const sectionMatches = chunk.text.match(/§\s*\d+[a-z]?(\s+[A-Z][a-zäöüß]+)?/gi);
          const section = sectionMatches && sectionMatches.length > 0
            ? sectionMatches[0].trim()  // Use first § found in chunk
            : undefined;

          return {
            id: `${filename.replace('.pdf', '')}_chunk_${index}`,
            text: chunk.text,
            metadata: {
              source: filename,
              chunk_index: index,
              total_chunks: textChunks.length,
              char_count: chunk.text.length,
              section: section  // Add § paragraph as section metadata
            }
          };
        });

        allChunks.push(...pdfChunks);

        fileMetadata.push({
          filename,
          pages: 0, // We could track this if needed
          chunks: textChunks.length,
          characters: fileChars
        });

        console.log(`✅ ${filename}: ${textChunks.length} chunks, ${fileChars} characters`);

      } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error);
        // Continue with next file
      }
    }

    const metadata: ProcessingMetadata = {
      totalFiles: pdfFiles.length,
      totalChunks: allChunks.length,
      totalCharacters,
      files: fileMetadata
    };

    console.log(`\n📊 Processing complete:`);
    console.log(`   Files: ${metadata.totalFiles}`);
    console.log(`   Chunks: ${metadata.totalChunks}`);
    console.log(`   Characters: ${metadata.totalCharacters}`);

    return { chunks: allChunks, metadata };

  } catch (error) {
    console.error('Error in processAllPDFs:', error);
    throw error;
  }
}

/**
 * Process a single PDF file
 */
export async function processSinglePDF(
  filePath: string
): Promise<{ chunks: PDFChunk[]; metadata: { pages: number; chunks: number; characters: number } }> {
  const filename = path.basename(filePath);

  const text = await extractTextFromPDF(filePath);

  if (!text || text.trim().length === 0) {
    return {
      chunks: [],
      metadata: {
        pages: 0,
        chunks: 0,
        characters: 0
      }
    };
  }

  const textChunks = splitTextIntoChunks(text, DEFAULT_CHUNK_CONFIG);

  const pdfChunks: PDFChunk[] = textChunks.map((chunk, index) => ({
    id: `${filename.replace('.pdf', '')}_chunk_${index}`,
    text: chunk.text,
    metadata: {
      source: filename,
      chunk_index: index,
      total_chunks: textChunks.length,
      char_count: chunk.text.length
    }
  }));

  return {
    chunks: pdfChunks,
    metadata: {
      pages: 0,
      chunks: textChunks.length,
      characters: text.length
    }
  };
}
