/**
 * Audit Logging System
 *
 * Logs security-relevant events for compliance and debugging
 * In production, these should be sent to a log aggregation service
 */

import { logger } from './logger';

// Audit event types
export type AuditEventType =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.failed'
  | 'api.request'
  | 'api.error'
  | 'api.rate_limited'
  | 'document.download'
  | 'document.generate'
  | 'data.access'
  | 'data.modify'
  | 'admin.action'
  | 'security.violation';

export interface AuditEvent {
  type: AuditEventType;
  timestamp: string;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  status: 'success' | 'failure' | 'blocked';
  details?: Record<string, unknown>;
}

// In-memory buffer for batch processing
// TODO: Replace with proper log aggregation (e.g., Vercel Log Drain, Datadog)
const auditBuffer: AuditEvent[] = [];
const MAX_BUFFER_SIZE = 100;

/**
 * Log an audit event
 */
export function audit(event: Omit<AuditEvent, 'timestamp'>): void {
  const fullEvent: AuditEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Add to buffer
  auditBuffer.push(fullEvent);

  // Flush if buffer is full
  if (auditBuffer.length >= MAX_BUFFER_SIZE) {
    flushAuditBuffer();
  }

  // Also log to standard logger for immediate visibility
  const logLevel = event.status === 'failure' || event.status === 'blocked' ? 'warn' : 'info';

  if (logLevel === 'warn') {
    logger.warn(`[AUDIT] ${event.type}`, {
      component: 'audit',
      action: event.action,
      status: event.status,
      resource: event.resource,
    });
  } else {
    logger.info(`[AUDIT] ${event.type}`, {
      component: 'audit',
      action: event.action,
      status: event.status,
      resource: event.resource,
    });
  }
}

/**
 * Flush audit buffer to persistent storage
 * TODO: Implement actual persistence (database, log service)
 */
function flushAuditBuffer(): void {
  if (auditBuffer.length === 0) return;

  // In development, just log the count
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Flushing ${auditBuffer.length} audit events`, {
      component: 'audit',
      action: 'flush',
    });
  }

  // Clear buffer
  auditBuffer.length = 0;

  // TODO: Send to log aggregation service
  // await sendToLogService(events);
}

/**
 * Convenience functions for common audit events
 */
export const auditLog = {
  apiRequest: (
    requestId: string,
    endpoint: string,
    method: string,
    ip?: string
  ) => {
    audit({
      type: 'api.request',
      requestId,
      ip,
      resource: endpoint,
      action: method,
      status: 'success',
    });
  },

  apiError: (
    requestId: string,
    endpoint: string,
    error: string,
    ip?: string
  ) => {
    audit({
      type: 'api.error',
      requestId,
      ip,
      resource: endpoint,
      status: 'failure',
      details: { error },
    });
  },

  rateLimited: (ip: string, endpoint: string) => {
    audit({
      type: 'api.rate_limited',
      ip,
      resource: endpoint,
      status: 'blocked',
    });
  },

  documentDownload: (
    documentId: string,
    format: string,
    ip?: string
  ) => {
    audit({
      type: 'document.download',
      ip,
      resource: documentId,
      action: format,
      status: 'success',
    });
  },

  securityViolation: (
    type: string,
    details: Record<string, unknown>,
    ip?: string
  ) => {
    audit({
      type: 'security.violation',
      ip,
      action: type,
      status: 'blocked',
      details,
    });
  },
};

// Flush buffer on process exit
if (typeof process !== 'undefined') {
  process.on('beforeExit', flushAuditBuffer);
}
