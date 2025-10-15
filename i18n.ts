export const locales = ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk'] as const
export const defaultLocale = 'de' as const
export type Locale = (typeof locales)[number]