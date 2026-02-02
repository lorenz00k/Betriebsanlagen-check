/**
 * Environment Variable Validation
 *
 * Validates all required environment variables at startup
 * Fails fast if required variables are missing
 */

import { z } from 'zod';
import { logger } from '@/app/lib/utils/logger';

const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().url().optional(),
  POSTGRES_PRISMA_URL: z.string().url().optional(),
  POSTGRES_URL_NON_POOLING: z.string().url().optional(),

  // AI Services
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),

  // Vector Database
  PINECONE_API_KEY: z.string().min(1, 'PINECONE_API_KEY is required'),
  PINECONE_INDEX_NAME: z.string().min(1, 'PINECONE_INDEX_NAME is required'),

  // Cache (optional)
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().optional(),

  // Admin API Key (for protected endpoints like /api/rag/embed)
  ADMIN_API_KEY: z.string().min(32, 'ADMIN_API_KEY must be at least 32 characters').optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Access this instead of process.env directly
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n');

    // In development, log warning but don't crash
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Environment validation warnings: ' + errors, { component: 'env', action: 'validate' });
      // Return partial env with defaults
      return {
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ?? '',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
        PINECONE_API_KEY: process.env.PINECONE_API_KEY ?? '',
        PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME ?? '',
        NODE_ENV: 'development',
      };
    }

    // In production, fail fast
    throw new Error('Invalid environment variables:\n' + errors);
  }

  return parsed.data;
}

// Lazy initialization to avoid issues during build
let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv();
  }
  return _env;
}

// Helper to check if we're in production
export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

// Helper to check if we're in development
export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development';
}

// Helper to check if debug mode is enabled
export function isDebugMode(): boolean {
  return getEnv().DEBUG === 'true';
}
