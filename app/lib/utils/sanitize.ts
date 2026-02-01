/**
 * Input Sanitization Utilities
 *
 * Protects against XSS and injection attacks
 */

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * Strips HTML tags from a string
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes user input for safe display
 * - Strips HTML tags
 * - Trims whitespace
 * - Limits length
 */
export function sanitizeInput(
  input: string,
  options: { maxLength?: number; allowNewlines?: boolean } = {}
): string {
  const { maxLength = 10000, allowNewlines = true } = options;

  let sanitized = stripHtml(input).trim();

  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  }

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes a query string for RAG/search
 * - Removes potential injection patterns
 * - Normalizes whitespace
 */
export function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ')            // Normalize whitespace
    .substring(0, 1000);             // Limit length
}

/**
 * Validates and sanitizes an email address
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitizes a filename for safe file operations
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
}

/**
 * Validates that a string contains only allowed characters
 */
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
}

/**
 * Validates that a string is a valid UUID
 */
export function isValidUUID(text: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(text);
}
