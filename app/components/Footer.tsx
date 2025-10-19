'use client'

// Footer renders the localized legal links and disclaimers while preserving the active locale.
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { defaultLocale } from '@/i18n'

// Displays a localized footer with imprint/privacy shortcuts tied to the current locale.
export default function Footer() {
  const t = useTranslations('home.footer')
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600 text-sm mb-4">
          <p>© 2025 {t('copyright')}</p>
          <p className="mt-2 text-xs text-gray-500">
            {t('disclaimer')}
          </p>
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <Link
            href={`/${locale}/impressum`}
            className="text-gray-600 hover:text-blue-600 transition-colors underline"
          >
            {t('imprint')}
          </Link>
          <Link
            href={`/${locale}/datenschutz`}
            className="text-gray-600 hover:text-blue-600 transition-colors underline"
          >
            {t('privacy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
