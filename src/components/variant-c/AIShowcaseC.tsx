export default function AIShowcaseC() {
  const tools = [
    {
      icon: '🧠',
      label: 'AI-Enhanced Copy',
      desc: 'Machine learning tools train on top-converting copy in your industry. Human writers refine the output. Result: words that actually sell.',
      accent: '#14EAEA',
      glow: 'rgba(20, 234, 234, 0.2)',
    },
    {
      icon: '📈',
      label: 'Predictive SEO',
      desc: 'AI identifies keyword gaps and ranking opportunities before your competitors find them. You show up first.',
      accent: '#F813BE',
      glow: 'rgba(248, 19, 190, 0.2)',
    },
    {
      icon: '⚡',
      label: 'Smart Automation',
      desc: 'Automated content scheduling, reporting, and campaign optimization running 24/7 so your marketing never stops.',
      accent: '#B9FF33',
      glow: 'rgba(185, 255, 51, 0.2)',
    },
    {
      icon: '🎯',
      label: 'Audience Intelligence',
      desc: 'AI-driven audience segmentation for your ads. We target the exact person most likely to become your customer.',
      accent: '#14EAEA',
      glow: 'rgba(20, 234, 234, 0.2)',
    },
    {
      icon: '📊',
      label: 'Live Dashboards',
      desc: 'Real-time performance data in one place. Know exactly what\'s working and what to optimize next.',
      accent: '#F813BE',
      glow: 'rgba(248, 19, 190, 0.2)',
    },
    {
      icon: '🔮',
      label: 'Conversion Forecasting',
      desc: 'Predictive models tell us which website visitors are most likely to convert — so we optimize toward the right signals.',
      accent: '#B9FF33',
      glow: 'rgba(185, 255, 51, 0.2)',
    },
  ]

  return (
    <section className="py-28 px-6 bg-black relative overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #14EAEA44, #F813BE44, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #F813BE44, #14EAEA44, transparent)' }}
      />

      {/* Large BG text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-grotesk font-bold text-[20vw] whitespace-nowrap select-none pointer-events-none opacity-[0.025]"
        style={{
          background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        AI-POWERED
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#14EAEA', boxShadow: '0 0 6px #14EAEA' }}
            />
            <span className="font-grotesk text-xs font-semibold text-white/50 tracking-widest uppercase">
              Technology
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#F813BE', boxShadow: '0 0 6px #F813BE' }}
            />
          </div>
          <h2 className="font-grotesk text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            AI-Powered.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Human-Led.
            </span>
          </h2>
          <p className="font-sans text-lg text-white/40 max-w-2xl mx-auto">
            The same AI tools used by Fortune 500 companies — applied intelligently to local business marketing.
            <br />
            <span className="text-white/60 font-medium">Your competitors don&apos;t have this yet.</span>
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div
              key={tool.label}
              className="group relative rounded-2xl p-7 transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: '#0A0A0A',
                border: `1px solid ${tool.accent}20`,
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${tool.accent}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="text-2xl mb-5 w-12 h-12 flex items-center justify-center rounded-xl"
                style={{
                  background: `${tool.accent}10`,
                  border: `1px solid ${tool.accent}25`,
                  boxShadow: `0 0 20px ${tool.glow}`,
                }}
              >
                {tool.icon}
              </div>

              <h3
                className="font-grotesk text-lg font-bold mb-3"
                style={{ color: tool.accent }}
              >
                {tool.label}
              </h3>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className="mt-16 rounded-3xl p-10 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #14EAEA10, #F813BE10)',
            border: '1px solid rgba(20, 234, 234, 0.15)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(20, 234, 234, 0.05) 0%, transparent 70%)',
            }}
          />
          <div className="relative">
            <p className="font-sans text-white/40 text-sm uppercase tracking-widest mb-3">STAT THAT MATTERS</p>
            <p className="font-grotesk text-4xl lg:text-6xl font-bold text-white mb-3">
              93<span
                style={{
                  background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                %
              </span>
            </p>
            <p className="font-sans text-lg text-white/60 max-w-xl mx-auto">
              of consumers search online before making a purchase. We make sure they find <em>your</em> business first.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
