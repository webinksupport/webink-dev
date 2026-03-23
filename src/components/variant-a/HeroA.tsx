'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroA() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -80])

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#0A0A0A]">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(20,234,234,1) 1px, transparent 1px), linear-gradient(to right, rgba(20,234,234,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Radial glow – cyan top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #14EAEA 0%, transparent 70%)' }} />
      {/* Radial glow – pink bottom left */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F813BE 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

        {/* Left — Text */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-[#14EAEA]/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
            <span className="text-xs font-semibold text-[#14EAEA] tracking-[0.15em] uppercase">
              Sarasota&apos;s Premiere Digital Agency
            </span>
          </div>

          {/* H1 */}
          <h1 className="font-syne font-extrabold leading-[1.03] mb-6">
            <span className="block text-white text-5xl md:text-6xl lg:text-7xl">Websites</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              That <span className="text-[#14EAEA]" style={{ textShadow: '0 0 30px rgba(20,234,234,0.5)' }}>Work.</span>
            </span>
            <span className="block text-white/35 text-3xl md:text-4xl lg:text-5xl mt-2">Marketing That</span>
            <span className="block text-[#F813BE] text-3xl md:text-4xl lg:text-5xl"
              style={{ textShadow: '0 0 25px rgba(248,19,190,0.4)' }}>
              Converts.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg">
            We build high-performance websites and run data-driven marketing campaigns for local businesses in
            Sarasota, Tampa & Bradenton — with structure, process, and real results.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#14EAEA] hover:bg-[#14EAEA]/85 text-black text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-[0_0_30px_rgba(20,234,234,0.55)] hover:scale-[1.03]"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-[#14EAEA]/60 text-white/75 hover:text-[#14EAEA] text-sm font-medium px-8 py-3.5 rounded-full transition-all duration-200"
            >
              See Our Work →
            </Link>
          </div>

          {/* Mini stats */}
          <div className="flex gap-10 pt-8 border-t border-white/10">
            {[
              { val: '6+', label: 'Years in Business' },
              { val: '50+', label: 'Clients Served' },
              { val: '300%', label: 'Avg Traffic Increase' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-syne text-2xl font-bold text-[#14EAEA]">{s.val}</div>
                <div className="text-xs text-white/35 mt-0.5 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image card with parallax */}
        <motion.div className="relative mt-8 md:mt-0 will-change-transform" style={{ y: heroY }}>
          {/* Main photo */}
          <div className="relative rounded-2xl overflow-hidden border border-[#14EAEA]/20 shadow-xl">
            <Image
              src="/variant-a/sean-hero.jpg"
              alt="Sean Rowe — Founder, Webink Solutions"
              width={600}
              height={720}
              className="w-full object-cover rounded-2xl"
              style={{ objectPosition: 'center top', maxHeight: '580px' }}
              priority
            />
            {/* Gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
            {/* Inner glow border */}
            <div className="absolute inset-0 rounded-2xl border border-[#14EAEA]/20 pointer-events-none" />
          </div>

          {/* Floating stat card — bottom left */}
          <div className="absolute -bottom-5 -left-5 bg-[#0D0D0D] border border-[#14EAEA]/30 rounded-xl p-4 shadow-2xl z-20 will-change-transform">
            <div className="font-syne text-3xl font-bold text-[#14EAEA]">300%</div>
            <div className="text-xs text-white/45 mt-0.5 tracking-wide">Avg Traffic Increase</div>
          </div>

          {/* Floating badge — top right */}
          <div className="absolute -top-3 -right-3 bg-[#F813BE] rounded-xl px-4 py-2 shadow-2xl z-20 will-change-transform">
            <div className="text-xs font-bold text-white leading-tight">#1 Rated</div>
            <div className="text-[10px] text-white/80">on DesignRush</div>
          </div>

          {/* Subtle cyan line accent */}
          <div className="absolute left-0 top-1/4 w-1 h-1/2 rounded-full bg-gradient-to-b from-transparent via-[#14EAEA]/40 to-transparent -translate-x-3" />
        </motion.div>
      </div>
    </section>
  )
}
