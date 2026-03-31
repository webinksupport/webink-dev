import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'PPC & Paid Advertising Sarasota & Tampa | Webink Solutions',
  description:
    'Expert Google Ads and Meta advertising management in Sarasota & Tampa. Data-driven PPC campaigns that deliver real ROI.',
  keywords: ['PPC management Sarasota', 'Google Ads Sarasota FL', 'paid advertising Tampa', 'Meta ads Florida'],
  openGraph: {
    title: 'PPC & Paid Advertising Sarasota & Tampa | Webink Solutions',
    description: 'Expert Google Ads and Meta advertising management. Data-driven PPC campaigns that deliver real ROI.',
    url: 'https://webink.solutions/services/paid-advertising',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

const defaultPhotos = [
  { src: '/images/photoshoot/DSC04537.jpg', alt: 'PPC campaign strategy meeting at Webink Solutions Sarasota', objectPosition: 'top center' },
  { src: '/images/photos/sean-street.jpg', alt: 'Sean Rowe — advertising strategist at Webink Solutions', objectPosition: 'top center' },
  { src: '/images/photoshoot/DSC04554.jpg', alt: 'Webink Solutions paid advertising team in action', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Target', title: 'Precision Targeting', description: 'Reach the right audience at the right time with data-driven targeting strategies across Google and Meta platforms.' },
  { icon: 'BarChart3', title: 'Real-Time Analytics', description: 'Live dashboards and conversion tracking so you always know exactly where your ad dollars are going.' },
  { icon: 'TrendingUp', title: 'Continuous Optimization', description: 'We test, refine, and optimize campaigns weekly to maximize your return on every dollar spent.' },
  { icon: 'Shield', title: 'Transparent Reporting', description: 'No hidden fees, no mystery. You see every dollar spent and every result generated in clear monthly reports.' },
]

const defaultProcessSteps = [
  { title: 'Strategy & Setup', description: 'We research your market, define your ideal customer, and build campaigns structured for maximum performance from day one.' },
  { title: 'Launch & Optimize', description: 'Campaigns go live with careful monitoring. We A/B test ads, refine targeting, and optimize bids in real time.' },
  { title: 'Scale & Report', description: 'As we identify winning strategies, we scale spend into what works. Monthly reports show clear ROI and next steps.' },
]

const defaultPricing = [
  {
    name: 'Single Network',
    price: '',
    contactOnly: true,
    features: ['$250 one-time onboarding fee', '20% monthly management fee', 'Google Ads or Meta ads', 'Audience research & targeting', 'Ad creative development', 'Monthly performance reporting'],
  },
  {
    name: 'Two Networks',
    price: '',
    contactOnly: true,
    recommended: true,
    features: ['$500 one-time onboarding ($250/network)', '25% monthly management fee', 'Google Ads + Meta ads', 'Cross-platform strategy', 'Conversion tracking setup', 'Monthly performance reporting'],
  },
  {
    name: 'Three+ Networks',
    price: '',
    contactOnly: true,
    features: ['$250 per network onboarding', '30% monthly management fee', 'Google, Meta, LinkedIn & more', 'Full multi-channel strategy', 'Advanced conversion tracking', 'Monthly performance reporting'],
  },
]

const defaultFaqs = [
  { question: 'How much should I budget for paid advertising?', answer: 'It depends on your industry and goals, but most Sarasota businesses start with $1,500-$3,000/month in ad spend plus management fees. We will recommend a budget during our initial consultation.' },
  { question: 'How quickly will I see results from PPC?', answer: 'Unlike SEO, paid ads can generate traffic and leads immediately. Most campaigns start producing measurable results within the first 2-4 weeks as we optimize targeting and bidding.' },
  { question: 'Do you manage both Google and Facebook ads?', answer: 'Yes. We manage campaigns across Google Ads (Search, Display, Shopping, YouTube), Meta (Facebook and Instagram), and LinkedIn. We recommend the mix that makes sense for your audience.' },
]

export default async function PaidAdvertisingPage() {
  const content = await getPageJsonContent('services/paid-advertising')

  return (
    <PageEditorWrapper pageSlug="services/paid-advertising">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/paid-advertising"
        eyebrow="Paid Advertising"
        headline={(content.hero_headline as string) || 'Ads That Drive'}
        headlineAccent="Real ROI."
        subtext={(content.hero_subtext as string) || 'Google Ads and Meta campaigns engineered for measurable results. We manage your ad spend like it is our own — because your growth is our growth.'}
        heroImage={((content.hero_bg as any)?.src || content.hero_bg as string) || '/images/services/ppc-ads-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get a Custom Quote'}
        ctaHref={(content.hero_cta_link as string) || '/contact'}
        pricingNote="Management fee is a percentage of monthly ad spend. Google LSA Management also available: $150 one-time setup fee + $250/mo management. Contact us for a custom proposal."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}
