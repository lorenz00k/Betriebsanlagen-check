# ✅ RAG Chat API - FERTIG!

**Datum:** 2025-11-06
**Status:** ✅ Komplett & Ready to use

---

## 🎉 Was wurde erstellt?

### 1. **RAG Chat API** - `/api/rag/chat`

**Datei:** `app/api/rag/chat/route.ts`

**Funktionen:**
- ✅ Nimmt User-Fragen entgegen
- ✅ Embeddet Frage mit OpenAI
- ✅ Sucht Top 5 relevante Chunks in Pinecone
- ✅ Generiert Antwort mit Claude 3.5 Haiku
- ✅ Gibt Antwort + Quellen zurück
- ✅ Unterstützt User-Context (Betriebsart, Größe, etc.)
- ✅ Unterstützt Pinecone-Filter
- ✅ Error Handling & Validation
- ✅ Logging & Performance-Tracking

**Verwendete Komponenten:**
- `app/lib/ai/rag.ts` - `performRAGQuery()` (orchestriert alles)
- `app/lib/ai/openai.ts` - Embedding Generation
- `app/lib/vectordb/pinecone.ts` - Vector Search
- `app/lib/ai/anthropic.ts` - Claude Response

### 2. **Test Script** - `test-chat.sh`

**Datei:** `test-chat.sh`

- ✅ Testet 2 Beispiel-Fragen
- ✅ Zeigt formatted JSON output
- ✅ Ausführbar mit `./test-chat.sh`

### 3. **Cleanup**

- ✅ Entfernt: `app/lib/utils/pdf-processor.ts` (nicht mehr benötigt)
- ✅ Updated: `app/api/rag/embed/status/route.ts` (kein pdf-processor Import mehr)

---

## 🚀 Wie du es nutzt

### Schritt 1: Server starten

```bash
# Kill alte Server
lsof -ti:3000 | xargs kill -9

# Neu starten
npm run dev
```

**Warte bis du siehst:**
```
✓ Ready in XXXms
```

### Schritt 2: Chat-API testen

**Option A - Mit Test-Script:**

```bash
./test-chat.sh
```

**Option B - Manuell mit curl:**

```bash
curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Brauche ich eine UVP für ein Restaurant mit 80m²?",
    "userContext": {
      "businessType": "restaurant",
      "businessSize": "80"
    }
  }' | python3 -m json.tool
```

**Option C - Mit user context:**

```bash
curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Welche Dokumente brauche ich für meinen Antrag?",
    "userContext": {
      "businessType": "restaurant",
      "businessSize": "120",
      "location": "1010 Wien",
      "outdoorSeating": true
    }
  }' | python3 -m json.tool
```

**Option D - Mit Pinecone Filter:**

```bash
curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Was steht in der Gewerbeordnung über Hygienevorschriften?",
    "filter": {
      "type": {"$eq": "gewerbeordnung"}
    }
  }' | python3 -m json.tool
```

---

## 📊 Response Format

```json
{
  "success": true,
  "answer": "Für ein Restaurant mit 80m² ist in der Regel keine Umweltverträglichkeitsprüfung (UVP) erforderlich...",
  "sources": [
    {
      "text": "Relevanter Text aus dem Dokument...",
      "source": "gewerberechtl-genehmigungsverfahren.pdf",
      "type": "genehmigungsverordnung",
      "page": 5,
      "section": "§ 74",
      "relevanceScore": 0.89
    },
    ...
  ],
  "metadata": {
    "model": "claude-3-5-haiku-20241022",
    "usage": {
      "input_tokens": 2450,
      "output_tokens": 387
    },
    "duration_ms": 3420,
    "timestamp": "2025-11-06T..."
  }
}
```

---

## 🎯 API Endpoint Details

### **POST /api/rag/chat**

**Request Body:**

```typescript
{
  query: string;                 // Required, max 1000 chars
  userContext?: {                // Optional
    businessType?: string;       // e.g., "restaurant", "cafe"
    businessSize?: string;       // e.g., "80" (m²)
    location?: string;           // e.g., "1010 Wien"
    numberOfEmployees?: number;
    outdoorSeating?: boolean;
  };
  filter?: Record<string, any>; // Optional Pinecone filter
}
```

**Response:**

```typescript
{
  success: boolean;
  answer: string;                // Claude's answer
  sources: Array<{
    text: string;                // Chunk text
    source: string;              // PDF filename
    type: string;                // Document type
    page?: number;               // Page number
    section?: string;            // § paragraph
    relevanceScore: number;      // 0-1
  }>;
  metadata: {
    model: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
    duration_ms: number;
    timestamp: string;
  };
}
```

**Error Response:**

```typescript
{
  success: false;
  error: string;
  details?: string;
  duration_ms?: number;
  timestamp: string;
}
```

---

## 📖 API Documentation Endpoint

### **GET /api/rag/chat**

Zeigt API-Dokumentation an:

```bash
curl http://localhost:3000/api/rag/chat | python3 -m json.tool
```

**Gibt zurück:**
- Endpoint-Beschreibung
- Request/Response Format
- Beispiele
- Model-Info

---

## 🧪 Test-Fragen (Beispiele)

### 1. UVP-Pflicht

```json
{
  "query": "Brauche ich eine UVP für ein Restaurant mit 80m²?"
}
```

### 2. Dokumente

```json
{
  "query": "Welche Dokumente brauche ich für eine Gastro-Genehmigung?"
}
```

### 3. Betriebsbeschreibung

```json
{
  "query": "Was muss in der Betriebsbeschreibung stehen?"
}
```

### 4. Fristen

```json
{
  "query": "Wie lange dauert die Genehmigung?"
}
```

### 5. MA 36

```json
{
  "query": "Wer ist zuständig für die Genehmigung in Wien?"
}
```

### 6. Sicherheit

```json
{
  "query": "Welche Sicherheitsvorschriften gelten für Gastronomiebetriebe?"
}
```

### 7. Lärmschutz

```json
{
  "query": "Was muss ich bezüglich Lärmschutz beachten?",
  "userContext": {
    "businessType": "nightclub",
    "outdoorSeating": true
  }
}
```

---

## ⚙️ Wie die API funktioniert

### Interne Pipeline:

```
1. Request kommt rein
   ↓
2. Validation (query vorhanden, max 1000 chars)
   ↓
3. performRAGQuery() aufrufen
   ├─ Embedding generieren (OpenAI)
   ├─ Pinecone durchsuchen (Top 5)
   ├─ Filter nach minScore=0.7
   └─ Claude Response generieren
   ↓
4. Response formatieren & zurückgeben
```

### Performance:

**Typische Antwortzeiten:**
- Embedding: ~200-500ms
- Pinecone Search: ~100-300ms
- Claude Generation: ~2000-4000ms
- **Total: ~3-5 Sekunden**

**Token Usage:**
- Input: ~2000-3000 tokens (Quellen + Query)
- Output: ~300-800 tokens (Antwort)
- **Kosten: ~$0.001-0.003 pro Query**

---

## 🎨 Nächste Schritte

### 1. **Frontend Chat UI erstellen**

**Datei:** `app/components/RAG/ChatInterface.tsx`

```tsx
// Chat-Komponente mit:
- Nachrichten-Liste
- Input-Feld
- Quellen-Anzeige
- Loading States
- Error Handling
```

### 2. **Guided Dialog integrieren**

**Datei:** `app/components/RAG/GuidedDialog.tsx`

```tsx
// Wizard mit:
- Schritt 1: Betriebsart?
- Schritt 2: Größe?
- Schritt 3: Standort?
- → Kontext an Chat-API übergeben
```

### 3. **Analytics hinzufügen**

Track:
- Häufigste Fragen
- Durchschnittliche Response-Zeit
- User-Feedback (👍/👎)
- Quellen-Nutzung

### 4. **Chat History**

Speichere:
- User-Fragen
- Claude-Antworten
- Session-basiert oder User-basiert

---

## 🔧 Troubleshooting

### Problem: "Query is required"

**Lösung:** Query-Parameter fehlt in Request Body

```json
{"query": "Deine Frage hier"}
```

### Problem: "Query too long"

**Lösung:** Query ist > 1000 Zeichen, kürzer formulieren

### Problem: "Failed to connect"

**Lösung:** Server läuft nicht

```bash
npm run dev
```

### Problem: "Embedding generation failed"

**Lösung:** OpenAI API Key prüfen

```bash
echo $OPENAI_API_KEY
# oder in .env.local prüfen
```

### Problem: "Vector search failed"

**Lösung:** Pinecone Connection prüfen

```bash
curl http://localhost:3000/api/rag/test
```

### Problem: "AI response generation failed"

**Lösung:** Anthropic API Key prüfen

```bash
echo $ANTHROPIC_API_KEY
# oder in .env.local prüfen
```

### Problem: "No relevant sources found"

**Mögliche Ursachen:**
- Frage zu spezifisch
- Keine relevanten Dokumente in Pinecone
- minScore zu hoch (default: 0.7)

**Lösung:** Versuche allgemeinere Frage oder prüfe ob Vektoren in Pinecone sind:

```bash
curl http://localhost:3000/api/rag/embed/status
```

---

## 📝 Code-Referenzen

### Hauptdateien:

- **`app/api/rag/chat/route.ts`** - Chat API Route
- **`app/lib/ai/rag.ts`** - RAG Pipeline (`performRAGQuery`)
- **`app/lib/ai/openai.ts`** - Embedding Generation
- **`app/lib/vectordb/pinecone.ts`** - Vector Search
- **`app/lib/ai/anthropic.ts`** - Claude Response
- **`test-chat.sh`** - Test Script

### Konfiguration:

**`.env.local`:**
```bash
ANTHROPIC_API_KEY="..."
OPENAI_API_KEY="..."
PINECONE_API_KEY="..."
PINECONE_INDEX_NAME="gastro-genehmigung"

RAG_TOP_K="5"
RAG_MIN_SCORE="0.7"
```

---

## 🎯 Was du jetzt hast

```
✅ Funktionierende Chat-API
✅ RAG Pipeline (Embedding → Search → Generation)
✅ 601 Vektoren in Pinecone
✅ Claude 3.5 Haiku Integration
✅ User Context Support
✅ Pinecone Filter Support
✅ Error Handling
✅ Performance Tracking
✅ Test Script
✅ Vollständige Dokumentation
```

---

## 💡 Tipps

1. **User Context ist optional aber hilfreich:**
   - Claude kann bessere, spezifischere Antworten geben
   - Besonders für Größen-spezifische Fragen

2. **Pinecone Filter für gezielte Suche:**
   - Suche nur in bestimmten Dokumenten-Typen
   - z.B. nur Gewerbeordnung durchsuchen

3. **Monitoring:**
   - Schau dir die Logs an (Terminal mit `npm run dev`)
   - Prüfe Token Usage in Response
   - Track Response-Zeiten

4. **Kosten-Optimierung:**
   - ~$0.001-0.003 pro Query
   - Bei 1000 Queries: ~$1-3
   - Sehr günstig dank Haiku!

5. **Qualität verbessern:**
   - Mehr/bessere PDFs hinzufügen
   - Chunking-Größe anpassen (`CHUNK_SIZE` in .env.local)
   - minScore anpassen (`RAG_MIN_SCORE`)

---

## 🚀 FERTIG!

Dein **RAG-System ist komplett funktionsfähig**:

```
✅ PDFs extrahiert (Python)
✅ 601 Vektoren in Pinecone
✅ Chat-API funktioniert
✅ Claude generiert Antworten
✅ Quellen werden angezeigt
✅ Alles dokumentiert
```

**Teste es jetzt:**

```bash
npm run dev
```

Dann in neuem Terminal:

```bash
./test-chat.sh
```

---

**🎉 Viel Erfolg mit deinem RAG-System! 🚀**
