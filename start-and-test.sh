#!/bin/bash

echo "🚀 Starting RAG System..."
echo ""

# Kill old servers
echo "🔪 Killing old servers..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2

# Start server
echo "▶️  Starting Next.js server..."
npm run dev &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 15

# Check if server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Server is running!"
    echo ""

    # Test the chat API
    echo "🧪 Testing Chat API..."
    echo ""
    echo "Question: Brauche ich eine UVP für ein Restaurant mit 80m²?"
    echo ""

    curl -X POST http://localhost:3000/api/rag/chat \
      -H "Content-Type: application/json" \
      -d '{
        "query": "Brauche ich eine UVP für ein Restaurant mit 80m²?",
        "userContext": {
          "businessType": "restaurant",
          "businessSize": "80"
        }
      }' 2>/dev/null | python3 -m json.tool

    echo ""
    echo "✅ Test complete!"
    echo ""
    echo "📝 Server is running on http://localhost:3000"
    echo "   (PID: $SERVER_PID)"
    echo ""
    echo "To stop: kill $SERVER_PID"
else
    echo "❌ Server failed to start"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
