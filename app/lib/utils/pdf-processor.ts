/**
 * PDF Processing Utilities
 *
 * Extracts text from PDFs and prepares them for embedding
 */

import fs from 'fs/promises';
import path from 'path';
import { splitTextIntoChunks, DEFAULT_CHUNK_CONFIG } from './chunking';
import { parseLegalDocument, getSectionPath, type LegalSection } from './legal-document-parser';
import { logger } from '@/app/lib/utils/logger';

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
    // Hierarchical metadata for legal documents
    hierarchy_level?: number;  // 0 = paragraph, 1 = absatz, 2 = ziffer
    hierarchy_path?: string;   // e.g., "§ 77 Abs. 2 Z 1"
    parent_section?: string;   // Reference to parent section
    has_children?: boolean;    // Whether this section has subsections
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
    logger.error('Error extracting text from PDF', error, { component: 'pdf-processor', action: 'extractText', path: pdfPath });
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
 * Find which legal section a chunk belongs to based on its position
 */
function findChunkSection(
  chunkStart: number,
  chunkEnd: number,
  sections: LegalSection[]
): LegalSection | null {
  // Recursively search through sections and their children
  function searchSections(sectionList: LegalSection[]): LegalSection | null {
    for (const section of sectionList) {
      // Check if chunk overlaps with this section
      const overlapsSection = !(chunkEnd <= section.startIndex || chunkStart >= section.endIndex);

      if (overlapsSection) {
        // If section has children, search them first (more specific)
        if (section.children.length > 0) {
          const childMatch = searchSections(section.children);
          if (childMatch) {
            return childMatch;
          }
        }

        // Return this section if no more specific child found
        return section;
      }
    }

    return null;
  }

  return searchSections(sections);
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
      logger.debug('Creating documents directory', { component: 'pdf-processor', action: 'createDir', path: documentsPath });
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
      logger.debug('No PDF files found', { component: 'pdf-processor', action: 'scan', path: documentsPath });
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

    logger.debug('Found PDF files', { component: 'pdf-processor', action: 'scan', count: pdfFiles.length });

    const allChunks: PDFChunk[] = [];
    const fileMetadata: ProcessingMetadata['files'] = [];
    let totalCharacters = 0;

    // Process each PDF file
    for (const filename of pdfFiles) {
      const filePath = path.join(documentsPath, filename);
      logger.debug('Processing PDF', { component: 'pdf-processor', action: 'process', filename });

      try {
        // Extract text with page information
        const pagedText = await extractTextFromPDFWithPages(filePath);

        if (!pagedText.fullText || pagedText.fullText.trim().length === 0) {
          logger.warn('No text extracted from PDF', { component: 'pdf-processor', action: 'extract', filename });
          continue;
        }

        // Parse legal document structure for hierarchical metadata
        let legalStructure: ReturnType<typeof parseLegalDocument> | null = null;
        try {
          legalStructure = parseLegalDocument(pagedText.fullText);
          if (legalStructure.sections.length > 0) {
            logger.debug('Found legal structure', {
              component: 'pdf-processor',
              action: 'parseLegal',
              filename,
              paragraphs: legalStructure.metadata.paragraphs
            });
          }
        } catch {
          logger.debug('No legal structure found', { component: 'pdf-processor', action: 'parseLegal', filename });
          legalStructure = null;
        }

        // Split into chunks
        const textChunks = splitTextIntoChunks(pagedText.fullText, DEFAULT_CHUNK_CONFIG);

        if (textChunks.length === 0) {
          logger.warn('No chunks created from PDF', { component: 'pdf-processor', action: 'chunk', filename });
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

        // Convert to PDFChunk format with section extraction, page numbers, and hierarchical metadata
        const pdfChunks: PDFChunk[] = textChunks.map((chunk, index) => {
          // Extract § paragraph references from chunk text (fallback)
          const sectionMatches = chunk.text.match(/§\s*\d+[a-z]?(\s+[A-Z][a-zäöüß]+)?/gi);
          const section = sectionMatches && sectionMatches.length > 0
            ? sectionMatches[0].trim()  // Use first § found in chunk
            : undefined;

          // Find the page number for this chunk
          const pageNumber = chunk.start !== undefined
            ? findPageForChunk(chunk.start)
            : undefined;

          // Find hierarchical metadata if legal structure was parsed
          let hierarchyLevel: number | undefined;
          let hierarchyPath: string | undefined;
          let parentSection: string | undefined;
          let hasChildren: boolean | undefined;

          if (legalStructure && legalStructure.sections.length > 0 && chunk.start !== undefined) {
            const chunkSection = findChunkSection(
              chunk.start,
              chunk.start + chunk.text.length,
              legalStructure.sections
            );

            if (chunkSection) {
              hierarchyLevel = chunkSection.level;
              hierarchyPath = getSectionPath(chunkSection, legalStructure.sections);
              parentSection = chunkSection.parentId;
              hasChildren = chunkSection.children.length > 0;
            }
          }

          return {
            id: `${filename.replace('.pdf', '')}_chunk_${index}`,
            text: chunk.text,
            metadata: {
              source: filename,
              page: pageNumber,
              chunk_index: index,
              total_chunks: textChunks.length,
              char_count: chunk.text.length,
              section: section,  // Fallback section extraction
              // Hierarchical metadata
              hierarchy_level: hierarchyLevel,
              hierarchy_path: hierarchyPath,
              parent_section: parentSection,
              has_children: hasChildren
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

        logger.debug('PDF processed successfully', {
          component: 'pdf-processor',
          action: 'complete',
          filename,
          pages: pagedText.totalPages,
          chunks: textChunks.length,
          characters: fileChars
        });

      } catch (error) {
        logger.error('Error processing PDF', error, { component: 'pdf-processor', action: 'process', filename });
        // Continue with next file
      }
    }

    const metadata: ProcessingMetadata = {
      totalFiles: pdfFiles.length,
      totalChunks: allChunks.length,
      totalCharacters,
      files: fileMetadata
    };

    logger.debug('PDF processing complete', {
      component: 'pdf-processor',
      action: 'summary',
      totalFiles: metadata.totalFiles,
      totalChunks: metadata.totalChunks,
      totalCharacters: metadata.totalCharacters
    });

    return { chunks: allChunks, metadata };

  } catch (error) {
    logger.error('Error in processAllPDFs', error, { component: 'pdf-processor', action: 'processAll' });
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
