import Link from 'next/link'

export default function CTABannerB() {
  return (
    <section className="relative bg-[#0F0F0F] border-t border-white/[0.06] overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(20,234,234,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#14EAEA]" />
            <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
              Ready to Grow?
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-inter text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.02] tracking-tight mb-8">
            Your competitors are<br />
            already investing in<br />
            <span className="text-white/25">digital marketing.</span>
          </h2>

          {/* Body */}
          <p className="font-public-sans text-white/40 text-base lg:text-lg leading-relaxed mb-12 max-w-xl">
            Free consultation — no obligation. We&apos;ll review your current digital presence, identify the biggest opportunities, and outline a clear path to more traffic, more leads, and more revenue.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#14EAEA] text-black font-inter text-[11px] font-black px-10 py-4 tracking-[0.2em] uppercase hover:bg-[#14EAEA]/80 transition-all duration-200 rounded-full"
              style={{ boxShadow: '0 0 32px rgba(20,234,234,0.25)' }}
            >
              Book a Free Consultation
            </Link>
            <Link
              href="tel:9418401381"
              className="inline-flex items-center gap-2 border border-white/10 text-white/40 font-inter text-[11px] font-bold px-10 py-4 tracking-[0.2em] uppercase hover:border-white/30 hover:text-white/70 transition-all duration-200 rounded-lg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (941) 840-1381
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-8 border-t border-white/[0.06] pt-8">
            {[
              'No long-term contracts',
              'Transparent pricing',
              'Local Sarasota agency',
              '#1 Rated on DesignRush',
            ].map((trust) => (
              <div key={trust} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#14EAEA]" />
                <span className="font-inter text-[11px] text-white/25 tracking-wider">
                  {trust}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
