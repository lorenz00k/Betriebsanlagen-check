// Server entry point for the localized questionnaire result view that wires up SEO metadata
// before handing rendering off to the interactive client component.

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { locales, type Locale } from '@/i18n'
import ResultPageClient from './ResultPageClient'

import {
  ROUTE_FALLBACK_METADATA,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type MessagesWithMetadata,
} from '../../metadataConfig'

// Compose localized metadata for the questionnaire result screen.
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await resolveLocaleParam(params)

  const importedMessages = (await import(`@/messages/${locale}.json`))
    .default as MessagesWithMetadata

  const metadataMessages = isMessagesWithMetadata(importedMessages)
    ? importedMessages.metadata?.checkResult ?? ROUTE_FALLBACK_METADATA.checkResult
    : ROUTE_FALLBACK_METADATA.checkResult

  return buildLocalizedMetadata({
    locale,
    pathname: '/check/result',
    metadataMessages,
    parent,
  })
}

// Validate locale on the server and render the client result experience.
export default async function ResultPage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await resolveLocaleParam(params)

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <ResultPageClient locale={locale} />
}
