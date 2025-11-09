#!/usr/bin/env python3
"""
PDF Text Extraction Script for RAG System

Extracts text from all PDFs in documents/raw-pdfs/ and saves to JSON format.
Uses pdfplumber for reliable text extraction from complex PDFs.

Usage:
    python scripts/extract_pdfs.py
"""

import os
import json
from pathlib import Path
import pdfplumber
import re


def clean_text(text: str) -> str:
    """
    Clean text to ensure valid JSON encoding.
    Removes control characters and problematic Unicode.
    """
    if not text:
        return ""

    # Remove null bytes
    text = text.replace('\x00', '')

    # Remove other control characters except newlines and tabs
    text = re.sub(r'[\x01-\x08\x0b-\x0c\x0e-\x1f\x7f]', '', text)

    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    return text


def extract_text_from_pdf(pdf_path: str) -> dict:
    """
    Extract text from a single PDF file.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        Dictionary with 'text' and 'pages' keys
    """
    print(f"📖 Processing: {os.path.basename(pdf_path)}")

    try:
        with pdfplumber.open(pdf_path) as pdf:
            text_parts = []
            page_count = len(pdf.pages)

            for page_num, page in enumerate(pdf.pages, 1):
                # Extract text from page
                page_text = page.extract_text()

                if page_text:
                    # Clean the text to remove problematic characters
                    cleaned_text = clean_text(page_text)
                    if cleaned_text:
                        text_parts.append(cleaned_text)

                # Progress indicator for large PDFs
                if page_num % 10 == 0:
                    print(f"   ... processed {page_num}/{page_count} pages")

            full_text = " ".join(text_parts)  # Use space instead of newlines

            print(f"✅ Extracted {len(full_text)} characters from {page_count} pages")

            return {
                "text": full_text,
                "pages": page_count
            }

    except Exception as e:
        print(f"❌ Error processing {os.path.basename(pdf_path)}: {str(e)}")
        return {
            "text": "",
            "pages": 0,
            "error": str(e)
        }


def main():
    """
    Main function to extract all PDFs and save to JSON.
    """
    print("\n🚀 Starting PDF extraction...\n")

    # Define paths
    project_root = Path(__file__).parent.parent
    pdf_dir = project_root / "documents" / "raw-pdfs"
    output_dir = project_root / "documents" / "processed"
    output_file = output_dir / "extracted.json"

    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)

    # Check if PDF directory exists
    if not pdf_dir.exists():
        print(f"❌ Error: PDF directory not found: {pdf_dir}")
        return

    # Find all PDF files
    pdf_files = list(pdf_dir.glob("*.pdf"))

    if not pdf_files:
        print(f"⚠️  No PDF files found in {pdf_dir}")
        return

    print(f"📁 Found {len(pdf_files)} PDF files\n")

    # Extract text from all PDFs
    results = {}
    success_count = 0
    error_count = 0

    for pdf_path in sorted(pdf_files):
        filename = pdf_path.name
        result = extract_text_from_pdf(str(pdf_path))
        results[filename] = result

        if result.get("error"):
            error_count += 1
        else:
            success_count += 1

        print()  # Empty line between files

    # Save to JSON
    print(f"💾 Saving results to {output_file}")

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        # Validate JSON by reading it back
        print("🔍 Validating JSON...")
        with open(output_file, 'r', encoding='utf-8') as f:
            test_load = json.load(f)
        print("✅ JSON is valid!")

    except Exception as e:
        print(f"❌ Error saving or validating JSON: {e}")
        print("Trying to save without indentation...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False)

    # Print summary
    print("\n" + "="*60)
    print("✅ PDF EXTRACTION COMPLETE")
    print("="*60)
    print(f"📊 Total PDFs: {len(pdf_files)}")
    print(f"✅ Successful: {success_count}")
    print(f"❌ Failed: {error_count}")
    print(f"📁 Output file: {output_file}")

    # Calculate total characters
    total_chars = sum(len(r.get("text", "")) for r in results.values())
    print(f"📝 Total characters extracted: {total_chars:,}")

    print("\n🎯 Next step:")
    print("   Run the API to process and upload to Pinecone:")
    print("   curl -X POST http://localhost:3000/api/rag/embed-from-json")
    print()


if __name__ == "__main__":
    main()
