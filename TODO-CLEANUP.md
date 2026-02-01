# Code Cleanup TODOs

Generiert am: 2026-02-01
Aktualisiert am: 2026-02-01

## Priorität 1: Console.log Migration zu Logger

Diese Dateien verwenden noch `console.log/warn/error` statt unseres strukturierten Loggers:

### API Routes (Server-Side)
- [x] `app/api/debug/pinecone/route.ts` - 4 Statements ✅
- [x] `app/api/rag/embed-from-json/route.ts` - 27 Statements ✅
- [x] `app/api/rag/test/route.ts` - 2 Statements ✅
- [x] `app/api/rag/embed/status/route.ts` - 3 Statements ✅

### Core Libraries
- [x] `app/lib/ai/rag.ts` - 24 Statements ✅
- [x] `app/lib/ai/openai.ts` - 3 Statements ✅
- [x] `app/lib/ai/anthropic.ts` - 1 Statement ✅
- [x] `app/lib/cache/rag-cache.ts` - 11 Statements ✅
- [x] `app/lib/utils/pdf-processor.ts` - 15 Statements ✅

### Client Components (TODO)
- [ ] `app/components/gastro-ki/FollowUpChat.tsx` - 8 Statements (DEBUG)
- [ ] `app/components/gastro-ki/GastroKIWizard.tsx` - 5 Statements (DEBUG)
- [ ] `app/components/gastro-ki/PDFViewerModal.tsx` - 1 Statement
- [ ] `app/components/FormularAssistent/FormularWizard.tsx` - 2 Statements
- [ ] `app/components/FormularAssistent/schritte/SchrittStandort.tsx` - 2 Statements
- [ ] `app/components/AddressChecker.tsx` - 2 Statements
- [ ] `app/components/features/check/ResultPageClient.tsx` - 1 Statement

### Akzeptabel (kein Handlungsbedarf)
- `app/lib/utils/logger.ts` - Ist der Logger selbst
- `app/lib/monitoring/sentry.ts` - Fallback-Logging wenn Sentry nicht konfiguriert
- `app/lib/env.ts` - console.warn für Env-Validierung ist Standard
- `app/components/ui/ErrorBoundary.tsx` - console.error in ErrorBoundary ist akzeptabel

---

## Priorität 2: Ungenutzte Middleware integrieren

Diese Middleware wurde erstellt aber nie in die API-Routes eingebunden:

- [ ] `app/lib/middleware/cors.ts` - CORS-Headers für API-Responses
- [ ] `app/lib/middleware/request-id.ts` - Request-Tracking für Debugging
- [ ] `app/lib/utils/audit.ts` - Security-Event-Logging

**Empfehlung:** In `app/api/rag/chat/route.ts` und andere wichtige Routes integrieren.

---

## Priorität 3: Ungenutzter Code

### Komplett ungenutzte Dateien
- [ ] `app/lib/utils/legal-document-parser.ts` - Wird nirgends importiert
  - **Entscheidung:** Löschen oder für zukünftiges Feature behalten?

### Ungenutzte Exports (können bleiben, sind nützliche Utilities)
- `chunking.ts`: `estimateChunkCount()`, `getChunkingStats()`
- `anthropic.ts`: `estimateClaudeCost()`
- `openai.ts`: `estimateTokens()`, `estimateEmbeddingCost()`
- `rag.ts`: `getRAGStats()`
- `sanitize.ts`: Mehrere Utility-Funktionen

**Empfehlung:** Behalten - diese sind nützlich für Debugging/Monitoring.

---

## Priorität 4: Bestehende TODOs im Code

Diese TODOs existieren bereits im Code:

### Infrastruktur
- [ ] `config/security.ts:12` - Production Domain zu ALLOWED_ORIGINS hinzufügen
- [ ] `app/lib/middleware/rate-limit.ts:5` - Migration zu Vercel KV für verteiltes Rate Limiting

### Monitoring
- [ ] `app/lib/monitoring/sentry.ts` - Sentry aktivieren (npm install @sentry/nextjs)
- [ ] `app/components/ui/ErrorBoundary.tsx:27` - Error Monitoring Service hinzufügen

### Audit/Logging
- [ ] `app/lib/utils/audit.ts:39` - Log Aggregation implementieren (Vercel Log Drain, Datadog)
- [ ] `app/lib/utils/audit.ts:82` - Persistenz implementieren

### Type Safety
- [ ] `app/api/documents/download/route.ts:37` - Document.formats Type Match

---

## Priorität 5: Type Safety

### Type `any` Usage
- `types/pdf-parse.d.ts` - 2 Instanzen (akzeptabel, externe Library)

### Catch Blocks ohne Type Annotation
Alle `catch (error)` Blocks sollten proper Error-Handling haben:
```typescript
// Statt:
catch (error) {
  console.error(error);
}

// Besser:
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error('Operation failed', error, { component: 'x' });
}
```

Betroffene Dateien: ~50 catch blocks (siehe Scan-Ergebnisse)

---

## Zusammenfassung

| Kategorie | Anzahl Items | Geschätzter Aufwand |
|-----------|-------------|---------------------|
| Console.log Migration | 17 Dateien | Mittel |
| Middleware Integration | 3 Module | Gering |
| Ungenutzter Code | 1 Datei | Gering |
| Bestehende TODOs | 8 Items | Varies |
| Type Safety | ~50 catch blocks | Mittel |

**Empfohlene Reihenfolge:**
1. Console.log → Logger (Priorität 1) - Konsistentes Logging
2. Middleware integrieren (Priorität 2) - Nutzt bereits geschriebenen Code
3. Ungenutzten Code entscheiden (Priorität 3)
4. Dann: Tests schreiben
5. Später: Bestehende TODOs (Priorität 4) wenn relevant
