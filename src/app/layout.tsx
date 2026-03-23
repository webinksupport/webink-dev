import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Webink Solutions — Sarasota\'s Premiere Digital Agency',
  description: 'Web design, SEO, digital marketing & social media for local businesses in Sarasota, Tampa & Bradenton, FL.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
