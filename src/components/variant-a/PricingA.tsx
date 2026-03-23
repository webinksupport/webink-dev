import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    tagline: 'Get your digital foundation right',
    price: '$31',
    period: '/mo',
    note: 'Starting from',
    highlight: false,
    accent: '#14EAEA',
    features: [
      'Managed Web Hosting',
      'SSL Certificate (HTTPS)',
      'Daily Automated Backups',
      'Unlimited Bandwidth',
      '24/7 Email Support',
      'Free Domain Migration',
    ],
    cta: 'Get Started',
    ctaHref: '/services/web-hosting',
  },
  {
    name: 'Growth',
    tagline: 'Grow your audience and revenue',
    price: '$493',
    period: '/mo',
    note: 'Starting from',
    highlight: true,
    accent: '#14EAEA',
    features: [
      'Everything in Starter',
      'Social Media Marketing',
      'Content Creation & Scheduling',
      'Monthly Performance Reports',
      'Google Business Optimization',
      'Priority Support',
    ],
    cta: 'Start Growing',
    ctaHref: '/contact',
    badge: 'MOST POPULAR',
  },
  {
    name: 'Authority',
    tagline: 'Dominate your local market',
    price: '$1,103',
    period: '/mo',
    note: 'Starting from',
    highlight: false,
    accent: '#F813BE',
    features: [
      'Everything in Growth',
      'Fully Managed SEO',
      'Google Ads Management',
      'Dedicated Account Manager',
      'Weekly Strategy Calls',
      'Custom Reporting Dashboard',
    ],
    cta: 'Scale Up',
    ctaHref: '/contact',
  },
]

export default function PricingA() {
  return (
    <section className="py-28 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-semibold tracking-[0.18em] text-[#14EAEA] uppercase mb-3">Simple Pricing</div>
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">
            Transparent. Flexible.{' '}
            <span className="text-[#14EAEA]">Built for Small Business.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-2xl mx-auto">
            No hidden fees. No long-term lock-in. Just results. Use our{' '}
            <Link href="/pricing" className="text-[#14EAEA] hover:text-[#14EAEA]/80 underline underline-offset-2">
              interactive pricing tool
            </Link>{' '}
            to get a custom quote in 2 minutes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 relative flex flex-col ${
                plan.highlight
                  ? 'bg-[#14EAEA] text-black shadow-[0_0_60px_rgba(20,234,234,0.25)]'
                  : 'border border-white/10 text-white hover:border-white/20 transition-colors'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F813BE] text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full tracking-widest shadow-[0_0_20px_rgba(248,19,190,0.5)]">
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className={`font-syne text-xs font-extrabold tracking-[0.18em] uppercase mb-1 ${plan.highlight ? 'text-black/50' : 'text-[#14EAEA]'}`}>
                {plan.name}
              </div>
              <div className={`text-sm mb-6 ${plan.highlight ? 'text-black/60' : 'text-white/40'}`}>
                {plan.tagline}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className={`text-xs mb-1 ${plan.highlight ? 'text-black/50' : 'text-white/30'}`}>{plan.note}</div>
                <div className="font-syne font-extrabold leading-none">
                  <span style={{ fontSize: '3rem' }}>{plan.price}</span>
                  <span className={`text-xl font-normal ${plan.highlight ? 'text-black/50' : 'text-white/40'}`}>{plan.period}</span>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px mb-6 ${plan.highlight ? 'bg-black/15' : 'bg-white/10'}`} />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-black' : 'text-[#14EAEA]'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={plan.highlight ? 'text-black/80' : 'text-white/60'}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`block text-center text-sm font-bold py-3.5 rounded-full transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-black text-[#14EAEA] hover:bg-black/80'
                    : 'border border-white/15 hover:border-[#14EAEA]/50 text-white hover:text-[#14EAEA] hover:bg-[#14EAEA]/5'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-white/35 text-sm mb-4">Need something custom? We work with businesses of all sizes.</p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-[#14EAEA] text-sm font-semibold hover:text-white transition-colors"
          >
            Use our interactive pricing calculator →
          </Link>
        </div>
      </div>
    </section>
  )
}
