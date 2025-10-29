# Formular-Assistent & Dokument-Download System - Implementierung

## 🎯 Projektziel

Wir bauen einen **mehrsprachigen Formular-Assistenten** für Betriebsanlagengenehmigungen in Wien.

**Kernfunktionen:**
1. Schritt-für-Schritt Formular-Assistent (interaktiv)
2. Automatisches Ausfüllen von offiziellen PDF-Formularen
3. Download-System für Original-Dokumente
4. Alles rechtlich korrekt & DSGVO-konform

---

## 📋 PHASE 1: PRISMA SETUP (Datenbank-Zugriff)

### Status: Datenbank ist erstellt & verbunden ✅

### Schritt 1.1: Prisma installieren

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### Schritt 1.2: Prisma initialisieren

```bash
npx prisma init
```

Das erstellt:
- `/prisma` Ordner
- `/prisma/schema.prisma` Datei

### Schritt 1.3: Prisma Schema konfigurieren

**Datei:** `prisma/schema.prisma`

**Ersetze den kompletten Inhalt mit:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

// ============================================
// MODELS - Datenbank-Tabellen
// ============================================

// Formular-Session: Eine "Sitzung" wenn jemand ein Formular ausfüllt
model FormSession {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  formType     String   // 'ansuchen', 'betriebsbeschreibung', 'komplett'
  language     String   @default("de")
  status       String   @default("in_progress") // 'in_progress', 'completed', 'downloaded'
  currentStep  Int      @default(1)
  totalSteps   Int
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  expiresAt    DateTime // Session läuft nach 30 Tagen ab

  // Relationen
  formData  FormData[]
  documents GeneratedDocument[]

  @@index([sessionToken])
  @@index([status])
  @@index([createdAt])
}

// Formular-Daten: Die einzelnen Felder die ausgefüllt werden
model FormData {
  id         String   @id @default(uuid())
  sessionId  String
  fieldName  String   // z.B. 'antragsteller.name'
  fieldValue String   @db.Text // JSON oder Plain Text
  section    String?  // z.B. 'general_info', 'machinery'
  stepNumber Int?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relation zu Session
  session FormSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@unique([sessionId, fieldName])
  @@index([sessionId])
}

// Generierte Dokumente: Die fertigen PDFs
model GeneratedDocument {
  id            String   @id @default(uuid())
  sessionId     String
  documentType  String   // 'ansuchen_pdf', 'betriebsbeschreibung_pdf', 'complete_zip'
  fileUrl       String   // URL zum Download
  fileSize      Int?
  mimeType      String?
  generatedAt   DateTime @default(now())
  downloadCount Int      @default(0)
  expiresAt     DateTime // Link läuft nach 7 Tagen ab

  // Relation zu Session
  session FormSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([documentType])
}

// Download-Tracking: Statistik welche Dokumente wie oft heruntergeladen werden
model DocumentDownload {
  id           String   @id @default(uuid())
  documentId   String   // z.B. 'ansuchen', 'betriebsbeschreibung'
  format       String   // 'pdf' oder 'docx'
  language     String   // z.B. 'de', 'en', 'tr'
  userAgent    String?
  ipAddress    String?  // Anonymisiert (nur erste 3 Oktetten)
  downloadedAt DateTime @default(now())

  @@index([documentId])
  @@index([downloadedAt])
}
```

**Was bedeuten die Models?**

- **FormSession**: Jeder Nutzer der ein Formular startet bekommt eine Session
- **FormData**: Jedes Feld das ausgefüllt wird, wird hier gespeichert (Auto-Save!)
- **GeneratedDocument**: Die fertigen PDFs die generiert werden
- **DocumentDownload**: Tracking für Analytics (welche Docs werden oft geladen?)

### Schritt 1.4: Prisma Client generieren

```bash
npx prisma generate
```

Das erstellt den TypeScript Client für die Datenbank.

### Schritt 1.5: Datenbank-Tabellen erstellen

```bash
npx prisma db push
```

**Erwartete Ausgabe:**
```
✔ Your database is now in sync with your Prisma schema.
```

✅ **Datenbank ist fertig!**

### Schritt 1.6: Prisma Client für den Code einrichten

**Erstelle Datei:** `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Warum dieser Code?**

In der Entwicklung lädt Next.js oft neu. Dieser Code stellt sicher, dass wir nur **eine** Datenbankverbindung haben und nicht bei jedem Reload eine neue aufmachen (das würde zu "Too many connections" Fehlern führen).

---

## 📋 PHASE 2: DOKUMENT-STRUKTUR & RECHTLICHE GRUNDLAGEN

### 2.1 Rechtliche Situation - Was dürfen wir?

**✅ ERLAUBT (ohne Rechtsberatung):**

1. **Original-Formulare zum Download anbieten**
   - Die sind öffentlich und von der Behörde bereitgestellt
   - Wir dürfen sie hosten und verteilen

2. **Ausfüllhilfen erstellen**
   - "Dieses Feld bedeutet..."
   - "Hier tragen Sie ein..."
   - In mehreren Sprachen erklären

3. **Formulare programmgesteuert ausfüllen**
   - Mit Nutzerdaten die PDF-Felder befüllen
   - Das fertige PDF zum Download anbieten

4. **Checklisten & Prozess-Übersichten**
   - "Sie brauchen folgende Dokumente"
   - "Der Prozess läuft so ab"

**❌ NICHT ERLAUBT:**

1. **Rechtsberatung**
   - "Sie sollten X machen"
   - "Das wird genehmigt"
   - Individuelle Rechtsauskunft

2. **Garantien geben**
   - "Das funktioniert zu 100%"
   - "Die Behörde akzeptiert das sicher"

3. **Eigene Formulare als "offiziell" ausgeben**
   - Wir dürfen nur die Originale nutzen
   - Oder klar markieren: "Inoffizielle Vorlage"

### 2.2 Disclaimer-Texte (WICHTIG!)

**An allen relevanten Stellen:**

```typescript
// Deutsch
const DISCLAIMER_DE = `
Diese Plattform bietet ausschließlich Informationen und technische 
Unterstützung beim Ausfüllen von Formularen. Wir bieten keine Rechtsberatung an.

Die generierten Dokumente basieren auf Ihren Eingaben. Die Überprüfung auf 
Vollständigkeit und Richtigkeit liegt in Ihrer Verantwortung.

Für rechtliche Fragen wenden Sie sich bitte an einen Rechtsanwalt oder einen 
auf Gewerberecht spezialisierten Berater.
`;

// Englisch
const DISCLAIMER_EN = `
This platform provides information and technical assistance with form completion only. 
We do not provide legal advice.

Generated documents are based on your input. You are responsible for verifying 
completeness and accuracy.

For legal questions, please consult a lawyer or business law specialist.
`;

// Türkisch
const DISCLAIMER_TR = `
Bu platform yalnızca bilgi ve form doldurma konusunda teknik destek sağlar. 
Hukuki danışmanlık sunmuyoruz.

Oluşturulan belgeler sizin girişlerinize dayanır. Eksiksizlik ve doğruluğu 
kontrol etmek sizin sorumluluğunuzdadır.

Hukuki sorular için lütfen bir avukata veya ticaret hukuku uzmanına danışın.
`;
```

### 2.3 Dokument-Ordnerstruktur

**Erstelle diese Struktur:**

```
public/
├── documents/
│   ├── original/              # Original PDFs von der Behörde
│   │   ├── ansuchen.pdf
│   │   ├── betriebsbeschreibung.pdf
│   │   └── ausfuellhilfe.pdf
│   │
│   ├── templates/             # Für PDF-Manipulation
│   │   ├── ansuchen-template.pdf
│   │   └── betriebsbeschreibung-template.pdf
│   │
│   └── thumbnails/            # Preview-Bilder
│       ├── ansuchen.png
│       ├── betriebsbeschreibung.png
│       └── ausfuellhilfe.png
```

**Wie bekommst du die Thumbnails?**

Option 1: Screenshot vom ersten Seite des PDFs
Option 2: Später mit einem Tool automatisch generieren

---

## 📋 PHASE 3: DOKUMENT-DOWNLOAD-SYSTEM

### 3.1 Dokument-Konfiguration

**Erstelle Datei:** `config/documents.ts`

```typescript
export interface Document {
  id: string;
  category: 'required' | 'optional' | 'guide';
  translations: {
    [key: string]: {
      title: string;
      description: string;
      help?: string;
    };
  };
  pages: number;
  formats: ('pdf' | 'docx')[];
  fileSize: {
    pdf?: number;  // in KB
    docx?: number;
  };
  officialSource?: string; // URL zur Behörde
  lastUpdated: string;     // Datum der letzten Aktualisierung
}

export const DOCUMENTS: Document[] = [
  {
    id: 'ansuchen',
    category: 'required',
    translations: {
      de: {
        title: 'Ansuchen um Betriebsanlagengenehmigung',
        description: 'Das Haupt-Antragsformular für Ihre Gewerbegenehmigung',
        help: 'Dieses Formular ist verpflichtend für jeden Antrag'
      },
      en: {
        title: 'Application for Business Permit',
        description: 'The main application form for your business permit',
        help: 'This form is mandatory for every application'
      },
      tr: {
        title: 'İşletme Ruhsatı Başvurusu',
        description: 'İşletme ruhsatınız için ana başvuru formu',
        help: 'Bu form her başvuru için zorunludur'
      }
    },
    pages: 1,
    formats: ['pdf', 'docx'],
    fileSize: {
      pdf: 156,
      docx: 89
    },
    officialSource: 'https://www.wien.gv.at/...',
    lastUpdated: '2024-03-01'
  },
  {
    id: 'betriebsbeschreibung',
    category: 'required',
    translations: {
      de: {
        title: 'Betriebsbeschreibung',
        description: 'Detaillierte Beschreibung Ihrer Betriebsanlage (4-fach erforderlich)',
        help: 'Enthält technische Details zu Ihrem Betrieb'
      },
      en: {
        title: 'Business Description',
        description: 'Detailed description of your business facility (4 copies required)',
        help: 'Contains technical details about your business'
      },
      tr: {
        title: 'İşletme Açıklaması',
        description: 'İşletme tesislerinizin detaylı açıklaması (4 kopya gerekli)',
        help: 'İşletmeniz hakkında teknik ayrıntılar içerir'
      }
    },
    pages: 14,
    formats: ['pdf', 'docx'],
    fileSize: {
      pdf: 423,
      docx: 287
    },
    officialSource: 'https://www.wien.gv.at/...',
    lastUpdated: '2024-03-01'
  },
  {
    id: 'ausfuellhilfe',
    category: 'guide',
    translations: {
      de: {
        title: 'Ausfüllhilfe und Hinweise',
        description: 'Offizielle Anleitung zum Ausfüllen der Formulare',
        help: 'Hilft Ihnen beim korrekten Ausfüllen'
      },
      en: {
        title: 'Completion Guide and Notes',
        description: 'Official guide for completing the forms',
        help: 'Helps you fill out the forms correctly'
      },
      tr: {
        title: 'Doldurma Kılavuzu ve Notlar',
        description: 'Formları doldurmak için resmi kılavuz',
        help: 'Formları doğru doldurmanıza yardımcı olur'
      }
    },
    pages: 10,
    formats: ['pdf'],
    fileSize: {
      pdf: 289
    },
    officialSource: 'https://www.wien.gv.at/...',
    lastUpdated: '2024-03-01'
  }
];
```

### 3.2 Download-API Route

**Erstelle Datei:** `app/api/documents/download/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { DOCUMENTS } from '@/config/documents';

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
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    // IP-Adresse anonymisieren (nur erste 3 Oktetten für DSGVO)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0';

    // Download tracken (für Analytics)
    await prisma.documentDownload.create({
      data: {
        documentId,
        format,
        language,
        userAgent: request.headers.get('user-agent') || 'unknown',
        ipAddress: anonymizedIp
      }
    });

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
      body: JSON.stringify({ documentId, format, language: 'de' })
    })
  );
}
```

### 3.3 React Component: Dokument-Karte

**Erstelle Datei:** `components/Documents/DocumentCard.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import type { Document } from '@/config/documents';

interface DocumentCardProps {
  document: Document;
  language: string;
}

export default function DocumentCard({ document, language }: DocumentCardProps) {
  const { t } = useTranslation('documents');
  const [isDownloading, setIsDownloading] = useState(false);

  const translation = document.translations[language] || document.translations.de;

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsDownloading(true);

    try {
      const response = await fetch('/api/documents/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          format,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'document_download', {
          document_id: document.id,
          format: format,
          language: language
        });
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(t('download_failed'));
    } finally {
      setIsDownloading(false);
    }
  };

  // Badge-Farbe nach Kategorie
  const badgeColor = {
    required: 'bg-red-100 text-red-800',
    optional: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800'
  }[document.category];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
        <img
          src={`/documents/thumbnails/${document.id}.png`}
          alt={translation.title}
          className="w-full h-full object-contain p-4"
          onError={(e) => {
            // Fallback wenn Thumbnail fehlt
            e.currentTarget.src = '/documents/thumbnails/default.png';
          }}
        />
        
        {/* Kategorie Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
          {t(`category.${document.category}`)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-gray-900">
          {translation.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {translation.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {document.pages} {t('pages')}
          </span>
          
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {document.fileSize.pdf} KB
          </span>
        </div>

        {/* Download Buttons */}
        <div className="space-y-2">
          {document.formats.map(format => (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('downloading')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t('download')} {format.toUpperCase()}
                </>
              )}
            </button>
          ))}
        </div>

        {/* Help Text */}
        {translation.help && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 {translation.help}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.4 Dokumente-Seite

**Erstelle Datei:** `app/[locale]/dokumente/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import DocumentCard from '@/components/Documents/DocumentCard';
import { DOCUMENTS } from '@/config/documents';

export default function DocumentsPage({ params }: { params: { locale: string } }) {
  const { t } = useTranslation('documents');
  const [filter, setFilter] = useState<'all' | 'required' | 'optional' | 'guide'>('all');

  const filteredDocuments = filter === 'all'
    ? DOCUMENTS
    : DOCUMENTS.filter(doc => doc.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('page_title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('page_description')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">
                {t('disclaimer.title')}
              </h3>
              <p className="text-sm text-yellow-800">
                {t('disclaimer.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.all')} ({DOCUMENTS.length})
            </button>
            <button
              onClick={() => setFilter('required')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'required'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.required')} ({DOCUMENTS.filter(d => d.category === 'required').length})
            </button>
            <button
              onClick={() => setFilter('guide')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                filter === 'guide'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.guides')} ({DOCUMENTS.filter(d => d.category === 'guide').length})
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              language={params.locale}
            />
          ))}
        </div>

        {/* Info Box */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">
            {t('need_help.title')}
          </h3>
          <p className="text-sm text-blue-800 mb-4">
            {t('need_help.text')}
          </p>
          <a
            href={`/${params.locale}/assistent`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('start_assistant')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 PHASE 4: ÜBERSETZUNGEN (i18n)

### 4.1 Übersetzungsdateien erstellen

**Erstelle:** `public/locales/de/documents.json`

```json
{
  "page_title": "Dokumente & Formulare",
  "page_description": "Alle erforderlichen Dokumente für Ihre Betriebsanlagengenehmigung zum Download",
  "disclaimer": {
    "title": "⚖️ Wichtiger Hinweis",
    "text": "Diese Plattform bietet ausschließlich Informationen und technische Unterstützung beim Ausfüllen von Formularen. Wir bieten keine Rechtsberatung an. Für rechtliche Fragen wenden Sie sich bitte an einen Fachanwalt."
  },
  "filter": {
    "all": "Alle Dokumente",
    "required": "Pflichtdokumente",
    "guides": "Anleitungen"
  },
  "category": {
    "required": "Pflicht",
    "optional": "Optional",
    "guide": "Anleitung"
  },
  "pages": "Seiten",
  "download": "Herunterladen",
  "downloading": "Lädt...",
  "download_failed": "Download fehlgeschlagen. Bitte versuchen Sie es erneut.",
  "need_help": {
    "title": "Hilfe beim Ausfüllen?",
    "text": "Nutzen Sie unseren interaktiven Assistenten, der Sie Schritt für Schritt durch die Formulare führt und automatisch ein ausgefülltes PDF erstellt."
  },
  "start_assistant": "Assistenten starten"
}
```

**Erstelle:** `public/locales/en/documents.json`

```json
{
  "page_title": "Documents & Forms",
  "page_description": "All required documents for your business permit application available for download",
  "disclaimer": {
    "title": "⚖️ Important Notice",
    "text": "This platform provides information and technical assistance with form completion only. We do not provide legal advice. For legal questions, please consult a specialized lawyer."
  },
  "filter": {
    "all": "All Documents",
    "required": "Required Documents",
    "guides": "Guides"
  },
  "category": {
    "required": "Required",
    "optional": "Optional",
    "guide": "Guide"
  },
  "pages": "Pages",
  "download": "Download",
  "downloading": "Loading...",
  "download_failed": "Download failed. Please try again.",
  "need_help": {
    "title": "Need help filling out forms?",
    "text": "Use our interactive assistant that guides you step-by-step through the forms and automatically creates a completed PDF."
  },
  "start_assistant": "Start Assistant"
}
```

**Erstelle:** `public/locales/tr/documents.json`

```json
{
  "page_title": "Belgeler ve Formlar",
  "page_description": "İşletme ruhsat başvurunuz için gerekli tüm belgeler indirilebilir",
  "disclaimer": {
    "title": "⚖️ Önemli Bilgi",
    "text": "Bu platform yalnızca bilgi ve form doldurma konusunda teknik destek sağlar. Hukuki danışmanlık sunmuyoruz. Hukuki sorular için lütfen uzman bir avukata danışın."
  },
  "filter": {
    "all": "Tüm Belgeler",
    "required": "Zorunlu Belgeler",
    "guides": "Kılavuzlar"
  },
  "category": {
    "required": "Zorunlu",
    "optional": "İsteğe Bağlı",
    "guide": "Kılavuz"
  },
  "pages": "Sayfa",
  "download": "İndir",
  "downloading": "Yükleniyor...",
  "download_failed": "İndirme başarısız. Lütfen tekrar deneyin.",
  "need_help": {
    "title": "Form doldurma konusunda yardıma mı ihtiyacınız var?",
    "text": "Sizi adım adım formlar boyunca yönlendiren ve otomatik olarak doldurulmuş bir PDF oluşturan etkileşimli asistanımızı kullanın."
  },
  "start_assistant": "Asistanı Başlat"
}
```

---

## 📋 PHASE 5: TESTEN

### 5.1 Test-API Route erstellen

**Erstelle:** `app/api/test-db/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test: Session erstellen
    const testSession = await prisma.formSession.create({
      data: {
        sessionToken: `test-${Date.now()}`,
        formType: 'test',
        language: 'de',
        totalSteps: 5,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 Tage
      }
    });

    // Test: FormData hinzufügen
    await prisma.formData.create({
      data: {
        sessionId: testSession.id,
        fieldName: 'test.field',
        fieldValue: 'Test Value',
        stepNumber: 1
      }
    });

    // Alle Sessions auslesen
    const allSessions = await prisma.formSession.findMany({
      include: {
        formData: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      testSession,
      allSessions,
      count: allSessions.length
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

### 5.2 Test durchführen

**Im Browser öffnen:**
```
http://localhost:3000/api/test-db
```

**Erwartetes Ergebnis:**
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "testSession": { ... },
  "allSessions": [ ... ],
  "count": 1
}
```

---

## 📋 PHASE 6: DEPLOYMENT VORBEREITUNG

### 6.1 Environment Variables prüfen

**Checke `.env.local`:**

```bash
# Sollte enthalten:
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."

# Optional:
NODE_ENV="development"
```

### 6.2 Git ignorieren

**Prüfe `.gitignore`:**

```
# Sollte enthalten:
.env.local
.env*.local
node_modules/
.next/
prisma/migrations/
```

### 6.3 Build testen

```bash
npm run build
```

Sollte ohne Fehler durchlaufen.

---

## 🎯 ZUSAMMENFASSUNG - Was wir gebaut haben

✅ **Datenbank-Struktur** (4 Tabellen)
✅ **Prisma ORM** eingerichtet
✅ **Dokument-Download-System** mit Tracking
✅ **React Components** für Dokumente
✅ **Mehrsprachigkeit** (DE, EN, TR)
✅ **Rechtlich korrekte Disclaimers**
✅ **DSGVO-konforme IP-Anonymisierung**
✅ **Test-Route** zum Verifizieren

---

## 🚀 NÄCHSTE SCHRITTE

### Option A: Formular-Assistent bauen
Schritt-für-Schritt Wizard für Formulare

### Option B: PDF-Generation
Automatisches Ausfüllen der PDFs

### Option C: Dashboard
Admin-Bereich für Statistiken

**Was möchtest du als nächstes angehen?**

---

## 📝 WICHTIGE NOTIZEN

### Rechtliche Absicherung
- Disclaimer auf jeder Seite
- Keine Rechtsberatung anbieten
- Original-Formulare verwenden
- Quellen-Links zur Behörde

### DSGVO
- IP-Adressen anonymisieren
- Session-Daten nach 30 Tagen löschen
- Downloads nach 7 Tagen löschen
- Cookie-Banner wenn nötig

### Performance
- PDF-Downloads cachen
- Thumbnails optimieren
- Lazy Loading für Dokumente
- CDN für statische Files

---

## 🆘 TROUBLESHOOTING

### "Module not found: @prisma/client"
```bash
npx prisma generate
```

### "Can't reach database server"
Prüfe `.env.local` und `POSTGRES_PRISMA_URL`

### "Too many clients already"
Verwende `lib/prisma.ts` statt direkten PrismaClient

### TypeScript Fehler nach Prisma-Änderungen
```bash
npx prisma generate
npm run dev (neu starten)
```

---

**Ende der Dokumentation - Viel Erfolg! 🚀**
