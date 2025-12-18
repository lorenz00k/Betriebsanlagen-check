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
  const [isScrolled, setIsScrolled] = useState(false)
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = useMemo(() => primaryLinks(locale), [locale])

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === `/${locale}`) {
      return pathname === `/${locale}`
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-200'
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/icon.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-base font-bold text-slate-900 hidden sm:inline">
                Betriebsanlagen Check
              </span>
            </Link>
          </div>

          <nav
            className="hidden min-w-0 flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 lg:flex"
            aria-label="Hauptnavigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`min-w-0 shrink-0 text-sm font-semibold transition-all duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg px-3 py-2 ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              aria-label="Menü öffnen"
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
