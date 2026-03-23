'use client'
import Link from 'next/link'

// SVG scribble underline — draws in via CSS stroke-dashoffset
function ScribbleUnderline({ color = '#14EAEA' }: { color?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: '-14px',
        left: 0,
        width: '100%',
        height: '18px',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <path
        d="M4 10 Q30 4, 60 11 Q90 18, 120 9 Q150 2, 180 11 Q210 18, 240 8 Q270 2, 296 12"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: 400,
          strokeDashoffset: 400,
          animation: 'scribble-draw 1s cubic-bezier(0.4,0,0.2,1) 0.6s forwards',
        }}
      />
    </svg>
  )
}

export default function HeroF() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Full-bleed Baja hero */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/baja-hero.jpg)' }}
      />
      {/* Cleaner, lighter overlay for a more editorial feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

      {/* Minimal centered content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-12 text-center">
        {/* Eyebrow — very minimal */}
        <p
          className="text-xs tracking-[0.5em] text-white/50 uppercase font-urbanist mb-10"
          style={{ animation: 'fadeInUp 0.6s ease 0.2s both' }}
        >
          Sarasota, Florida
        </p>

        {/* Headline with scribble on key word */}
        <h1
          className="font-urbanist font-black text-white leading-[0.92] mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8rem)',
            animation: 'fadeInUp 0.7s ease 0.35s both',
          }}
        >
          DESIGN THAT<br />
          <span className="relative inline-block">
            CONVERTS
            <ScribbleUnderline color="#14EAEA" />
          </span>
        </h1>

        <p
          className="text-white/55 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-12 font-urbanist font-light"
          style={{ animation: 'fadeInUp 0.7s ease 0.5s both' }}
        >
          Web design, SEO, and digital marketing for local businesses across Southwest Florida. Built to perform.
        </p>

        {/* Single, minimal CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'fadeInUp 0.6s ease 0.65s both' }}
        >
          <Link
            href="/contact"
            className="inline-block text-sm font-semibold px-10 py-4 bg-white text-black hover:bg-[#14EAEA] transition-all duration-400 font-urbanist tracking-wide"
          >
            Start a Project
          </Link>
          <Link
            href="#services"
            className="text-sm text-white/50 hover:text-white transition-colors font-urbanist tracking-widest uppercase"
          >
            Explore ↓
          </Link>
        </div>
      </div>

      {/* Bottom metadata strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-8 pb-8 flex items-end justify-between">
          <div className="flex gap-6">
            <div className="text-center">
              <div className="font-urbanist font-black text-white text-2xl leading-none">50+</div>
              <div className="text-white/35 text-xs font-urbanist mt-1 tracking-wider">Clients</div>
            </div>
            <div className="w-px h-10 bg-white/15 self-center" />
            <div className="text-center">
              <div className="font-urbanist font-black text-white text-2xl leading-none">6+</div>
              <div className="text-white/35 text-xs font-urbanist mt-1 tracking-wider">Years</div>
            </div>
            <div className="w-px h-10 bg-white/15 self-center" />
            <div className="text-center">
              <div className="font-urbanist font-black text-[#14EAEA] text-2xl leading-none">#1</div>
              <div className="text-white/35 text-xs font-urbanist mt-1 tracking-wider">DesignRush FL</div>
            </div>
          </div>
          <div className="hidden md:block text-white/20 text-xs font-urbanist tracking-[0.3em] uppercase">
            Rethink Design
          </div>
        </div>
        {/* Single cyan accent line — the only color */}
        <div className="h-[2px] bg-[#14EAEA]" />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
