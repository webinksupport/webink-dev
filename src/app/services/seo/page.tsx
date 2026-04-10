import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import PageEditorWrapper from '@/components/editor/PageEditorWrapper'
import { getPageJsonContent } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'SEO Services Sarasota & Tampa | $1,103/mo | Webink Solutions',
  description:
    'Professional SEO services in Sarasota & Tampa starting at $1,103/mo. Technical SEO, content strategy, local SEO, and transparent monthly reporting. Results you can measure.',
  keywords: ['SEO services Sarasota', 'local SEO Florida', 'managed SEO agency', 'search engine optimization Tampa', 'Sarasota SEO company'],
  openGraph: {
    title: 'SEO Services Sarasota & Tampa | $1,103/mo | Webink Solutions',
    description: 'Fully managed SEO starting at $1,103/mo. Technical audits, content strategy, local SEO, and transparent reporting.',
    url: 'https://webink.solutions/services/seo',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

const defaultPhotos = [
  { src: '/images/photos/workspace-dark.jpg', alt: 'SEO analytics dashboard on screen — Webink Solutions data-driven SEO', objectPosition: 'center' },
  { src: '/images/digital-workspace-flatlay.png', alt: 'Digital workspace flatlay showing SEO tools and analytics', objectPosition: 'center' },
  { src: '/images/photoshoot/DSC04515.jpg', alt: 'Webink Solutions team analyzing SEO performance metrics', objectPosition: 'top center' },
]

const defaultFeatures = [
  { icon: 'Search', title: 'Technical SEO', description: 'Site speed optimization, crawlability fixes, schema markup, and Core Web Vitals improvements that build a solid foundation for rankings.' },
  { icon: 'Target', title: 'Content Strategy', description: 'Keyword-driven content plans, blog strategy, and on-page optimization that attracts qualified traffic and establishes topical authority.' },
  { icon: 'Globe', title: 'Local SEO', description: 'Google Business Profile optimization, local citations, review management, and map pack strategies for Sarasota, Tampa, and Bradenton.' },
  { icon: 'BarChart3', title: 'Monthly Reporting', description: 'Transparent dashboards with real metrics — keyword rankings, organic traffic, conversions, and ROI. No jargon, no vanity metrics.' },
]

const defaultProcessSteps = [
  { title: 'Audit & Research', description: 'Comprehensive technical audit, keyword research, competitor analysis, and content gap identification. We find exactly where the opportunities are before we start.' },
  { title: 'On-Page & Off-Page Optimization', description: 'We optimize your existing pages, build new content, fix technical issues, and develop a link building strategy that moves the needle.' },
  { title: 'Monitor & Scale', description: 'Continuous monitoring, A/B testing, and monthly strategy refinements based on real data. Your SEO compounds over time, and so do your results.' },
]

const defaultPricing = [
  { name: 'Basic', price: '$1,103', period: 'mo', features: ['Keyword research & tracking', 'On-page optimization', 'Technical SEO audit & fixes', 'Google Business Profile setup', 'Monthly performance reports'] },
  { name: 'Pro', price: '$1,493', period: 'mo', recommended: true, features: ['Everything in Basic', 'Content strategy & creation', 'Link building campaigns', 'Competitor analysis', 'Bi-weekly performance calls'] },
  { name: 'Ultimate', price: '$1,993', period: 'mo', features: ['Everything in Pro', 'Dedicated account manager', 'Weekly performance reports', 'Priority support', 'Advanced conversion tracking'] },
]

const defaultFaqs = [
  { question: 'How long does SEO take to show results?', answer: 'SEO is a long-term strategy. Most businesses start seeing measurable improvements in 3-6 months, with significant results by month 6-12. Local SEO for Sarasota businesses can sometimes show faster results, especially if your Google Business Profile and local citations have not been optimized yet.' },
  { question: 'What is the difference between local SEO and organic SEO?', answer: 'Local SEO focuses on ranking in map packs and local search results for location-based queries like "web design Sarasota." Organic SEO targets broader keyword rankings in standard search results. Most local businesses need both — we build strategies that combine the two for maximum visibility.' },
  { question: 'What kind of reporting do you provide?', answer: 'You get a clear monthly report covering keyword rankings, organic traffic, conversion metrics, and a summary of work completed. No jargon, no fluff. Pro and Ultimate plans include regular calls to walk through results and discuss strategy.' },
  { question: 'Do you guarantee first-page rankings?', answer: 'No reputable SEO agency can guarantee specific rankings — Google controls the algorithm. What we guarantee is a transparent, data-driven process, consistent execution, and clear reporting so you always know exactly what you are getting for your investment.' },
]

export default async function SEOPage() {
  const content = await getPageJsonContent('services/seo')

  return (
    <PageEditorWrapper pageSlug="services/seo">
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        pageSlug="services/seo"
        eyebrow="SEO Services"
        headline={(content.hero_headline as string) || 'Dominate Search'}
        headlineAccent="Results."
        subtext={(content.hero_subtext as string) || 'Data-driven SEO strategies that put your Sarasota or Tampa business in front of the right customers. No smoke and mirrors — just measurable, month-over-month growth.'}
        heroImage={(content.hero_image as string) || '/images/services/seo-hero.png'}
        photos={(content.photos as typeof defaultPhotos) || defaultPhotos}
        features={(content.features as typeof defaultFeatures) || defaultFeatures}
        processSteps={(content.process_steps as typeof defaultProcessSteps) || defaultProcessSteps}
        pricing={(content.pricing as typeof defaultPricing) || defaultPricing}
        ctaText={(content.hero_cta_text as string) || 'Get Started'}
        ctaHref={(content.hero_cta_link as string) || '/products/fully-managed-seo'}
        productSlug="fully-managed-seo"
        pricingNote="$250 signup fee on all SEO plans. Also available: SEO Primer one-time audit for $553 (sale from $653), Local SEO packages starting at $1,103/mo (Pro $1,603/mo, Ultimate $2,103/mo), and Local SEO 3-Month BOOST with discounted rates starting at $993/mo."
        faqs={(content.faqs as typeof defaultFaqs) || defaultFaqs}
      />
      <FooterI />
    </main>
    </PageEditorWrapper>
  )
}
