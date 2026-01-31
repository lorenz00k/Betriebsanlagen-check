# Betriebsanlagen-Check Wien - AI Context

Mehrsprachige Web-App zur Unterstützung bei Betriebsanlagengenehmigungen in Wien.

## Tech Stack

```
Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
├── PostgreSQL (Vercel) + Prisma ORM
├── Claude 3.5 Haiku (RAG Responses)
├── OpenAI text-embedding-3-small (Embeddings)
├── Pinecone (Vector Search)
├── Vercel KV (Response Cache)
└── next-intl (i18n: de, en, sr, hr, tr, it, es, uk)
```

## Projektstruktur

```
app/
├── [locale]/                    # Seiten (nur page.tsx, layout.tsx)
│   ├── page.tsx                 # Homepage
│   ├── gastro-ki/               # AI-Assistent
│   ├── check/                   # Compliance Checker
│   │   └── result/
│   ├── documents/               # Dokument-Downloads
│   ├── formular-assistent/      # Formular-Wizard
│   ├── adressen-check/          # Adress-Validierung
│   ├── faq/
│   ├── datenschutz/
│   └── impressum/
│
├── api/                         # API Routes
│   ├── rag/chat/                # RAG Chat Endpoint
│   ├── rag/embed/               # PDF Embedding
│   └── documents/download/      # Dokument-Download
│
├── components/                  # ALLE Components
│   ├── layout/                  # Header, Footer, Nav
│   ├── ui/                      # Basis-UI (AutoGrid, BreakText)
│   ├── shared/                  # Wiederverwendbar (Hero, SellingPoints, etc.)
│   ├── home/                    # Homepage-spezifisch (CheckerEmbed, etc.)
│   ├── features/                # Feature-spezifisch
│   │   ├── check/               # ComplianceCheckerWizard, ResultPageClient
│   │   ├── documents/           # DocumentsPageClient
│   │   └── faq/                 # FAQPageClient
│   ├── gastro-ki/               # AI Wizard Components
│   ├── FormularAssistent/       # Formular-Schritte
│   └── Documents/               # DocumentCard
│
├── lib/                         # Server/Business Logic
│   ├── ai/                      # anthropic.ts, openai.ts, rag.ts
│   ├── vectordb/                # pinecone.ts
│   ├── cache/                   # rag-cache.ts
│   ├── utils/                   # pdf-processor.ts, chunking.ts
│   └── prisma.ts
│
└── data/                        # Statische Daten
    └── help-texts.ts

config/                          # App-Konfiguration
└── documents.ts                 # Dokument-Definitionen

public/
└── pdfs/sources/                # RAG-Quellen-PDFs

messages/                        # i18n (de.json, en.json, etc.)
prisma/schema.prisma             # Datenbank-Schema
```

## API Endpoints

### POST /api/rag/chat
RAG-Chat mit Claude. Cached in Vercel KV (1h TTL).

```typescript
// Request
{ query: string, userContext?: UserContext }

// Response
{ success: boolean, answer: string, sources: Source[], metadata: {...} }
```

### POST /api/documents/download
Dokument-Download mit Analytics-Tracking.

```typescript
{ documentId: 'ansuchen' | 'betriebsbeschreibung' | 'ausfuellhilfe', format: 'pdf', language: string }
```

### POST /api/rag/embed
Verarbeitet PDFs aus `public/pdfs/sources/` und lädt sie in Pinecone.

## Datenbank (Prisma)

| Model | Zweck |
|-------|-------|
| `FormSession` | Formular-Sessions |
| `FormData` | Eingabe-Felder pro Session |
| `GeneratedDocument` | Generierte PDFs |
| `DocumentDownload` | Analytics-Tracking |

## RAG-System

**Flow:** Query → OpenAI Embedding → Pinecone Search → Claude Response

**Config** (`app/lib/ai/rag.ts`): topK=8, minScore=0.15

**PDF-Quellen:** `public/pdfs/sources/` (öffentlich zugänglich für PDF-Viewer)

## Coding-Konventionen

- **Components:** Funktionale Components, TypeScript
- **Styling:** Tailwind CSS
- **Imports:** `@/` Alias für Root (z.B. `@/app/components/ui/`)
- **API:** Next.js Route Handlers
- **DB:** Prisma Client über `app/lib/prisma.ts`

## i18n

- Config: `i18n.ts`
- Middleware: `middleware.ts`
- Messages: `messages/{locale}.json`
- Hook: `useTranslations()` von next-intl

## Rechtliches

- Keine Rechtsberatung - nur technische Unterstützung
- Disclaimers auf relevanten Seiten
- DSGVO: IP-Anonymisierung, Session-Ablauf nach 30 Tagen
