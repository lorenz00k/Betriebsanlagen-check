'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import LanguageSwitcher from './LanguageSwitcher'
import MobileSidebar from '../[locale]/components/MobileSidebar'
import { primaryLinks } from '../[locale]/components/nav.config'
import styles from "./HeaderNav.module.css";
import { useTranslations } from 'next-intl'

interface HeaderNavProps {
  locale: string
}

export default function HeaderNav({ locale }: HeaderNavProps) {
  const tItem = useTranslations("item")
  const tNav = useTranslations("nav")
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const links = useMemo(() => primaryLinks(locale), [locale])

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === `/${locale}`) {
      return pathname === `/${locale}`
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className={`${styles.header} sticky top-0 z-50`}>
      <div className="w-full px-6 lg:px-10">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-lg shadow-sm" />
              <span className="ml-2 text-sm font-semibold text-current lg:hidden">{tItem("bac")}</span>
              <span className="ml-2 hidden truncate text-sm font-semibold text-current lg:inline">
                {tItem("bac")}
              </span>
            </Link>
          </div>

          <nav
            className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2 lg:flex"
            aria-label={tNav("primaryMenu")}
          >
            {links.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : styles.navLinkInactive}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {tItem(link.label.replace("item.", ""))}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-shrink-0 items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={styles.menuButton}
              aria-label={tNav("menuOpen")}
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>

          <div className="hidden min-w-0 flex-shrink-0 items-center gap-3 lg:flex">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <MobileSidebar locale={locale} open={isSidebarOpen} onClose={closeSidebar} />
    </header>
  )
}
