# Betriebsanlagen-Check Wien

Mehrsprachige Web-Anwendung zur Unterstützung bei Betriebsanlagengenehmigungen in Wien.

## Features

- AI-gestützter Assistent (RAG mit Claude)
- Compliance Checker Wizard
- Formular-Assistent
- Dokument-Downloads
- Adress-Validierung (Vienna GIS)
- 8 Sprachen (DE, EN, SR, HR, TR, IT, ES, UK)

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Datenbank | PostgreSQL + Prisma |
| AI | Claude 3.5 Haiku + OpenAI Embeddings |
| Vector DB | Pinecone |
| Cache | Vercel KV |
| i18n | next-intl |
| Hosting | Vercel |

## Setup

```bash
# 1. Dependencies
npm install

# 2. Environment
cp .env.example .env.local
# Fülle die Werte aus (siehe unten)

# 3. Datenbank
npx prisma generate
npx prisma db push

# 4. Development
npm run dev
```

### Environment Variables

```env
# Datenbank (Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# AI Services
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX_NAME=

# Cache (optional)
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## Projektstruktur

```
app/
├── [locale]/           # Lokalisierte Seiten
├── api/                # API Routes
├── components/         # Alle React Components
│   ├── ui/             # Basis-UI
│   ├── shared/         # Wiederverwendbar
│   ├── features/       # Feature-spezifisch
│   └── ...
├── lib/                # Server-Logik (AI, DB, etc.)
└── data/               # Statische Daten

config/                 # App-Konfiguration
public/pdfs/sources/    # RAG-Quellen-PDFs
messages/               # i18n Übersetzungen
prisma/                 # Datenbank-Schema
```

## Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Development Server |
| `npm run build` | Production Build |
| `npm run lint` | ESLint |

## API Endpoints

- `POST /api/rag/chat` - AI Chat mit RAG
- `POST /api/rag/embed` - PDF Embedding
- `POST /api/documents/download` - Dokument-Download

## Deployment

```bash
vercel --prod
```

## Lizenz

Privates Projekt.
