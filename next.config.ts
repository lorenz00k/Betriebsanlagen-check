import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts')

/** @type {import('next').NextConfig} */
const config = {
  // Add any Next.js config options here
}

export default withNextIntl(config)

import type { NextConfig } from "next";