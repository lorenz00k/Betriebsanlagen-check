'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Consent = 'accepted' | 'rejected'

export default function CookieConsentModal() {
  const [open, setOpen] = useState(false)
  const [decision, setDecision] = useState<Consent | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Beim ersten Besuch Modal öffnen
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null
    if (!saved) setOpen(true)
    else setDecision(saved as Consent)
  }, [])

  // Scroll-Lock solange offen
  useEffect(() => {
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => { body.style.overflow = prev }
  }, [open])

  // einfacher Fokus-Trap + ESC schließt nicht (Pflichtentscheidung)
  useEffect(() => {
    if (!open || !dialogRef.current) return
    const el = dialogRef.current
    const focusables = el.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )
    focusables[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        last?.focus(); e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === last) {
        first?.focus(); e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function updateConsent(granted: boolean) {
    // Consent Mode v2 Update
    // @ts-expect-error 
    window.gtag?.('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: 'denied',
    })
    const val: Consent = granted ? 'accepted' : 'rejected'
    localStorage.setItem('cookie-consent', val)
    setDecision(val)
    setOpen(false)
  }

  function reopen() {
    setOpen(true)
  }

  return (
    <>
      {/* Floating "Cookie-Einstellungen" Button (nur nach Entscheidung sichtbar) */}
      {decision && !open && (
        <button
          onClick={reopen}
          aria-label="Cookie-Einstellungen"
          className="fixed z-[9998] bottom-5 right-5 rounded-full shadow-lg border bg-white px-4 py-2 text-sm"
        >
          Cookie-Einstellungen
        </button>
      )}

      {/* Modal */}
      {open && (
        <div
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="cookie-title" className="text-lg font-semibold mb-2">
              Cookies & Analyse
            </h2>
            <p id="cookie-desc" className="text-sm text-gray-700 mb-3">
              Wir verwenden <strong>Google Analytics</strong> nur nach Ihrer Einwilligung
              (Statistik/Analyse). Ohne Zustimmung bleibt Analytics blockiert. Details in unserer{' '}
              <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
              <button
                onClick={() => updateConsent(false)}
                className="px-3 py-2 rounded-lg border"
              >
                Nur notwendig
              </button>
              <button
                onClick={() => updateConsent(true)}
                className="px-3 py-2 rounded-lg bg-black text-white"
              >
                Alle akzeptieren
              </button>
            </div>

            {/* Optional: kleiner Hinweis */}
            <p className="mt-3 text-xs text-gray-500">
              Ihre Auswahl können Sie jederzeit über „Cookie-Einstellungen“ ändern.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
