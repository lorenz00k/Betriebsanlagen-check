# Betriebsbörse - Bilder & Videos

Dieser Ordner enthält alle Medien für die Betriebsbörse Landing Page.

## 📂 Benötigte Dateien

### 1. Hero-Section Video/Bild
**Dateiname:** `hero-video.mp4` oder `hero-image.jpg`
**Größe:** 16:9 Format (z.B. 1920x1080px)
**Inhalt:**
- Erklärvideo zur Plattform (max. 30-60 Sekunden)
- Oder: Ansprechendes Bild eines erfolgreichen Geschäfts in Wien
**Aktuell:** Platzhalter mit Play-Icon

### 2. Verkäufer-Sektion Bild
**Dateiname:** `verkaufer-bild.jpg`
**Größe:** 16:9 Format (z.B. 1200x675px)
**Inhalt:**
- Zufriedener Verkäufer/Unternehmer
- Oder: Übergabe-Szene (Handschlag, Dokumentenunterzeichnung)
**Aktuell:** Platzhalter mit Image-Icon

### 3. Käufer-Sektion Bild
**Dateiname:** `kaeufer-bild.jpg`
**Größe:** 16:9 Format (z.B. 1200x675px)
**Inhalt:**
- Erfolgreicher junger Unternehmer
- Oder: Neueröffnung eines Geschäfts
**Aktuell:** Platzhalter mit Image-Icon

## 🎨 Bildanforderungen

- **Format:** JPG, PNG oder WebP
- **Qualität:** Hochauflösend (mindestens 1200px Breite)
- **Dateigröße:** Maximal 500KB pro Bild (für schnelle Ladezeiten)
- **Stil:** Modern, professionell, freundlich
- **Farben:** Passen zu blau/grün Farbschema der Website

## 🎥 Video-Anforderungen

- **Format:** MP4 (H.264 Codec)
- **Länge:** 30-60 Sekunden
- **Auflösung:** 1920x1080px (Full HD)
- **Dateigröße:** Maximal 5MB (komprimiert)
- **Ton:** Optional (Untertitel empfohlen)

## 📝 Wie Bilder/Videos hochladen?

### Option 1: Direkt in diesen Ordner kopieren
```bash
# In diesem Projekt-Ordner:
/public/images/betriebsboerse/
```

### Option 2: Claude zur Verfügung stellen
Schicke mir die Bilder/Videos direkt im Chat und ich binde sie ein:
- Datei direkt hochladen im Chat
- Oder: Link zu Dropbox/Google Drive/etc.

## 🔄 Nach dem Upload

Ich passe dann den Code an und ersetze die Platzhalter:
```tsx
// Vorher (Platzhalter):
<div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100">
  <Play className="w-16 h-16 text-blue-600" />
</div>

// Nachher (echtes Bild):
<img
  src="/images/betriebsboerse/hero-image.jpg"
  alt="Wiener Betriebsbörse"
  className="w-full h-full object-cover rounded-2xl"
/>
```

## 💡 Tipps

- Verwende **authentische** Bilder (keine generischen Stock-Photos wenn möglich)
- Bilder von **echten Wiener Geschäften** schaffen Vertrauen
- **Menschen** in Bildern erhöhen Engagement
- Achte auf **Rechte** der Bilder (eigene Fotos oder lizenzfreie Quellen)

## 📧 Fragen?

Schicke mir einfach eine Nachricht mit:
- Dem Bild/Video das du verwenden möchtest
- Wo es auf der Seite platziert werden soll
- Eventuelle spezielle Wünsche (Größe, Beschnitt, etc.)
