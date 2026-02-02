'use client'

// Footer renders the localized legal links and disclaimers while preserving the active locale.
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { defaultLocale } from '@/i18n'
import styles from "./Footer.module.css";

// Displays a localized footer with imprint/privacy shortcuts tied to the current locale.
export default function Footer() {
  const t = useTranslations('home.footer')
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

  return (
    <footer className={styles.footer}>
      <div className="site-container">
        <div className={styles.meta}>
          <p>© 2026 {t('copyright')}</p>
          <p className="mt-3 text-xs">
            {t('disclaimer')}
          </p>
        </div>
        <div className={styles.links}>
          <Link href={`/${locale}/impressum`} className={styles.link}>
            {t('imprint')}
          </Link>
          <Link href={`/${locale}/datenschutz`} className={styles.link}>
            {t('privacy')}
          </Link>
          <button
            type="button"
            onClick={() => window.showCookieSettings?.()}
            className={styles.link}
          >
            {t('cookie')}
          </button>
        </div>
      </div>
    </footer>
  )
}
