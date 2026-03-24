import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'
import ServicePageLayout from '@/components/services/ServicePageLayout'

export const metadata: Metadata = {
  title: 'PPC & Paid Advertising Sarasota & Tampa | Webink Solutions',
  description:
    'Expert Google Ads and Meta advertising management in Sarasota & Tampa. Data-driven PPC campaigns that deliver real ROI.',
}

export default function PaidAdvertisingPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <ServicePageLayout
        eyebrow="Paid Advertising"
        headline="Ads That Drive"
        headlineAccent="Real ROI."
        subtext="Google Ads and Meta campaigns engineered for measurable results. We manage your ad spend like it is our own — because your growth is our growth."
        heroImage="/images/photos/workspace-laptop.jpg"
        features={[
          {
            icon: 'Target',
            title: 'Precision Targeting',
            description: 'Reach the right audience at the right time with data-driven targeting strategies across Google and Meta platforms.',
          },
          {
            icon: 'BarChart3',
            title: 'Real-Time Analytics',
            description: 'Live dashboards and conversion tracking so you always know exactly where your ad dollars are going.',
          },
          {
            icon: 'TrendingUp',
            title: 'Continuous Optimization',
            description: 'We test, refine, and optimize campaigns weekly to maximize your return on every dollar spent.',
          },
          {
            icon: 'Shield',
            title: 'Transparent Reporting',
            description: 'No hidden fees, no mystery. You see every dollar spent and every result generated in clear monthly reports.',
          },
        ]}
        processSteps={[
          {
            title: 'Strategy & Setup',
            description: 'We research your market, define your ideal customer, and build campaigns structured for maximum performance from day one.',
          },
          {
            title: 'Launch & Optimize',
            description: 'Campaigns go live with careful monitoring. We A/B test ads, refine targeting, and optimize bids in real time.',
          },
          {
            title: 'Scale & Report',
            description: 'As we identify winning strategies, we scale spend into what works. Monthly reports show clear ROI and next steps.',
          },
        ]}
        pricing={[
          {
            name: 'Paid Advertising',
            price: '',
            contactOnly: true,
            features: [
              'Google Ads management',
              'Meta (Facebook/Instagram) ads',
              'Audience research & targeting',
              'Ad creative development',
              'Conversion tracking setup',
              'Monthly performance reporting',
            ],
          },
        ]}
        pricingNote="Pricing is based on ad spend and campaign complexity. Contact us for a custom proposal."
        faqs={[
          {
            question: 'How much should I budget for paid advertising?',
            answer: 'It depends on your industry and goals, but most Sarasota businesses start with $1,500-$3,000/month in ad spend plus management fees. We will recommend a budget during our initial consultation.',
          },
          {
            question: 'How quickly will I see results from PPC?',
            answer: 'Unlike SEO, paid ads can generate traffic and leads immediately. Most campaigns start producing measurable results within the first 2-4 weeks as we optimize targeting and bidding.',
          },
          {
            question: 'Do you manage both Google and Facebook ads?',
            answer: 'Yes. We manage campaigns across Google Ads (Search, Display, Shopping, YouTube), Meta (Facebook and Instagram), and LinkedIn. We recommend the mix that makes sense for your audience.',
          },
        ]}
      />
      <FooterI />
    </main>
  )
}
