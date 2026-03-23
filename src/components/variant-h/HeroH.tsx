'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroH() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax: background image moves slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  // Portrait image moves slightly
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -60])
  // Text fades out as you scroll
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY2 = useTransform(scrollYProgress, [0, 0.6], [0, -60])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Full-width Baja background — parallax slower than scroll */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-[-20%] top-0">
          <Image
            src="/images/photos/baja-beach.jpg"
            alt="Baja beach"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          {/* Left: Massive editorial headline */}
          <motion.div
            style={{ opacity: textOpacity, y: textY2 }}
            className="lg:col-span-8"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-10">
              <span className="w-12 h-[2px] bg-[#14EAEA]" />
              <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#14EAEA] uppercase">
                Sarasota, Florida · Est. 2020
              </span>
            </div>

            {/* Ultra-bold headline — the text IS the design */}
            <h1
              className="font-urbanist font-black text-white leading-[0.85] mb-10"
              style={{
                fontSize: 'clamp(4.5rem, 12vw, 11rem)',
                letterSpacing: '-0.04em',
              }}
            >
              WEB<br />
              <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
                DESIGN
              </span><br />
              THAT<br />
              <span className="text-[#14EAEA]">SELLS.</span>
            </h1>

            <div className="flex flex-wrap items-start gap-10 mb-12">
              <p className="font-urbanist text-white/55 text-lg leading-relaxed max-w-lg">
                We build high-performance websites and data-driven marketing campaigns. Local expertise. World-class execution.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link
                href="/contact"
                className="font-urbanist font-black text-sm px-10 py-5 bg-[#14EAEA] text-black hover:bg-white transition-all duration-300 tracking-wider uppercase"
              >
                Start a Project
              </Link>
              <Link
                href="/portfolio"
                className="font-urbanist font-black text-sm px-10 py-5 border-2 border-white/30 text-white hover:border-[#14EAEA] hover:text-[#14EAEA] transition-all duration-300 tracking-wider uppercase"
              >
                Our Work →
              </Link>
            </div>
          </motion.div>

          {/* Right: Portrait of Sean overlapping hero — offset positioning */}
          <motion.div
            style={{ y: portraitY }}
            className="lg:col-span-4 hidden lg:block relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative h-[480px] w-full overflow-hidden">
              <Image
                src="/images/photos/sean-hero.jpg"
                alt="Sean Brennan — Webink Founder"
                fill
                className="object-cover object-top"
                sizes="30vw"
              />
              {/* Cyan frame accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA]" />
              <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#14EAEA]" />
            </div>

            {/* Caption */}
            <div className="mt-3 text-right">
              <p className="font-urbanist text-xs text-white/30 tracking-wider">Sean Brennan · Founder</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-6 items-center"
        >
          <span className="font-urbanist text-xs text-white/30 tracking-[0.3em] uppercase">Trusted By</span>
          <div className="flex gap-8 flex-wrap">
            {['Gulf Sands Realty', 'Nathan Benderson Park', 'Brown Mechanical', 'Bradenton Classical'].map((c) => (
              <span key={c} className="font-urbanist text-sm text-white/40 font-semibold">{c}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-10 right-10 z-10 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="font-urbanist text-xs text-white/25 tracking-[0.4em] uppercase rotate-90 mb-4">Scroll</span>
        <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#14EAEA] origin-top" style={{ animation: 'scroll-line 2s ease-in-out infinite' }} />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>
    </section>
  )
}
