export interface NavItem {
  href: string
  label: string
}

export const primaryLinks = (locale: string): NavItem[] => [
  { href: `/${locale}/check`, label: 'item.approval' },
  { href: `/${locale}/gastro-ki`, label: 'item.gastroAi' },
  { href: `/${locale}/adressen-check`, label: 'item.addressCheck' },
  { href: `/${locale}/formular-assistent`, label: 'item.formAssistant' },
  { href: `/${locale}/documents`, label: 'item.documents' },
  { href: `/${locale}/faq`, label: 'item.faq' },
]

export const secondaryLinks = (locale: string): NavItem[] => [
  { href: `/${locale}/impressum`, label: 'item.imprint' },
  { href: `/${locale}/datenschutz`, label: 'item.privacy' },
]
