# 🍽️ RAG-System für Gastro-Betriebsanlagengenehmigungen Wien

Ein intelligentes Retrieval-Augmented Generation (RAG) System, das Gastronomen in Wien bei der Beantragung von Betriebsanlagengenehmigungen unterstützt.

## 🎯 Was macht dieses System?

Das RAG-System beantwortet Fragen zu Betriebsanlagengenehmigungen für Gastronomiebetriebe in Wien, indem es:

1. **Guided Dialog**: Sammelt User-Informationen (Betriebsart, Größe, Standort)
2. **Semantic Search**: Findet relevante Gesetzestexte in der Vector Database
3. **AI-Antworten**: Generiert präzise Antworten mit Claude 3.5 Haiku
4. **Quellenangaben**: Zeigt die exakten Rechtsgrundlagen an

---

## 🏗️ System-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                            │
│  "Ich möchte ein Restaurant mit 50 Plätzen im 1. Bezirk     │
│   eröffnen. Welche Genehmigungen brauche ich?"              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   GUIDED DIALOG                              │
│  ✓ Betriebsart (Restaurant, Café, Bar...)                   │
│  ✓ Größe (Fläche, Gästeplätze)                             │
│  ✓ Standort (Bezirk, Nachbarn)                             │
│  ✓ Features (Küche, Schanigarten...)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              EMBEDDING GENERATION                            │
│  OpenAI text-embedding-3-small                              │
│  Input → [0.1234, -0.5678, 0.9876, ...]                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│            VECTOR SEARCH (Pinecone)                         │
│  📚 Durchsucht alle Gesetzestexte                           │
│  🔍 Top 5 relevante Paragraphen                             │
│  📊 Similarity Score > 0.7                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         RAG GENERATION (Claude 3.5 Haiku)                   │
│  • Liest gefundene Gesetzestexte                            │
│  • Versteht User-Kontext                                    │
│  • Generiert präzise Antwort                                │
│  • Fügt Quellenangaben hinzu                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    USER OUTPUT                               │
│  "Für Ihr Restaurant benötigen Sie:                         │
│   1. Betriebsanlagengenehmigung (§ 74 GewO)                │
│   2. Gastgewerbeberechtigung (§ 111 GewO)                   │
│   3. Lebensmittelbetriebsbewilligung                        │
│                                                              │
│  📄 Quellen: GewO § 74, GFVO § 3, LMG § 12"                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Komponente | Technologie | Zweck |
|-----------|-------------|-------|
| **Frontend** | Next.js 15 + React 19 | UI & Guided Dialog |
| **Embeddings** | OpenAI `text-embedding-3-small` | Text → Vektoren (1536 Dimensionen) |
| **Vector DB** | Pinecone | Speichert & durchsucht Gesetzestexte |
| **LLM** | Anthropic Claude 3.5 Haiku | Generiert Antworten |
| **PDF Parser** | pdf-parse | Extrahiert Text aus PDFs |
| **Orchestration** | LangChain | RAG-Pipeline |
| **Hosting** | Vercel | Deployment |

---

## 📁 Projekt-Struktur

```
betriebsanlagen-check/
│
├── documents/                    # Dokumente & Daten
│   ├── raw-pdfs/                # Original-PDFs (Gesetze, Verordnungen)
│   └── processed/               # Verarbeitete Chunks (JSON)
│
├── app/
│   ├── api/
│   │   └── rag/
│   │       ├── chat/           # Chat API (Claude Antworten)
│   │       │   └── route.ts
│   │       └── embed/          # Embedding API (Dokumente verarbeiten)
│   │           └── route.ts
│   │
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── anthropic.ts   # Claude Client
│   │   │   ├── openai.ts      # OpenAI Embeddings
│   │   │   └── rag.ts         # RAG Logik
│   │   │
│   │   └── vectordb/
│   │       ├── pinecone.ts    # Pinecone Client
│   │       └── operations.ts  # CRUD Operationen
│   │
│   └── components/
│       └── RAG/
│           ├── GuidedDialog.tsx    # Schritt-für-Schritt Dialog
│           ├── ChatInterface.tsx   # Chat UI
│           └── SourceDisplay.tsx   # Quellenangaben
│
├── .env.local                   # API Keys (nicht in Git!)
├── RAG_README.md               # Diese Datei
└── package.json
```

---

## 🚀 Setup & Installation

### 1. Dependencies installieren

```bash
npm install
```

**Installierte Pakages:**
- `@anthropic-ai/sdk` - Claude API
- `openai` - OpenAI Embeddings
- `@pinecone-database/pinecone` - Vector Database
- `pdf-parse` - PDF Text Extraction
- `langchain` - RAG Framework
- `@langchain/openai`, `@langchain/pinecone`, `@langchain/anthropic`

### 2. API Keys konfigurieren

Die API Keys sind bereits in `.env.local` eingetragen:

```bash
ANTHROPIC_API_KEY="sk-ant-api03-..."
OPENAI_API_KEY="sk-proj-..."
PINECONE_API_KEY="pcsk_..."
PINECONE_INDEX_NAME="gastro-genehmigung"
```

### 3. Pinecone Index prüfen

```bash
# Index sollte existieren mit:
# - Name: gastro-genehmigung
# - Dimensions: 1536
# - Metric: cosine
```

### 4. Dev Server starten

```bash
npm run dev
```

---

## 📚 Workflow: Dokumente verarbeiten

### Phase 1: PDFs sammeln ✅ (bereits erledigt)

Du hast bereits PDFs gesammelt. Lege sie in:

```
documents/raw-pdfs/
├── gewerbeordnung.pdf
├── bauordnung_wien.pdf
├── lebensmittelgesetz.pdf
└── gfvo_verordnung.pdf
```

### Phase 2: PDFs chunken & embedden

```bash
# API Route aufrufen (erstellen wir gleich):
POST /api/rag/embed

# Body:
{
  "action": "process_all"
}
```

**Was passiert:**
1. PDF wird gelesen
2. Text wird in Chunks aufgeteilt (1000 Zeichen, 200 Overlap)
3. Für jeden Chunk wird ein Embedding erstellt
4. Chunk + Embedding + Metadata werden in Pinecone gespeichert

### Phase 3: Guided Dialog nutzen

User beantwortet Fragen:
- Betriebsart: "Restaurant"
- Größe: "50 Gästeplätze"
- Bezirk: "1. Bezirk"
- Features: "Küche, Schanigarten"

### Phase 4: RAG Query

```bash
POST /api/rag/chat

{
  "message": "Welche Genehmigungen brauche ich?",
  "context": {
    "betriebsart": "Restaurant",
    "groesse": "50 Gästeplätze",
    "bezirk": "1. Bezirk"
  }
}
```

**Response:**

```json
{
  "answer": "Für Ihr Restaurant benötigen Sie folgende Genehmigungen:\n\n1. **Betriebsanlagengenehmigung** nach § 74 GewO...",
  "sources": [
    {
      "title": "Gewerbeordnung § 74",
      "content": "...",
      "page": 12,
      "score": 0.89
    }
  ],
  "metadata": {
    "model": "claude-3-5-haiku-20241022",
    "tokens": 1234
  }
}
```

---

## 🔑 API Endpoints (erstellen wir als nächstes)

### 1. `/api/rag/embed` - Dokumente verarbeiten

**POST** - Lädt PDFs hoch, chunked sie und speichert in Pinecone

```typescript
// Request
{
  "action": "process_all" | "process_single",
  "filename": "gewerbeordnung.pdf" // optional
}

// Response
{
  "success": true,
  "chunks_created": 156,
  "documents_processed": 4
}
```

### 2. `/api/rag/chat` - RAG Query

**POST** - Stellt Frage, sucht in Pinecone, generiert Antwort

```typescript
// Request
{
  "message": "Welche Genehmigungen brauche ich?",
  "context": {
    "betriebsart": "Restaurant",
    "groesse": "50 Plätze",
    "bezirk": "1. Bezirk"
  }
}

// Response
{
  "answer": "Für Ihr Restaurant...",
  "sources": [...],
  "metadata": { ... }
}
```

---

## 🎨 UI Components (bauen wir als nächstes)

### GuidedDialog.tsx

```typescript
// Schritt-für-Schritt Formular:
// 1. Betriebsart wählen
// 2. Größe angeben
// 3. Standort auswählen
// 4. Features definieren
```

### ChatInterface.tsx

```typescript
// Chat-UI für RAG Fragen
// - User Input
// - AI Response
// - Loading States
// - Error Handling
```

### SourceDisplay.tsx

```typescript
// Quellenangaben anzeigen
// - Gesetzesparagraphen
// - Seitenzahlen
// - Similarity Score
// - "Quelle öffnen" Link
```

---

## 📊 Datenmodell

### Pinecone Vector Metadata

Jeder Chunk in Pinecone hat folgende Metadata:

```typescript
{
  id: "gewo_74_chunk_1",
  values: [0.1234, -0.5678, ...], // 1536 Dimensionen
  metadata: {
    text: "§ 74 (1) Betriebsanlagen...",
    source: "gewerbeordnung.pdf",
    page: 12,
    section: "§ 74",
    category: "genehmigung",
    chunk_index: 1,
    total_chunks: 156,
    date_added: "2025-11-05T10:30:00Z"
  }
}
```

---

## ⚡ Performance Optimierungen

### Caching

```typescript
// In-Memory Cache für häufige Queries
const cache = new Map<string, CachedResponse>();
const CACHE_TTL = 3600; // 1 Stunde
```

### Rate Limiting

```typescript
// Max 100 Requests pro Stunde pro User
const rateLimit = {
  maxRequests: 100,
  windowMs: 3600000
};
```

### Chunking Strategy

```typescript
const CHUNK_CONFIG = {
  size: 1000,        // 1000 Zeichen pro Chunk
  overlap: 200,      // 200 Zeichen Überlappung
  separator: "\n\n"  // Split bei Absätzen
};
```

---

## 🔒 Sicherheit & Datenschutz

### API Keys

✅ Alle Keys in `.env.local` (nicht in Git)
✅ Server-side only (nie Client-seitig)
✅ Vercel Environment Variables für Production

### User Daten

✅ Keine persistenten User-Daten
✅ Session-based (in-memory)
✅ DSGVO-konform

### Rate Limiting

✅ 100 Requests/Stunde
✅ IP-based Tracking (anonymisiert)
✅ Error Handling

---

## 📈 Kosten-Kalkulation

### Entwicklungsphase (Testing)

| Service | Kosten | Limit |
|---------|--------|-------|
| **OpenAI Embeddings** | $0.013 / 1M tokens | ~10.000 Chunks = $0.13 |
| **Claude 3.5 Haiku** | $0.25 / 1M input tokens | 100 Queries = $0.05 |
| **Pinecone Free** | $0 | 100k Vektoren gratis |
| **Vercel Hobby** | $0 | Gratis Hosting |
| **TOTAL** | ~$0.20 | für Testing |

### Production (1000 User/Monat)

| Service | Kosten |
|---------|--------|
| **OpenAI Embeddings** | $2 |
| **Claude API** | $15 |
| **Pinecone** | $70 (Standard Plan) |
| **Vercel** | $20 (Pro Plan) |
| **TOTAL** | ~$107/Monat |

---

## 🎯 Nächste Schritte

### Phase 1: Core Setup ✅ (FERTIG!)

- [x] Ordnerstruktur erstellen
- [x] API Keys konfigurieren
- [x] Dependencies installieren
- [x] README schreiben

### Phase 2: Backend (als nächstes)

- [ ] Pinecone Client erstellen (`app/lib/vectordb/pinecone.ts`)
- [ ] OpenAI Embeddings Setup (`app/lib/ai/openai.ts`)
- [ ] Claude Client Setup (`app/lib/ai/anthropic.ts`)
- [ ] RAG Pipeline (`app/lib/ai/rag.ts`)

### Phase 3: API Routes

- [ ] `/api/rag/embed` - Dokumente verarbeiten
- [ ] `/api/rag/chat` - RAG Queries

### Phase 4: Frontend

- [ ] Guided Dialog Component
- [ ] Chat Interface
- [ ] Source Display

### Phase 5: Testing & Optimization

- [ ] PDF Verarbeitung testen
- [ ] RAG Quality evaluieren
- [ ] Performance optimieren

---

## 🆘 Troubleshooting

### Pinecone Connection Failed

```bash
# Prüfe API Key
echo $PINECONE_API_KEY

# Prüfe Index Existenz
curl -X GET https://api.pinecone.io/indexes/gastro-genehmigung \
  -H "Api-Key: YOUR_KEY"
```

### OpenAI Rate Limit

```bash
# Füge Retry-Logik hinzu
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: text,
  max_retries: 3,
  timeout: 30000
});
```

### Claude API Error

```bash
# Prüfe Model Name
model: "claude-3-5-haiku-20241022" // Korrekt!
model: "claude-3.5-haiku"          // Falsch!
```

---

## 📝 Lizenz

Private Project - Nicht für kommerzielle Nutzung ohne Erlaubnis.

---

## 👤 Kontakt

Bei Fragen zum RAG-System:
- GitHub Issues
- Email: your-email@example.com

---

**Stand:** 2025-11-05
**Version:** 1.0.0
**Status:** Setup Phase abgeschlossen ✅
