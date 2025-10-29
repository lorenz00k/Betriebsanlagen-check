# 📄 Document Download System - Setup Guide

Dokumenten-Download-System für Betriebsanlagen-Formulare mit Tracking und DSGVO-Konformität.

---

## ✅ Was wurde implementiert?

### 1. **PDF-Dokumente** (3 Formulare)
- ✅ Ansuchen um Betriebsanlagengenehmigung
- ✅ Betriebsbeschreibung (14 Seiten)
- ✅ Ausfüllhilfe und Hinweise

**Speicherort:** `/public/documents/original/`

### 2. **Prisma Database Schema**
4 Tabellen für:
- `FormSession` - Formular-Sitzungen
- `FormData` - Ausgefüllte Felder (für späteren Formular-Assistenten)
- `GeneratedDocument` - Generierte PDFs
- `DocumentDownload` - Download-Tracking (Analytics)

**Datei:** `prisma/schema.prisma`

### 3. **Download-API**
- DSGVO-konform mit IP-Anonymisierung
- Download-Tracking in Datenbank
- PDF-Streaming mit Caching
- Fehlerbehandlung

**Route:** `/api/documents/download`

### 4. **UI Components**
- `DocumentCard` - Responsive Dokument-Karten
- Filter nach Kategorie (Pflicht/Anleitung)
- Download-Button mit Loading-State
- Mehrsprachig (8 Sprachen unterstützt)

**Component:** `app/components/Documents/DocumentCard.tsx`

### 5. **Dokumente-Seite**
Vollständige Seite mit:
- Header und Beschreibung
- Rechtlicher Disclaimer
- Filter-Tabs
- Dokument-Grid
- CTA zum Checker

**Route:** `/[locale]/dokumente`

### 6. **Integration in Checker**
- Download-Sektion am Ende der Result-Seite
- Direkter Link zu Dokumenten
- Call-to-Action mit Icon

**Datei:** `app/[locale]/check/result/ResultPageClient.tsx`

### 7. **Konfiguration**
- Zentrale Dokument-Config mit allen Metadaten
- Übersetzungen für 8 Sprachen
- Dateigröße, Seitenzahl, Links zu Behörden

**Datei:** `app/config/documents.ts`

---

## 🚀 Setup & Deployment

### Schritt 1: Environment Variables setzen

**Option A: Lokal mit Vercel CLI**
```bash
vercel env pull .env.development.local
```

**Option B: Manuell**
Erstelle `.env.local` mit:
```env
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://betriebsanlage-check.at"
```

### Schritt 2: Prisma Client generieren
```bash
npx prisma generate
```

### Schritt 3: Datenbank-Tabellen erstellen
```bash
npx prisma db push
```

**Erwartete Ausgabe:**
```
✔ Your database is now in sync with your Prisma schema.
```

### Schritt 4: Build testen
```bash
npm run build
```

### Schritt 5: Development starten
```bash
npm run dev
```

**Testen:**
- Dokumente-Seite: http://localhost:3000/de/dokumente
- Download-API: http://localhost:3000/api/documents/download?id=ansuchen&format=pdf

---

## 📂 Projekt-Struktur

```
├── app/
│   ├── api/
│   │   └── documents/
│   │       └── download/
│   │           └── route.ts          # Download-API
│   ├── components/
│   │   └── Documents/
│   │       └── DocumentCard.tsx      # Dokument-Karte Component
│   ├── config/
│   │   └── documents.ts              # Dokument-Konfiguration
│   ├── lib/
│   │   └── prisma.ts                 # Prisma Client Setup
│   └── [locale]/
│       ├── dokumente/
│       │   └── page.tsx              # Dokumente-Seite
│       └── check/
│           └── result/
│               └── ResultPageClient.tsx  # + Download-Sektion
│
├── prisma/
│   └── schema.prisma                 # Datenbank-Schema
│
├── public/
│   └── documents/
│       ├── original/                 # Original-PDFs
│       │   ├── ansuchen.pdf
│       │   ├── betriebsbeschreibung.pdf
│       │   └── ausfuellhilfe.pdf
│       └── thumbnails/               # Preview-Bilder (optional)
│
└── messages/                         # Übersetzungen
    ├── de.json                       # + documents Sektion
    └── en.json                       # + documents Sektion
```

---

## 🔒 Rechtliche Absicherung

### Disclaimer
Auf allen relevanten Seiten:
> "Diese Plattform bietet ausschließlich Informationen und technische Unterstützung beim Ausfüllen von Formularen. Wir bieten keine Rechtsberatung an. Die Überprüfung auf Vollständigkeit und Richtigkeit liegt in Ihrer Verantwortung."

### DSGVO-Konformität
- ✅ IP-Adressen werden anonymisiert (nur erste 3 Oktetten)
- ✅ Kein Tracking ohne Zustimmung
- ✅ Sessions laufen nach 30 Tagen ab
- ✅ Download-Links laufen nach 7 Tagen ab

### Was ist erlaubt?
✅ Original-Formulare zum Download anbieten
✅ Ausfüllhilfen erstellen
✅ Mehrsprachige Erklärungen
✅ Technische Unterstützung

### Was ist NICHT erlaubt?
❌ Rechtsberatung anbieten
❌ Garantien geben
❌ Individuelle Rechtsauskunft

---

## 📊 Features im Detail

### Download-Tracking (Analytics)

**Was wird getrackt?**
- Welches Dokument wurde heruntergeladen
- Format (PDF)
- Sprache
- Zeitstempel
- Anonymisierte IP (DSGVO-konform)
- User-Agent (Browser)

**Zugriff auf Statistiken:**
```typescript
import { prisma } from '@/app/lib/prisma';

// Alle Downloads der letzten 30 Tage
const downloads = await prisma.documentDownload.findMany({
  where: {
    downloadedAt: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  },
  orderBy: { downloadedAt: 'desc' }
});

// Meistgeladene Dokumente
const stats = await prisma.documentDownload.groupBy({
  by: ['documentId'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } }
});
```

### Mehrsprachigkeit

**Unterstützte Sprachen:**
- 🇩🇪 Deutsch (DE)
- 🇬🇧 English (EN)
- 🇷🇸 Srpski (SR)
- 🇭🇷 Hrvatski (HR)
- 🇹🇷 Türkçe (TR)
- 🇮🇹 Italiano (IT)
- 🇪🇸 Español (ES)
- 🇺🇦 Українська (UK)

**Dokument-Übersetzungen:**
Jedes Dokument hat Titel, Beschreibung und Hilfetext in allen 8 Sprachen.

**Location:** `app/config/documents.ts` - `translations` Object

---

## 🔄 Zukünftige Erweiterungen

### Phase 2: Formular-Assistent (Beta)
- Schritt-für-Schritt Wizard durch Formulare
- Auto-Save in Datenbank (`FormSession`, `FormData`)
- Mehrsprachige Feld-Erklärungen
- Progress-Tracking

### Phase 3: PDF-Ausfüllung
- Automatisches Befüllen von PDF-Feldern
- Nutzerdaten aus Wizard übernehmen
- Fertige PDFs generieren und zum Download anbieten
- Verwendung von `pdf-lib` oder `PDFKit`

### Phase 4: Admin-Dashboard
- Download-Statistiken visualisieren
- Beliebteste Dokumente
- Sprach-Verteilung
- Zeitreihen-Analysen

---

## 🧪 Testing

### Manueller Test

**1. Dokumente-Seite testen:**
```
http://localhost:3000/de/dokumente
```
- Alle 3 Dokumente sichtbar?
- Filter funktioniert?
- Download-Button reagiert?

**2. Download testen:**
```
http://localhost:3000/api/documents/download?id=ansuchen&format=pdf
```
- PDF wird heruntergeladen?
- Richtiger Dateiname?

**3. Result-Seite testen:**
```
http://localhost:3000/de/check/result
```
(Nachdem Checker durchlaufen)
- Download-Sektion sichtbar?
- Link zu /dokumente funktioniert?

### Datenbank-Test

**Test-Route:** (optional erstellen)
```typescript
// app/api/test-db/route.ts
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const count = await prisma.documentDownload.count();
  return Response.json({ downloads: count });
}
```

---

## ⚠️ Troubleshooting

### "Module not found: @prisma/client"
```bash
npm install @prisma/client
npx prisma generate
```

### "Can't reach database server"
- Prüfe `.env.local` Variablen
- `POSTGRES_PRISMA_URL` muss gesetzt sein
- Vercel Dashboard → Storage → Database → .env.local

### "Too many clients already"
- Verwende `app/lib/prisma.ts` (singleton pattern)
- NICHT `new PrismaClient()` in Components

### TypeScript Fehler nach Prisma-Änderungen
```bash
npx prisma generate
# Dev-Server neu starten
npm run dev
```

### Downloads funktionieren nicht
- Prüfe ob PDFs in `/public/documents/original/` liegen
- Dateipfade korrekt? (ansuchen.pdf, betriebsbeschreibung.pdf, ausfuellhilfe.pdf)
- Browser-Console auf Fehler prüfen

---

## 📝 Nächste Schritte

1. **Environment Variables setzen** (siehe Setup)
2. **Prisma DB push** ausführen
3. **Testen** auf localhost
4. **Deployment** zu Vercel
5. **Monitoring** einrichten für Downloads

---

## 📚 Ressourcen

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming)
- [DSGVO Leitfaden](https://www.dsgvo-gesetz.de/)
- [Stadt Wien Formulare](https://www.wien.gv.at/amtshelfer/wirtschaft/gewerbe/betriebsanlage/)

---

*Erstellt: 2025-10-29*
*Version: 1.0*
