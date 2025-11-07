# 🎯 PDF Extraction & RAG Upload - Schritt-für-Schritt Anleitung

**Stand:** 2025-11-06
**Status:** ✅ Bereit zum Ausführen

---

## 📋 Überblick

Diese Anleitung zeigt dir, wie du:
1. PDFs mit einem Python Script extrahierst
2. Die extrahierten Texte in Pinecone hochlädst
3. Dein RAG-System testest

**Warum Python?** PDF-Bibliotheken funktionieren in Node.js/Next.js nicht zuverlässig. Python mit pdfplumber ist der stabilste Weg.

---

## 🚀 Schritt 1: Python Dependencies installieren

### Prüfe ob Python 3 installiert ist:

```bash
python3 --version
```

**Erwartete Ausgabe:** `Python 3.x.x`

Falls nicht installiert:
- **Mac:** `brew install python3`
- **Linux:** `sudo apt-get install python3 python3-pip`
- **Windows:** Download von [python.org](https://www.python.org/downloads/)

### Installiere pdfplumber:

```bash
pip3 install pdfplumber
```

**Alternative** (falls pip3 nicht funktioniert):
```bash
python3 -m pip install pdfplumber
```

✅ **Fertig!** Das ist alles was du brauchst.

---

## 📄 Schritt 2: PDFs extrahieren

### 2.1 Prüfe ob PDFs vorhanden sind:

```bash
ls documents/raw-pdfs/
```

**Du solltest sehen:**
```
01_gewerbeordnung.pdf
02_bauordnung.pdf
03_lebensmittelgesetz.pdf
...
```

### 2.2 Führe das Extraction-Script aus:

```bash
python3 scripts/extract_pdfs.py
```

**Was passiert:**
- Das Script liest alle PDFs aus `documents/raw-pdfs/`
- Extrahiert Text Seite für Seite
- Zeigt Fortschritt an: "Processing: filename.pdf"
- Speichert Ergebnis in `documents/processed/extracted.json`

**Erwartete Ausgabe:**

```
🚀 Starting PDF extraction...

📁 Found 9 PDF files

📖 Processing: 01_gewerbeordnung.pdf
✅ Extracted 45231 characters from 15 pages

📖 Processing: 02_bauordnung.pdf
✅ Extracted 38912 characters from 12 pages

...

💾 Saving results to documents/processed/extracted.json

============================================================
✅ PDF EXTRACTION COMPLETE
============================================================
📊 Total PDFs: 9
✅ Successful: 9
❌ Failed: 0
📁 Output file: documents/processed/extracted.json
📝 Total characters extracted: 387,245

🎯 Next step:
   Run the API to process and upload to Pinecone:
   curl -X POST http://localhost:3000/api/rag/embed-from-json
```

### 2.3 Prüfe das Ergebnis:

```bash
ls -lh documents/processed/extracted.json
```

**Du solltest sehen:** Eine JSON-Datei mit mehreren MB (z.B. 2-5 MB je nach PDFs)

**Optional - Inhalt anschauen:**
```bash
head -50 documents/processed/extracted.json
```

---

## 🔄 Schritt 3: Status prüfen

Bevor du hochlädst, prüfe ob die JSON-Datei korrekt erkannt wird:

```bash
curl http://localhost:3000/api/rag/embed-from-json
```

**Erwartete Ausgabe:**

```json
{
  "success": true,
  "fileExists": true,
  "filePath": "/Users/.../documents/processed/extracted.json",
  "stats": {
    "documentCount": 9,
    "totalCharacters": 387245,
    "averageCharactersPerDocument": 43027
  },
  "message": "Found 9 documents in extracted.json",
  "timestamp": "2025-11-06T..."
}
```

✅ **Wenn `fileExists: true`** → Alles bereit!
❌ **Wenn `fileExists: false`** → Schritt 2 nochmal ausführen

---

## 📤 Schritt 4: In Pinecone hochladen

### 4.1 Hochladen (behält bestehende Vektoren):

```bash
curl -X POST http://localhost:3000/api/rag/embed-from-json \
  -H "Content-Type: application/json" \
  -d '{"action":"process_all"}'
```

**Was passiert:**
- Text wird in Chunks aufgeteilt (1000 Zeichen, 200 Overlap)
- OpenAI generiert Embeddings (1536 Dimensionen)
- Vektoren werden in Pinecone gespeichert
- **Dauer:** Ca. 1-3 Minuten je nach Textmenge

**Erwartete Ausgabe:**

```json
{
  "success": true,
  "message": "Documents processed and uploaded successfully",
  "stats": {
    "totalDocuments": 9,
    "totalChunks": 456,
    "totalCharacters": 387245,
    "skippedDocuments": 0,
    "documents": [
      {
        "filename": "01_gewerbeordnung.pdf",
        "chunks": 52,
        "characters": 45231
      },
      ...
    ]
  },
  "timestamp": "2025-11-06T..."
}
```

### 4.2 Alternative: Erst löschen, dann hochladen:

Falls du nochmal von vorne starten willst:

```bash
curl -X POST http://localhost:3000/api/rag/embed-from-json \
  -H "Content-Type: application/json" \
  -d '{"action":"clear_and_process"}'
```

⚠️ **Warnung:** Das löscht ALLE existierenden Vektoren in Pinecone!

### 4.3 Nur Pinecone löschen (ohne Upload):

```bash
curl -X POST http://localhost:3000/api/rag/embed-from-json \
  -H "Content-Type: application/json" \
  -d '{"action":"clear_only"}'
```

---

## ✅ Schritt 5: Upload verifizieren

Prüfe ob Vektoren in Pinecone sind:

```bash
curl http://localhost:3000/api/rag/embed/status | python3 -m json.tool
```

**Erwartete Ausgabe:**

```json
{
  "success": true,
  "pinecone": {
    "indexName": "gastro-genehmigung",
    "totalVectors": 456,
    "dimension": 1536,
    "namespaces": {
      "": {
        "vectorCount": 456
      }
    }
  },
  "local": {
    "pdfFilesFound": 9,
    "documentsPath": ".../documents/raw-pdfs"
  },
  "status": {
    "hasVectors": true,
    "needsProcessing": false,
    "message": "✅ Index contains 456 vectors"
  }
}
```

✅ **Wenn `totalVectors > 0`** → Upload erfolgreich!
❌ **Wenn `totalVectors = 0`** → Schritt 4 nochmal ausführen

---

## 🧪 Schritt 6: RAG-System testen

Teste ob alle Komponenten zusammenarbeiten:

```bash
curl http://localhost:3000/api/rag/test | python3 -m json.tool
```

**Erwartete Ausgabe:**

```json
{
  "success": true,
  "message": "All RAG components working!",
  "tests": {
    "pinecone": {
      "success": true,
      "indexName": "gastro-genehmigung",
      "totalVectors": 456,
      "dimension": 1536
    },
    "openai": {
      "success": true,
      "model": "text-embedding-3-small",
      "dimensions": 1536,
      "sampleEmbedding": "[0.123, -0.456, ...]"
    },
    "anthropic": {
      "success": true,
      "model": "claude-3-5-haiku-20241022",
      "testResponse": "OK"
    }
  },
  "timestamp": "2025-11-06T..."
}
```

---

## 🎯 Was du jetzt hast

✅ **456 Vektoren** in Pinecone (Beispiel für 9 PDFs)
✅ **Semantic Search** funktioniert
✅ **Claude RAG** bereit
✅ **Alle APIs** getestet

---

## 📊 Nächste Schritte

### Option A: Chat-API bauen

Erstelle eine API Route für RAG-Queries:

```typescript
// app/api/rag/chat/route.ts
// Nutzer stellt Frage → RAG-System antwortet mit Quellen
```

### Option B: Frontend-Chat bauen

Erstelle eine Chat-Komponente:

```tsx
// app/components/RAG/ChatInterface.tsx
// Interaktiver Chat mit RAG-Antworten
```

### Option C: Guided Dialog bauen

Erstelle einen Wizard für Nutzerdaten:

```tsx
// app/components/RAG/GuidedDialog.tsx
// Schritt-für-Schritt Formular
```

---

## 🔧 Troubleshooting

### Problem: "ModuleNotFoundError: No module named 'pdfplumber'"

**Lösung:**
```bash
pip3 install pdfplumber
# oder
python3 -m pip install pdfplumber
```

### Problem: "Permission denied: scripts/extract_pdfs.py"

**Lösung:**
```bash
chmod +x scripts/extract_pdfs.py
```

### Problem: "curl: (7) Failed to connect to localhost:3000"

**Lösung:** Server ist nicht gestartet
```bash
npm run dev
```

### Problem: "extracted.json not found"

**Lösung:** Python Script nochmal ausführen
```bash
python3 scripts/extract_pdfs.py
```

### Problem: Upload schlägt fehl mit "OpenAI API error"

**Prüfe API Key:**
```bash
echo $OPENAI_API_KEY
# oder in .env.local prüfen
```

### Problem: "Pinecone index not found"

**Prüfe Index-Name in .env.local:**
```
PINECONE_INDEX_NAME="gastro-genehmigung"
```

**Prüfe in Pinecone Dashboard:**
- Login: https://app.pinecone.io/
- Index sollte existieren mit dimension=1536

---

## 📝 Kommando-Übersicht

### Python Script ausführen:
```bash
python3 scripts/extract_pdfs.py
```

### Status prüfen:
```bash
curl http://localhost:3000/api/rag/embed-from-json
```

### In Pinecone hochladen:
```bash
curl -X POST http://localhost:3000/api/rag/embed-from-json \
  -H "Content-Type: application/json" \
  -d '{"action":"process_all"}'
```

### Pinecone Status prüfen:
```bash
curl http://localhost:3000/api/rag/embed/status | python3 -m json.tool
```

### Alle Komponenten testen:
```bash
curl http://localhost:3000/api/rag/test | python3 -m json.tool
```

---

## 💡 Tipps

1. **Große PDFs:** Das Script zeigt Fortschritt alle 10 Seiten
2. **Fehlerhafte PDFs:** Werden automatisch übersprungen
3. **Encoding:** UTF-8 wird automatisch verwendet
4. **Batching:** OpenAI-Embeddings werden automatisch gebatched (max 2048 Texte)
5. **Pinecone Upload:** Erfolgt in 100er-Batches
6. **Kosten:** ~$0.01-0.05 pro 1000 PDFs (abhängig von Textmenge)

---

## 🎉 Du bist fertig!

Dein RAG-System ist jetzt vollständig:

```
✅ PDFs extrahiert
✅ Text gechunkt
✅ Embeddings generiert
✅ Vektoren in Pinecone
✅ Claude RAG ready
```

**Jetzt kannst du:**
- Eine Chat-API bauen
- Ein Frontend erstellen
- Guided Dialog implementieren

---

**Viel Erfolg! 🚀**
