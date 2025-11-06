export interface NavItem {
  href: string
  label: string
}

export const primaryLinks = (locale: string): NavItem[] => [
  { href: `/${locale}/adressen-check`, label: 'Adressen-Check' },
  { href: `/${locale}/formular-assistent`, label: 'Formular-Assistent' },
  { href: `/${locale}/dokumente`, label: 'Dokumente' },
  { href: `/${locale}/faq`, label: 'FAQ' },
]

export const secondaryLinks = (locale: string): NavItem[] => [
  { href: `/${locale}/impressum`, label: 'Impressum' },
  { href: `/${locale}/datenschutz`, label: 'Datenschutz' },
]
