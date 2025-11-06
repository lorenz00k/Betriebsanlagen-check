'use client'

// LanguageSwitcher provides a dropdown that rewrites the current path to the selected locale
// while keeping the navigation context for each page.
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { defaultLocale } from '@/i18n'

const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
]

// Renders the interactive locale picker and routes users to the matching translation.
interface LanguageSwitcherProps {
  direction?: 'up' | 'down'
}

export default function LanguageSwitcher({ direction = 'down' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLanguageChange = (langCode: string) => {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
    let newPathname: string
    if (normalizedPath === '/' || normalizedPath === '') {
      newPathname = `/${langCode}`
    } else if (normalizedPath.startsWith(`/${locale}`)) {
      const rest = normalizedPath.slice(locale.length + 1).replace(/^\/+/, '')
      newPathname = rest ? `/${langCode}/${rest}` : `/${langCode}`
    } else {
      newPathname = `/${langCode}${normalizedPath}`
    }
    router.push(newPathname)
    setIsOpen(false)
  }

  const dropdownPositionClasses =
    direction === 'up'
      ? 'bottom-full mb-2 origin-bottom-right'
      : 'top-full mt-2 origin-top-right'

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
          isOpen ? 'ring-2 ring-slate-400' : ''
        }`}
        aria-label={t('selectLanguage')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base" aria-hidden>
          {currentLanguage.flag}
        </span>
        <span className="hidden text-sm font-semibold text-slate-900 sm:inline">{currentLanguage.name}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg ring-1 ring-black/5 ${dropdownPositionClasses}`}
          role="listbox"
        >
          {languages.map((lang) => {
            const isSelected = lang.code === locale
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base" aria-hidden>
                    {lang.flag}
                  </span>
                  <span>{lang.name}</span>
                </span>
                {isSelected && (
                  <svg className="h-4 w-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
