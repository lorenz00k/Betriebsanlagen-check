import './globals.css'

/*export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}*/

import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next' // keep if you want Vercel Analytics
import CookieConsentModal from './components/CookieConsentModal'

export const metadata: Metadata = { title: 'Betriebsanlagen Check' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="de">
      <head>
        {/* Consent Mode v2: default = denied BEFORE GA loads */}
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
          `}
        </Script>
      </head>
      <body>
        {children}

        {/* Vercel Web Analytics (cookie-less). Remove this line if you decide to disable it. */}
        <VercelAnalytics />

        {/* GA4 loader. This injects gtag.js and auto-tracks pageviews on client-side route changes */}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
        <CookieConsentModal />
      </body>
    </html>
  )
}
