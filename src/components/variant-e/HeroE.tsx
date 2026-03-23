'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const cyclingWords = ['Results.', 'Clients.', 'Revenue.', 'Rankings.']

export default function HeroE() {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, -100])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % cyclingWords.length)
        setVisible(true)
      }, 350)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Full-bleed Baja hero image with parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: 'url(/baja-hero.jpg)',
          y: bgY,
          scale: 1.15,
        }}
      />
      {/* Dark overlay — stronger at top for nav readability, lighter at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80" />

      {/* Content sits at the bottom of the hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20 lg:pb-28 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="inline-block w-8 h-px bg-[#14EAEA]" />
            <span className="text-xs font-bold tracking-[0.4em] text-[#14EAEA] uppercase font-urbanist">
              Sarasota, FL — Since 2018
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-urbanist font-black leading-[0.9] text-white mb-6"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}
          >
            WEBSITES BUILT<br />
            FOR{' '}
            <span className="gradient-text-animated">
              MORE
            </span>
            <br />
            <span
              className="inline-block transition-all duration-300 text-white will-change-transform"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-12px)',
                transitionDuration: '350ms',
              }}
            >
              {cyclingWords[wordIndex]}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/70 text-xl leading-relaxed max-w-2xl mb-10 font-urbanist font-light"
          >
            We build high-performance websites and data-driven marketing campaigns for local businesses across Southwest Florida.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#14EAEA] text-black text-sm font-bold px-10 py-4 rounded-lg hover:bg-white transition-all duration-300 font-urbanist hover:scale-[1.02]"
            >
              Start Your Project
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                <path d="M3 8h10M8 3l5 5-5 5" />
              </svg>
            </Link>
            <Link
              href="#portfolio"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white text-sm font-bold px-10 py-4 rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-urbanist"
            >
              See Our Work
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <span key={i} className="text-[#F813BE] text-sm">★</span>)}
              </div>
              <span className="text-white/50 text-xs font-urbanist">Top Rated — DesignRush</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/50 text-xs font-urbanist">50+ Businesses Served</span>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-white/50 text-xs font-urbanist">Sarasota · Tampa · Bradenton</span>
          </motion.div>
        </div>
      </div>

      {/* Accent bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33] z-10" />
    </section>
  )
}
