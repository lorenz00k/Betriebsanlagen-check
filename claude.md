# Betriebsanlagen-Check Wien - AI Context

Mehrsprachige Web-App für Betriebsanlagengenehmigungen in Wien.

## Architektur

```
Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
├── PostgreSQL (Vercel) + Prisma ORM
├── Claude 3.5 Haiku (RAG Responses)
├── OpenAI text-embedding-3-small (Embeddings)
├── Pinecone (Vector Search)
├── Vercel KV (Response Cache)
└── next-intl (i18n: de, en, sr, hr, tr, it, es, uk)
```

## Wichtige Verzeichnisse

| Pfad | Zweck |
|------|-------|
| `app/[locale]/` | Lokalisierte Seiten |
| `app/api/rag/` | RAG-System API |
| `app/lib/ai/` | AI-Integration (anthropic.ts, openai.ts, rag.ts) |
| `app/lib/vectordb/` | Pinecone Client |
| `app/lib/cache/` | Vercel KV Cache |
| `app/config/` | Dokument-Konfiguration |
| `app/components/` | React Components |
| `messages/` | i18n JSON-Dateien |
| `prisma/schema.prisma` | Datenbank-Schema |

## Seiten

| Route | Funktion |
|-------|----------|
| `/[locale]` | Homepage |
| `/[locale]/gastro-ki` | AI-Assistent (RAG Chat) |
| `/[locale]/check` | Compliance Checker Wizard |
| `/[locale]/formular-assistent` | Formular-Wizard |
| `/[locale]/documents` | Dokument-Downloads |
| `/[locale]/adressen-check` | Wien Adress-Validierung (GIS API) |

## API Endpoints

### POST /api/rag/chat
RAG-Chat mit Claude. Cached Responses in Vercel KV.

```typescript
// Request
{ query: string, userContext?: UserContext, filter?: Record<string, unknown> }

// UserContext
{ businessType?: string, businessSize?: string, location?: string,
  numberOfEmployees?: number, outdoorSeating?: boolean }

// Response
{ success: boolean, answer: string, sources: Source[], metadata: {...} }
```

### POST /api/documents/download
Dokument-Download mit Analytics-Tracking.

```typescript
{ documentId: 'ansuchen' | 'betriebsbeschreibung' | 'ausfuellhilfe',
  format: 'pdf', language: string }
```

## Datenbank (Prisma)

```prisma
model FormSession {
  id, sessionToken, formType, language, status, currentStep, totalSteps
  formData: FormData[], documents: GeneratedDocument[]
}

model FormData {
  id, sessionId, fieldName, fieldValue, section, stepNumber
}

model GeneratedDocument {
  id, sessionId, documentType, fileUrl, fileSize, downloadCount, expiresAt
}

model DocumentDownload {
  id, documentId, format, language, userAgent, ipAddress (anonymized)
}
```

## RAG-System

Flow: Query → OpenAI Embedding → Pinecone Search → Claude Response

**Konfiguration** (`app/lib/ai/rag.ts`):
- topK: 8 Dokumente
- minScore: 0.15 (Similarity Threshold)
- Fallback: Top 5 bei keinem Match

**Hierarchisches Chunking**: Parent-Context wird bei Bedarf hinzugefügt.

**Cache**: Responses werden 1h in Vercel KV gecached.

## Dokumente

Definiert in `app/config/documents.ts`:
- `ansuchen` - Haupt-Antragsformular (required)
- `betriebsbeschreibung` - Technische Details, 4-fach (required)
- `ausfuellhilfe` - Anleitung (guide)

Alle mit 8-Sprachen-Übersetzungen.

## i18n

- Config: `i18n.ts` (locales, defaultLocale)
- Middleware: `middleware.ts` (Routing)
- Messages: `messages/{locale}.json`
- Hook: `useTranslations()` von next-intl

## Coding-Konventionen

- **Components**: Funktionale Components mit TypeScript
- **Styling**: Tailwind CSS, keine CSS-Module
- **API**: Next.js Route Handlers (app/api/)
- **DB**: Prisma Client über `app/lib/prisma.ts` (Singleton)
- **Imports**: `@/` Alias für Root

## Rechtliche Hinweise

Diese App bietet **keine Rechtsberatung**. Disclaimers müssen auf relevanten Seiten angezeigt werden:
- Keine Garantien für Genehmigungen
- Nur technische Unterstützung beim Ausfüllen
- Original-Formulare von der Behörde

## DSGVO

- IP-Adressen werden anonymisiert (erste 3 Oktetten)
- Sessions laufen nach 30 Tagen ab
- Download-Links nach 7 Tagen
