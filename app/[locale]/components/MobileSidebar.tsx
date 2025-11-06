'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    lastFocusedElement.current = document.activeElement as HTMLElement

    const drawer = drawerRef.current
    const focusableItems = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors))
      : []
    const firstItem = focusableItems[0]
    firstItem?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || focusableItems.length === 0) {
        return
      }

      const first = focusableItems[0]
      const last = focusableItems[focusableItems.length - 1]
      const activeElement = document.activeElement as HTMLElement | null

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && activeElement === first) {
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

  if (!open) return null

  const primary = primaryLinks(locale)
  const secondary = secondaryLinks(locale)

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      id="mobile-sidebar"
      onClick={onClose}
    >
      <div className="flex-1 bg-black/30" />
      <div
        ref={drawerRef}
        className="ml-auto flex h-full w-80 max-w-[85vw] flex-col gap-4 bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center"
            onClick={onClose}
          >
            <Image src="/icon.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg shadow-sm" />
            <span className="sr-only">Betriebsanlagen Check</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            aria-label="Menü schließen"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {primary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-md px-2 py-2 text-base font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600">
          {secondary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-md px-2 py-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <LanguageSwitcher direction="up" />
        </div>
      </div>
    </div>
  )
}
