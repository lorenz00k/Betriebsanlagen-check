// Helper utilities for building locale-aware metadata objects used across multiple routes,
// including canonical URLs, hreflang alternates, and social previews derived from messages.
import type { Metadata, ResolvingMetadata } from 'next'
import type { AbstractIntlMessages } from 'next-intl'

import { defaultLocale, locales, type Locale } from '@/i18n'

export type MetadataContent = {
  title: string
  description: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    siteName?: string
    images?: {
      url: string
      width?: number
      height?: number
      alt?: string
    }[]
  }
  twitter?: {
    title?: string
    description?: string
    creator?: string
    images?: string[]
  }
}

export type MetadataCollection = MetadataContent & {
  faq?: MetadataContent
  documents?: MetadataContent
  checkResult?: MetadataContent
}

export type MessagesWithMetadata = AbstractIntlMessages & { metadata?: MetadataCollection }

// Accept both the App Router's `{ params: { locale } }` and the Promise variant.
export type LocaleParam = { locale: string } | Promise<{ locale: string }>

// Small helper so call sites can always `await resolveLocaleParam(params)`
export const resolveLocaleParam = async (
  params: LocaleParam,
): Promise<{ locale: string }> => await params

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://betriebsanlagen-check.vercel.app'

export const FALLBACK_METADATA: MetadataCollection = {
  title: 'Betriebsanlagen Check',
  description:
    'Prüfen Sie online, ob Sie für Ihre Betriebsanlage eine Genehmigung benötigen, und erhalten Sie eine Schritt-für-Schritt-Anleitung.',
  openGraph: {
    siteName: 'Betriebsanlagen Check',
  },
  twitter: {
    title: 'Betriebsanlagen Check',
    description:
      'Finden Sie in wenigen Minuten heraus, ob Ihre Betriebsanlage genehmigungspflichtig ist.',
  },
}

export const ROUTE_FALLBACK_METADATA: Record<
  'faq' | 'documents' | 'checkResult',
  MetadataContent
> = {
  faq: {
    title: 'FAQ – Häufige Fragen zum Betriebsanlagen-Check',
    description:
      'Antworten auf die wichtigsten Fragen zur Genehmigungspflicht, zum Ablauf und zu den Kosten des Betriebsanlagen-Checks.',
    keywords: ['FAQ Betriebsanlage', 'Genehmigung Fragen', 'Betriebsanlagen Ablauf'],
  },
  documents: {
    title: 'Dokumente & Ablauf für Ihre Betriebsanlagen-Genehmigung',
    description:
      'Erfahren Sie, welche Unterlagen Sie für die Genehmigung Ihrer Betriebsanlage benötigen und wie der Prozess in Wien abläuft.',
    keywords: [
      'Betriebsanlage Dokumente',
      'Genehmigung Unterlagen Wien',
      'Betriebsanlagengenehmigung Ablauf',
    ],
  },
  checkResult: {
    title: 'Ergebnis Ihres Betriebsanlagen-Checks',
    description:
      'Sehen Sie, ob Ihre Betriebsanlage eine Genehmigung benötigt und welche nächsten Schritte empfohlen werden.',
    keywords: [
      'Betriebsanlage Ergebnis',
      'Genehmigung benötigt',
      'Nächste Schritte Betriebsanlage',
    ],
  },
}

export const isMessagesWithMetadata = (
  messages: AbstractIntlMessages,
): messages is MessagesWithMetadata =>
  typeof (messages as MessagesWithMetadata).metadata === 'object' &&
  (messages as MessagesWithMetadata).metadata !== null

const getLanguageAlternates = (pathname: string) => {
  // Compose a hreflang map for each supported locale so search engines understand the
  // available translations for a given pathname.
  return locales.reduce<Record<string, string>>((acc, currentLocale) => {
    const localePath = pathname ? `/${currentLocale}${pathname}` : `/${currentLocale}`
    acc[currentLocale] = new URL(localePath, SITE_URL).toString()
    return acc
  }, {})
}

// buildLocalizedMetadata centralizes canonical URL, alternates, and social metadata generation
// so that every route can hydrate consistent SEO output from translated message bundles.
export const buildLocalizedMetadata = async ({
  locale,
  pathname = '',
  metadataMessages,
  parent,
}: {
  locale: string
  pathname?: string
  metadataMessages: MetadataContent
  parent?: ResolvingMetadata
}): Promise<Metadata> => {
  if (!locales.includes(locale as Locale)) {
    return {}
  }

  const metadataBase = new URL(SITE_URL)
  const routePath = pathname ? `/${locale}${pathname}` : `/${locale}`
  const canonical = new URL(routePath, metadataBase).toString()
  const languageAlternates = getLanguageAlternates(pathname)
  languageAlternates['x-default'] = languageAlternates[defaultLocale]

  const parentMetadata = parent ? await parent : undefined
  const openGraphConfig = metadataMessages.openGraph ?? {}
  const twitterConfig = metadataMessages.twitter ?? {}
  const images = openGraphConfig.images ?? parentMetadata?.openGraph?.images

  const fallbackTwitterImages = Array.isArray(images)
    ? images
        .map((image) => {
          if (typeof image === 'string') return image
          if (image instanceof URL) return image.toString()
          return image?.url
        })
        .filter((value): value is string => Boolean(value))
    : typeof images === 'string'
      ? [images]
      : undefined

  const twitterImages = twitterConfig.images ?? fallbackTwitterImages

  return {
    metadataBase,
    title: metadataMessages.title,
    description: metadataMessages.description,
    keywords: metadataMessages.keywords,
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    openGraph: {
      ...parentMetadata?.openGraph,
      type: 'website',
      url: canonical,
      locale,
      siteName: openGraphConfig.siteName ?? metadataMessages.title,
      title: openGraphConfig.title ?? metadataMessages.title,
      description: openGraphConfig.description ?? metadataMessages.description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterConfig.title ?? metadataMessages.title,
      description: twitterConfig.description ?? metadataMessages.description,
      creator: twitterConfig.creator,
      images: twitterImages,
    },
  }
}
