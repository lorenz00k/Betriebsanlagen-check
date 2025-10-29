import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/app/lib/prisma';
import { DOCUMENTS } from '@/app/config/documents';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, format, language } = body;

    // Validierung
    const document = DOCUMENTS.find(d => d.id === documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (!document.formats.includes(format as any)) {
      return NextResponse.json(
        { error: 'Format not available' },
        { status: 400 }
      );
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

    // MIME-Type bestimmen
    const mimeTypes = {
      pdf: 'application/pdf',
    };

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
      console.warn('DB tracking failed, continuing with download:', dbError);
    }

    // Datei zurückgeben
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeTypes[format as keyof typeof mimeTypes],
        'Content-Disposition': `attachment; filename="${documentId}.${format}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Download failed:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}

// GET für direkte Links
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const documentId = searchParams.get('id');
  const format = searchParams.get('format') || 'pdf';
  const language = searchParams.get('lang') || 'de';

  if (!documentId) {
    return NextResponse.json(
      { error: 'Document ID required' },
      { status: 400 }
    );
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
