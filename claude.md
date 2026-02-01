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
├── Zod (Schema Validation)
└── next-intl (i18n: de, en, sr, hr, tr, it, es, uk)
```

## Projektstruktur

```
app/
├── [locale]/                    # Seiten (nur page.tsx, layout.tsx)
│   ├── page.tsx                 # Homepage
│   ├── gastro-ki/               # AI-Assistent
│   ├── check/                   # Compliance Checker
│   ├── documents/               # Dokument-Downloads
│   └── ...
│
├── api/                         # API Routes
│   ├── rag/chat/                # RAG Chat (Zod-validiert, Rate-Limited)
│   ├── rag/embed/               # PDF Embedding
│   ├── documents/download/      # Dokument-Download
│   └── health/                  # Health Check Endpoint
│
├── components/
│   ├── ui/                      # Basis-UI (AutoGrid, ErrorBoundary)
│   ├── shared/                  # Wiederverwendbar
│   ├── home/                    # Homepage-spezifisch
│   ├── features/                # Feature-spezifisch
│   └── gastro-ki/               # AI Wizard
│
└── lib/                         # Server/Business Logic
    ├── ai/                      # anthropic.ts, openai.ts, rag.ts
    ├── vectordb/                # pinecone.ts
    ├── cache/                   # rag-cache.ts
    ├── api/                     # response.ts (Standard-Responses)
    ├── middleware/              # rate-limit.ts, cors.ts, request-id.ts
    ├── monitoring/              # sentry.ts
    ├── utils/                   # logger.ts, sanitize.ts, audit.ts
    ├── env.ts                   # Environment-Validation
    └── prisma.ts

config/
├── documents.ts                 # Dokument-Definitionen
└── security.ts                  # Security-Konfiguration (CSP, CORS, Rate-Limits)

public/pdfs/sources/             # RAG-Quellen-PDFs
messages/                        # i18n (de.json, en.json, etc.)
```

## Security Utilities

### Logger (`app/lib/utils/logger.ts`)
```typescript
import { logger } from '@/app/lib/utils/logger';

logger.debug('msg', { component: 'x' });  // Nur dev + DEBUG=true
logger.info('msg', { component: 'x' });   // Nur dev
logger.warn('msg', { component: 'x' });   // Immer (+ Sentry in prod)
logger.error('msg', error, { ... });      // Immer (+ Sentry)
```

### Input Sanitization (`app/lib/utils/sanitize.ts`)
```typescript
import { sanitizeQuery, sanitizeInput, escapeHtml } from '@/app/lib/utils/sanitize';

const safeQuery = sanitizeQuery(userInput);  // Für RAG-Queries
const safeText = sanitizeInput(text, { maxLength: 1000 });
```

### API Responses (`app/lib/api/response.ts`)
```typescript
import { success, apiError } from '@/app/lib/api/response';

return success({ data });                    // 200 OK
return apiError.validation('Invalid');       // 422
return apiError.notFound('Not found');       // 404
return apiError.rateLimited(60);             // 429
return apiError.internal('Error');           // 500
```

### Rate Limiting (`app/lib/middleware/rate-limit.ts`)
```typescript
import { isRateLimited, rateLimitPresets } from '@/app/lib/middleware/rate-limit';

if (isRateLimited(clientId, rateLimitPresets.chat)) {
  return apiError.rateLimited(60);
}
```

### Environment Validation (`app/lib/env.ts`)
```typescript
import { getEnv, isProduction } from '@/app/lib/env';

const env = getEnv();  // Validiert mit Zod, fails fast in production
```

## API Endpoints

### POST /api/rag/chat
RAG-Chat mit Claude. Zod-validiert, Rate-Limited (20/min), Cached (1h).

```typescript
// Request (Zod-Schema)
{
  query: string,           // max 1000 chars
  userContext?: { businessType?, businessSize?, location?, ... },
  filter?: Record<string, unknown>
}

// Response
{ success: true, answer: string, sources: Source[], metadata: {...} }
// oder
{ success: false, error: { code: string, message: string } }
```

### POST /api/documents/download
Dokument-Download mit Analytics-Tracking.

```typescript
{ documentId: 'ansuchen' | 'betriebsbeschreibung', format: 'pdf', language: string }
```

### GET /api/health
Health-Check für Monitoring.

```typescript
// Response
{
  status: 'healthy' | 'degraded' | 'unhealthy',
  checks: { database: {...}, environment: {...} }
}
```

## Security Configuration (`config/security.ts`)

```typescript
ALLOWED_ORIGINS     // CORS Origins
RATE_LIMITS         // api, chat, downloads, embed
CSP_DIRECTIVES      // Content Security Policy
SECURITY_HEADERS    // HSTS, X-Frame-Options, etc.
```

## Datenbank (Prisma)

| Model | Zweck |
|-------|-------|
| `FormSession` | Formular-Sessions |
| `FormData` | Eingabe-Felder pro Session |
| `GeneratedDocument` | Generierte PDFs |
| `DocumentDownload` | Analytics-Tracking |

## RAG-System

**Flow:** Query → Sanitize → OpenAI Embedding → Pinecone Search → Claude Response

**Config** (`app/lib/ai/rag.ts`): topK=8, minScore=0.15

## Coding-Konventionen

- **Validation:** Zod-Schemas für alle API-Inputs
- **Logging:** `logger` statt `console.log`
- **Errors:** `apiError.*` für konsistente Responses
- **Imports:** `@/` Alias (z.B. `@/app/lib/utils/logger`)
- **Security:** Input sanitization, Rate limiting, CSP Headers

## Monitoring (Optional)

Sentry-Integration vorbereitet in `app/lib/monitoring/sentry.ts`:
1. `npm install @sentry/nextjs`
2. `SENTRY_DSN` in Environment setzen
3. Code in sentry.ts auskommentieren

## Rechtliches

- Keine Rechtsberatung - nur technische Unterstützung
- Disclaimers auf relevanten Seiten
- DSGVO: IP-Anonymisierung, Session-Ablauf nach 30 Tagen
