import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://betriebsanlagen-check.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'de': '/de',
      'en': '/en',
      'sr': '/sr',
      'hr': '/hr',
      'tr': '/tr',
      'it': '/it',
      'es': '/es',
      'uk': '/uk',
    },
  },
}

export const homeMetadata: Metadata = {
  ...baseMetadata,
  title: 'Betriebsanlagen Check Wien - Genehmigung prüfen in 2 Minuten | Kostenlos',
  description: 'Prüfen Sie kostenlos, ob Ihre Betriebsanlage in Wien eine Genehmigung benötigt. Für Gründer, KMU, Gastro, Einzelhandel & mehr. 8 Sprachen verfügbar. Gewerbegenehmigung einfach erklärt.',
  keywords: [
    'Betriebsanlage',
    'Betriebsanlagengenehmigung',
    'Gewerbegenehmigung',
    'Wien',
    'Gründung',
    'Gewerbe',
    'MA 36',
    'Freistellungsverordnung',
    'Gewerbeanmeldung',
    'KMU',
    'Gastro',
    'Einzelhandel',
    'Unternehmensgründung Wien',
    'business permit Vienna',
    'trade license Austria'
  ].join(', '),
  openGraph: {
    title: 'Betriebsanlagen Check Wien - Genehmigung prüfen',
    description: 'Kostenloser Check: Braucht Ihre Betriebsanlage eine Genehmigung? Für alle Branchen. Mehrsprachig. Schnell & einfach.',
    url: 'https://betriebsanlagen-check.vercel.app',
    siteName: 'Betriebsanlagen Check',
    locale: 'de_AT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Betriebsanlagen Check Wien',
    description: 'Kostenloser Check für Betriebsanlagengenehmigung in Wien',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const faqMetadata: Metadata = {
  ...baseMetadata,
  title: 'FAQ - Häufige Fragen zur Betriebsanlagengenehmigung Wien | Betriebsanlagen Check',
  description: 'Alle Antworten zu Betriebsanlagengenehmigung, Gewerbeanmeldung & Gründung in Wien. Dauer, Kosten, benötigte Unterlagen, Freistellungsverordnung. Für Gastro, Einzelhandel, Büro & mehr.',
  keywords: [
    'FAQ Betriebsanlage',
    'Gewerbegenehmigung Fragen',
    'Betriebsanlage Kosten',
    'Betriebsanlage Dauer',
    'MA 36 Wien',
    'Gewerbeanmeldung Unterlagen',
    'Freistellungsverordnung Wien',
    'Gastro Genehmigung Wien',
    'Einzelhandel Genehmigung',
    'Gründung Wien',
    'business permit FAQ Vienna'
  ].join(', '),
  openGraph: {
    title: 'FAQ - Betriebsanlagengenehmigung Wien',
    description: 'Häufige Fragen zu Gewerbegenehmigung, Kosten, Dauer & Unterlagen für Ihre Betriebsanlage in Wien',
    type: 'website',
  },
}

export const checkMetadata: Metadata = {
  ...baseMetadata,
  title: 'Genehmigungscheck starten - Brauche ich eine Betriebsanlagengenehmigung? | Wien',
  description: 'Interaktiver Check: Finden Sie in 2 Minuten heraus, ob Ihre Betriebsanlage in Wien genehmigungspflichtig ist. Basierend auf österreichischer Gewerbeordnung & Freistellungsverordnung.',
  keywords: [
    'Betriebsanlage Check',
    'Genehmigung prüfen',
    'Gewerbegenehmigung Test',
    'Genehmigungspflicht',
    'Freistellung Gewerbe',
    'Wien Betriebsanlage',
    'Gewerbeordnung',
    'permit check Vienna'
  ].join(', '),
}

export const impressumMetadata: Metadata = {
  ...baseMetadata,
  title: 'Impressum | Betriebsanlagen Check Wien',
  description: 'Impressum und rechtliche Informationen zu Betriebsanlagen Check - Ihr Helfer für Wiener Bürokratie',
  robots: {
    index: true,
    follow: true,
  },
}

export const datenschutzMetadata: Metadata = {
  ...baseMetadata,
  title: 'Datenschutzerklärung | Betriebsanlagen Check Wien',
  description: 'Datenschutzerklärung gemäß DSGVO für Betriebsanlagen Check. Informationen zur Datenverarbeitung, Cookies und Ihren Rechten.',
  robots: {
    index: true,
    follow: true,
  },
}
