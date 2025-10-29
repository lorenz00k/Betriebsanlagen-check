import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Betriebsanlagen Check Wien',
    short_name: 'BA Check',
    description: 'Prüfen Sie kostenlos, ob Ihre Betriebsanlage in Wien eine Genehmigung benötigt',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    categories: ['business', 'government', 'utilities'],
    lang: 'de-AT',
    dir: 'ltr'
  }
}
