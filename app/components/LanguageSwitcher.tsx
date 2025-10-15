'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

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

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    const newPathname = pathname.replace(`/${locale}`, `/${langCode}`)
    router.push(newPathname)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 shadow-sm relative overflow-hidden"
        aria-label={t('selectLanguage')}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <span className="text-xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">{currentLanguage.flag}</span>
        <span className="font-medium text-gray-700 relative z-10 group-hover:text-blue-600 transition-colors duration-300">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 relative z-10 transition-all duration-300 group-hover:text-blue-600 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 min-w-[200px] animate-slideDown backdrop-blur-sm">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-200 relative group ${
                lang.code === locale ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600' : 'text-gray-700'
              }`}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <span className="text-xl transform group-hover:scale-125 transition-transform duration-200">{lang.flag}</span>
              <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">{lang.name}</span>
              {lang.code === locale && (
                <svg className="w-5 h-5 ml-auto animate-scaleIn" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
