import Link from 'next/link'
import Image from 'next/image'

export default function CTABannerD() {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32 overflow-hidden relative">
      {/* Subtle background texture via gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] opacity-100" />

      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14EAEA] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F813BE] to-transparent opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.35em] text-white/25 uppercase font-sans">Next Step</span>
            </div>

            <h2 className="font-syne font-extrabold text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to Grow<br />
              Your <span className="text-[#14EAEA]">Business?</span>
            </h2>

            <p className="text-white/40 text-lg leading-relaxed font-sans mb-10 max-w-lg">
              Free consultation. We&apos;ll review your website, identify your biggest growth opportunities, and build a clear roadmap — no pressure, no obligation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-block border-2 border-[#14EAEA] text-[#14EAEA] text-sm font-bold px-8 py-4 hover:bg-[#14EAEA] hover:text-black transition-all duration-200 font-sans"
              >
                Get a Free Consultation
              </Link>
              <a
                href="tel:9418401381"
                className="inline-block border-2 border-white/10 text-white/40 text-sm font-bold px-8 py-4 hover:border-white/30 hover:text-white transition-all duration-200 font-sans"
              >
                Call (941) 840-1381
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-white/8">
              {[
                { icon: '★', text: 'Top Rated on DesignRush' },
                { icon: '✦', text: '50+ Businesses Served' },
                { icon: '⊙', text: 'Sarasota, FL Based' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2">
                  <span className="text-[#14EAEA] text-sm">{t.icon}</span>
                  <span className="text-white/30 text-xs font-sans">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — photo */}
          <div className="relative hidden lg:block">
            <div className="relative h-[440px]">
              <Image
                src="/variant-d/team-workspace.jpg"
                alt="Webink Solutions team at work"
                fill
                className="object-cover"
                sizes="50vw"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-[#0A0A0A]/30" />
              {/* Cyan border accent */}
              <div className="absolute top-0 left-0 w-full h-full border border-white/10" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-[#14EAEA] p-6 min-w-[200px]">
              <div className="font-syne text-3xl font-extrabold text-black">Free</div>
              <div className="text-black/60 text-sm font-sans mt-0.5">Discovery Call — No Obligation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
