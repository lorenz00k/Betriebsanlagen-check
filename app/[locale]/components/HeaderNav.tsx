'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import LanguageSwitcher from '../../components/LanguageSwitcher'
import MobileSidebar from './MobileSidebar'
import { primaryLinks } from './nav.config'

interface HeaderNavProps {
  locale: string
}

export default function HeaderNav({ locale }: HeaderNavProps) {
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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Image src="/icon.svg" alt="" width={28} height={28} className="h-7 w-7 rounded-lg shadow-sm" />
              <span className="ml-2 text-sm font-semibold text-slate-900 lg:hidden">Betriebsanlagen Check</span>
              <span className="ml-2 hidden truncate text-sm font-semibold text-slate-900 xl:inline">
                Betriebsanlagen Check
              </span>
            </Link>
          </div>

          <nav
            className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2 lg:flex"
            aria-label="Hauptnavigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`min-w-0 shrink-0 text-sm font-medium transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  isActive(link.href)
                    ? 'text-slate-900'
                    : 'text-slate-600'
                }`}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label="Menü öffnen"
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
