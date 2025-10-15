'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('home.footer')
  const locale = useLocale()

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
            Impressum
          </Link>
          <Link
            href={`/${locale}/datenschutz`}
            className="text-gray-600 hover:text-blue-600 transition-colors underline"
          >
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  )
}
