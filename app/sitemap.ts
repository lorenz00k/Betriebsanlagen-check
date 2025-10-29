import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://betriebsanlage-check.at';

// falls defaultLocale ohne Präfix geroutet wird, hier anpassen:
const locales = ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk'] as const;
const defaultLocale = 'de';            // ggf. anpassen
const withPrefix = (l: string) => l === defaultLocale ? '' : `/${l}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/check', '/documents', '/faq', '/impressum', '/datenschutz'];
  const now = new Date();

  return locales.flatMap((l) =>
    routes.map((r) => ({
      url: `${base}${withPrefix(l)}${r}`,
      lastModified: now,
      changeFrequency: (r === '' || r === '/faq') ? 'weekly' as const : 'monthly' as const,
      priority: r === '' ? 1.0 : (r === '/check' || r === '/faq') ? 0.9 : 0.7
    }))
  );
}
