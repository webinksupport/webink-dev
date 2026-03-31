'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Web Hosting',
    tagline: 'Always online, always fast.',
    from: '$31',
    period: '/mo',
    features: [
      'Managed cloud hosting',
      'SSL certificate included',
      'Daily backups',
      'Unlimited bandwidth',
      'Email accounts',
      '24/7 technical support',
    ],
    cta: 'Get Started',
    href: '/services/web-hosting',
    featured: false,
    accentColor: '#14EAEA',
  },
  {
    name: 'Social Media Marketing',
    tagline: 'Content that converts.',
    from: '$493',
    period: '/mo',
    features: [
      'Custom content strategy',
      'Branded post creation',
      'Platform management',
      'Engagement monitoring',
      'Monthly analytics report',
      'Paid ad management option',
    ],
    cta: 'Start Growing',
    href: '/services/social-media',
    featured: true,
    accentColor: '#F813BE',
  },
  {
    name: 'Fully Managed SEO',
    tagline: 'Rank higher. Get found.',
    from: '$1,103',
    period: '/mo',
    features: [
      'Keyword research & strategy',
      'On-page optimization',
      'Local SEO + Google Business',
      'Technical SEO audits',
      'Monthly ranking reports',
      'Competitor analysis',
    ],
    cta: 'Rank Higher',
    href: '/services/seo',
    featured: false,
    accentColor: '#B9FF33',
  },
]

export default function PricingI({ content }: { content?: Record<string, string> } = {}) {
  return (
    <section id="pricing" className="bg-[#F8F8F8] py-24 lg:py-36 border-y border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-[#F813BE]" />
            <span className="font-urbanist text-xs font-black tracking-[0.5em] text-black/30 uppercase">Pricing</span>
            <span className="w-8 h-[2px] bg-[#F813BE]" />
          </div>
          <h2
            data-block="pricing_heading"
            className="font-urbanist font-black text-[#0A0A0A] leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.04em' }}
          >
            {content?.pricing_heading || 'Transparent Pricing. Real Results.'}
          </h2>
          <p
            data-block="pricing_subtext"
            className="font-urbanist text-[#0A0A0A]/50 text-lg max-w-xl mx-auto leading-relaxed"
          >
            {content?.pricing_subtext || 'No hidden fees. No lock-in contracts. Month-to-month flexibility with agency-grade results.'}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 70, rotateY: i === 0 ? 8 : i === 2 ? -8 : 0, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: plan.featured ? 1.05 : 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.95, delay: i * 0.12, ease: [0.2, 1, 0.2, 1] }}
              style={{ perspective: '1200px', willChange: 'transform, opacity' }}
              className={`relative flex flex-col rounded-2xl ${
                plan.featured
                  ? 'bg-[#0A0A0A] shadow-2xl scale-105 ring-2 ring-[#F813BE]/50'
                  : 'bg-white border border-black/8 shadow-sm'
              }`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="font-urbanist font-bold text-xs px-4 py-1.5 rounded-full bg-[#F813BE] text-white tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                {/* Accent top line */}
                <div
                  className="w-10 h-1 rounded-full mb-6"
                  style={{ backgroundColor: plan.accentColor }}
                />

                <div className="mb-6">
                  <div
                    className={`font-urbanist font-black text-xl mb-1 ${plan.featured ? 'text-white' : 'text-[#0A0A0A]'}`}
                  >
                    {plan.name}
                  </div>
                  <div
                    className={`font-urbanist text-sm ${plan.featured ? 'text-white/40' : 'text-[#0A0A0A]/40'}`}
                  >
                    {plan.tagline}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className={`font-urbanist font-black leading-none ${plan.featured ? 'text-white' : 'text-[#0A0A0A]'}`}
                    style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}
                  >
                    {plan.from}
                  </span>
                  <span className={`font-urbanist text-base ml-1 ${plan.featured ? 'text-white/40' : 'text-[#0A0A0A]/40'}`}>
                    {plan.period}
                  </span>
                  <div className={`font-urbanist text-xs mt-1 ${plan.featured ? 'text-white/25' : 'text-[#0A0A0A]/30'}`}>
                    Starting price · custom quotes available
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${plan.accentColor}25` }}
                      >
                        <Check size={11} style={{ color: plan.accentColor === '#B9FF33' ? '#4A7C10' : plan.accentColor }} strokeWidth={3} />
                      </span>
                      <span className={`font-urbanist text-sm leading-relaxed ${plan.featured ? 'text-white/60' : 'text-[#0A0A0A]/55'}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.href}
                  className="block text-center font-urbanist font-bold text-sm py-4 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: plan.featured ? plan.accentColor : '#0A0A0A',
                    color: plan.featured ? '#0A0A0A' : '#fff',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = plan.accentColor
                    if (!plan.featured) (e.target as HTMLElement).style.color = '#0A0A0A'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = plan.featured ? plan.accentColor : '#0A0A0A'
                    if (!plan.featured) (e.target as HTMLElement).style.color = '#fff'
                  }}
                >
                  {plan.cta} →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p
            data-page="home"
            data-block="pricing_bottom_note"
            className="font-urbanist text-[#0A0A0A]/40 text-sm mb-4"
          >
            {content?.pricing_bottom_note || 'Need something custom? Web design projects start at a one-time investment.'}
          </p>
          <a
            href="/contact"
            className="font-urbanist font-bold text-sm text-[#0A0A0A] border-b-2 border-[#14EAEA] pb-0.5 hover:text-[#14EAEA] transition-colors"
          >
            <span
              data-page="home"
              data-block="pricing_bottom_cta"
            >
              {content?.pricing_bottom_cta || 'Get a Custom Quote →'}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
