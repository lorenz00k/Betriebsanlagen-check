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
    <footer className="footer mt-24">
      <div className="layout-container section-tight text-center">
        <div className="space-y-3 text-sm" style={{ color: 'var(--color-muted)' }}>
          <p>© 2025 {t('copyright')}</p>
          <p className="text-xs max-w-2xl mx-auto" style={{ color: 'color-mix(in srgb, var(--color-muted) 75%, white 25%)' }}>
            {t('disclaimer')}
          </p>
        </div>
        <div className="footer__links mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <Link href={`/${locale}/impressum`}>{t('imprint')}</Link>
          <Link href={`/${locale}/datenschutz`}>{t('privacy')}</Link>
          <button
            type="button"
            onClick={() => window.showCookieSettings?.()}
            className="btn btn-ghost"
          >
            Cookie-Einstellungen
          </button>
        </div>
      </div>
    </footer>
  )
}
