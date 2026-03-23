import Image from 'next/image'
import Link from 'next/link'

export default function HeroC() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black pt-20">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #14EAEA 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #F813BE 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #B9FF33 0%, transparent 70%)' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#14EAEA 1px, transparent 1px), linear-gradient(90deg, #14EAEA 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-3 mb-8 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#14EAEA', boxShadow: '0 0 8px #14EAEA' }}
              />
              <span className="font-grotesk text-xs font-semibold text-white/70 tracking-widest uppercase">
                Sarasota&apos;s Premiere Digital Agency
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-grotesk text-5xl lg:text-7xl font-bold leading-[1.0] mb-8 text-white">
              Websites{' '}
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                That Work.
              </span>
              <br />
              <span className="text-white/30">Marketing</span>
              <br />
              <span className="text-white">That Converts.</span>
            </h1>

            <p className="font-sans text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
              We build high-performance websites and run data-driven digital marketing for businesses across Sarasota, Tampa, and Bradenton, FL.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-grotesk text-sm font-bold px-8 py-4 rounded-full text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                  boxShadow: '0 0 30px rgba(20, 234, 234, 0.3)',
                }}
              >
                Start Your Project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 font-grotesk text-sm font-medium px-8 py-4 rounded-full text-white border border-white/15 hover:border-white/40 transition-all duration-200 backdrop-blur-sm"
              >
                See Our Work
              </Link>
            </div>

            {/* Mini stats row */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/10">
              {[
                { value: '6+', label: 'Years' },
                { value: '50+', label: 'Clients' },
                { value: '300%', label: 'Avg Traffic Growth' },
                { value: '#1', label: 'On DesignRush' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className="font-grotesk text-2xl font-bold"
                    style={{
                      background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="font-sans text-white/30 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Photo + floating cards */}
          <div className="relative hidden lg:block">
            {/* Main photo */}
            <div
              className="relative rounded-3xl overflow-hidden h-[580px]"
              style={{
                border: '1px solid rgba(20, 234, 234, 0.2)',
                boxShadow: '0 0 60px rgba(20, 234, 234, 0.15), 0 0 120px rgba(248, 19, 190, 0.1)',
              }}
            >
              <Image
                src="/variant-c/sean-about.jpg"
                alt="Sean Rowe — Webink Solutions Founder"
                fill
                className="object-cover object-center"
                priority
              />
              {/* Color overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                }}
              />
            </div>

            {/* Floating badge — top left */}
            <div
              className="absolute -top-4 -left-8 bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl px-5 py-4"
              style={{ boxShadow: '0 0 30px rgba(20, 234, 234, 0.15)' }}
            >
              <div className="font-grotesk text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Est.</div>
              <div
                className="font-grotesk text-3xl font-bold"
                style={{
                  background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                2019
              </div>
              <div className="font-sans text-white/30 text-xs">Sarasota, FL</div>
            </div>

            {/* Floating badge — bottom right */}
            <div
              className="absolute -bottom-4 -right-8 bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl px-5 py-4 max-w-[200px]"
              style={{ boxShadow: '0 0 30px rgba(248, 19, 190, 0.15)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#F813BE] text-xs">★</span>
                ))}
              </div>
              <div className="font-grotesk text-xs font-semibold text-white/80 leading-snug">
                &ldquo;Best agency we&apos;ve ever worked with.&rdquo;
              </div>
              <div className="font-sans text-white/30 text-xs mt-1">— Tiffini Brown</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
