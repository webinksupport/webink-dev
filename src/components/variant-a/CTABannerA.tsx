import Link from 'next/link'

export default function CTABannerA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-[#0A0A0A]">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(20,234,234,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,234,234,1) 1px, transparent 1px), linear-gradient(to right, rgba(20,234,234,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 border border-[#14EAEA]/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
          <span className="text-xs font-semibold text-[#14EAEA] tracking-[0.15em] uppercase">
            Free Consultation
          </span>
        </div>

        <h2 className="font-syne font-extrabold text-white mb-6 leading-[1.05]"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
          Ready to{' '}
          <span
            className="text-[#14EAEA]"
            style={{ textShadow: '0 0 40px rgba(20,234,234,0.5)' }}
          >
            Grow?
          </span>
        </h2>

        <p className="text-white/50 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
          Let&apos;s build something great together. Book a free discovery call — we&apos;ll review your current 
          site, map out your goals, and create a plan that actually makes sense for your business and budget.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#14EAEA] hover:bg-[#14EAEA]/85 text-black text-sm font-bold px-9 py-4 rounded-full transition-all duration-200 hover:shadow-[0_0_40px_rgba(20,234,234,0.5)] hover:scale-105"
          >
            Get a Free Quote
          </Link>
          <Link
            href="tel:9418401381"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white text-sm font-medium px-9 py-4 rounded-full transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
            </svg>
            (941) 840-1381
          </Link>
        </div>

        {/* Trust markers */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-white/25 text-xs">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#14EAEA]/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No contracts required
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#14EAEA]/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free initial consultation
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#14EAEA]/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            #1 Rated on DesignRush
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#14EAEA]/50" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Serving Sarasota since 2018
          </div>
        </div>
      </div>
    </section>
  )
}
