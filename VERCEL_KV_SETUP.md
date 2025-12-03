# Vercel KV Setup for Response Caching

## What is Vercel KV?

Vercel KV is a Redis-based key-value store that provides fast, distributed caching for serverless applications. We use it to cache RAG query responses.

## Benefits of Response Caching

- **Cost Reduction**: Identical queries don't hit OpenAI/Anthropic APIs again
- **Speed**: Cached responses return in ~50ms instead of 2-5 seconds
- **Reliability**: Reduces API rate limit issues
- **Better UX**: Instant responses for common questions

## Setup Instructions

### 1. Create Vercel KV Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `betriebsanlagen-check`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Choose a name: `betriebsanlagen-check-cache`
7. Select region: **EU Central 1** (same as your Neon database)
8. Click **Create**

### 2. Add Environment Variables

Vercel will automatically add these to your project:

```bash
KV_URL="redis://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

### 3. Pull to Local Development

```bash
# Pull environment variables from Vercel
vercel env pull .env.local
```

This will add the KV variables to your `.env.local` file.

### 4. Verify Setup

Start your dev server:

```bash
npm run dev
```

Test a query in GastroKI - you should see in the server logs:

**First query:**
```
❌ Cache miss - Performing RAG query...
✅ RAG CHAT RESPONSE
💾 Cached response for query: "..." (TTL: 3600s)
```

**Second identical query:**
```
⚡ CACHE HIT - Returning cached response
📚 Sources: 3
🤖 Model: claude-3-5-haiku-20241022
💾 Originally generated: 2025-01-...
```

## Current Status

⚠️ **Caching code is implemented but not active yet**

The application will work normally without Vercel KV - it just won't cache responses. Once you set up Vercel KV, caching will activate automatically.

## Cache Configuration

Current settings in `app/lib/cache/rag-cache.ts`:

- **TTL (Time-To-Live)**: 1 hour (3600 seconds)
- **Cache Key**: SHA-256 hash of query + context (business type, size, location)
- **Storage**: Redis via `@vercel/kv`

## Cache Statistics

You can view cache stats by creating an admin endpoint:

```typescript
// app/api/admin/cache-stats/route.ts
import { getCacheStats } from '@/app/lib/cache/rag-cache';

export async function GET() {
  const stats = await getCacheStats();
  return Response.json(stats);
}
```

Visit: `http://localhost:3000/api/admin/cache-stats`

## Clearing Cache

During development, you may want to clear the cache:

```typescript
import { clearAllRAGCache } from '@/app/lib/cache/rag-cache';

// In a script or admin endpoint
await clearAllRAGCache();
```

## Cost Estimation

**Without Caching:**
- 100 queries/day × 30 days = 3,000 queries/month
- Each query: ~$0.01 (OpenAI embeddings + Anthropic generation)
- Monthly cost: ~$30

**With Caching (50% cache hit rate):**
- 1,500 cached queries + 1,500 new queries
- Monthly cost: ~$15
- **Savings: 50%**

## Production Deployment

The caching will automatically work in production once Vercel KV is set up - no code changes needed!

## Troubleshooting

### "Cache not available" warnings

This is normal if KV is not set up yet. The app will continue to work.

### Cache not working after setup

1. Check environment variables are present: `echo $KV_REST_API_URL`
2. Restart dev server: `npm run dev`
3. Check Vercel dashboard for KV database status

### Cache hit rate too low

Consider increasing TTL in `setCachedResponse()` call (currently 3600s = 1 hour).
