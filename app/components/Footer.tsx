'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('home.footer')

  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 text-sm">
        <p>© 2025 {t('copyright')}</p>
        <p className="mt-2 text-xs text-gray-500">
          {t('disclaimer')}
        </p>
      </div>
    </footer>
  )
}
