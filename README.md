# Betriebsanlagen-Check Wien

Mehrsprachige Web-Anwendung zur Unterstützung bei Betriebsanlagengenehmigungen in Wien. Die App bietet einen AI-gestützten Assistenten, Formular-Hilfen und Dokument-Downloads.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Vercel) + Prisma ORM
- **AI:** Claude 3.5 Haiku (Anthropic) + OpenAI Embeddings
- **Vector DB:** Pinecone
- **Cache:** Vercel KV (Redis)
- **i18n:** next-intl (8 Sprachen: de, en, sr, hr, tr, it, es, uk)
- **Maps:** Leaflet + Vienna GIS API
- **Hosting:** Vercel

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Environment Variables

Kopiere `.env.example` zu `.env.local` und fülle die Werte aus:

```bash
cp .env.example .env.local
```

Benötigte Variables:
- `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` - Vercel Postgres
- `ANTHROPIC_API_KEY` - Claude API
- `OPENAI_API_KEY` - Embeddings
- `PINECONE_API_KEY`, `PINECONE_INDEX_NAME` - Vector DB
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` - Vercel KV (optional)

### 3. Datenbank Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Development Server

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Development mit Turbopack |
| `npm run build` | Production Build |
| `npm run start` | Production Server |
| `npm run lint` | ESLint |

## Projektstruktur

```
app/
├── [locale]/              # Lokalisierte Seiten (de, en, etc.)
│   ├── page.tsx           # Homepage
│   ├── gastro-ki/         # AI-Assistent für Gastro
│   ├── check/             # Compliance Checker
│   ├── formular-assistent/# Formular-Wizard
│   ├── documents/         # Dokument-Downloads
│   ├── adressen-check/    # Adress-Validierung
│   ├── faq/               # FAQ
│   ├── datenschutz/       # Datenschutz
│   └── impressum/         # Impressum
│
├── api/                   # API Routes
│   ├── rag/
│   │   ├── chat/          # RAG Chat Endpoint
│   │   ├── embed/         # PDF Embedding
│   │   └── test/          # Test Endpoint
│   └── documents/
│       └── download/      # Dokument-Download
│
├── components/            # React Components
├── lib/                   # Business Logic
│   ├── ai/                # AI Integration (Claude, OpenAI, RAG)
│   ├── vectordb/          # Pinecone
│   ├── cache/             # Vercel KV Cache
│   └── prisma.ts          # DB Client
│
├── config/                # Konfiguration
│   └── documents.ts       # Dokument-Definitionen
│
└── i18n/                  # Internationalisierung

messages/                  # Übersetzungsdateien (JSON)
prisma/                    # Datenbank-Schema
public/                    # Statische Assets
```

## Datenbank-Modelle

| Model | Beschreibung |
|-------|--------------|
| `FormSession` | Formular-Sessions mit Status |
| `FormData` | Eingabe-Felder pro Session |
| `GeneratedDocument` | Generierte PDFs |
| `DocumentDownload` | Download-Tracking (Analytics) |

## API Endpoints

### RAG Chat
```
POST /api/rag/chat
Body: { query: string, userContext?: {...} }
```

### Dokument Download
```
POST /api/documents/download
Body: { documentId: string, format: 'pdf', language: string }
```

## Deployment

Das Projekt ist für Vercel optimiert. Bei Push auf `main` wird automatisch deployed.

```bash
vercel --prod
```

## Lizenz

Privates Projekt.
