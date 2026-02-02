# Needs To Be Fixed

Comprehensive list of issues found during code audit. Each task is small and focused for incremental fixing and testing.

---

## Priority Legend

- **P0 - Critical**: Security vulnerabilities, broken functionality
- **P1 - High**: Bad practices that will cause problems
- **P2 - Medium**: Should be fixed but not urgent
- **P3 - Low**: Nice to have, minor improvements

---

## Quick Stats

| Priority | Count |
|----------|-------|
| P0 Critical | 7 |
| P1 High | 12 |
| P2 Medium | 15 |
| P3 Low | 10 |
| **Total** | **44** |

---

## P0 - Critical (Fix First)

### SEC-01: Add authentication to admin API endpoints
**Files:**
- `app/api/rag/embed/route.ts:23`
- `app/api/rag/embed-from-json/route.ts:213`

**Problem:** These endpoints can rebuild/delete the entire vector index without any authentication. Anyone can call them.

**Fix:** Add API key check or admin authentication.

**Test:** Try calling endpoint without auth header → should return 401.

---

### SEC-02: Protect or disable debug endpoint in production
**File:** `app/api/debug/pinecone/route.ts:15-91`

**Problem:** Exposes internal system info (index stats, vector counts) without authentication.

**Fix:** Either:
- Add authentication check
- Disable in production with `if (isProduction()) return apiError.notFound()`
- Delete the endpoint entirely

**Test:** Call `/api/debug/pinecone` in production → should return 404 or 401.

---

### SEC-03: Protect or disable test endpoint in production
**File:** `app/api/rag/test/route.ts:15-57`

**Problem:** Exposes API connection status without authentication.

**Fix:** Same options as SEC-02.

**Test:** Call `/api/rag/test` in production → should return 404 or 401.

---

### SEC-04: Add production domain to CORS
**File:** `config/security.ts:12`

**Problem:** TODO comment says "Add production domain" - CORS won't work properly.

**Fix:** Add your production domain to `ALLOWED_ORIGINS` array.

**Test:** Deploy and verify cross-origin requests work from production domain.

---

### SEC-05: Remove unsafe CSP directives
**Files:**
- `config/security.ts:42-43`
- `next.config.ts:10` (if duplicated there)

**Problem:** `'unsafe-eval'` and `'unsafe-inline'` significantly weaken XSS protection.

**Fix:** Remove these directives. If something breaks, fix the root cause instead.

**Test:** Run app, check browser console for CSP violations, fix any that appear.

---

### I18N-01: Translate datenschutz (privacy) page
**File:** `app/[locale]/datenschutz/page.tsx` (entire file, ~360 lines)

**Problem:** Privacy policy is hardcoded German. Users selecting other languages still see German.

**Fix:**
1. Extract all strings to `messages/de.json` under `datenschutz` key
2. Add translations to all locale files (en, sr, hr, tr, it, es, uk)
3. Use `useTranslations('datenschutz')` in component

**Test:** Switch to English → page should display in English.

---

### I18N-02: Translate impressum (imprint) page
**File:** `app/[locale]/impressum/page.tsx` (entire file, ~80 lines)

**Problem:** Same as I18N-01 - hardcoded German.

**Fix:** Same approach as I18N-01.

**Test:** Switch to English → page should display in English.

---

## P1 - High Priority

### LOG-01: Replace console.log in FollowUpChat.tsx
**File:** `app/components/gastro-ki/FollowUpChat.tsx`
**Lines:** 92, 103, 107, 112, 129, 132, 133

**Problem:** Uses `console.log` instead of `logger` utility.

**Fix:**
```typescript
import { logger } from '@/app/lib/utils/logger';
// Replace console.log('[DEBUG]...') with logger.debug(...)
// Replace console.error('[ERROR]...') with logger.error(...)
```

**Test:** Run app, check that logs appear correctly in dev, are suppressed in prod.

---

### LOG-02: Replace console.log in GastroKIWizard.tsx
**File:** `app/components/gastro-ki/GastroKIWizard.tsx`
**Lines:** 175, 192, 203, 205, 207

**Problem:** Same as LOG-01.

**Fix:** Same approach.

---

### LOG-03: Replace console.log in ResultPageClient.tsx
**File:** `app/components/features/check/ResultPageClient.tsx`
**Line:** 139

**Problem:** Same as LOG-01.

**Fix:** Same approach.

---

### LOG-04: Replace console.log in other components
**Files:**
- `app/components/gastro-ki/PDFViewerModal.tsx:54`
- `app/components/FormularAssistent/FormularWizard.tsx:79, 112`
- `app/components/AddressChecker.tsx:66, 96`
- `app/components/FormularAssistent/schritte/SchrittStandort.tsx:35, 63`

**Problem:** Same as LOG-01.

**Fix:** Same approach for each file.

---

### LOG-05: Replace console.log in lib files
**Files:**
- `app/lib/monitoring/sentry.ts:33, 64, 105`
- `app/lib/env.ts:49`

**Problem:** Library files using console instead of logger.

**Fix:** Import and use logger utility.

---

### CFG-01: Remove duplicate CORS origins
**File:** `app/lib/middleware/cors.ts:10-15`

**Problem:** `ALLOWED_ORIGINS` is hardcoded here AND in `config/security.ts`. They can drift.

**Fix:**
```typescript
import { ALLOWED_ORIGINS } from '@/config/security';
// Remove the local ALLOWED_ORIGINS array
```

**Test:** CORS should work the same as before.

---

### CFG-02: Standardize environment variable access
**Files:**
- `app/lib/ai/anthropic.ts:18`
- `app/lib/ai/openai.ts:19`
- `app/lib/vectordb/pinecone.ts:19, 38`

**Problem:** These files access `process.env` directly instead of using `getEnv()`.

**Fix:** Import and use `getEnv()` from `@/app/lib/env`.

**Test:** App should work the same; missing env vars caught at startup.

---

### SEO-01: Add metadata to homepage
**File:** `app/[locale]/page.tsx`

**Problem:** Homepage has no `generateMetadata` export - bad for SEO.

**Fix:** Add metadata export like other pages (see `check/result/page.tsx` for example).

**Test:** View page source → should see proper `<title>` and `<meta>` tags.

---

### SEO-02: Add metadata to gastro-ki page
**File:** `app/[locale]/gastro-ki/page.tsx:3`

**Problem:** No metadata export.

**Fix:** Same as SEO-01.

---

### SEO-03: Add metadata to datenschutz page
**File:** `app/[locale]/datenschutz/page.tsx:3`

**Problem:** No metadata export.

**Fix:** Same as SEO-01.

---

### SEO-04: Add metadata to impressum page
**File:** `app/[locale]/impressum/page.tsx:3`

**Problem:** No metadata export.

**Fix:** Same as SEO-01.

---

### SEO-05: Add metadata to adressen-check page
**File:** `app/[locale]/adressen-check/page.tsx`

**Problem:** No metadata export.

**Fix:** Same as SEO-01.

---

## P2 - Medium Priority

### SEC-06: Add path traversal protection
**File:** `app/api/documents/download/route.ts:42-49`

**Problem:** Missing path normalization check.

**Fix:**
```typescript
const filePath = path.resolve(process.cwd(), 'public', 'documents', 'original', `${documentId}.${format}`);
const expectedDir = path.resolve(process.cwd(), 'public', 'documents', 'original');
if (!filePath.startsWith(expectedDir)) {
  return apiError.badRequest('Invalid document path');
}
```

**Test:** Try path traversal in documentId → should fail.

---

### SEC-07: Add rate limiting to download endpoint
**File:** `app/api/documents/download/route.ts`

**Problem:** Rate limit preset defined but not enforced.

**Fix:** Add rate limiting check like in `/api/rag/chat`.

**Test:** Exceed rate limit → should return 429.

---

### SEC-08: Don't expose stack traces
**File:** `app/api/debug/pinecone/route.ts:88`

**Problem:** Returns `error.stack` to client.

**Fix:** Remove stack from response, only log server-side.

---

### I18N-03: Translate gastro-ki page strings
**File:** `app/[locale]/gastro-ki/page.tsx:20-81`

**Problem:** 11+ hardcoded German strings.

**Fix:** Extract to translation files, use `useTranslations()`.

**Test:** Switch locale → all text should translate.

---

### REACT-01: Fix key props in StackedArticles
**File:** `app/components/home/StackedCard/Q&A/StackedArticles.tsx:24`

**Problem:** `key={idx}` uses array index.

**Fix:** Use unique identifier from items, e.g., `key={item.id}` or `key={item.title}`.

---

### REACT-02: Fix key props in AnimatedStats
**File:** `app/components/AnimatedStats.tsx:46`

**Problem:** `key={index}` uses array index.

**Fix:** Use unique identifier.

---

### REACT-03: Fix key props in RiskAssessment
**File:** `app/components/RiskAssessment.tsx:83, 104`

**Problem:** `key={index}` uses array index.

**Fix:** Use unique identifier.

---

### REACT-04: Fix key props in POIList
**File:** `app/components/POIList.tsx:68`

**Problem:** `key={index}` uses array index.

**Fix:** Use POI's unique identifier.

---

### REACT-05: Fix key props in AddressChecker
**File:** `app/components/AddressChecker.tsx:201, 395, 443`

**Problem:** `key={index}` or `key={idx}` uses array index.

**Fix:** Use unique identifier from data.

---

### REACT-06: Fix key props in SchrittStandort
**File:** `app/components/FormularAssistent/schritte/SchrittStandort.tsx:112, 257, 273`

**Problem:** `key={index}` or `key={i}` uses array index.

**Fix:** Use unique identifier.

---

### ERR-01: Add error.tsx to routes
**Paths:**
- `app/[locale]/error.tsx`
- `app/[locale]/check/error.tsx`
- `app/[locale]/gastro-ki/error.tsx`

**Problem:** No error boundaries at route level.

**Fix:** Create error.tsx files with user-friendly error UI.

**Test:** Throw error in page → should show error UI, not crash.

---

### ERR-02: Add loading.tsx to routes
**Paths:**
- `app/[locale]/loading.tsx`
- `app/[locale]/check/loading.tsx`
- `app/[locale]/gastro-ki/loading.tsx`

**Problem:** No loading states for slow operations.

**Fix:** Create loading.tsx files with skeleton/spinner UI.

---

### ENV-01: Add NEXT_PUBLIC vars to env schema
**File:** `app/lib/env.ts`

**Problem:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_VERCEL_ENV` not validated.

**Fix:** Add to Zod schema as optional strings.

---

### ENV-02: Add SENTRY_DSN to env schema
**File:** `app/lib/env.ts`

**Problem:** Used in sentry.ts but not in schema.

**Fix:** Add `SENTRY_DSN: z.string().url().optional()` to schema.

---

## P3 - Low Priority

### PERF-01: Memoize suggested questions array
**File:** `app/components/gastro-ki/FollowUpChat.tsx:52-59`

**Problem:** Array recreated every render.

**Fix:** Move to module level or wrap in `useMemo`.

---

### PERF-02: Memoize helper functions in GastroKIWizard
**File:** `app/components/gastro-ki/GastroKIWizard.tsx:263-291`

**Problem:** `getBusinessTypeLabel`, etc. recreated every render.

**Fix:** Move outside component or use `useCallback`.

---

### A11Y-01: Add ARIA to progress bar
**File:** `app/components/gastro-ki/GastroKIWizard.tsx:400`

**Problem:** Progress bar is visual only.

**Fix:** Add `role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"`.

---

### A11Y-02: Add accessible names to SVG icons
**File:** `app/components/RiskAssessment.tsx:109`

**Problem:** Icons lack accessible names.

**Fix:** Add `aria-label` or `title` to SVGs.

---

### A11Y-03: Add ARIA labels to map popups
**File:** `app/components/ViennaGISMap.tsx:62-66, 89-99`

**Problem:** Leaflet popups lack ARIA labels.

**Fix:** Add proper ARIA attributes to popup content.

---

### CLEAN-01: Use router instead of location.reload()
**File:** `app/[locale]/datenschutz/page.tsx:163-170`

**Problem:** Direct DOM manipulation with `location.reload()`.

**Fix:** Use Next.js `router.refresh()` instead.

---

### CLEAN-02: Extract cookie consent key to constant
**File:** `app/[locale]/datenschutz/page.tsx:164`

**Problem:** Hardcoded string `'cookie-consent'`.

**Fix:** Create constant in config file.

---

### TYPE-01: Fix type assertions in logger
**File:** `app/lib/logger.ts:107-109`

**Problem:** Unsafe `as string` casts.

**Fix:** Add proper type guards before casting.

---

### TYPE-02: Extract inline types to interfaces
**Files:**
- `app/lib/viennagis-api.ts:103`
- `app/lib/utils/pdf-processor.ts:69`

**Problem:** Complex inline type annotations.

**Fix:** Extract to named interfaces for readability.

---

### DOC-01: Remove stack traces from API error responses
**File:** `app/api/debug/pinecone/route.ts:88`

**Problem:** Stack traces exposed to clients.

**Fix:** Only log stack server-side, return generic error to client.

---

## Future Work (Not Urgent)

### FUTURE-01: Sentry Integration
**File:** `app/lib/monitoring/sentry.ts`

When ready to add error monitoring:
1. Run `npm install @sentry/nextjs`
2. Set `SENTRY_DSN` in environment
3. Uncomment the 7 TODO sections in sentry.ts

### FUTURE-02: Distributed Rate Limiting
**File:** `app/lib/middleware/rate-limit.ts:5`

Current in-memory rate limiting won't work across serverless instances. Migrate to Vercel KV when scaling becomes an issue.

### FUTURE-03: Log Aggregation
**File:** `app/lib/utils/audit.ts:39, 82, 98`

Replace in-memory audit buffer with proper log aggregation (Vercel Log Drain, Datadog, etc.) for production.

---

## Progress Tracking

Use this section to track completed items:

- [x] SEC-01
- [x] SEC-02
- [x] SEC-03
- [x] SEC-04
- [x] SEC-05
- [ ] I18N-01
- [ ] I18N-02
- [x] LOG-01
- [x] LOG-02
- [x] LOG-03
- [x] LOG-04
- [x] LOG-05
- [ ] CFG-01
- [ ] CFG-02
- [ ] SEO-01
- [ ] SEO-02
- [ ] SEO-03
- [ ] SEO-04
- [ ] SEO-05
- [ ] SEC-06
- [ ] SEC-07
- [x] SEC-08
- [ ] I18N-03
- [ ] REACT-01
- [ ] REACT-02
- [ ] REACT-03
- [ ] REACT-04
- [ ] REACT-05
- [ ] REACT-06
- [ ] ERR-01
- [ ] ERR-02
- [ ] ENV-01
- [ ] ENV-02
- [ ] PERF-01
- [ ] PERF-02
- [ ] A11Y-01
- [ ] A11Y-02
- [ ] A11Y-03
- [ ] CLEAN-01
- [ ] CLEAN-02
- [ ] TYPE-01
- [ ] TYPE-02
- [x] DOC-01
