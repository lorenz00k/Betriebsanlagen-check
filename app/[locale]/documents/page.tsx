// Server entry point for the localized documents route that prepares SEO metadata
// and renders the client checklist after validating the locale.

import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { locales, type Locale } from '@/i18n'
import DocumentsPageClient from './DocumentsPageClient'

import {
  ROUTE_FALLBACK_METADATA,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type MessagesWithMetadata,
} from '../metadataConfig'

// generateMetadata assembles localized metadata for the documents workflow instructions.
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await resolveLocaleParam(params)

  const importedMessages = (await import(`@/messages/${locale}.json`))
    .default as MessagesWithMetadata

  const metadataMessages = isMessagesWithMetadata(importedMessages)
    ? importedMessages.metadata?.documents ?? ROUTE_FALLBACK_METADATA.documents
    : ROUTE_FALLBACK_METADATA.documents

  return buildLocalizedMetadata({
    locale,
    pathname: '/documents',
    metadataMessages,
    parent,
  })
}

// DocumentsPage resolves the active locale on the server and delegates UI to the client component.
export default async function DocumentsPage(
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await resolveLocaleParam(params)

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Pass locale if your client needs it; otherwise render as-is.
  return <DocumentsPageClient />
}
