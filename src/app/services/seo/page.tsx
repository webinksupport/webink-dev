import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import { getPageContent } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SEO Services Sarasota & Tampa | $1,103/mo | Webink Solutions',
  description:
    'Professional SEO services in Sarasota & Tampa starting at $1,103/mo. Technical SEO, content strategy, local SEO, and transparent monthly reporting. Results you can measure.',
  openGraph: {
    title: 'SEO Services Sarasota & Tampa | $1,103/mo | Webink Solutions',
    description:
      'Fully managed SEO starting at $1,103/mo. Technical audits, content strategy, local SEO, and transparent reporting.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Webink Solutions',
  },
}

export default async function SEOPage() {
  const content = await getPageContent('services/seo')

  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="SEO Services"
        headline={content.hero_headline || 'Dominate Search'}
        headlineAccent="Results."
        subtext={content.hero_subtext || 'Data-driven SEO strategies that put your Sarasota or Tampa business in front of the right customers. No smoke and mirrors — just measurable, month-over-month growth.'}
        heroImage="/images/services/seo-hero.png"
        photos={[
          { src: '/images/photos/workspace-dark.jpg', alt: 'SEO analytics dashboard on screen — Webink Solutions data-driven SEO' },
          { src: '/images/digital-workspace-flatlay.png', alt: 'Digital workspace flatlay showing SEO tools and analytics' },
          { src: '/images/photoshoot/DSC04515.jpg', alt: 'Webink Solutions team analyzing SEO performance metrics' },
        ]}
        features={[
          {
            icon: 'Search',
            title: 'Technical SEO',
            description: 'Site speed optimization, crawlability fixes, schema markup, and Core Web Vitals improvements that build a solid foundation for rankings.',
          },
          {
            icon: 'Target',
            title: 'Content Strategy',
            description: 'Keyword-driven content plans, blog strategy, and on-page optimization that attracts qualified traffic and establishes topical authority.',
          },
          {
            icon: 'Globe',
            title: 'Local SEO',
            description: 'Google Business Profile optimization, local citations, review management, and map pack strategies for Sarasota, Tampa, and Bradenton.',
          },
          {
            icon: 'BarChart3',
            title: 'Monthly Reporting',
            description: 'Transparent dashboards with real metrics — keyword rankings, organic traffic, conversions, and ROI. No jargon, no vanity metrics.',
          },
        ]}
        processSteps={[
          {
            title: 'Audit & Research',
            description: 'Comprehensive technical audit, keyword research, competitor analysis, and content gap identification. We find exactly where the opportunities are before we start.',
          },
          {
            title: 'On-Page & Off-Page Optimization',
            description: 'We optimize your existing pages, build new content, fix technical issues, and develop a link building strategy that moves the needle.',
          },
          {
            title: 'Monitor & Scale',
            description: 'Continuous monitoring, A/B testing, and monthly strategy refinements based on real data. Your SEO compounds over time, and so do your results.',
          },
        ]}
        pricing={[
          {
            name: 'Basic',
            price: '$1,103',
            period: 'mo',
            features: [
              'Keyword research & tracking',
              'On-page optimization',
              'Technical SEO audit & fixes',
              'Google Business Profile setup',
              'Monthly performance reports',
            ],
          },
          {
            name: 'Pro',
            price: '$1,493',
            period: 'mo',
            recommended: true,
            features: [
              'Everything in Basic',
              'Content strategy & creation',
              'Link building campaigns',
              'Competitor analysis',
              'Bi-weekly performance calls',
            ],
          },
          {
            name: 'Ultimate',
            price: '$1,993',
            period: 'mo',
            features: [
              'Everything in Pro',
              'Dedicated account manager',
              'Weekly performance reports',
              'Priority support',
              'Advanced conversion tracking',
            ],
          },
        ]}
        pricingNote="Also available: SEO Primer one-time audit for $553 (sale from $653) and Local SEO packages starting at $1,103/mo."
        faqs={[
          {
            question: 'How long does SEO take to show results?',
            answer: 'SEO is a long-term strategy. Most businesses start seeing measurable improvements in 3-6 months, with significant results by month 6-12. Local SEO for Sarasota businesses can sometimes show faster results, especially if your Google Business Profile and local citations have not been optimized yet.',
          },
          {
            question: 'What is the difference between local SEO and organic SEO?',
            answer: 'Local SEO focuses on ranking in map packs and local search results for location-based queries like "web design Sarasota." Organic SEO targets broader keyword rankings in standard search results. Most local businesses need both — we build strategies that combine the two for maximum visibility.',
          },
          {
            question: 'What kind of reporting do you provide?',
            answer: 'You get a clear monthly report covering keyword rankings, organic traffic, conversion metrics, and a summary of work completed. No jargon, no fluff. Pro and Ultimate plans include regular calls to walk through results and discuss strategy.',
          },
          {
            question: 'Do you guarantee first-page rankings?',
            answer: 'No reputable SEO agency can guarantee specific rankings — Google controls the algorithm. What we guarantee is a transparent, data-driven process, consistent execution, and clear reporting so you always know exactly what you are getting for your investment.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}
