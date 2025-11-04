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
export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const params = useParams<{ locale: string }>()
  const paramLocale = params?.locale
  const locale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-secondary language-switcher__trigger ${isOpen ? 'is-open' : ''}`}
        aria-label={t('selectLanguage')}
      >
        <span className="language-switcher__flag" aria-hidden>
          {currentLanguage.flag}
        </span>
        <span className="language-switcher__label">{currentLanguage.name}</span>
        <svg
          className={`language-switcher__chevron ${isOpen ? 'is-open' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="language-switcher__menu" role="listbox">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`language-switcher__option ${lang.code === locale ? 'is-active' : ''}`}
              role="option"
              aria-selected={lang.code === locale}
            >
              <span className="language-switcher__option-flag" aria-hidden>
                {lang.flag}
              </span>
              <span className="language-switcher__option-label">{lang.name}</span>
              {lang.code === locale && (
                <svg className="language-switcher__check" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
