/**
 * Request ID Middleware
 *
 * Generates unique request IDs for tracing and debugging
 */

import { NextRequest, NextResponse } from 'next/server';

// Header name for request ID
export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Generate a unique request ID
 * Format: timestamp-random
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Get request ID from request headers or generate a new one
 */
export function getRequestId(request: NextRequest): string {
  const existingId = request.headers.get(REQUEST_ID_HEADER);
  return existingId || generateRequestId();
}

/**
 * Add request ID to response headers
 */
export function withRequestId(
  response: NextResponse,
  requestId: string
): NextResponse {
  response.headers.set(REQUEST_ID_HEADER, requestId);
  return response;
}

/**
 * Request context for passing request ID through the application
 */
interface RequestContext {
  requestId: string;
  startTime: number;
  ip: string;
  userAgent: string;
  path: string;
  method: string;
}

/**
 * Create request context from NextRequest
 */
export function createRequestContext(request: NextRequest): RequestContext {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0].trim() || 'unknown';

  return {
    requestId: getRequestId(request),
    startTime: Date.now(),
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: new URL(request.url).pathname,
    method: request.method,
  };
}

/**
 * Calculate request duration
 */
export function getRequestDuration(context: RequestContext): number {
  return Date.now() - context.startTime;
}
