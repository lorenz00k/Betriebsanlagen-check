import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Betriebsanlagen Check',
  description: 'Prüfen Sie, ob Sie eine Betriebsanlagengenehmigung benötigen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100`}>
        {children}
      </body>
    </html>
  )
}