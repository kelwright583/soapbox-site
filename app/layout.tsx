import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'In the Absence of a Soapbox',
    template: '%s | In the Absence of a Soapbox',
  },
  description:
    'Candid, funny, occasionally furious writing about bodies, relationships, motherhood, and the long, unglamorous business of growing outward instead of up.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'In the Absence of a Soapbox — Kel Wright',
    description:
      'Candid, funny, occasionally furious writing about bodies, relationships, motherhood, and the long, unglamorous business of growing outward instead of up.',
    type: 'website',
    url: '/',
    images: ['/images/BookCover.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  )
}
