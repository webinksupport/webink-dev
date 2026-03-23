import Image from 'next/image'
import Link from 'next/link'

export default function HeroB() {
  return (
    <section className="relative min-h-screen bg-[#0F0F0F] overflow-hidden">
      {/* Split layout: left text, right photo */}
      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* Left — Content */}
        <div className="relative z-10 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 pt-24 pb-16 lg:pt-16">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#14EAEA]" />
            <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
              Sarasota&apos;s Premiere Digital Agency
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-inter text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-white mb-6">
            Websites That<br />
            <span className="text-white/25">Work.</span>{' '}
            <span className="relative">
              Marketing
              <span
                className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#14EAEA]"
                style={{ boxShadow: '0 0 12px rgba(20,234,234,0.6)' }}
              />
            </span>{' '}
            That<br />
            Converts.
          </h1>

          {/* Subheadline */}
          <p className="font-public-sans text-white/45 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
            Webink Solutions builds high-performance websites and runs measurable marketing campaigns for local businesses across Southwest Florida. Data-driven. Transparently priced. Built to last.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/contact"
              className="inline-flex items-center bg-[#14EAEA] text-black text-[11px] font-black px-8 py-4 tracking-[0.2em] uppercase hover:bg-[#14EAEA]/80 transition-all duration-200 font-inter"
              style={{ boxShadow: '0 0 24px rgba(20,234,234,0.25)' }}
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center border border-white/15 text-white/50 text-[11px] font-bold px-8 py-4 tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 font-inter"
            >
              See Our Work
            </Link>
          </div>

          {/* Inline stats */}
          <div className="flex gap-8 border-t border-white/[0.08] pt-8">
            {[
              { value: '6+', label: 'Years in Business' },
              { value: '50+', label: 'Clients Served' },
              { value: '300%', label: 'Avg Traffic Increase' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="font-inter text-2xl font-black text-[#14EAEA]"
                  style={{ textShadow: '0 0 16px rgba(20,234,234,0.4)' }}
                >
                  {s.value}
                </div>
                <div className="text-white/25 text-[10px] tracking-widest uppercase mt-0.5 font-inter">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Photo */}
        <div className="relative lg:min-h-screen min-h-[50vh] order-first lg:order-last">
          <Image
            src="/variant-b/hero-photo.jpg"
            alt="Webink Solutions — Professional Digital Agency"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark gradient overlay fading into left (blends with text panel) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent" />
          {/* Bottom fade on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F0F0F] lg:hidden" />
          {/* Subtle cyan accent line on right edge */}
          <div
            className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#14EAEA]/40 to-transparent"
          />
          {/* Floating badge */}
          <div className="absolute bottom-10 right-8 hidden lg:block">
            <div className="border border-[#14EAEA]/30 bg-[#0F0F0F]/80 backdrop-blur-sm px-5 py-4">
              <div className="text-[#14EAEA] text-[10px] font-bold tracking-[0.25em] uppercase mb-1 font-inter">#1 Rated</div>
              <div className="text-white text-sm font-semibold font-inter">Top Web Design</div>
              <div className="text-white/40 text-[10px] font-inter">Company in Florida</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14EAEA]/30 to-transparent" />
    </section>
  )
}
