// Server entry point for the localized FAQ route that resolves metadata and
// renders the client accordion once the locale has been validated.
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { locales, type Locale } from '@/i18n'

import FAQPageClient from './FAQPageClient'
import {
  ROUTE_FALLBACK_METADATA,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type LocaleParam,
  type MessagesWithMetadata,
} from '../metadataConfig'

// generateMetadata hydrates translated titles, descriptions, and alternates for the FAQ page.
export async function generateMetadata(
  { params }: { params: LocaleParam },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await resolveLocaleParam(params)

  const importedMessages = (await import(`@/messages/${locale}.json`)).default as MessagesWithMetadata
  const metadataMessages = isMessagesWithMetadata(importedMessages)
    ? importedMessages.metadata?.faq ?? ROUTE_FALLBACK_METADATA.faq
    : ROUTE_FALLBACK_METADATA.faq

  return buildLocalizedMetadata({
    locale,
    pathname: '/faq',
    metadataMessages,
    parent,
  })
}

// FAQPage loads the validated locale and delegates rendering to the client-side component.
export default async function FAQPage({ params }: { params: LocaleParam }) {
  const { locale } = await resolveLocaleParam(params)

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <FAQPageClient locale={locale} />
}
