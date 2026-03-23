import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    tagline: 'Get online with confidence',
    price: '$31',
    period: '/mo',
    note: 'Starting from',
    features: [
      'Managed Web Hosting',
      'SSL Certificate',
      'Daily Backups',
      'Email Support',
      'Monthly Uptime Reports',
    ],
    cta: 'Get Started',
    highlight: false,
    accentBorder: '#14EAEA',
  },
  {
    name: 'Growth',
    tagline: 'Grow your local presence',
    price: '$493',
    period: '/mo',
    note: 'Starting from',
    features: [
      'Everything in Starter',
      'Social Media Marketing',
      'Content Creation (8 posts/mo)',
      'Monthly Performance Report',
      'Priority Email & Phone Support',
      'Brand Strategy Session',
    ],
    cta: 'Most Popular — Get Started',
    highlight: true,
    accentBorder: '#14EAEA',
  },
  {
    name: 'Authority',
    tagline: 'Dominate your market',
    price: '$1,103',
    period: '/mo',
    note: 'Starting from',
    features: [
      'Everything in Growth',
      'Fully Managed SEO',
      'Google Ads Management',
      'Weekly Strategy Calls',
      'Dedicated Account Manager',
      'Competitor Intelligence Reports',
      'Conversion Rate Optimization',
    ],
    cta: 'Get Started',
    highlight: false,
    accentBorder: '#F813BE',
  },
]

export default function PricingD() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 bg-[#B9FF33]" />
          <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-sans">Pricing</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <h2 className="font-syne font-extrabold text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3rem)' }}>
            Transparent.<br />No Hidden Fees.
          </h2>
          <div className="flex items-end">
            <p className="text-[#333] text-lg leading-relaxed font-sans">
              Flat monthly pricing built for real businesses. No long-term lock-in. No surprise invoices. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="grid lg:grid-cols-3 gap-0 border-t border-l border-black/8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border-r border-b border-black/8 p-8 lg:p-10 flex flex-col ${
                plan.highlight ? 'bg-[#14EAEA]' : 'bg-white hover:bg-[#F8F8F8] transition-colors duration-200'
              }`}
            >
              {/* Recommended badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0A0A0A] text-[#14EAEA] text-xs font-bold px-4 py-1.5 tracking-widest uppercase font-sans whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className={`text-xs font-bold tracking-[0.3em] uppercase mb-1 font-sans ${plan.highlight ? 'text-black/50' : 'text-black/30'}`}>
                {plan.name}
              </div>
              <div className={`text-sm mb-6 font-sans ${plan.highlight ? 'text-black/60' : 'text-black/35'}`}>
                {plan.tagline}
              </div>

              {/* Price */}
              <div className="mb-1">
                <span className={`font-syne font-extrabold leading-none ${plan.highlight ? 'text-black' : 'text-[#0A0A0A]'}`}
                  style={{ fontSize: 'clamp(3rem, 4vw, 4rem)' }}>
                  {plan.price}
                </span>
                <span className={`text-lg font-sans ${plan.highlight ? 'text-black/50' : 'text-black/40'}`}>{plan.period}</span>
              </div>
              <div className={`text-xs font-sans mb-8 ${plan.highlight ? 'text-black/40' : 'text-black/25'}`}>{plan.note}</div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className={`text-base flex-shrink-0 mt-px ${plan.highlight ? 'text-black' : 'text-[#14EAEA]'}`}>✓</span>
                    <span className={`text-sm font-sans ${plan.highlight ? 'text-black/70' : 'text-black/55'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact"
                className={`block text-center text-sm font-bold py-4 transition-all duration-200 font-sans ${
                  plan.highlight
                    ? 'bg-black text-white hover:bg-[#333]'
                    : 'border-2 border-black/10 text-[#0A0A0A] hover:border-[#14EAEA] hover:text-[#14EAEA]'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Custom pricing note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-black/35 font-sans mb-3">
            Need a custom web design project or one-time service?
          </p>
          <Link
            href="/pricing"
            className="text-sm font-bold text-[#0A0A0A] border-b border-[#14EAEA] pb-0.5 hover:text-[#14EAEA] transition-colors font-sans"
          >
            Use Our Interactive Pricing Calculator →
          </Link>
        </div>
      </div>
    </section>
  )
}
