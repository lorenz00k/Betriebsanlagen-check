/**
 * Sentry Error Monitoring Configuration
 *
 * Setup instructions:
 * 1. Install Sentry: npm install @sentry/nextjs
 * 2. Add SENTRY_DSN to environment variables
 * 3. Uncomment the initialization code below
 * 4. Run: npx @sentry/wizard@latest -i nextjs
 *
 * This file provides a wrapper for error reporting that works
 * with or without Sentry being configured.
 */

// TODO: Uncomment when Sentry is installed
// import * as Sentry from '@sentry/nextjs';

import { logger } from '@/app/lib/utils/logger';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  extra?: Record<string, unknown>;
}

/**
 * Initialize Sentry (call once at app startup)
 */
export function initSentry(): void {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    logger.info('Sentry DSN not configured, error reporting disabled', {
      component: 'sentry',
      action: 'init',
    });
    return;
  }

  // TODO: Uncomment when Sentry is installed
  /*
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Sanitize sensitive data before sending
      if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
      }
      return event;
    },
  });
  */
}

/**
 * Capture an error and send to Sentry
 */
export function captureError(error: Error, context?: ErrorContext): void {
  const dsn = process.env.SENTRY_DSN;

  // Always log errors
  logger.error('Captured error', error, {
    component: context?.component || 'sentry',
    action: context?.action || 'captureError',
  });

  if (!dsn) {
    return;
  }

  // TODO: Uncomment when Sentry is installed
  /*
  Sentry.withScope((scope) => {
    if (context?.component) {
      scope.setTag('component', context.component);
    }
    if (context?.action) {
      scope.setTag('action', context.action);
    }
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context?.requestId) {
      scope.setTag('request_id', context.requestId);
    }
    if (context?.extra) {
      scope.setExtras(context.extra);
    }
    Sentry.captureException(error);
  });
  */
}

/**
 * Capture a message/warning
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): void {
  const dsn = process.env.SENTRY_DSN;

  // Log message using logger
  if (level === 'error') {
    logger.error(message, null, {
      component: context?.component || 'sentry',
      action: context?.action || 'captureMessage',
    });
  } else if (level === 'warning') {
    logger.warn(message, {
      component: context?.component || 'sentry',
      action: context?.action || 'captureMessage',
    });
  } else {
    logger.info(message, {
      component: context?.component || 'sentry',
      action: context?.action || 'captureMessage',
    });
  }

  if (!dsn) {
    return;
  }

  // TODO: Uncomment when Sentry is installed
  /*
  Sentry.withScope((scope) => {
    if (context?.component) {
      scope.setTag('component', context.component);
    }
    if (context?.requestId) {
      scope.setTag('request_id', context.requestId);
    }
    Sentry.captureMessage(message, level);
  });
  */
}

/**
 * Set user context for error tracking
 */
export function setUser(_userId: string, _email?: string): void {
  // TODO: Uncomment when Sentry is installed
  /*
  Sentry.setUser({
    id: _userId,
    email: _email,
  });
  */
}

/**
 * Clear user context (on logout)
 */
export function clearUser(): void {
  // TODO: Uncomment when Sentry is installed
  // Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  _message: string,
  _category: string,
  _data?: Record<string, unknown>
): void {
  // TODO: Uncomment when Sentry is installed
  /*
  Sentry.addBreadcrumb({
    message: _message,
    category: _category,
    data: _data,
    level: 'info',
  });
  */
}
