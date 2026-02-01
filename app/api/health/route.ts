/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Returns service health status for monitoring
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    database: CheckResult;
    environment: CheckResult;
  };
}

interface CheckResult {
  status: 'pass' | 'fail';
  message?: string;
  duration_ms?: number;
}

export const runtime = 'nodejs';

// Disable caching for health checks
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse<HealthStatus>> {
  // Check database connection
  const dbCheck = await checkDatabase();

  // Check environment variables
  const envCheck = checkEnvironment();

  // Determine overall status
  const allPassing = dbCheck.status === 'pass' && envCheck.status === 'pass';
  const anyFailing = dbCheck.status === 'fail' || envCheck.status === 'fail';

  const status: HealthStatus = {
    status: allPassing ? 'healthy' : anyFailing ? 'unhealthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: dbCheck,
      environment: envCheck,
    },
  };

  const httpStatus = status.status === 'healthy' ? 200 : 503;

  return NextResponse.json(status, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

async function checkDatabase(): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: 'pass',
      duration_ms: Date.now() - startTime,
    };
  } catch {
    return {
      status: 'fail',
      message: 'Database connection failed',
      duration_ms: Date.now() - startTime,
    };
  }
}

function checkEnvironment(): CheckResult {
  const requiredVars = [
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX_NAME',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    return {
      status: 'fail',
      message: `Missing environment variables: ${missing.length}`,
    };
  }

  return {
    status: 'pass',
  };
}
