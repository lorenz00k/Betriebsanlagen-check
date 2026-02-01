/**
 * Simple in-memory rate limiter
 *
 * For production with multiple instances, use Redis (Vercel KV)
 * TODO: Migrate to Vercel KV for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store - cleared on server restart
const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 60 * 1000,   // 1 minute
  maxRequests: 30,       // 30 requests per minute
};

/**
 * Check if request should be rate limited
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): boolean {
  const { windowMs, maxRequests } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired - reset
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  // Increment counter
  entry.count++;

  if (entry.count > maxRequests) {
    return true; // Rate limited
  }

  return false;
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitInfo(
  identifier: string,
  config: Partial<RateLimitConfig> = {}
): { remaining: number; reset: number } {
  const { maxRequests } = { ...DEFAULT_CONFIG, ...config };
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    return { remaining: maxRequests, reset: 0 };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    reset: Math.ceil((entry.resetTime - Date.now()) / 1000),
  };
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Extract client identifier from request
 * Uses IP address with fallback
 */
export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return 'unknown';
}
