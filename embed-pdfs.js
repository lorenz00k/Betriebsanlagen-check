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
    chunks.push({ text: chunk.trim() });
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

        return {
          id: `${sanitizedFilename}_chunk_${index}`,
          text: chunk.text,
          metadata: {
            source: filename,
            page: pageNumber,
            section: section,
            chunk_index: index,
            total_chunks: textChunks.length,
            char_count: chunk.text.length
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
