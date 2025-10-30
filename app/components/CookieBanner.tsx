'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('cookie-consent')
        if (!saved) setOpen(true)
    }, [])

    function updateConsent(granted: boolean) {
        // Update Consent Mode v2 based on the user's choice
        window.gtag?.('consent', 'update', {
            ad_storage: granted ? 'granted' : 'denied',
            analytics_storage: granted ? 'granted' : 'denied',
            ad_user_data: granted ? 'granted' : 'denied',
            ad_personalization: 'denied', // keep off unless you really need personalized ads
        })
        localStorage.setItem('cookie-consent', granted ? 'accepted' : 'rejected')
        setOpen(false)
    }

    if (!open) return null

    return (
        <div role="dialog" className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto rounded-xl border p-4 bg-white shadow">
            <p className="text-sm">
                Wir verwenden Google Analytics (GA4) zur Reichweitenmessung. Sie können zustimmen
                oder nur notwendige Dienste erlauben. Mehr in unserer <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>.
            </p>
            <div className="mt-3 flex gap-2 justify-end">
                <button onClick={() => updateConsent(false)} className="px-3 py-2 rounded border">Nur notwendig</button>
                <button onClick={() => updateConsent(true)} className="px-3 py-2 rounded bg-black text-white">Alles akzeptieren</button>
            </div>
        </div>
    )
}
