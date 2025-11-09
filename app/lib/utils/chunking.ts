/**
 * Text Chunking Utilities
 *
 * Splits text into smaller chunks for embedding and vector storage
 */

export interface ChunkConfig {
  chunkSize: number;      // Max characters per chunk
  chunkOverlap: number;   // Overlap between chunks
  separator: string;      // Primary separator (e.g., "\n\n")
}

export interface TextChunk {
  text: string;
  index: number;
  start: number;
  end: number;
}

/**
 * Default chunking configuration
 * Optimized for legal texts with paragraphs (§) and sections
 */
export const DEFAULT_CHUNK_CONFIG: ChunkConfig = {
  chunkSize: parseInt(process.env.CHUNK_SIZE || '1200'),  // INCREASED: More context per chunk for legal texts
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '300'),  // INCREASED: Better continuity across chunks
  separator: '\n\n'
};

/**
 * Split text into chunks with overlap
 *
 * @param text The text to split
 * @param config Chunking configuration
 * @returns Array of text chunks
 */
export function splitTextIntoChunks(
  text: string,
  config: ChunkConfig = DEFAULT_CHUNK_CONFIG
): TextChunk[] {
  const { chunkSize, chunkOverlap, separator } = config;

  // Clean text
  const cleanText = text
    .replace(/\r\n/g, '\n')     // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .trim();

  if (cleanText.length === 0) {
    return [];
  }

  // If text is smaller than chunk size, return as single chunk
  if (cleanText.length <= chunkSize) {
    return [
      {
        text: cleanText,
        index: 0,
        start: 0,
        end: cleanText.length
      }
    ];
  }

  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < cleanText.length) {
    // Calculate end index for this chunk
    let endIndex = startIndex + chunkSize;

    // If this is not the last chunk, try to find a good break point
    if (endIndex < cleanText.length) {
      // PRIORITY 1: Try to break at legal section markers (§ paragraphs)
      const sectionMatch = cleanText.substring(startIndex, endIndex).match(/§\s*\d+[a-z]?/gi);
      if (sectionMatch && sectionMatch.length > 0) {
        const lastSection = cleanText.lastIndexOf(sectionMatch[sectionMatch.length - 1], endIndex);
        if (lastSection > startIndex + 200) {  // Only if we have enough content before it
          endIndex = lastSection;
        }
      }

      // PRIORITY 2: Try to break at separator (paragraph break)
      if (endIndex === startIndex + chunkSize) {  // If section break didn't work
        const separatorIndex = cleanText.lastIndexOf(separator, endIndex);
        if (separatorIndex > startIndex) {
          endIndex = separatorIndex + separator.length;
        } else {
          // PRIORITY 3: Try to break at sentence end
          const sentenceEnd = /[.!?]\s/.exec(cleanText.substring(startIndex, endIndex));
          if (sentenceEnd && sentenceEnd.index) {
            endIndex = startIndex + sentenceEnd.index + 2;
          } else {
            // PRIORITY 4: Try to break at word boundary
            const lastSpace = cleanText.lastIndexOf(' ', endIndex);
            if (lastSpace > startIndex) {
              endIndex = lastSpace + 1;
            }
          }
        }
      }
    } else {
      endIndex = cleanText.length;
    }

    // Extract chunk
    const chunkText = cleanText.substring(startIndex, endIndex).trim();

    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        index: chunkIndex,
        start: startIndex,
        end: endIndex
      });
      chunkIndex++;
    }

    // Move start index forward, accounting for overlap
    startIndex = endIndex - chunkOverlap;

    // Ensure we make progress
    if (startIndex <= chunks[chunks.length - 1]?.start) {
      startIndex = endIndex;
    }
  }

  return chunks;
}

/**
 * Estimate number of chunks for a text
 */
export function estimateChunkCount(
  textLength: number,
  config: ChunkConfig = DEFAULT_CHUNK_CONFIG
): number {
  const { chunkSize, chunkOverlap } = config;
  const effectiveChunkSize = chunkSize - chunkOverlap;
  return Math.ceil(textLength / effectiveChunkSize);
}

/**
 * Calculate chunking statistics
 */
export function getChunkingStats(chunks: TextChunk[]) {
  if (chunks.length === 0) {
    return {
      totalChunks: 0,
      avgChunkSize: 0,
      minChunkSize: 0,
      maxChunkSize: 0,
      totalCharacters: 0
    };
  }

  const sizes = chunks.map(c => c.text.length);
  const totalCharacters = sizes.reduce((sum, size) => sum + size, 0);

  return {
    totalChunks: chunks.length,
    avgChunkSize: Math.round(totalCharacters / chunks.length),
    minChunkSize: Math.min(...sizes),
    maxChunkSize: Math.max(...sizes),
    totalCharacters
  };
}
