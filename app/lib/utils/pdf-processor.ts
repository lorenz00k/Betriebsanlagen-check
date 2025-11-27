/**
 * PDF Processing Utilities
 *
 * Extracts text from PDFs and prepares them for embedding
 */

import fs from 'fs/promises';
import path from 'path';
import { splitTextIntoChunks, DEFAULT_CHUNK_CONFIG } from './chunking';

export interface PDFChunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    page?: number;
    section?: string;
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

export interface PagedText {
  fullText: string;
  pages: Array<{
    pageNumber: number;
    text: string;
    startIndex: number;
    endIndex: number;
  }>;
  totalPages: number;
}

/**
 * Extract text from a single PDF file with page information
 */
async function extractTextFromPDFWithPages(pdfPath: string): Promise<PagedText> {
  try {
    const dataBuffer = await fs.readFile(pdfPath);

    // Dynamic import to handle CommonJS module
    const pdfParse = (await import('pdf-parse')).default;

    const pages: PagedText['pages'] = [];
    let currentIndex = 0;

    // Use pagerender to extract text page by page
    const data = await pdfParse(dataBuffer, {
      pagerender: async (pageData: { pageNumber: number; getTextContent: () => Promise<{ items: Array<{ str: string }> }> }) => {
        const textContent = await pageData.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str)
          .join(' ')
          .trim();

        const startIndex = currentIndex;
        const endIndex = currentIndex + pageText.length;

        pages.push({
          pageNumber: pageData.pageNumber,
          text: pageText,
          startIndex,
          endIndex
        });

        // Add page separator and update index
        currentIndex = endIndex + 2; // +2 for \n\n separator

        return pageText;
      }
    });

    const fullText = pages.map(p => p.text).join('\n\n').trim();

    return {
      fullText,
      pages,
      totalPages: data.numpages
    };
  } catch (error) {
    console.error(`Error extracting text from ${pdfPath}:`, error);
    throw error;
  }
}

/**
 * Extract text from a single PDF file using pdf-parse (dynamic import)
 * Legacy function - kept for backward compatibility
 */
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  const pagedText = await extractTextFromPDFWithPages(pdfPath);
  return pagedText.fullText;
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
        // Extract text with page information
        const pagedText = await extractTextFromPDFWithPages(filePath);

        if (!pagedText.fullText || pagedText.fullText.trim().length === 0) {
          console.log(`⚠️  No text extracted from ${filename}`);
          continue;
        }

        // Split into chunks
        const textChunks = splitTextIntoChunks(pagedText.fullText, DEFAULT_CHUNK_CONFIG);

        if (textChunks.length === 0) {
          console.log(`⚠️  No chunks created from ${filename}`);
          continue;
        }

        const fileChars = pagedText.fullText.length;
        totalCharacters += fileChars;

        // Helper function to find which page a chunk belongs to
        const findPageForChunk = (chunkStartIndex: number): number | undefined => {
          // Find the page that contains the start of this chunk
          for (const page of pagedText.pages) {
            if (chunkStartIndex >= page.startIndex && chunkStartIndex < page.endIndex) {
              return page.pageNumber;
            }
          }
          // If not found in exact range, find the closest page
          const closestPage = pagedText.pages.reduce((prev, curr) => {
            const prevDist = Math.abs(prev.startIndex - chunkStartIndex);
            const currDist = Math.abs(curr.startIndex - chunkStartIndex);
            return currDist < prevDist ? curr : prev;
          });
          return closestPage?.pageNumber;
        };

        // Convert to PDFChunk format with section extraction and page numbers
        const pdfChunks: PDFChunk[] = textChunks.map((chunk, index) => {
          // Extract § paragraph references from chunk text
          const sectionMatches = chunk.text.match(/§\s*\d+[a-z]?(\s+[A-Z][a-zäöüß]+)?/gi);
          const section = sectionMatches && sectionMatches.length > 0
            ? sectionMatches[0].trim()  // Use first § found in chunk
            : undefined;

          // Find the page number for this chunk
          const pageNumber = chunk.start !== undefined
            ? findPageForChunk(chunk.start)
            : undefined;

          return {
            id: `${filename.replace('.pdf', '')}_chunk_${index}`,
            text: chunk.text,
            metadata: {
              source: filename,
              page: pageNumber,
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
          pages: pagedText.totalPages,
          chunks: textChunks.length,
          characters: fileChars
        });

        console.log(`✅ ${filename}: ${pagedText.totalPages} pages, ${textChunks.length} chunks, ${fileChars} characters`);

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
