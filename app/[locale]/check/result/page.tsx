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
  type MessagesWithMetadata,
} from '../../metadataConfig'

type LocaleParams = { params: Promise<{ locale: string }> }

// generateMetadata composes localized metadata for the questionnaire result screen.
export async function generateMetadata(
  { params }: LocaleParams,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params

  const importedMessages = (await import(`@/messages/${locale}.json`)).default as MessagesWithMetadata
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

// ResultPage validates the locale on the server and renders the client result experience.
export default async function ResultPage({ params }: LocaleParams) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <ResultPageClient locale={locale} />
}
