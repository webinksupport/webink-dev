import Link from 'next/link'

export default function CTABannerC() {
  return (
    <section className="py-28 px-6 relative overflow-hidden bg-black">
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 234, 234, 0.12) 0%, rgba(0,0,0,0) 40%, rgba(248, 19, 190, 0.12) 100%)',
        }}
      />

      {/* Gradient border top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #14EAEA80, #F813BE80, transparent)' }}
      />

      {/* Large BG glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(20, 234, 234, 0.08) 0%, rgba(248, 19, 190, 0.06) 50%, transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-8 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#14EAEA', boxShadow: '0 0 8px #14EAEA' }}
          />
          <span className="font-grotesk text-xs font-semibold text-white/60 tracking-widest uppercase">
            Let&apos;s Work Together
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-grotesk text-5xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="text-white">Ready to Grow</span>
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Business?
          </span>
        </h2>

        <p className="font-sans text-lg text-white/50 leading-relaxed mb-12 max-w-2xl mx-auto">
          Free consultation. We&apos;ll build you a clear digital roadmap on our first call —
          no fluff, no pressure, no obligation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 font-grotesk text-base font-bold px-10 py-5 rounded-full text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
              boxShadow: '0 0 40px rgba(20, 234, 234, 0.25), 0 0 20px rgba(248, 19, 190, 0.15)',
            }}
          >
            Get a Free Quote
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link
            href="tel:9418401381"
            className="inline-flex items-center gap-3 font-grotesk text-base font-medium px-10 py-5 rounded-full text-white border border-white/15 hover:border-white/40 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
              <path d="M2 3.5C2 2.67 2.67 2 3.5 2h2.585c.351 0 .664.207.795.527l1.2 3a.875.875 0 01-.196.947L6.97 7.386a.125.125 0 00-.023.139A9.25 9.25 0 0010.475 11l.91-.914a.875.875 0 01.947-.196l3 1.2c.32.131.527.444.527.795V14.5c0 .83-.672 1.5-1.5 1.5A13.5 13.5 0 012 2.5v1z" clipRule="evenodd" fillRule="evenodd"/>
            </svg>
            (941) 840-1381
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 text-white/25 text-xs font-sans">
          <span>✓ No long-term contracts</span>
          <span>✓ Free 30-min strategy call</span>
          <span>✓ Sarasota-based team</span>
          <span>✓ #1 Rated on DesignRush</span>
        </div>
      </div>
    </section>
  )
}
