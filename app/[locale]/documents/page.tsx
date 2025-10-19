import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { locales, type Locale } from '@/i18n'

import DocumentsPageClient from './DocumentsPageClient'
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
    ? importedMessages.metadata?.documents ?? ROUTE_FALLBACK_METADATA.documents
    : ROUTE_FALLBACK_METADATA.documents

  return buildLocalizedMetadata({
    locale,
    pathname: '/documents',
    metadataMessages,
    parent,
  })
}

export default async function DocumentsPage({ params }: LocaleParams) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <DocumentsPageClient />
}
