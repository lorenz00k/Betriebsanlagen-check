# Design Overview

Dieses kurze Dokument fasst die wichtigsten Designanpassungen zusammen und zeigt, wo sich die zentralen Werte befinden.

## Tokens & Grundlagen
- Globale Design Tokens liegen in [`app/tokens.css`](app/tokens.css).
- Die wichtigsten Variablen:
  - `--color-bg`, `--color-surface`, `--color-fg`, `--color-muted`
  - `--color-accent`, `--color-accent-strong`, `--color-accent-soft`
  - `--radius`, `--shadow-soft`, `--container-w`
- Dark-Mode-Werte sind in `html.dark` hinterlegt und können durch Hinzufügen der Klasse `dark` auf dem `<html>`-Element aktiviert werden.

## Globale Styles
- Der neue Grundstil wird in [`app/globals.css`](app/globals.css) gepflegt. Dort finden sich die Typografie-Skala, Container-Hilfsklassen (`.layout-container`, `.section`, `.surface-card`, `.btn`, etc.) und Farbharmonisierung für bestehende Utility-Klassen.
- Buttons verwenden die Klassen `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`.
- Karten und Flächen nutzen `.surface-card` bzw. `.surface-muted`.
- Die Navigationslinks erhalten automatische Hervorhebung über `.nav-link`.

## Komponenten
- Wichtige Komponenten mit überarbeiteten Styles:
  - Navigation & Footer (`app/[locale]/layout.tsx`, `app/components/NavLink.tsx`, `app/components/Footer.tsx`)
  - Startseite (`app/[locale]/page.tsx`) inkl. neuer Karten- und Statistikoptik
  - Address Checker & Risikoauswertung (`app/components/AddressChecker.tsx`, `app/components/RiskAssessment.tsx`, `app/components/POIList.tsx`, `app/components/AnimatedStats.tsx`)
  - FAQ (`app/[locale]/faq/FAQPageClient.tsx`)
  - Dokumentkarten (`app/components/Documents/DocumentCard.tsx`)
- Bestehende Utility-Klassen (z. B. `bg-blue-50`) werden über globale Regeln auf die neue Farbwelt gemappt.

## Layout & Abstände
- Containerbreite: `--container-w` (derzeit 72rem). Verwenden Sie `.layout-container` und `.section` für konsistente Seitenabstände.
- Standardabstände basieren auf einem 8pt-Raster; zusätzliche Hilfsklassen (`.section-tight`, `.feature-grid`) helfen beim Layout.

## Fokus & Motion
- Fokuszustände sind global definiert (sichtbarer Fokus-Ring, WCAG-konform).
- Motion reduziert sich automatisch über `prefers-reduced-motion`.

Für Fragen oder neue Komponenten empfiehlt es sich, bestehende Tokens und Hilfsklassen wiederzuverwenden, um die Konsistenz des Designs sicherzustellen.
