import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Webink Solutions — Sarasota\'s Premiere Digital Agency',
  description: 'Web design, SEO, digital marketing & social media for local businesses in Sarasota, Tampa & Bradenton, FL.',
  metadataBase: new URL('https://webink.solutions'),
  openGraph: {
    title: 'Webink Solutions — Sarasota\'s Premiere Digital Agency',
    description: 'Web design, SEO, digital marketing & social media for local businesses in Sarasota, Tampa & Bradenton, FL.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webink Solutions — Sarasota\'s Premiere Digital Agency',
    description: 'Web design, SEO, digital marketing & social media for local businesses in Sarasota, Tampa & Bradenton, FL.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <LenisProvider>{children}</LenisProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
