// LocaleLayout bootstraps every localized route by loading translations, metadata,
// and shared navigation while exposing locale-aware structured data for search engines.
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { NextIntlClientProvider } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { locales, type Locale } from '@/i18n'
import Footer from '../components/Footer'
import LanguageBanner from '../components/LanguageBanner'
import LanguageSwitcher from '../components/LanguageSwitcher'
import {
  FALLBACK_METADATA,
  SITE_URL,
  buildLocalizedMetadata,
  isMessagesWithMetadata,
  resolveLocaleParam,
  type MessagesWithMetadata,
} from './metadataConfig'

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
      <body className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
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
          <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link href={`/${locale}`} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Betriebsanlagen Check
                </h1>
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href={`/${locale}/adressen-check`}
                  className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Adressen-Check
                </Link>
                <Link
                  href={`/${locale}/formular-assistent`}
                  className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Formular-Assistent
                </Link>
                <Link
                  href={`/${locale}/gastro-ki`}
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span>Gastro KI</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full group-hover:bg-blue-200 transition-colors">
                    Beta
                  </span>
                </Link>
                <Link
                  href={`/${locale}/dokumente`}
                  className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Dokumente
                </Link>
                <Link
                  href={`/${locale}/faq`}
                  className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  FAQ
                </Link>
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
          <main className="min-h-screen">{children}</main>
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
