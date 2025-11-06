// LocaleLayout bootstraps every localized route by loading translations, metadata,
// and shared navigation while exposing locale-aware structured data for search engines.
import type { Metadata, ResolvingMetadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { locales, type Locale } from '@/i18n'
import Footer from '../components/Footer'
import LanguageBanner from '../components/LanguageBanner'
import {
  FALLBACK_METADATA,
  SITE_URL,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type MessagesWithMetadata,
} from './metadataConfig'
import HeaderNav from './components/HeaderNav'

// generateMetadata builds locale-scoped metadata for the current route by combining
// localized message bundles with inherited parent metadata values.
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await resolveLocaleParam(params)

  const importedMessages = (await import(`@/messages/${locale}.json`))
    .default as MessagesWithMetadata
  const metadataMessages = importedMessages.metadata ?? FALLBACK_METADATA

  return buildLocalizedMetadata({
    locale,
    metadataMessages,
    parent,
  })
}

// LocaleLayout renders the shared shell (html/body/nav/footer) for all localized pages
// after verifying the requested locale and wiring up analytics plus organization schema.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await resolveLocaleParam(params)

  if (!locales.includes(locale as Locale)) notFound()

  let messages: AbstractIntlMessages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch {
    notFound()
  }

  const metadataMessages = isMessagesWithMetadata(messages)
    ? messages.metadata ?? FALLBACK_METADATA
    : FALLBACK_METADATA

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: metadataMessages.openGraph?.siteName ?? 'Betriebsanlagen Check',
    alternateName: metadataMessages.title,
    url: SITE_URL,
    description: metadataMessages.description,
    logo: `${SITE_URL}/file.svg`,
    areaServed: {
      '@type': 'City',
      name: 'Vienna',
      '@id': 'https://www.wikidata.org/wiki/Q1741'
    },
    availableLanguage: ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk'],
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Betriebsanlagen Check Wien',
    description: 'Kostenloser Online-Check für Betriebsanlagengenehmigung in Wien',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'MA 36 - Technische Gewerbeangelegenheiten',
      telephone: '+43 1 4000 86440',
      email: 'post@ma36.wien.gv.at',
      url: 'https://www.wien.gv.at/kontakte/ma36/',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Dresdner Straße 73-75',
        addressLocality: 'Wien',
        postalCode: '1200',
        addressCountry: 'AT',
        addressRegion: 'Wien'
      }
    },
    areaServed: {
      '@type': 'City',
      name: 'Vienna',
      '@id': 'https://www.wikidata.org/wiki/Q1741'
    },
    serviceType: 'Business Permit Check',
    availableLanguage: ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk'],
    audience: {
      '@type': 'Audience',
      audienceType: 'Entrepreneurs, Business Owners, Startups'
    }
  }

  return (
    <html lang={locale}>
      <body>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageBanner />

          <HeaderNav locale={locale} />

          <main className="min-h-screen mx-auto max-w-screen-xl w-full px-4">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export async function generateStaticParams() {
  // Pre-render every supported locale during build time for the localized routes.
  return locales.map((locale) => ({ locale }))
}
