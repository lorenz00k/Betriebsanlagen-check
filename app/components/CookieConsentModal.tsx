'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Consent = 'accepted' | 'rejected'
const STORAGE_KEY = 'cookie-consent'
const CONSENT_VERSION = '2025-10' // erhöhe, wenn sich deine Policy ändert

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    showCookieSettings?: () => void
  }
}

export default function CookieConsentModal() {
  const [open, setOpen] = useState(false)
  const [decision, setDecision] = useState<Consent | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    // Banner nur zeigen, wenn noch keine Entscheidung ODER Version geändert
    if (!saved) setOpen(true)
    else {
      try {
        const { value, v } = JSON.parse(saved)
        if (v !== CONSENT_VERSION) setOpen(true)
        else setDecision(value)
      } catch {
        setOpen(true)
      }
    }
  }, [])

  // Scroll lock solange offen
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Globale Funktion, damit Footer-Link das Modal öffnen kann
  useEffect(() => {
    window.showCookieSettings = () => setOpen(true)
    return () => { delete window.showCookieSettings }
  }, [])

  function updateConsent(granted: boolean) {
    window.gtag?.('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: 'denied',
    })

    // GA-Cookies aufräumen, wenn abgelehnt
    if (!granted) {
      // versucht gängige GA4-Cookies zu löschen
      const domain = window.location.hostname
      const opts = (d: string) => `; Path=/; Domain=${d}; Max-Age=0; SameSite=Lax`
      document.cookie = `_ga=;${opts(domain)}`
      document.cookie = `_ga=;${opts('.' + domain)}`
      // Beispiel für property-spezifisches Cookie
      const gaProp = (document.cookie.match(/_ga_[^=]+/g) || [])
      gaProp.forEach(name => {
        document.cookie = `${name}=;${opts(domain)}`
        document.cookie = `${name}=;${opts('.' + domain)}`
      })
    }

    const val: Consent = granted ? 'accepted' : 'rejected'
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value: val, v: CONSENT_VERSION, t: Date.now() }))
    setDecision(val)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div ref={dialogRef} className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Cookies & Analyse</h2>
        <p className="text-sm text-gray-700 mb-3">
          Wir verwenden <strong>Google Analytics</strong> nur nach Ihrer Einwilligung. Ohne Zustimmung bleibt
          Analytics blockiert. Details in unserer <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-end mt-4">
          <button onClick={() => updateConsent(false)} className="px-3 py-2 rounded-lg border">
            Nur notwendig
          </button>
          <button onClick={() => updateConsent(true)} className="px-3 py-2 rounded-lg bg-black text-white">
            Alle akzeptieren
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Sie können Ihre Auswahl später jederzeit über „Cookie-Einstellungen“ im Footer ändern.
        </p>
      </div>
    </div>
  )
}
