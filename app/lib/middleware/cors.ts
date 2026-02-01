/**
 * CORS Middleware Utilities
 *
 * Handles Cross-Origin Resource Sharing for API routes
 */

import { NextRequest, NextResponse } from 'next/server';

// Allowed origins - add your production domains here
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://betriebsanlagen-check.vercel.app',
  // Add production domain when deployed
];

// In development, allow all origins
const isDev = process.env.NODE_ENV === 'development';

interface CorsOptions {
  allowedMethods?: string[];
  allowedHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
}

const DEFAULT_OPTIONS: CorsOptions = {
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  credentials: false,
};

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests
  if (isDev) return true;   // Allow all in development
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for a request
 */
export function getCorsHeaders(
  request: NextRequest,
  options: CorsOptions = {}
): Record<string, string> {
  const { allowedMethods, allowedHeaders, maxAge, credentials } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const origin = request.headers.get('origin');

  // If origin is not allowed, don't set CORS headers
  if (!isOriginAllowed(origin)) {
    return {};
  }

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': allowedMethods!.join(', '),
    'Access-Control-Allow-Headers': allowedHeaders!.join(', '),
    'Access-Control-Max-Age': String(maxAge),
  };

  // Set origin header
  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (isDev) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  if (credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * Handle OPTIONS preflight request
 */
export function handlePreflight(
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse | null {
  if (request.method !== 'OPTIONS') {
    return null;
  }

  const origin = request.headers.get('origin');

  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request, options),
  });
}

/**
 * Add CORS headers to an existing response
 */
export function withCors(
  response: NextResponse,
  request: NextRequest,
  options: CorsOptions = {}
): NextResponse {
  const corsHeaders = getCorsHeaders(request, options);

  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Wrapper for API route handlers with CORS support
 */
export function withCorsHandler<T>(
  handler: (request: NextRequest) => Promise<NextResponse<T>>,
  options: CorsOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight
    const preflightResponse = handlePreflight(request, options);
    if (preflightResponse) {
      return preflightResponse;
    }

    // Check origin for non-preflight requests
    const origin = request.headers.get('origin');
    if (!isOriginAllowed(origin)) {
      return new NextResponse(
        JSON.stringify({ error: 'Origin not allowed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call the actual handler
    const response = await handler(request);

    // Add CORS headers to response
    return withCors(response, request, options);
  };
}
