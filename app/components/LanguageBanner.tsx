'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const languageNames: Record<string, { native: string; english: string }> = {
  de: { native: 'Deutsch', english: 'German' },
  en: { native: 'English', english: 'English' },
  sr: { native: 'Српски', english: 'Serbian' },
  hr: { native: 'Hrvatski', english: 'Croatian' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  it: { native: 'Italiano', english: 'Italian' },
  es: { native: 'Español', english: 'Spanish' },
  uk: { native: 'Українська', english: 'Ukrainian' },
}

const suggestions: Record<string, string> = {
  de: 'Wir haben erkannt, dass Sie möglicherweise Deutsch sprechen. Möchten Sie die Sprache ändern?',
  en: 'We detected that you might prefer English. Would you like to change the language?',
  sr: 'Приметили смо да можда говорите српски. Желите ли да промените језик?',
  hr: 'Primijetili smo da možda govorite hrvatski. Želite li promijeniti jezik?',
  tr: 'Türkçe konuştuğunuzu tespit ettik. Dili değiştirmek ister misiniz?',
  it: 'Abbiamo notato che potresti parlare italiano. Vuoi cambiare la lingua?',
  es: 'Detectamos que podrías hablar español. ¿Quieres cambiar el idioma?',
  uk: 'Ми помітили, що ви можливо говорите українською. Бажаєте змінити мову?',
}

export default function LanguageBanner() {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<string | null>(null)

  useEffect(() => {
    // Check if user has already seen the banner
    const hasSeenBanner = localStorage.getItem('hasSeenLanguageBanner')
    if (hasSeenBanner) return

    // Detect browser language
    const browserLang = navigator.language.toLowerCase().split('-')[0]

    // Only show banner if browser language is different from current locale
    // and we support that language
    if (browserLang !== currentLocale && languageNames[browserLang]) {
      setDetectedLocale(browserLang)
      setShow(true)
    } else {
      // Mark as seen even if we don't show it
      localStorage.setItem('hasSeenLanguageBanner', 'true')
    }
  }, [currentLocale])

  const handleChangeLanguage = () => {
    if (!detectedLocale) return

    const newPathname = pathname.replace(`/${currentLocale}`, `/${detectedLocale}`)
    localStorage.setItem('hasSeenLanguageBanner', 'true')
    router.push(newPathname)
    setShow(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('hasSeenLanguageBanner', 'true')
    setShow(false)
  }

  if (!show || !detectedLocale) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-50 animate-slideDown">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base font-medium">
                  {suggestions[detectedLocale]}
                </p>
                <p className="text-xs md:text-sm opacity-90 mt-1">
                  Browser language: {languageNames[detectedLocale].native}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleChangeLanguage}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Change to {languageNames[detectedLocale].native}
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
