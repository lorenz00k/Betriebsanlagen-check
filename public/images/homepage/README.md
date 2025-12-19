# Homepage - Media Assets

Dieser Ordner enthält alle Medien für die moderne Landing Page.

## 📂 Benötigte Dateien

### 1. Hero-Section Video
**Dateiname:** `hero-video.mp4`
**Größe:** 16:9 Format (z.B. 1920x1080px)
**Dauer:** 10-30 Sekunden (Loop)
**Inhalt:**
- Atmosphärisches Video von Wien
- Oder: Business/Gründer-Szenen
- Oder: Abstrakte professionelle Animation
**Dateigröße:** Maximal 10MB (für schnelle Ladezeiten)
**Format:** MP4 (H.264)
**Aktuell:** Platzhalter mit Play-Icon

**Verwendung im Code:**
```tsx
// Zeile 72-78 in app/[locale]/page.tsx
<video autoPlay loop muted playsInline>
  <source src="/images/homepage/hero-video.mp4" type="video/mp4" />
</video>
```

---

### 2. Feature Image 1
**Dateiname:** `feature-1.jpg`
**Größe:** 4:3 Format (z.B. 1600x1200px)
**Inhalt:**
- Wiener Geschäft/Standort
- Erfolgreiche Unternehmer
- Business-Szene mit lokalem Bezug
**Aktuell:** Platzhalter mit MapPin-Icon

**Verwendung im Code:**
```tsx
// Zeile 192-200 in app/[locale]/page.tsx
// Sektion: Adressen-Check Feature
<Image
  src="/images/homepage/feature-1.jpg"
  alt="Adressen-Check Wien"
  fill
  className="object-cover"
/>
```

---

### 3. Feature Image 2
**Dateiname:** `feature-2.jpg`
**Größe:** 4:3 Format (z.B. 1600x1200px)
**Inhalt:**
- Dokumente/Formulare
- Person am Schreibtisch
- Professionelle Office-Szene
**Aktuell:** Platzhalter mit FileText-Icon

**Verwendung im Code:**
```tsx
// Zeile 244-252 in app/[locale]/page.tsx
// Sektion: Dokumente Feature
<Image
  src="/images/homepage/feature-2.jpg"
  alt="Dokumente für Betriebsanlagen"
  fill
  className="object-cover"
/>
```

---

## 🎨 Design-Anforderungen

### Video
- **Format:** MP4 (H.264 Codec)
- **Auflösung:** 1920x1080px (Full HD)
- **Bitrate:** Maximal 5000 kbps
- **Dateigröße:** Unter 10MB
- **Ton:** Optional (Video wird gemutet abgespielt)
- **Stil:** Professionell, modern, nicht zu hektisch

### Bilder
- **Format:** JPG oder WebP
- **Qualität:** Hochauflösend (mindestens 1600px Breite)
- **Dateigröße:** Maximal 500KB pro Bild (Next.js optimiert automatisch)
- **Stil:** Modern, professionell, vertrauenswürdig
- **Farben:** Passen zu Slate/Blau Farbschema
- **Personen:** Gerne authentische Business-Szenen

---

## 🎯 Stil-Vorgaben (Apple-inspiriert)

- **Clean & Minimalistisch:** Viel Weißraum, klare Fokuspunkte
- **Professionell:** Hochwertige, scharfe Aufnahmen
- **Authentisch:** Echte Szenen statt generische Stock-Photos
- **Farben:** Dezent, nicht zu bunt
- **Beleuchtung:** Natürlich, gut ausgeleuchtet
- **Komposition:** Ausgewogen, professionell

---

## 📝 Wo Bilder/Videos hochladen?

### Option 1: Direkt in diesen Ordner kopieren
```bash
# In diesem Projekt-Ordner:
/public/images/homepage/
```

Dateien direkt hier ablegen:
- `hero-video.mp4`
- `feature-1.jpg`
- `feature-2.jpg`

### Option 2: Via GitHub hochladen
1. Dateien in GitHub-Branch hochladen
2. Ordner: `public/images/homepage/`
3. Commit & Push

### Option 3: Mir im Chat zur Verfügung stellen
- Datei direkt im Chat hochladen
- Oder: Link zu Dropbox/Google Drive/WeTransfer

---

## 🔄 Nach dem Upload

Ich ersetze dann die Platzhalter im Code:

```tsx
// Vorher (Platzhalter):
<div className="bg-slate-200">
  <Play className="w-20 h-20 text-slate-600" />
  <p>Hero Video Placeholder</p>
</div>

// Nachher (echtes Video):
<video autoPlay loop muted playsInline className="w-full h-full object-cover">
  <source src="/images/homepage/hero-video.mp4" type="video/mp4" />
</video>
```

Für die Bilder:
```tsx
// Vorher (Platzhalter):
<div className="bg-slate-200">
  <MapPin className="w-16 h-16 text-slate-400" />
</div>

// Nachher (echtes Bild):
<Image
  src="/images/homepage/feature-1.jpg"
  alt="Feature Image"
  fill
  className="object-cover"
/>
```

---

## 💡 Content-Vorschläge

### Hero Video
- **Option A:** Zeitraffer von Wiener Straßen/Gebäuden
- **Option B:** Person arbeitet erfolgreich am Laptop (Business)
- **Option C:** Abstrakte Animation mit Blau/Slate Farben
- **Option D:** Drohnenaufnahme von Wien

### Feature Image 1 (Adressen-Check)
- Wien Stadtplan/Karte
- Wiener Geschäftsstraße
- Person zeigt auf Standort auf Karte
- Business Location von außen

### Feature Image 2 (Dokumente)
- Ordentlicher Schreibtisch mit Dokumenten
- Person füllt Formular aus
- Gestempeltes/Unterschriebenes Dokument
- Ordner mit "Betriebsanlagen" Label

---

## 📦 Dateien-Checkliste

- [ ] `hero-video.mp4` - Hero Section (Zeile 72)
- [ ] `feature-1.jpg` - Adressen-Check Feature (Zeile 192)
- [ ] `feature-2.jpg` - Dokumente Feature (Zeile 244)

---

## 📧 Bei Fragen

Schicke mir einfach:
- Die Medien-Dateien
- Eventuelle Wünsche zur Platzierung
- Spezielle Anforderungen (Crop, Filter, etc.)

---

**Tipp:** Verwende **authentische** Bilder von echten Wiener Geschäften/Standorten wenn möglich - das schafft Vertrauen und lokalen Bezug!
