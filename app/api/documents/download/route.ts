import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/app/lib/prisma';
import { DOCUMENTS } from '@/config/documents';
import { logger } from '@/app/lib/utils/logger';
import { apiError } from '@/app/lib/api/response';

// Zod schema for request validation
const DownloadRequestSchema = z.object({
  documentId: z.string().min(1),
  format: z.enum(['pdf']),
  language: z.string().optional().default('de'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod validation
    const parseResult = DownloadRequestSchema.safeParse(body);
    if (!parseResult.success) {
      logger.warn('Document download validation failed', { component: 'download' });
      return apiError.validation('Invalid request parameters');
    }

    const { documentId, format, language } = parseResult.data;

    // Validierung
    const document = DOCUMENTS.find(d => d.id === documentId);

    if (!document) {
      return apiError.notFound('Document not found');
    }

    // TODO: Document.formats type should match Zod schema formats
    if (!document.formats.includes(format)) {
      return apiError.badRequest('Format not available');
    }

    // Datei-Pfad
    const filePath = path.join(
      process.cwd(),
      'public',
      'documents',
      'original',
      `${documentId}.${format}`
    );

    // Datei lesen
    const fileBuffer = await readFile(filePath);

    // MIME-Type - format is already validated by Zod
    const mimeType = 'application/pdf';

    // IP-Adresse anonymisieren (nur erste 3 Oktetten für DSGVO)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0';

    // Download tracken (für Analytics)
    try {
      await prisma.documentDownload.create({
        data: {
          documentId,
          format,
          language: language || 'de',
          userAgent: request.headers.get('user-agent') || 'unknown',
          ipAddress: anonymizedIp
        }
      });
    } catch (dbError) {
      // Wenn DB-Tracking fehlschlägt, trotzdem Download erlauben
      logger.warn('DB tracking failed, continuing with download', {
        component: 'download',
        documentId
      });
    }

    // Datei zurückgeben (Buffer zu Uint8Array konvertieren für NextResponse)
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${documentId}.${format}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    logger.error('Download failed', error, { component: 'download' });
    return apiError.internal('Download failed');
  }
}

// GET für direkte Links
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const documentId = searchParams.get('id');
  const format = searchParams.get('format') || 'pdf';
  const language = searchParams.get('lang') || 'de';

  if (!documentId) {
    return apiError.badRequest('Document ID required');
  }

  // Redirect zu POST
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ documentId, format, language })
    })
  );
}
