# FORMULAR-ASSISTENT: MEHRSPRACHIGE AUSFÜLLHILFE
# Konzept und Implementierungsplan für betriebsanlage-check.at

## 1. ÜBERBLICK

### Ziel
Einen interaktiven, mehrsprachigen Assistenten erstellen, der Gründer durch die 
Betriebsanlagen-Formulare der Stadt Wien führt und am Ende ein ausgefülltes PDF generiert.

### Sprachen
- Deutsch (de) - Hauptsprache
- Englisch (en)
- Serbisch (sr)
- Kroatisch (hr)
- Türkisch (tr)
- Italienisch (it)
- Spanisch (es)
- Ukrainisch (uk)

## 2. TECHNISCHE ARCHITEKTUR

### Frontend
- React/Next.js für interaktive Oberfläche
- Multi-Step-Form mit Fortschrittsanzeige
- Echtzeit-Validierung
- Responsive Design für Mobile/Desktop

### Backend
- PDF-Generierung mit PDFLib oder jsPDF
- Datenvalidierung
- Übersetzungs-Management
- Optional: Speicherung für "Später fortsetzen"

### Datenbank (Optional)
- Supabase/Firebase für:
  - Speichern von Draft-Formularen
  - Tracking (anonymisiert)
  - Multi-Device-Support

## 3. BENUTZERFLUSS

```
Start
  ↓
Sprachwahl
  ↓
Willkommen & Erklärung
  ↓
Typ des Antrags (Neu / Änderung)
  ↓
Schritt 1: Antragsteller-Daten
  ↓
Schritt 2: Standort der Betriebsanlage
  ↓
Schritt 3: Art der Anlage
  ↓
Schritt 4: Betriebsflächen
  ↓
Schritt 5: Produktionsabläufe
  ↓
Schritt 6: Arbeitnehmerschutz
  ↓
Schritt 7: Versorgung & Entsorgung
  ↓
Schritt 8: Brandschutz
  ↓
Schritt 9: Maschinen & Stoffe
  ↓
Schritt 10: Spezielle Anlagen
  ↓
Zusammenfassung & Überprüfung
  ↓
PDF-Generierung & Download
```

## 4. DATENSTRUKTUR

### Formular-Konfiguration (JSON)

```json
{
  "formular": {
    "id": "betriebsanlage-antrag",
    "version": "2024-v1",
    "titel": {
      "de": "Antrag auf Betriebsanlagengenehmigung",
      "en": "Application for Operating Facility Permit",
      "tr": "İşletme Tesisi İzin Başvurusu"
    },
    "beschreibung": {
      "de": "Füllen Sie dieses Formular aus, um eine Betriebsanlagengenehmigung zu beantragen.",
      "en": "Complete this form to apply for an operating facility permit."
    },
    "schritte": [
      {
        "id": "antragsteller",
        "nummer": 1,
        "titel": {
          "de": "Angaben zum Antragsteller",
          "en": "Applicant Information"
        },
        "icon": "👤",
        "felder": [
          {
            "id": "name",
            "typ": "text",
            "label": {
              "de": "Name und Anschrift",
              "en": "Name and Address"
            },
            "hilfe": {
              "de": "Vollständiger Name der Person oder des Unternehmens, das den Antrag stellt",
              "en": "Full name of the person or company submitting the application"
            },
            "platzhalter": {
              "de": "z.B. Max Mustermann GmbH, Musterstraße 1, 1010 Wien",
              "en": "e.g. John Doe Ltd, Sample Street 1, 1010 Vienna"
            },
            "pflicht": true,
            "validierung": {
              "minLaenge": 3,
              "maxLaenge": 200
            }
          },
          {
            "id": "kontaktperson",
            "typ": "text",
            "label": {
              "de": "Kontaktdaten der Ansprechperson",
              "en": "Contact Details"
            },
            "hilfe": {
              "de": "Name, Adresse und Telefonnummer der Ansprechperson für Rückfragen",
              "en": "Name, address and phone number of contact person for inquiries"
            },
            "pflicht": true
          },
          {
            "id": "telefon",
            "typ": "tel",
            "label": {
              "de": "Telefonnummer",
              "en": "Phone Number"
            },
            "platzhalter": {
              "de": "+43 1 234 5678",
              "en": "+43 1 234 5678"
            },
            "pflicht": true,
            "validierung": {
              "pattern": "^\\+?[0-9\\s\\-\\/]+$"
            }
          },
          {
            "id": "email",
            "typ": "email",
            "label": {
              "de": "E-Mail-Adresse",
              "en": "Email Address"
            },
            "pflicht": true,
            "validierung": {
              "pattern": "^[^@]+@[^@]+\\.[^@]+$"
            }
          }
        ]
      },
      {
        "id": "standort",
        "nummer": 2,
        "titel": {
          "de": "Standort der Betriebsanlage",
          "en": "Location of Operating Facility"
        },
        "icon": "📍",
        "felder": [
          {
            "id": "bezirk",
            "typ": "select",
            "label": {
              "de": "Bezirk",
              "en": "District"
            },
            "optionen": [
              { "wert": "1", "label": { "de": "1. Innere Stadt", "en": "1st District" } },
              { "wert": "2", "label": { "de": "2. Leopoldstadt", "en": "2nd District" } },
              { "wert": "3", "label": { "de": "3. Landstraße", "en": "3rd District" } }
              // ... alle 23 Bezirke
            ],
            "pflicht": true
          },
          {
            "id": "gemeinde",
            "typ": "text",
            "label": {
              "de": "Gemeinde",
              "en": "Municipality"
            },
            "standardWert": "Wien",
            "pflicht": true
          },
          {
            "id": "adresse",
            "typ": "text",
            "label": {
              "de": "Straße, Hausnummer",
              "en": "Street, House Number"
            },
            "platzhalter": {
              "de": "z.B. Musterstraße 123",
              "en": "e.g. Sample Street 123"
            },
            "pflicht": true
          },
          {
            "id": "grundstueck",
            "typ": "text",
            "label": {
              "de": "Grundstücksnummer/n und Katastralgemeinde",
              "en": "Plot Number(s) and Cadastral Municipality"
            },
            "hilfe": {
              "de": "Finden Sie diese Information im Grundbuch oder auf www.bev.gv.at",
              "en": "Find this information in the land register or on www.bev.gv.at"
            },
            "pflicht": true
          }
        ]
      },
      {
        "id": "antragstyp",
        "nummer": 3,
        "titel": {
          "de": "Art des Antrags",
          "en": "Type of Application"
        },
        "icon": "📋",
        "felder": [
          {
            "id": "typ",
            "typ": "radio",
            "label": {
              "de": "Was möchten Sie beantragen?",
              "en": "What would you like to apply for?"
            },
            "optionen": [
              {
                "wert": "neu",
                "label": {
                  "de": "Errichtung und Betrieb einer neuen Betriebsanlage",
                  "en": "Construction and operation of a new facility"
                },
                "beschreibung": {
                  "de": "Sie planen eine komplett neue Betriebsanlage",
                  "en": "You are planning a completely new facility"
                }
              },
              {
                "wert": "aenderung",
                "label": {
                  "de": "Änderung einer bestehenden genehmigten Betriebsanlage",
                  "en": "Modification of an existing approved facility"
                },
                "beschreibung": {
                  "de": "Sie möchten eine bereits genehmigte Anlage ändern oder erweitern",
                  "en": "You want to modify or expand an already approved facility"
                }
              }
            ],
            "pflicht": true
          },
          {
            "id": "art_der_anlage",
            "typ": "text",
            "label": {
              "de": "Art der Anlage",
              "en": "Type of Facility"
            },
            "platzhalter": {
              "de": "z.B. Tischlerei, KFZ-Werkstätte, Bäckerei",
              "en": "e.g. Carpentry, Car Workshop, Bakery"
            },
            "hilfe": {
              "de": "Beschreiben Sie in wenigen Worten, welche Art von Betrieb Sie führen möchten",
              "en": "Briefly describe what type of business you want to operate"
            },
            "pflicht": true
          },
          {
            "id": "anlagenteile",
            "typ": "textarea",
            "label": {
              "de": "Wesentliche Anlagenteile und Tätigkeiten",
              "en": "Main Facility Components and Activities"
            },
            "platzhalter": {
              "de": "z.B. Produktionshalle, Büro, Lager, Heizungsanlage, Parkplatz\nTätigkeiten: Holzverarbeitung, Verkauf, Montage",
              "en": "e.g. Production hall, office, warehouse, heating system, parking\nActivities: wood processing, sales, assembly"
            },
            "hilfe": {
              "de": "Listen Sie alle wichtigen Teile Ihrer Anlage und die geplanten Tätigkeiten auf",
              "en": "List all important parts of your facility and the planned activities"
            },
            "pflicht": true,
            "zeilen": 5
          }
        ]
      },
      {
        "id": "aenderung_details",
        "nummer": 4,
        "titel": {
          "de": "Details zur Änderung",
          "en": "Modification Details"
        },
        "icon": "🔄",
        "bedingung": {
          "feld": "typ",
          "wert": "aenderung"
        },
        "felder": [
          {
            "id": "beschreibung_aenderung",
            "typ": "textarea",
            "label": {
              "de": "Beschreibung der Änderung",
              "en": "Description of Modification"
            },
            "platzhalter": {
              "de": "z.B. Zubau zur bestehenden Maschinenhalle, Aufstellung zusätzlicher Maschinen",
              "en": "e.g. Extension to existing machine hall, installation of additional machines"
            },
            "hilfe": {
              "de": "Beschreiben Sie genau, was geändert, erweitert oder neu gebaut werden soll",
              "en": "Describe exactly what will be changed, expanded or newly built"
            },
            "pflicht": true,
            "zeilen": 5
          },
          {
            "id": "letzte_genehmigung_datum",
            "typ": "date",
            "label": {
              "de": "Datum der letzten Genehmigung",
              "en": "Date of Last Approval"
            },
            "pflicht": true
          },
          {
            "id": "letzte_genehmigung_zahl",
            "typ": "text",
            "label": {
              "de": "Geschäftszahl der letzten Genehmigung",
              "en": "Reference Number of Last Approval"
            },
            "hilfe": {
              "de": "Finden Sie diese auf Ihrem Genehmigungsbescheid",
              "en": "Find this on your approval document"
            },
            "pflicht": true
          }
        ]
      },
      {
        "id": "flaechen",
        "nummer": 5,
        "titel": {
          "de": "Betriebsflächen",
          "en": "Operating Areas"
        },
        "icon": "📐",
        "felder": [
          {
            "id": "flaechen_beschreibung",
            "typ": "textarea",
            "label": {
              "de": "Art und Ausmaß der gewerblich genutzten Flächen",
              "en": "Type and Size of Commercially Used Areas"
            },
            "platzhalter": {
              "de": "z.B. Produktionsräume 200m², Lager 50m², Büro 30m², Sanitärräume 20m², Parkplatz 100m²",
              "en": "e.g. Production rooms 200m², warehouse 50m², office 30m², sanitary 20m², parking 100m²"
            },
            "hilfe": {
              "de": "Listen Sie alle Räume und Flächen mit ihrer Größe auf. Auch Freiflächen wie Parkplätze zählen!",
              "en": "List all rooms and areas with their size. Outdoor areas like parking lots count too!"
            },
            "pflicht": true,
            "zeilen": 5
          },
          {
            "id": "gesamtflaeche",
            "typ": "number",
            "label": {
              "de": "Gesamte betrieblich genutzte Fläche (m²)",
              "en": "Total Commercially Used Area (m²)"
            },
            "einheit": "m²",
            "hilfe": {
              "de": "Summe aller oben genannten Flächen",
              "en": "Sum of all areas mentioned above"
            },
            "pflicht": true,
            "min": 1
          },
          {
            "id": "anschlussleistung",
            "typ": "radio",
            "label": {
              "de": "Gesamte elektrische Anschlussleistung",
              "en": "Total Electrical Connection Capacity"
            },
            "optionen": [
              {
                "wert": "unter300",
                "label": {
                  "de": "Unter 300 Kilowatt",
                  "en": "Below 300 kilowatts"
                }
              },
              {
                "wert": "ueber300",
                "label": {
                  "de": "Über 300 Kilowatt",
                  "en": "Above 300 kilowatts"
                }
              },
              {
                "wert": "keine",
                "label": {
                  "de": "Keine Maschinen oder Geräte vorhanden",
                  "en": "No machines or equipment present"
                }
              }
            ],
            "hilfe": {
              "de": "Diese Angabe bestimmt, ob ein vereinfachtes Verfahren möglich ist",
              "en": "This determines if a simplified procedure is possible"
            },
            "pflicht": true
          }
        ]
      }
      // ... weitere Schritte für:
      // - Produktionsabläufe
      // - Betriebszeiten
      // - Arbeitnehmerschutz
      // - Versorgung & Entsorgung
      // - Brandschutz
      // - Maschinen & Stoffe
      // - Spezielle Anlagen
    ]
  }
}
```

## 5. KOMPONENTEN-STRUKTUR

### React-Komponenten

```
/components/FormularAssistent/
├── FormularWizard.js          # Hauptkomponente
├── SprachWaehler.js            # Sprachwahl-Dropdown
├── FortschrittsAnzeige.js      # Progress Bar
├── Schritt.js                  # Einzelner Formular-Schritt
├── FeldTypen/
│   ├── TextField.js
│   ├── TextAreaField.js
│   ├── SelectField.js
│   ├── RadioField.js
│   ├── CheckboxField.js
│   ├── DateField.js
│   └── NumberField.js
├── Validierung.js              # Echtzeit-Validierung
├── Hilfebox.js                 # Kontextuelle Hilfe
├── Zusammenfassung.js          # Review vor PDF
└── PDFGenerator.js             # PDF-Erstellung
```

## 6. HILFE & ERKLÄRUNGEN

### Arten von Hilfe

1. **Inline-Hilfe**
   - Kleine Info-Icons (ℹ️) neben jedem Feld
   - Tooltip beim Hover
   - Kurze Erklärung (1-2 Sätze)

2. **Kontextuelle Hilfe**
   - Rechte Sidebar mit ausführlichen Erklärungen
   - Beispiele für typische Eingaben
   - Häufige Fehler und wie man sie vermeidet

3. **Video-Tutorials** (Optional)
   - Kurze 1-2 Min Videos pro Schritt
   - Mehrsprachige Untertitel

4. **Live-Chat** (Optional)
   - Support während der Geschäftszeiten
   - FAQ-Bot für häufige Fragen

### Beispiel-Hilfetext (mehrsprachig)

```javascript
const hilfeTexte = {
  grundstuecksnummer: {
    de: {
      kurz: "Grundbuch-Nummer Ihres Grundstücks",
      lang: "Die Grundstücksnummer finden Sie:\n• Im Grundbuch\n• Auf www.bev.gv.at (Bundesamt für Eich- und Vermessungswesen)\n• Bei Ihrem Notar oder Immobilienmakler\n\nBeispiel: 1234/5 KG Innere Stadt",
      beispiel: "1234/5 KG Innere Stadt"
    },
    en: {
      kurz: "Land register number of your property",
      lang: "You can find the plot number:\n• In the land register\n• On www.bev.gv.at (Federal Office of Metrology)\n• From your notary or real estate agent\n\nExample: 1234/5 KG Inner City",
      beispiel: "1234/5 KG Inner City"
    },
    tr: {
      kurz: "Mülkünüzün tapu numarası",
      lang: "Parsel numarasını şurada bulabilirsiniz:\n• Tapu sicilinde\n• www.bev.gv.at adresinde\n• Noterden veya emlakçıdan\n\nÖrnek: 1234/5 KG Inner City",
      beispiel: "1234/5 KG Inner City"
    }
  }
};
```

## 7. PDF-GENERIERUNG

### Ansatz 1: PDF-Formular mit PDFLib ausfüllen

```javascript
import { PDFDocument } from 'pdf-lib';

async function generiereAusgefuelltePDF(formularDaten, sprache) {
  // Original-PDF der Stadt Wien laden
  const pdfBytes = await fetch('/formulare/betriebsanlage-antrag.pdf').then(r => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Formularfelder ausfüllen
  const form = pdfDoc.getForm();
  
  form.getTextField('name').setText(formularDaten.name);
  form.getTextField('adresse').setText(formularDaten.adresse);
  // ... alle weiteren Felder
  
  // Optional: Felder nicht mehr editierbar machen
  form.flatten();
  
  // PDF speichern
  const filledPdfBytes = await pdfDoc.save();
  
  return filledPdfBytes;
}
```

### Ansatz 2: Komplett neue PDF mit jsPDF erstellen

```javascript
import jsPDF from 'jspdf';

function generiereEigenePDF(formularDaten, sprache) {
  const doc = new jsPDF();
  
  // Überschrift
  doc.setFontSize(18);
  doc.text(übersetzungen[sprache].titel, 20, 20);
  
  // Daten einfügen
  doc.setFontSize(12);
  let y = 40;
  
  doc.text(`${übersetzungen[sprache].name}: ${formularDaten.name}`, 20, y);
  y += 10;
  // ... weitere Felder
  
  return doc.output('blob');
}
```

## 8. ÜBERSETZUNGS-MANAGEMENT

### Struktur

```
/translations/
├── de.json
├── en.json
├── sr.json
├── hr.json
├── tr.json
├── it.json
├── es.json
└── uk.json
```

### Übersetzungs-Tool

Nutze i18next oder react-intl:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: require('./translations/de.json') },
      en: { translation: require('./translations/en.json') },
      tr: { translation: require('./translations/tr.json') }
      // ... weitere
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });
```

## 9. VALIDIERUNG

### Client-Side Validierung

```javascript
const validierungsRegeln = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    nachricht: {
      de: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      en: 'Please enter a valid email address'
    }
  },
  telefon: {
    pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    nachricht: {
      de: 'Bitte geben Sie eine gültige Telefonnummer ein',
      en: 'Please enter a valid phone number'
    }
  },
  pflichtfeld: {
    nachricht: {
      de: 'Dieses Feld ist erforderlich',
      en: 'This field is required'
    }
  }
};
```

## 10. SPEICHERN & FORTSETZEN

### LocalStorage für Entwürfe

```javascript
// Automatisches Speichern alle 30 Sekunden
useEffect(() => {
  const interval = setInterval(() => {
    localStorage.setItem('formular_entwurf', JSON.stringify(formularDaten));
  }, 30000);
  
  return () => clearInterval(interval);
}, [formularDaten]);

// Beim Laden wiederherstellen
useEffect(() => {
  const entwurf = localStorage.getItem('formular_entwurf');
  if (entwurf) {
    const wiederherstellen = window.confirm(
      übersetzungen[sprache].entwurf_gefunden
    );
    if (wiederherstellen) {
      setFormularDaten(JSON.parse(entwurf));
    }
  }
}, []);
```

## 11. BARRIEREFREIHEIT

### WCAG 2.1 AA Compliance

- ✅ Keyboard-Navigation
- ✅ Screen-Reader-Unterstützung (ARIA-Labels)
- ✅ Hoher Kontrast
- ✅ Klare Fehlermeldungen
- ✅ Fokus-Indikatoren
- ✅ Alternative Texte für Icons

## 12. ANALYTICS & TRACKING

### Was tracken? (DSGVO-konform, anonymisiert)

- Schritt-Abbruchrate (wo brechen Nutzer ab?)
- Durchschnittliche Ausfüllzeit pro Schritt
- Häufigste Fehler bei der Eingabe
- Genutzte Sprachen
- Häufigkeit der Hilfe-Nutzung

```javascript
// Beispiel mit Plausible Analytics (DSGVO-freundlich)
useEffect(() => {
  plausible('Formular-Schritt', {
    props: {
      schritt: aktuellerSchritt,
      sprache: sprache
    }
  });
}, [aktuellerSchritt]);
```

## 13. CHECKLISTE FÜR DIE UMSETZUNG

### Phase 1: MVP (Minimum Viable Product)
- [ ] Formular-Struktur definieren (JSON)
- [ ] Basis-Wizard mit 3-5 Hauptschritten
- [ ] Deutsche Version vollständig
- [ ] Englische Version vollständig
- [ ] Einfache PDF-Generierung
- [ ] Basis-Validierung

### Phase 2: Erweiterte Features
- [ ] Alle 8 Sprachen implementiert
- [ ] Erweiterte Hilfe-Texte
- [ ] Speichern & Fortsetzen
- [ ] Bessere PDF-Generierung mit Original-Formular
- [ ] Mobile Optimierung

### Phase 3: Premium-Features
- [ ] Video-Tutorials
- [ ] Live-Chat-Support
- [ ] E-Mail-Versand des PDFs
- [ ] Direkteinreichung bei Behörde (API)
- [ ] Dokumenten-Upload
- [ ] Automatische Vervollständigung aus Firmenbuch

## 14. RECHTLICHE HINWEISE IM TOOL

### Disclaimer einfügen

```javascript
const disclaimer = {
  de: `
    ⚖️ WICHTIGER HINWEIS
    
    Diese Ausfüllhilfe dient als Unterstützung beim Ausfüllen des offiziellen 
    Formulars. Sie ersetzt keine rechtliche Beratung und ist unverbindlich.
    
    Das generierte PDF basiert auf Ihren Angaben. Bitte überprüfen Sie alle 
    Einträge sorgfältig vor der Einreichung.
    
    Für rechtsverbindliche Auskünfte wenden Sie sich bitte an:
    • Das zuständige Magistratische Bezirksamt
    • Die Wirtschaftskammer Wien
    • Einen Rechtsanwalt oder Gewerberechtssachverständigen
  `,
  en: `
    ⚖️ IMPORTANT NOTICE
    
    This filling aid serves as support when completing the official form.
    It does not replace legal advice and is non-binding.
    
    The generated PDF is based on your information. Please carefully review
    all entries before submission.
    
    For legally binding information, please contact:
    • The responsible district office
    • The Vienna Chamber of Commerce
    • A lawyer or commercial law expert
  `
};
```

## 15. NÄCHSTE SCHRITTE

1. **Formular-Struktur finalisieren**
   - Alle Felder aus Stadtformular mappen
   - Übersetzungen für alle Sprachen erstellen

2. **Prototyp bauen**
   - Mit 3-5 Schritten starten
   - Deutsch + Englisch
   - Basis-PDF-Export

3. **Testing**
   - Mit echten Gründern testen
   - Feedback sammeln
   - Iterieren

4. **Schrittweise erweitern**
   - Weitere Sprachen
   - Mehr Features
   - Bessere UX

---

Viel Erfolg bei der Umsetzung! 🚀
