/**
 * Security Configuration
 *
 * Centralized security settings for the application
 */

// Allowed origins for CORS
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://betriebsanlagen-check.vercel.app',
  'https://betriebsanlage-check.at',
  'https://www.betriebsanlage-check.at',
] as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  // API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,     // 60 requests per minute
  },
  // Chat endpoint (more restrictive due to AI costs)
  chat: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,     // 20 requests per minute
  },
  // Document downloads
  downloads: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,     // 30 downloads per minute
  },
  // Embed endpoint (admin only)
  embed: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,      // 5 requests per minute
  },
} as const;

// Content Security Policy directives
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  // Note: 'unsafe-inline' for styles is required by Tailwind CSS / Next.js
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'blob:', 'data:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://api.anthropic.com',
    'https://api.openai.com',
    'https://*.pinecone.io',
    'https://*.vercel-storage.com',
  ],
  'frame-ancestors': ["'self'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
} as const;

// Build CSP string from directives
export function buildCSP(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

// Security headers
export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

// Sensitive data patterns to sanitize in logs
export const SENSITIVE_PATTERNS = [
  'password',
  'token',
  'key',
  'secret',
  'authorization',
  'cookie',
  'session',
  'email',
  'phone',
  'address',
  'apikey',
  'api_key',
] as const;

// Maximum request body sizes
export const MAX_BODY_SIZE = {
  default: '1mb',
  upload: '10mb',
} as const;
