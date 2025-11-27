/**
 * Standalone script to embed PDFs into Pinecone
 * Run with: node embed-pdfs.js
 */

const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'gastro-genehmigung';

console.log('🚀 PDF Embedding Script');
console.log('========================');
console.log(`OpenAI Key: ${OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`Pinecone Key: ${PINECONE_API_KEY ? '✅ Set' : '❌ Missing'}`);
console.log(`Pinecone Index: ${PINECONE_INDEX_NAME}\n`);

if (!OPENAI_API_KEY || !PINECONE_API_KEY) {
  console.error('❌ Missing required environment variables!');
  process.exit(1);
}

// Helper function to chunk text
function splitTextIntoChunks(text, chunkSize = 1200, overlap = 300) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.substring(startIndex, endIndex);
    chunks.push({
      text: chunk.trim(),
      start: startIndex  // Track start position for hierarchical matching
    });
    startIndex += chunkSize - overlap;
  }

  return chunks;
}

// Extract text from PDF with page information
async function extractTextFromPDFWithPages(pdfPath) {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfParse = require('pdf-parse');

    const pages = [];
    let currentIndex = 0;

    // Use pagerender to extract text page by page
    const data = await pdfParse(dataBuffer, {
      pagerender: async (pageData) => {
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
    console.error(`Error extracting text from ${pdfPath}:`, error.message);
    throw error;
  }
}

// Helper function to find which page a chunk belongs to
function findPageForChunk(chunkStartIndex, pages) {
  // Find the page that contains the start of this chunk
  for (const page of pages) {
    if (chunkStartIndex >= page.startIndex && chunkStartIndex < page.endIndex) {
      return page.pageNumber;
    }
  }
  // If not found in exact range, find the closest page
  const closestPage = pages.reduce((prev, curr) => {
    const prevDist = Math.abs(prev.startIndex - chunkStartIndex);
    const currDist = Math.abs(curr.startIndex - chunkStartIndex);
    return currDist < prevDist ? curr : prev;
  });
  return closestPage?.pageNumber;
}

// Parse legal document structure (§, Abs., Z hierarchy)
function parseLegalDocument(text) {
  const sections = [];
  const metadata = { totalSections: 0, paragraphs: 0 };

  // Find all paragraph markers (§)
  const paragraphRegex = /§\s*(\d+[a-z]?)/gi;
  let paragraphMatch;

  while ((paragraphMatch = paragraphRegex.exec(text)) !== null) {
    const paragraphId = `§ ${paragraphMatch[1]}`;
    const paragraphStart = paragraphMatch.index;

    // Find where this paragraph ends
    const nextParagraphMatch = paragraphRegex.exec(text);
    const paragraphEnd = nextParagraphMatch ? nextParagraphMatch.index : text.length;

    // Reset regex for next iteration
    if (nextParagraphMatch) {
      paragraphRegex.lastIndex = nextParagraphMatch.index;
    }

    const paragraphText = text.substring(paragraphStart, paragraphEnd);

    // Parse Absätze within this paragraph
    const absatze = parseAbsatze(paragraphText, paragraphStart, paragraphId);

    sections.push({
      type: 'paragraph',
      identifier: paragraphId,
      text: paragraphText,
      startIndex: paragraphStart,
      endIndex: paragraphEnd,
      level: 0,
      children: absatze
    });

    metadata.paragraphs++;
    metadata.totalSections++;
  }

  return { sections, metadata };
}

// Parse Absätze (subsections) within a paragraph
function parseAbsatze(text, baseOffset, parentId) {
  const absatze = [];
  const absatzRegex = /(?:Abs\.\s*(\d+)|\((\d+)\))/gi;
  let absatzMatch;

  while ((absatzMatch = absatzRegex.exec(text)) !== null) {
    const absatzNum = absatzMatch[1] || absatzMatch[2];
    const absatzId = `Abs. ${absatzNum}`;
    const absatzStart = absatzMatch.index;

    const nextAbsatzMatch = absatzRegex.exec(text);
    const absatzEnd = nextAbsatzMatch ? nextAbsatzMatch.index : text.length;

    if (nextAbsatzMatch) {
      absatzRegex.lastIndex = nextAbsatzMatch.index;
    }

    const absatzText = text.substring(absatzStart, absatzEnd);
    const ziffern = parseZiffern(absatzText, baseOffset + absatzStart, `${parentId} ${absatzId}`);

    absatze.push({
      type: 'absatz',
      identifier: absatzId,
      text: absatzText,
      startIndex: baseOffset + absatzStart,
      endIndex: baseOffset + absatzEnd,
      level: 1,
      parentId: parentId,
      children: ziffern
    });
  }

  return absatze;
}

// Parse Ziffern (numbered points) within an Absatz
function parseZiffern(text, baseOffset, parentId) {
  const ziffern = [];
  const zifferRegex = /(?:Z\.?\s*(\d+)|Ziffer\s*(\d+))/gi;
  let zifferMatch;

  while ((zifferMatch = zifferRegex.exec(text)) !== null) {
    const zifferNum = zifferMatch[1] || zifferMatch[2];
    const zifferId = `Z ${zifferNum}`;
    const zifferStart = zifferMatch.index;

    const nextZifferMatch = zifferRegex.exec(text);
    const zifferEnd = nextZifferMatch ? nextZifferMatch.index : text.length;

    if (nextZifferMatch) {
      zifferRegex.lastIndex = nextZifferMatch.index;
    }

    const zifferText = text.substring(zifferStart, zifferEnd);

    ziffern.push({
      type: 'ziffer',
      identifier: zifferId,
      text: zifferText,
      startIndex: baseOffset + zifferStart,
      endIndex: baseOffset + zifferEnd,
      level: 2,
      parentId: parentId,
      children: []
    });
  }

  return ziffern;
}

// Find which legal section a chunk belongs to
function findChunkSection(chunkStart, chunkEnd, sections) {
  function searchSections(sectionList) {
    for (const section of sectionList) {
      const overlapsSection = !(chunkEnd <= section.startIndex || chunkStart >= section.endIndex);

      if (overlapsSection) {
        if (section.children.length > 0) {
          const childMatch = searchSections(section.children);
          if (childMatch) return childMatch;
        }
        return section;
      }
    }
    return null;
  }

  return searchSections(sections);
}

// Get full hierarchical path for a section
function getSectionPath(section, allSections) {
  const path = [section.identifier];
  let currentParentId = section.parentId;

  function findSectionById(id, sections) {
    for (const sec of sections) {
      if (sec.identifier === id) return sec;
      const found = findSectionById(id, sec.children);
      if (found) return found;
    }
    return null;
  }

  while (currentParentId) {
    const parent = findSectionById(currentParentId, allSections);
    if (parent) {
      path.unshift(parent.identifier);
      currentParentId = parent.parentId;
    } else {
      break;
    }
  }

  return path.join(' ');
}

// Process all PDFs
async function processPDFs(documentsPath) {
  const files = await fs.readdir(documentsPath);
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

  console.log(`📄 Found ${pdfFiles.length} PDF files\n`);

  const allChunks = [];

  for (const filename of pdfFiles) {
    const filePath = path.join(documentsPath, filename);
    console.log(`Processing: ${filename}...`);

    try {
      const pagedText = await extractTextFromPDFWithPages(filePath);

      if (!pagedText.fullText || pagedText.fullText.trim().length === 0) {
        console.log(`⚠️  No text extracted from ${filename}`);
        continue;
      }

      // Parse legal document structure for hierarchical metadata
      let legalStructure = null;
      try {
        legalStructure = parseLegalDocument(pagedText.fullText);
        if (legalStructure.sections.length > 0) {
          console.log(`   📚 Found ${legalStructure.metadata.paragraphs} paragraphs in legal structure`);
        }
      } catch (error) {
        console.log(`   ℹ️  No legal structure found (not a legal document)`);
        legalStructure = null;
      }

      const textChunks = splitTextIntoChunks(pagedText.fullText);

      const pdfChunks = textChunks.map((chunk, index) => {
        // Sanitize ID: only ASCII, replace spaces with underscores, remove special chars
        const sanitizedFilename = filename
          .replace('.pdf', '')
          .replace(/[^a-zA-Z0-9]/g, '_')  // Replace all non-alphanumeric with underscore
          .replace(/_+/g, '_')             // Replace multiple underscores with single
          .replace(/^_|_$/g, '');          // Remove leading/trailing underscores

        // Extract § paragraph references from chunk text
        const sectionMatches = chunk.text.match(/§\s*\d+[a-z]?(\s+[A-Z][a-zäöüß]+)?/gi);
        const section = sectionMatches && sectionMatches.length > 0
          ? sectionMatches[0].trim()  // Use first § found in chunk
          : undefined;

        // Find the page number for this chunk
        const pageNumber = chunk.start !== undefined
          ? findPageForChunk(chunk.start, pagedText.pages)
          : undefined;

        // Find hierarchical metadata if legal structure was parsed
        let hierarchyLevel, hierarchyPath, parentSection, hasChildren;

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
          id: `${sanitizedFilename}_chunk_${index}`,
          text: chunk.text,
          metadata: {
            source: filename,
            page: pageNumber,
            section: section,
            chunk_index: index,
            total_chunks: textChunks.length,
            char_count: chunk.text.length,
            // Hierarchical metadata
            ...(hierarchyLevel !== undefined && { hierarchy_level: hierarchyLevel }),
            ...(hierarchyPath && { hierarchy_path: hierarchyPath }),
            ...(parentSection && { parent_section: parentSection }),
            ...(hasChildren !== undefined && { has_children: hasChildren })
          }
        };
      });

      allChunks.push(...pdfChunks);
      console.log(`✅ ${filename}: ${pagedText.totalPages} pages, ${textChunks.length} chunks, ${pagedText.fullText.length} characters`);
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  return allChunks;
}

// Generate embeddings with OpenAI
async function generateEmbeddings(texts) {
  const batchSize = 100;
  const allEmbeddings = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    console.log(`🔢 Generating embeddings for batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}...`);

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: batch,
        dimensions: 1536
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const embeddings = data.data.map(item => item.embedding);
    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}

// Upload to Pinecone using SDK
async function uploadToPinecone(vectors) {
  const { Pinecone } = require('@pinecone-database/pinecone');

  const client = new Pinecone({
    apiKey: PINECONE_API_KEY
  });

  const index = client.index(PINECONE_INDEX_NAME);

  const batchSize = 100;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);

    console.log(`⬆️  Uploading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)} to Pinecone...`);

    await index.upsert(batch);
  }
}

// Main function
async function main() {
  try {
    const documentsPath = path.join(__dirname, 'documents/raw-pdfs');

    // 1. Process PDFs
    console.log('📄 Step 1: Processing PDFs...\n');
    const chunks = await processPDFs(documentsPath);

    if (chunks.length === 0) {
      console.log('\n❌ No chunks created. Exiting.');
      process.exit(1);
    }

    console.log(`\n✅ Created ${chunks.length} total chunks\n`);

    // 2. Generate embeddings
    console.log('🔢 Step 2: Generating embeddings...\n');
    const texts = chunks.map(chunk => chunk.text);
    const embeddings = await generateEmbeddings(texts);
    console.log(`\n✅ Generated ${embeddings.length} embeddings\n`);

    // 3. Prepare vectors
    console.log('📦 Step 3: Preparing vectors...\n');
    const dateAdded = new Date().toISOString();
    const vectors = chunks.map((chunk, index) => ({
      id: chunk.id,
      values: embeddings[index],
      metadata: {
        text: chunk.text,
        source: chunk.metadata.source,
        page: chunk.metadata.page,
        section: chunk.metadata.section,
        chunk_index: chunk.metadata.chunk_index,
        total_chunks: chunk.metadata.total_chunks,
        date_added: dateAdded
      }
    }));

    // 4. Upload to Pinecone
    console.log('⬆️  Step 4: Uploading to Pinecone...\n');
    await uploadToPinecone(vectors);

    console.log('\n✅ SUCCESS! All PDFs embedded and uploaded to Pinecone');
    console.log(`📊 Summary:`);
    console.log(`   - Chunks created: ${chunks.length}`);
    console.log(`   - Embeddings generated: ${embeddings.length}`);
    console.log(`   - Vectors uploaded: ${vectors.length}`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
