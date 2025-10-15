import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales, Locale } from '@/i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { Analytics } from "@vercel/analytics/next"

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
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
            <h1 className="text-xl font-bold text-gray-800">Betriebsanlagen Check</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>
      <main className="min-h-screen">{children}</main>
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>© 2025 Betriebsanlagen Check - Ihr Helfer für Wiener Bürokratie</p>
          <p className="mt-2 text-xs text-gray-500">
            Diese Website dient nur zu Informationszwecken. Für rechtlich verbindliche Auskünfte wenden Sie sich bitte an die zuständigen Behörden.
          </p>
        </div>
      </footer>
    </NextIntlClientProvider>
  )
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}