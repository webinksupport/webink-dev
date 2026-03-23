import Image from 'next/image'
import Link from 'next/link'

export default function HeroD() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[85vh] items-stretch">

          {/* Left — copy */}
          <div className="flex flex-col justify-center py-16 lg:py-20 lg:pr-16">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-sans">
                Sarasota, FL — Since 2020
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-syne font-extrabold leading-[0.92] text-[#0A0A0A] mb-6" style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)' }}>
              WEBSITES<br />
              THAT <span className="text-[#14EAEA]">WORK.</span><br />
              <span className="text-[#0A0A0A]">MARKETING</span><br />
              <span className="text-[#F813BE]">THAT CONVERTS.</span>
            </h1>

            {/* Subheading */}
            <p className="text-[#333] text-lg leading-relaxed max-w-lg mb-8 font-sans">
              We build high-performance websites and run data-driven marketing campaigns for local businesses across Southwest Florida. No fluff — just results.
            </p>

            {/* Trust badge */}
            <div className="flex items-center gap-2 mb-10">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-[#F813BE] text-base">★</span>
                ))}
              </div>
              <span className="text-xs text-black/40 font-sans">Top Web Design Company — DesignRush 2025</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-block bg-[#0A0A0A] text-white text-sm font-bold px-10 py-4 hover:bg-[#14EAEA] hover:text-black transition-all duration-300 font-sans"
              >
                Start Your Project →
              </Link>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 text-sm font-bold text-black/40 hover:text-black px-2 py-4 border-b-2 border-transparent hover:border-[#14EAEA] transition-all duration-200 font-sans"
              >
                See Our Work
              </a>
            </div>
          </div>

          {/* Right — photo */}
          <div className="relative hidden lg:block">
            {/* Main photo */}
            <div className="absolute inset-0 right-[-2rem]">
              <Image
                src="/variant-d/sean-hero.jpg"
                alt="Sean Rowe — Webink Solutions Founder"
                fill
                className="object-cover object-center"
                priority
                sizes="50vw"
              />
              {/* Subtle gradient overlay on left edge to blend with white */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-24" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute top-12 left-0 bg-white border border-black/8 shadow-lg p-5 z-10 min-w-[160px]">
              <div className="font-syne text-3xl font-extrabold text-[#0A0A0A]">50+</div>
              <div className="text-xs text-black/40 mt-1 font-sans uppercase tracking-wider">Clients Served</div>
            </div>

            <div className="absolute bottom-16 left-6 bg-[#14EAEA] p-5 z-10 min-w-[150px]">
              <div className="font-syne text-3xl font-extrabold text-black">300%</div>
              <div className="text-xs text-black/60 mt-1 font-sans uppercase tracking-wider">Avg Traffic Lift</div>
            </div>

            {/* Cyan accent bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA] z-10" />
          </div>
        </div>
      </div>

      {/* Mobile photo strip */}
      <div className="lg:hidden relative h-72 mt-4">
        <Image
          src="/variant-d/sean-hero.jpg"
          alt="Sean Rowe — Webink Solutions Founder"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA]" />
      </div>
    </section>
  )
}
