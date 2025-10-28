import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

//eigentliche Weiterleitungslogik 
export default createMiddleware({
  locales,
  defaultLocale: 'de',
  localePrefix: 'as-needed'
});

//Ausnamhen, um Ketten/Schleifen verhindern
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|icon|apple-icon).*)'
  ]
};