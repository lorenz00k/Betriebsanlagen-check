import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { locales, type Locale } from '@/i18n'

import FAQPageClient from './FAQPageClient'
import {
  ROUTE_FALLBACK_METADATA,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  type MessagesWithMetadata,
} from '../metadataConfig'

type LocaleParams = { params: Promise<{ locale: string }> }

export async function generateMetadata(
  { params }: LocaleParams,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params

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

export default async function FAQPage({ params }: LocaleParams) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <FAQPageClient locale={locale} />
}
