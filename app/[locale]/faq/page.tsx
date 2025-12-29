import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { locales, type Locale } from "@/i18n"
import FAQPageClient from "./FAQPageClient"
import {
  ROUTE_FALLBACK_METADATA,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type MessagesWithMetadata,
} from "../metadataConfig"

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await resolveLocaleParam(params)

  const importedMessages = (await import(`@/messages/${locale}.json`)).default as MessagesWithMetadata

  const metadataMessages = isMessagesWithMetadata(importedMessages)
    ? importedMessages.metadata?.faq ?? ROUTE_FALLBACK_METADATA.faq
    : ROUTE_FALLBACK_METADATA.faq

  return buildLocalizedMetadata({
    locale,
    pathname: "/faq",
    metadataMessages,
    parent,
  })
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await resolveLocaleParam(params)

  if (!locales.includes(locale as Locale)) notFound()

  const groups = [
    { id: "genehmigung", questions: ["q1", "q2", "q4"] },
    { id: "kosten", questions: ["q3", "q5"] },
    { id: "recht", questions: ["q6", "q7", "q8", "q9", "q10"] },
  ] as const

  return <FAQPageClient locale={locale} groups={groups} />
}
