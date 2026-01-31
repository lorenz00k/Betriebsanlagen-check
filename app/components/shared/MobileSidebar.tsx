"use client";

import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from "next-intl";

import LanguageSwitcher from '../../components/LanguageSwitcher'
import { primaryLinks, secondaryLinks } from './nav.config'

interface MobileSidebarProps {
  locale: string
  open: boolean
  onClose: () => void
}

const focusableSelectors = [
  'a[href]',
  'button:not([disabled])',
  'textarea',
  'input[type="text"]',
  'input[type="radio"]',
  'input[type="checkbox"]',
  'select',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function MobileSidebar({ locale, open, onClose }: MobileSidebarProps) {
  const tItem = useTranslations("item")
  const tNav = useTranslations("nav")
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)
  const pathname = usePathname()

  const primary = useMemo(() => primaryLinks(locale), [locale])
  const secondary = useMemo(() => secondaryLinks(locale), [locale])

  useEffect(() => {
    if (!open) return

    lastFocusedElement.current = document.activeElement as HTMLElement

    const drawer = drawerRef.current
    const focusableItems = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors))
      : []
    focusableItems[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || focusableItems.length === 0) return

      const first = focusableItems[0]
      const last = focusableItems[focusableItems.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      lastFocusedElement.current?.focus()
    }
  }, [open, onClose])

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname?.startsWith(href))

  return (
    <div
      className={`mobileSidebar ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={tNav("navigation")}
      aria-hidden={!open}
      id="mobile-sidebar"
    >
      <button
        type="button"
        className="mobileSidebar__backdrop"
        aria-label={tNav("closeMenu")}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        ref={drawerRef}
        className="mobileSidebar__drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobileSidebar__header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Link href={`/${locale}`} className="mobileSidebar__brand" onClick={onClose} tabIndex={open ? 0 : -1}>
              <Image
                src="/icon.svg"
                alt=""
                width={32}
                height={32}
                className="h-9 w-9"
                style={{ borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-xs)' }}
              />
              <div>
                <div className="mobileSidebar__brandTitle">{tItem("bac")}</div>
                <div className="mobileSidebar__brandSub">{tNav("navigation")}</div>
              </div>
            </Link>

            <button type="button" onClick={onClose} className="mobileSidebar__close" aria-label={tNav("closeMenu")} tabIndex={open ? 0 : -1}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="mobileSidebar__divider" />
        </div>

        <div className="mobileSidebar__content">
          <div className="mobileSidebar__sectionLabel">{tNav("primaryMenu")}</div>
          <nav className="mobileSidebar__nav">
            {primary.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`mobileSidebar__item ${isActive(link.href) ? 'is-active' : ''}`}
                tabIndex={open ? 0 : -1}
              >
                <span>{tItem(link.label.replace("item.", ""))}</span>
              </Link>
            ))}
          </nav>


          <div className="mobileSidebar__spacer" />
          <div className="mobileSidebar__divider" style={{ margin: '0 12px' }} />

          <div className="mobileSidebar__spacer" />
          <div className="mobileSidebar__sectionLabel">{tNav("more")}</div>

          <nav className="mobileSidebar__nav">
            {secondary.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`mobileSidebar__item mobileSidebar__item--secondary ${isActive(link.href) ? 'is-active' : ''}`}
                tabIndex={open ? 0 : -1}
              >
                {tItem(link.label.replace("item.", ""))}
              </Link>
            ))}
          </nav>

        </div>

        <div className="mobileSidebar__footer">
          <div className="mobileSidebar__footerInner">
            <LanguageSwitcher direction="up" />
          </div>
        </div>
      </div>
    </div>
  )
}
