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
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer__meta">
          <p>© 2025 {t('copyright')}</p>
          <p className="mt-3 text-xs">
            {t('disclaimer')}
          </p>
        </div>
        <div className="site-footer__links">
          <Link href={`/${locale}/impressum`} className="site-footer__link">
            {t('imprint')}
          </Link>
          <Link href={`/${locale}/datenschutz`} className="site-footer__link">
            {t('privacy')}
          </Link>
          <button
            type="button"
            onClick={() => window.showCookieSettings?.()}
            className="site-footer__link"
          >
            Cookie-Einstellungen
          </button>
        </div>
      </div>
    </footer>
  )
}
