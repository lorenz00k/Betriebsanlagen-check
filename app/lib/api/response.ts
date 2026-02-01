/**
 * Standardized API Response Helpers
 *
 * Ensures consistent response format across all API endpoints
 */

import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}

// Exported for use in API route type annotations
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Standard error codes
 */
export const ErrorCode = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

/**
 * HTTP status codes for each error type
 */
const errorStatusMap: Record<ErrorCodeType, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Create a success response
 */
export function success<T>(data: T, status = 200): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function error(
  code: ErrorCodeType,
  message: string,
  headers?: Record<string, string>
): NextResponse<ErrorResponse> {
  const status = errorStatusMap[code];

  return NextResponse.json(
    {
      success: false as const,
      error: {
        code,
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status, headers }
  );
}

/**
 * Shorthand error responses
 */
export const apiError = {
  badRequest: (message = 'Bad request') =>
    error(ErrorCode.BAD_REQUEST, message),

  unauthorized: (message = 'Unauthorized') =>
    error(ErrorCode.UNAUTHORIZED, message),

  forbidden: (message = 'Forbidden') =>
    error(ErrorCode.FORBIDDEN, message),

  notFound: (message = 'Resource not found') =>
    error(ErrorCode.NOT_FOUND, message),

  rateLimited: (retryAfter: number, message = 'Too many requests') =>
    error(ErrorCode.RATE_LIMITED, message, {
      'Retry-After': String(retryAfter),
    }),

  validation: (message: string) =>
    error(ErrorCode.VALIDATION_ERROR, message),

  internal: (message = 'Internal server error') =>
    error(ErrorCode.INTERNAL_ERROR, message),

  serviceUnavailable: (message = 'Service temporarily unavailable') =>
    error(ErrorCode.SERVICE_UNAVAILABLE, message),
};
