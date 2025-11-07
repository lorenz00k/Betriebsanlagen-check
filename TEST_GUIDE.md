# 🧪 RAG Integration - Test Guide

## Quick Test (5 Minuten)

### 1. Server starten
```bash
npm run dev
```

Warte bis du siehst:
```
✓ Ready in 1319ms
```

---

### 2. Fragebogen ausfüllen

**Öffne:** http://localhost:3000/de/check

#### Schritt 1/4 - Basics ✏️

```
❓ Welche Branche?
→ [Gastronomie/Hotel]

❓ Welcher Untertyp?
→ [Restaurant, Café, Bar (Sonstige Gastronomie)]

📏 Fläche in m²
→ 80

👥 Anzahl Sitzplätze
→ 40

❓ Örtlich gebundene Einrichtung?
→ [Ja]

❓ Nur vorübergehend betrieben?
→ [Nein]
```

**Klick:** [Weiter →]

---

#### Schritt 2/4 - Location 📍

```
❓ Ist die Flächenwidmung für Ihr Gewerbe geklärt?
→ [Ja]

❓ Liegt eine Baugenehmigung vor?
→ [Ja]
```

**Klick:** [Weiter →]

---

#### Schritt 3/4 - Operations ⚙️

```
❓ Geplante Betriebszeiten?
→ [Standard (06:00-22:00)]

❓ Externe Lüftung nach außen?
→ [Ja]

❓ Lagerung von Gefahrenstoffen (> 1000 kg)?
→ [Nein]

❓ Kennzeichnungspflichtige Gefahrenstoffe?
→ [Nein]

❓ Lautmusik oder Live-Musik?
→ [Ja]

❓ IPPC oder Seveso-Relevanz?
→ [Nein]
```

**Klick:** [Weiter →]

---

#### Schritt 4/4 - Context 🏢

```
❓ Erwartest du Beeinträchtigungen für Nachbarn?
→ [Nein]

❓ Innerhalb eines Infrastrukturstandorts?
→ [Nein]

❓ In genehmigter Anlage (z.B. Einkaufszentrum)?
→ [Nein]

❓ Besteht eine Vorgeschichte mit Genehmigungen?
→ [Nein]
```

**Klick:** [Fertigstellen ✓]

---

### 3. Result-Seite 🎉

Du wirst weitergeleitet zu: `/de/check/result`

**Was du siehst:**

```
┌─────────────────────────────────────┐
│  📋 Ihr Ergebnis                    │
│                                     │
│  [Statische Compliance-Auswertung]  │
│  • Klassifizierung                  │
│  • Gründe                           │
│  • Dokumente                        │
│  • ...                              │
└─────────────────────────────────────┘

        ↓ Scroll nach unten ↓

┌─────────────────────────────────────┐
│  ⚡ KI-POWERED                       │
│  ══════════════════════════════════ │
│                                     │
│  Personalisierte Rechtsanalyse      │
│                                     │
│  Ihre Eingaben:                     │
│  • Gastronomie (Restaurant)         │
│  • 80m²                             │
│  • Standard-Öffnungszeiten          │
│                                     │
│  [🔮 Jetzt KI-Analyse starten →]    │
└─────────────────────────────────────┘
```

---

### 4. KI-Analyse starten 🚀

**Klick:** [🔮 Jetzt KI-Analyse starten →]

**Loading Animation erscheint:**

```
┌─────────────────────────────────────┐
│         ⚡                           │
│       (Spinner)                     │
│                                     │
│  KI analysiert Ihre Angaben...      │
│  Durchsuche Gesetze und Verordnungen│
└─────────────────────────────────────┘
```

**Dauer:** ~5-10 Sekunden

---

### 5. Ergebnis anzeigen ✨

**Nach ~5-10 Sekunden siehst du:**

```
┌─────────────────────────────────────┐
│  🔮 KI-Analyse für Ihren Betrieb    │
│  ──────────────────────────────────  │
│  📊 1 Quellen • 6.0s • Claude Haiku │
│                                     │
│  Für Ihr Restaurant mit 80m² in     │
│  Wien benötigen Sie:                │
│                                     │
│  ✅ Betriebsanlagengenehmigung      │
│     nach § 74 GewO                  │
│                                     │
│  ⚠️  UVP-Prüfung: Nicht erforderlich│
│     (unter 200m² Schwellenwert)     │
│                                     │
│  📄 Erforderliche Unterlagen:       │
│  • Grundrissplan                    │
│  • Betriebsbeschreibung             │
│  • Geräteliste                      │
│  • ...                              │
│                                     │
│  [📚 Rechtsgrundlagen (1) ▼]        │
└─────────────────────────────────────┘
```

---

### 6. Rechtsgrundlagen expandieren 📚

**Klick:** [📚 Rechtsgrundlagen (1) ▼]

**Expandiert zu:**

```
┌─────────────────────────────────────┐
│  📚 Rechtsgrundlagen (1) ▲          │
│  ──────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ gewerberechtl-genehmigung   │   │
│  │ sverfahren.pdf (Seite 2)    │   │
│  │                         82% │   │
│  │                             │   │
│  │ "Eine Betriebsanlage ist    │   │
│  │ jede örtlich gebundene      │   │
│  │ Einrichtung..."             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## ✅ Was testen?

### Funktionalität
- [ ] Form-Daten werden korrekt gespeichert (SessionStorage)
- [ ] User-Context wird richtig gemappt
- [ ] RAG API wird korrekt aufgerufen
- [ ] Loading Animation erscheint
- [ ] Antwort wird angezeigt
- [ ] Quellen können expandiert werden
- [ ] "Neue Analyse" Button funktioniert

### UI/UX
- [ ] Design ist konsistent mit Rest der App
- [ ] Mobile responsive
- [ ] Loading States sind smooth
- [ ] Error Handling funktioniert

### Performance
- [ ] Response in < 15 Sekunden
- [ ] Keine Lags beim Scrollen
- [ ] Smooth Animations

---

## 🐛 Erwartete Fehler & Lösungen

### Error: "RAG-Anfrage fehlgeschlagen"

**Ursachen:**
1. Server nicht erreichbar
2. ANTHROPIC_API_KEY fehlt
3. OPENAI_API_KEY fehlt
4. Pinecone nicht verbunden

**Lösung:**
```bash
# 1. Check .env.local
cat .env.local | grep -E "ANTHROPIC|OPENAI|PINECONE"

# 2. Check Server Logs
tail -f /tmp/nextjs-dev.log

# 3. Test RAG API direkt
curl -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "Was ist eine Betriebsanlage?"}'
```

---

### Error: "Keine relevanten Informationen gefunden"

**Bedeutung:**
- Pinecone fand Dokumente, aber Relevanz-Score < 0.7

**Lösung:**
```bash
# Senke den Threshold (temporär für Tests)
# In .env.local:
RAG_MIN_SCORE=0.5
```

Oder teste mit besserer Query:
```typescript
"Was ist eine Betriebsanlage?"  // ✅ Funktioniert gut
"Welche Genehmigungen brauche ich für ein Restaurant?"  // ✅ Gut
"Brauche ich eine UVP?"  // ⚠️ Evtl. keine Treffer
```

---

### Session Storage leer

**Symptom:**
- Result-Seite redirectet zu /check
- Keine User-Daten sichtbar

**Ursache:**
- Browser-Cache gelöscht
- In anderem Tab geöffnet
- Formular nicht abgeschlossen

**Lösung:**
1. Formular komplett durchgehen (alle 4 Schritte)
2. "Fertigstellen" klicken
3. Im gleichen Browser-Tab bleiben

---

## 📊 Console Logs zum Debuggen

**Öffne Chrome DevTools:** `Cmd+Opt+J` (Mac) oder `F12` (Windows)

### Expected Logs:

```javascript
// 1. Form submission
console.log("Navigating to result page with data:", formData)

// 2. RAG API Call
console.log("Calling RAG API with:", {
  query: "...",
  userContext: { ... }
})

// 3. Success
console.log("RAG Response received:", {
  answer: "...",
  sources: [...],
  metadata: { ... }
})
```

### Network Tab:

```
POST /api/rag/chat
Status: 200 OK
Time: ~5-10s
Size: ~2-5 KB

Response:
{
  "success": true,
  "answer": "...",
  "sources": [...],
  "metadata": { ... }
}
```

---

## 🎯 Advanced Tests

### Test 1: Different Business Types

**Gastronomie:**
```typescript
sector: "gastronomyHotel"
hospitalitySubtype: "otherGastro"
areaSqm: 80
→ Erwartet: "Restaurant mit 80m²..."
```

**Werkstätte:**
```typescript
sector: "workshop"
workshopSubtype: "tailor"
areaSqm: 50
→ Erwartet: "Schneiderei mit 50m²..."
```

**Büro:**
```typescript
sector: "office"
areaSqm: 200
→ Erwartet: "Büro mit 200m²..."
```

---

### Test 2: Error Scenarios

**Scenario A: Kill Server**
```bash
# In Terminal 1
lsof -ti:3000 | xargs kill -9

# In Browser
Click "KI-Analyse starten"
→ Erwartet: Error Message "RAG-Anfrage fehlgeschlagen"
```

**Scenario B: Invalid API Key**
```bash
# In .env.local
ANTHROPIC_API_KEY=invalid_key

# Restart server
npm run dev

# In Browser
Click "KI-Analyse starten"
→ Erwartet: Error Message
```

---

### Test 3: Performance

**Measure Response Time:**
```javascript
// In DevTools Console:
const start = Date.now()

// Click "KI-Analyse starten"

// Wait for response...

const end = Date.now()
console.log(`Response Time: ${end - start}ms`)

// Expected: 5000-10000ms
```

---

## 📸 Screenshots Checklist

Mache Screenshots von:

- [ ] Fragebogen Schritt 1
- [ ] Fragebogen Schritt 4
- [ ] Result-Seite (vor AI-Analyse)
- [ ] KI-Powered Section (Button)
- [ ] Loading Animation
- [ ] AI Response (collapsed sources)
- [ ] AI Response (expanded sources)
- [ ] Mobile View (alle oben)

---

## ✅ Acceptance Criteria

### Must Have
- [x] Form-Daten werden zu User-Context gemappt
- [x] RAG API wird mit Context aufgerufen
- [x] Loading State während API-Call
- [x] Error Handling bei API-Fehler
- [x] Claude's Antwort wird angezeigt
- [x] Quellen können expandiert werden
- [x] Responsive Design

### Nice to Have
- [ ] Analytics Tracking
- [ ] PDF Export der Antwort
- [ ] Chat Widget für Follow-up
- [ ] Mehrsprachige UI

---

**Test Status:** ✅ READY FOR TESTING

Viel Erfolg beim Testen! 🚀
