import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    tagline: 'Get online and stay there.',
    price: '$31',
    period: '/mo',
    features: [
      'Managed Web Hosting',
      'SSL Certificate',
      'Daily Backups',
      'Email Support',
      '99.9% Uptime SLA',
    ],
    cta: 'Get Started',
    highlight: false,
    accent: '#14EAEA',
    gradient: 'linear-gradient(135deg, #14EAEA10, #14EAEA05)',
    border: 'rgba(20, 234, 234, 0.2)',
  },
  {
    name: 'Growth',
    tagline: 'Everything you need to grow.',
    price: '$493',
    period: '/mo',
    features: [
      'Everything in Starter',
      'Social Media Marketing',
      'Content Creation',
      'Monthly Performance Reports',
      'Priority Support',
      'Strategy Calls',
    ],
    cta: 'Most Popular — Start Now',
    highlight: true,
    accent: '#F813BE',
    gradient: 'linear-gradient(135deg, rgba(20, 234, 234, 0.12) 0%, rgba(248, 19, 190, 0.12) 100%)',
    border: 'transparent',
  },
  {
    name: 'Authority',
    tagline: 'Dominate your local market.',
    price: '$1,103',
    period: '/mo',
    features: [
      'Everything in Growth',
      'Full Managed SEO',
      'Google Ads Management',
      'Weekly Strategy Calls',
      'Dedicated Account Manager',
      'Competitor Analysis',
    ],
    cta: 'Get Started',
    highlight: false,
    accent: '#B9FF33',
    gradient: 'linear-gradient(135deg, #B9FF3310, #B9FF3305)',
    border: 'rgba(185, 255, 51, 0.2)',
  },
]

export default function PricingC() {
  return (
    <section className="py-28 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <span className="font-grotesk text-xs font-semibold text-white/50 tracking-widest uppercase">
              Pricing
            </span>
          </div>
          <h2 className="font-grotesk text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Simple,{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Transparent
            </span>{' '}
            Pricing.
          </h2>
          <p className="font-sans text-white/40 text-lg max-w-xl mx-auto">
            No hidden fees. No long-term contracts required. Cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-8 flex flex-col"
              style={{
                background: plan.highlight
                  ? 'linear-gradient(135deg, #0D0D0D 0%, #0D0D0D 100%)'
                  : plan.gradient,
                border: plan.highlight
                  ? '1px solid transparent'
                  : `1px solid ${plan.border}`,
                ...(plan.highlight && {
                  backgroundImage: plan.gradient,
                  boxShadow: '0 0 60px rgba(248, 19, 190, 0.15), 0 0 30px rgba(20, 234, 234, 0.1)',
                }),
              }}
            >
              {/* Gradient border for highlight card */}
              {plan.highlight && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    padding: '1px',
                    background: 'linear-gradient(135deg, #14EAEA, #F813BE)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
              )}

              {/* Popular badge */}
              {plan.highlight && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 font-grotesk text-xs font-bold px-5 py-1.5 rounded-full text-black whitespace-nowrap"
                  style={{ background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)' }}
                >
                  MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <div
                className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase mb-2"
                style={{ color: plan.accent }}
              >
                {plan.name}
              </div>
              <div className="font-sans text-white/40 text-sm mb-5">{plan.tagline}</div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span
                  className="font-grotesk text-5xl font-bold"
                  style={{
                    background: plan.highlight
                      ? 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)'
                      : 'none',
                    WebkitBackgroundClip: plan.highlight ? 'text' : 'unset',
                    WebkitTextFillColor: plan.highlight ? 'transparent' : 'white',
                    backgroundClip: plan.highlight ? 'text' : 'unset',
                    color: plan.highlight ? 'transparent' : 'white',
                  }}
                >
                  {plan.price}
                </span>
                <span className="font-sans text-white/30 text-lg">{plan.period}</span>
              </div>

              {/* Divider */}
              <div
                className="w-full h-px mb-6"
                style={{
                  background: `linear-gradient(90deg, ${plan.accent}40, transparent)`,
                }}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: plan.accent }}
                    >
                      ✓
                    </span>
                    <span className="font-sans text-white/60">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact"
                className="block text-center font-grotesk text-sm font-bold py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={
                  plan.highlight
                    ? {
                        background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                        color: '#000',
                        boxShadow: '0 0 20px rgba(20, 234, 234, 0.25)',
                      }
                    : {
                        background: 'transparent',
                        color: plan.accent,
                        border: `1px solid ${plan.accent}40`,
                      }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <p className="text-center font-sans text-white/25 text-sm mt-8">
          Custom packages available. One-time projects start at $500.{' '}
          <Link href="/pricing" className="underline hover:text-white/50 transition-colors">
            Try our pricing calculator →
          </Link>
        </p>
      </div>
    </section>
  )
}
