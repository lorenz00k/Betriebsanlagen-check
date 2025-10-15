import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['de', 'en', 'sr', 'hr', 'tr', 'it', 'es', 'uk'],
  defaultLocale: 'de'
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}