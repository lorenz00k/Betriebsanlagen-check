/**
 * Logger Utility
 *
 * Centralized logging that respects environment.
 * - In production: Only errors are logged (no user data)
 * - In development: Full logging with DEBUG flag
 *
 * NEVER log user data, API keys, or sensitive information.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  duration?: number;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.DEBUG === 'true';

/**
 * Sanitizes context to remove sensitive data
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;

  const sensitiveKeys = [
    'password', 'token', 'key', 'secret', 'authorization',
    'cookie', 'session', 'email', 'phone', 'address',
    'userContext', 'query', 'input', 'content', 'text'
  ];

  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = value.substring(0, 100) + '...[truncated]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Formats log message
 */
function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (context) {
    const safeContext = sanitizeContext(context);
    return `${prefix} ${message} ${JSON.stringify(safeContext)}`;
  }

  return `${prefix} ${message}`;
}

/**
 * Logger instance
 */
export const logger = {
  /**
   * Debug logs - Only in development with DEBUG=true
   */
  debug(message: string, context?: LogContext): void {
    if (isDev && isDebug) {
      console.log(formatMessage('debug', message, context));
    }
  },

  /**
   * Info logs - Only in development
   */
  info(message: string, context?: LogContext): void {
    if (isDev) {
      console.log(formatMessage('info', message, context));
    }
  },

  /**
   * Warning logs - Always logged
   */
  warn(message: string, context?: LogContext): void {
    console.warn(formatMessage('warn', message, context));
  },

  /**
   * Error logs - Always logged (sanitized)
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const fullContext = {
      ...context,
      errorMessage,
      // Never log stack traces in production
      ...(isDev && error instanceof Error ? { stack: error.stack } : {})
    };
    console.error(formatMessage('error', message, fullContext));
  },

  /**
   * Performance timing - Only in development
   */
  time(label: string): () => void {
    if (!isDev) return () => {};

    const start = performance.now();
    return () => {
      const duration = Math.round(performance.now() - start);
      this.debug(`${label} completed`, { duration });
    };
  }
};

export default logger;
