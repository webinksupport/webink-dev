import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    tagline: 'Get online, stay online.',
    price: '$31',
    period: '/month',
    setupFee: null,
    features: [
      'Managed Web Hosting',
      'SSL Certificate Included',
      'Daily Automated Backups',
      'Unlimited Bandwidth',
      '24/7 Uptime Monitoring',
      'Email Support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    highlight: false,
  },
  {
    name: 'Growth',
    tagline: 'Build your audience.',
    price: '$493',
    period: '/month',
    setupFee: '$99 setup fee',
    features: [
      'Everything in Starter',
      'Social Media Marketing',
      'Content Creation (4 posts/wk)',
      'Platform Management',
      'Monthly Analytics Report',
      'Dedicated Account Manager',
    ],
    cta: 'Start Growing',
    ctaHref: '/contact',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Authority',
    tagline: 'Dominate your market.',
    price: '$1,103',
    period: '/month',
    setupFee: '$250 setup fee',
    features: [
      'Everything in Growth',
      'Full Managed SEO',
      'Google Ads (PPC) Management',
      'Local SEO Optimization',
      'Keyword Rank Tracking',
      'Weekly Strategy Calls',
    ],
    cta: 'Become the Authority',
    ctaHref: '/contact',
    highlight: false,
  },
]

export default function PricingB() {
  return (
    <section className="bg-[#0A0A0A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#14EAEA]" />
              <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
                Pricing
              </span>
            </div>
            <h2 className="font-inter text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Transparent Pricing.<br />
              <span className="text-white/30">No Surprises.</span>
            </h2>
          </div>
          <p className="font-public-sans text-white/35 text-sm max-w-sm leading-relaxed">
            Every package is month-to-month. No long-term contracts required. Cancel or upgrade anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 border border-white/[0.08] divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 lg:p-10 flex flex-col ${plan.highlight ? 'bg-[#14EAEA]/[0.05]' : ''}`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-px left-8 bg-[#14EAEA] text-black text-[9px] font-black px-3 py-1 tracking-[0.2em] uppercase font-inter">
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <div className="font-inter text-[10px] font-bold text-white/25 tracking-[0.25em] uppercase mb-1">
                  {plan.name}
                </div>
                <div className="font-public-sans text-white/35 text-sm">{plan.tagline}</div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-inter text-4xl font-black text-white"
                  >
                    {plan.price}
                  </span>
                  <span className="font-inter text-sm text-white/30">{plan.period}</span>
                </div>
                {plan.setupFee && (
                  <div className="font-public-sans text-[11px] text-white/20 mt-1">+ {plan.setupFee}</div>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="text-[#14EAEA] mt-0.5 flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="font-public-sans text-white/45 text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`block text-center font-inter text-[11px] font-black py-3.5 tracking-[0.18em] uppercase transition-all duration-200 rounded-full ${
                  plan.highlight
                    ? 'bg-[#14EAEA] text-black hover:bg-[#14EAEA]/80'
                    : 'border border-white/15 text-white/40 hover:border-[#14EAEA]/50 hover:text-[#14EAEA]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-white/[0.06]">
          <p className="font-public-sans text-white/20 text-[12px] text-center sm:text-left">
            Need a custom package? Every business is different — let&apos;s build the right solution for yours.
          </p>
          <Link
            href="/pricing"
            className="font-inter text-[11px] font-bold text-[#14EAEA] tracking-[0.18em] uppercase hover:text-white transition-colors flex-shrink-0"
          >
            Full Pricing Calculator &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
