'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Hosting',
    tagline: 'Get online with confidence',
    startFrom: '$31/mo',
    note: 'Starter plan · Starter → Premium tiers',
    features: ['Managed hosting', 'Free SSL', 'Daily backups', 'Email support'],
    cta: 'View Plans',
  },
  {
    name: 'Social Media Marketing',
    tagline: 'Grow your local presence',
    startFrom: '$493/mo',
    note: 'Entry plan · Entry → Enterprise tiers',
    features: ['Content creation', 'Platform management', 'Monthly reports', 'Strategy sessions'],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'SEO Services',
    tagline: 'Dominate local search',
    startFrom: '$1,103/mo',
    note: 'Basic plan · Basic → Ultimate tiers',
    features: ['Fully managed SEO', 'Keyword research', 'Local optimization', 'Monthly reporting'],
    cta: 'Get Started',
  },
]

export default function PricingF() {
  return (
    <section id="pricing" className="py-24 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-xs tracking-[0.45em] text-black/25 uppercase font-urbanist mb-6">Pricing</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Transparent.<br />No surprises.
            </h2>
            <p className="text-black/40 text-base font-urbanist max-w-sm leading-relaxed">
              Month-to-month subscriptions. No lock-in contracts. Contact us for an exact quote tailored to your business.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-px bg-black/6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 lg:p-10 flex flex-col ${plan.featured ? 'bg-[#0A0A0A]' : 'bg-white'}`}
            >
              <div className={`text-xs tracking-[0.3em] uppercase font-urbanist mb-1 ${plan.featured ? 'text-[#14EAEA]' : 'text-black/25'}`}>
                {plan.featured ? '★ Most Popular' : plan.name}
              </div>
              {plan.featured && (
                <div className="font-urbanist font-black text-white text-base mb-1">{plan.name}</div>
              )}
              <div className={`text-xs mb-8 font-urbanist ${plan.featured ? 'text-white/30' : 'text-black/30'}`}>{plan.tagline}</div>

              <div className="mb-1">
                <span className={`font-urbanist font-black leading-none ${plan.featured ? 'text-white' : 'text-[#0A0A0A]'}`} style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
                  {plan.startFrom}
                </span>
              </div>
              <div className={`text-xs font-urbanist mb-8 ${plan.featured ? 'text-white/25' : 'text-black/20'}`}>
                {plan.note}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="text-[#14EAEA] text-xs">—</span>
                    <span className={`text-sm font-urbanist ${plan.featured ? 'text-white/50' : 'text-black/45'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`block text-center text-sm font-semibold py-3.5 transition-all duration-300 font-urbanist ${
                  plan.featured
                    ? 'bg-[#14EAEA] text-black hover:bg-white'
                    : 'border border-black/10 text-black/50 hover:border-black hover:text-black'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 pt-10 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <p className="text-black/30 text-sm font-urbanist">
            Need web design or paid advertising? Pricing varies by project scope.
          </p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm font-semibold text-[#14EAEA] font-urbanist hover:text-black transition-colors">
              Web Design Pricing Tool →
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-black/40 font-urbanist hover:text-black transition-colors">
              Contact for PPC Quote →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
