'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Hosting',
    tagline: 'Get online with confidence',
    startFrom: '$31',
    period: '/mo',
    badge: null,
    features: [
      'Managed Web Hosting',
      'Free SSL Certificate',
      'Daily Automated Backups',
      'Email Hosting Included',
      'Monthly Uptime Reports',
      'Starter → Premium tiers',
    ],
    cta: 'View Hosting Plans',
    highlight: false,
    accent: '#14EAEA',
  },
  {
    name: 'Social Media',
    tagline: 'Grow your local presence',
    startFrom: '$493',
    period: '/mo',
    badge: 'Most Popular',
    features: [
      'Custom content creation',
      'Multi-platform management',
      'Monthly performance reports',
      'Priority phone & email support',
      'Brand strategy session',
      'Entry → Enterprise tiers',
    ],
    cta: 'Get Started',
    highlight: true,
    accent: '#14EAEA',
  },
  {
    name: 'SEO',
    tagline: 'Dominate local search',
    startFrom: '$1,103',
    period: '/mo',
    badge: null,
    features: [
      'Fully managed SEO campaign',
      'Keyword research & strategy',
      'On-page + local optimization',
      'Transparent monthly reporting',
      'Google Business Profile',
      'Basic → Ultimate tiers',
    ],
    cta: 'Get Started',
    highlight: false,
    accent: '#F813BE',
  },
]

export default function PricingE() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[#B9FF33]" />
            <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-urbanist">Pricing</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)' }}>
              Transparent.<br />
              <span className="text-[#14EAEA]">No Hidden Fees.</span>
            </h2>
            <div className="flex items-end">
              <p className="text-[#333] text-lg leading-relaxed font-urbanist">
                Flat monthly pricing for real businesses. No lock-in contracts. No surprise invoices. Contact us for a personalized quote.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative flex flex-col p-8 lg:p-10 ${
                plan.highlight
                  ? 'bg-[#0A0A0A] text-white'
                  : 'bg-[#F5F5F5] text-[#0A0A0A] hover:bg-white hover:shadow-md transition-all duration-300'
              }`}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: plan.accent }} />

              {plan.badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 tracking-widest uppercase font-urbanist whitespace-nowrap"
                  style={{ background: plan.accent, color: '#000' }}
                >
                  {plan.badge}
                </div>
              )}

              <div className={`text-xs font-bold tracking-[0.3em] uppercase mb-1 font-urbanist ${plan.highlight ? 'text-white/40' : 'text-black/30'}`}>
                {plan.name}
              </div>
              <div className={`text-sm mb-6 font-urbanist ${plan.highlight ? 'text-white/50' : 'text-black/40'}`}>
                {plan.tagline}
              </div>

              <div className="mb-1 flex items-baseline gap-1.5">
                <span className={`text-xs font-urbanist ${plan.highlight ? 'text-white/40' : 'text-black/30'}`}>from</span>
                <span
                  className="font-urbanist font-black leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: plan.highlight ? '#fff' : '#0A0A0A' }}
                >
                  {plan.startFrom}
                </span>
                <span className={`text-base font-urbanist ${plan.highlight ? 'text-white/40' : 'text-black/35'}`}>{plan.period}</span>
              </div>
              <div className={`text-xs font-urbanist mb-8 ${plan.highlight ? 'text-white/30' : 'text-black/25'}`}>
                Contact for exact quote
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="text-sm flex-shrink-0 mt-px" style={{ color: plan.accent }}>✓</span>
                    <span className={`text-sm font-urbanist ${plan.highlight ? 'text-white/60' : 'text-black/55'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center text-sm font-bold py-4 transition-all duration-200 font-urbanist border-2 ${
                  plan.highlight
                    ? 'border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-black'
                    : 'border-black/10 text-[#0A0A0A] hover:border-black hover:bg-black hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* PPC + web design note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 grid md:grid-cols-2 gap-4"
        >
          <div className="border border-black/8 p-6 flex items-center justify-between bg-[#F5F5F5]">
            <div>
              <div className="font-urbanist font-bold text-[#0A0A0A] text-sm mb-1">Paid Advertising (PPC)</div>
              <div className="text-black/40 text-xs font-urbanist">Google Ads · Facebook · Instagram — custom campaigns</div>
            </div>
            <Link href="/contact" className="text-xs font-bold text-[#14EAEA] font-urbanist whitespace-nowrap ml-4">Contact for Pricing →</Link>
          </div>
          <div className="border border-black/8 p-6 flex items-center justify-between bg-[#F5F5F5]">
            <div>
              <div className="font-urbanist font-bold text-[#0A0A0A] text-sm mb-1">Custom Web Design</div>
              <div className="text-black/40 text-xs font-urbanist">Full website builds — use our interactive pricing tool</div>
            </div>
            <Link href="/pricing" className="text-xs font-bold text-[#F813BE] font-urbanist whitespace-nowrap ml-4">Try Pricing Tool →</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
