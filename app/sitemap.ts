import { MetadataRoute } from 'next'

const locales = ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk']
const baseUrl = 'https://betriebsanlagen-check.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/check', '/documents', '/faq', '/impressum', '/datenschutz']

  const sitemapEntries: MetadataRoute.Sitemap = []

  locales.forEach(locale => {
    routes.forEach(route => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/faq' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/check' || route === '/faq' ? 0.9 : 0.7,
      })
    })
  })

  return sitemapEntries
}
