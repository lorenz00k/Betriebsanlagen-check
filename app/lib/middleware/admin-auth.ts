/**
 * Admin Authentication Middleware
 *
 * Protects admin-only endpoints like /api/rag/embed
 * Requires ADMIN_API_KEY environment variable to be set
 */

import { NextRequest } from 'next/server';
import { apiError } from '@/app/lib/api/response';
import { logger } from '@/app/lib/utils/logger';

/**
 * Validates admin API key from request headers
 *
 * Expected header: Authorization: Bearer <ADMIN_API_KEY>
 *
 * @returns null if authorized, NextResponse error if not
 */
export function validateAdminAuth(request: NextRequest) {
  const adminApiKey = process.env.ADMIN_API_KEY;

  // If no admin key is configured, block all requests in production
  if (!adminApiKey) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Admin endpoint called but ADMIN_API_KEY not configured', {
        component: 'admin-auth',
        action: 'denied',
      });
      return apiError.forbidden('Admin endpoints are disabled');
    }
    // In development, allow requests without auth (with warning)
    logger.warn('ADMIN_API_KEY not set - allowing request in development mode', {
      component: 'admin-auth',
      action: 'dev-bypass',
    });
    return null;
  }

  // Check Authorization header
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    logger.warn('Admin endpoint called without Authorization header', {
      component: 'admin-auth',
      action: 'denied',
    });
    return apiError.unauthorized('Missing Authorization header');
  }

  // Expect "Bearer <token>" format
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    logger.warn('Admin endpoint called with invalid Authorization format', {
      component: 'admin-auth',
      action: 'denied',
    });
    return apiError.unauthorized('Invalid Authorization header format. Expected: Bearer <token>');
  }

  // Validate token using timing-safe comparison
  if (!timingSafeEqual(token, adminApiKey)) {
    logger.warn('Admin endpoint called with invalid API key', {
      component: 'admin-auth',
      action: 'denied',
    });
    return apiError.unauthorized('Invalid API key');
  }

  // Authorized
  logger.info('Admin request authorized', {
    component: 'admin-auth',
    action: 'authorized',
  });

  return null;
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
