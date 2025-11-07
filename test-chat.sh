#!/bin/bash

# Test script for RAG Chat API

echo "🧪 Testing RAG Chat API..."
echo ""

# Test 1: Simple question
echo "📝 Test 1: Brauche ich eine UVP für ein Restaurant mit 80m²?"
echo ""

curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Brauche ich eine UVP für ein Restaurant mit 80m²?",
    "userContext": {
      "businessType": "restaurant",
      "businessSize": "80"
    }
  }' | python3 -m json.tool

echo ""
echo "=========================================="
echo ""

# Test 2: Another question
echo "📝 Test 2: Welche Dokumente brauche ich für eine Gastro-Genehmigung?"
echo ""

curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Welche Dokumente brauche ich für eine Gastro-Genehmigung?"
  }' | python3 -m json.tool

echo ""
echo "=========================================="
echo ""
echo "✅ Tests complete!"
