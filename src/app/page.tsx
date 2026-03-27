import type { Metadata } from 'next'
import type { BackgroundData } from '@/components/editor/EditableBackground'
import NavI from '@/components/variant-i/NavI'
import HeroI from '@/components/variant-i/HeroI'
import MarqueeI from '@/components/variant-i/MarqueeI'
import ServicesI from '@/components/variant-i/ServicesI'
import AboutI from '@/components/variant-i/AboutI'
import FounderI from '@/components/variant-i/FounderI'
import LocalI from '@/components/variant-i/LocalI'
import StatsI from '@/components/variant-i/StatsI'
import TestimonialsI from '@/components/variant-i/TestimonialsI'
import PricingI from '@/components/variant-i/PricingI'
import CTAI from '@/components/variant-i/CTAI'
import FooterI from '@/components/variant-i/FooterI'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageContent, getPageJsonContent } from '@/lib/content'

export const revalidate = 1

export const metadata: Metadata = {
  title: 'Sarasota Web Design & Digital Marketing Agency | Webink Solutions',
  description:
    'Webink Solutions is Sarasota\'s premiere digital marketing agency — web design, SEO, paid ads, social media & hosting for local businesses in Sarasota, Tampa & Bradenton, FL.',
  keywords: ['Sarasota web design', 'digital marketing Sarasota', 'web design Florida', 'SEO Sarasota', 'social media marketing Sarasota', 'web hosting Sarasota'],
  openGraph: {
    title: 'Sarasota Web Design & Digital Marketing Agency | Webink Solutions',
    description:
      'Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton. Real results from a local team.',
    url: 'https://webink.solutions',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarasota Web Design & Digital Marketing | Webink Solutions',
  },
  alternates: {
    canonical: 'https://webink.solutions',
  },
}

function JsonLd() {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://webink.solutions/#business',
    name: 'Webink Solutions',
    image: 'https://webink.solutions/images/webink-logo.png',
    url: 'https://webink.solutions',
    telephone: '+19418401381',
    email: 'hello@webink.solutions',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1609 Georgetowne Blvd',
      addressLocality: 'Sarasota',
      addressRegion: 'FL',
      postalCode: '34232',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.3364,
      longitude: -82.5307,
    },
    areaServed: [
      { '@type': 'City', name: 'Sarasota', '@id': 'https://en.wikipedia.org/wiki/Sarasota,_Florida' },
      { '@type': 'City', name: 'Tampa' },
      { '@type': 'City', name: 'Bradenton' },
    ],
    sameAs: [
      'https://www.facebook.com/WebInkSolutionsLLC',
      'https://www.instagram.com/webinksolutions',
      'https://www.linkedin.com/company/webink-solutions-llc',
      'https://twitter.com/WebinkSolutions',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    priceRange: '$$',
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Webink Solutions',
    legalName: 'Webink Solutions LLC',
    url: 'https://webink.solutions',
    logo: 'https://webink.solutions/images/webink-logo.png',
    foundingDate: '2019',
    founder: {
      '@type': 'Person',
      name: 'Sean Rowe',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+19418401381',
      contactType: 'sales',
      email: 'hello@webink.solutions',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
    </>
  )
}

export default async function HomePage() {
  const content = await getPageContent('home').catch(() => ({}))
  const jsonContent = await getPageJsonContent('home').catch(() => ({}))

  return (
    <PageEditorWrapper pageSlug="home" initialContent={content} initialJsonContent={jsonContent}>
      <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
        <JsonLd />
        <NavI />
        <HeroI content={content} heroBgData={jsonContent.hero_bg as Partial<BackgroundData> | undefined} />
        <MarqueeI />
        <ServicesI content={content} />
        <AboutI content={content} />
        <FounderI content={content} />
        <LocalI content={content} />
        <StatsI content={content} stats={jsonContent.stats as Array<{ value: number; suffix: string; label: string; sublabel: string; underlineColor: string }> | undefined} />
        <TestimonialsI content={content} />
        <PricingI content={content} />
        <CTAI content={content} ctaBgData={jsonContent.cta_bg as Partial<BackgroundData> | undefined} />
        <FooterI />
      </main>
    </PageEditorWrapper>
  )
}
