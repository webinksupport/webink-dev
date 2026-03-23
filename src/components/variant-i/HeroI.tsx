'use client'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const CYCLING_WORDS = ['Sarasota', 'Tampa', 'Bradenton', 'Florida']

export default function HeroI() {
  const sectionRef = useRef<HTMLElement>(null)
  const [wordIndex, setWordIndex] = useState(0)
  const [wordVisible, setWordVisible] = useState(true)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax: bg moves at 40% scroll speed
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  // Word cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % CYCLING_WORDS.length)
        setWordVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A]"
    >
      {/* Baja hero background with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 h-[130%] top-[-15%]"
        >
          <Image
            src="/images/photos/baja-beach.jpg"
            alt="Baja beach — Webink Solutions Sarasota digital marketing agency"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        {/* Dark gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
      </div>

      {/* Overlapping photoshoot images — collage feel */}
      {/* Image 1: Sean portrait — left side, offset up */}
      <motion.div
        className="absolute hidden lg:block z-10"
        style={{
          right: '18%',
          top: '12%',
          width: '220px',
          height: '300px',
        }}
        initial={{ opacity: 0, y: 40, rotate: -3, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-2xl ring-1 ring-white/10">
          <Image
            src="/images/photos/sean-portrait.jpg"
            alt="Sean Rowe, founder of Webink Solutions"
            fill
            className="object-cover object-top"
            sizes="220px"
          />
        </div>
      </motion.div>

      {/* Image 2: Team / workspace — offset lower right */}
      <motion.div
        className="absolute hidden lg:block z-10"
        style={{
          right: '7%',
          bottom: '22%',
          width: '180px',
          height: '240px',
        }}
        initial={{ opacity: 0, y: 60, rotate: 4, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, rotate: 4, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-2xl ring-1 ring-white/10">
          <Image
            src="/images/photos/team-rooftop.jpg"
            alt="Webink Solutions team"
            fill
            className="object-cover object-center"
            sizes="180px"
          />
          {/* Cyan accent bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA]" />
        </div>
      </motion.div>

      {/* Hero text content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 min-h-screen flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-20 pt-28 pb-20"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="w-10 h-[2px] bg-[#14EAEA]" />
          <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#14EAEA] uppercase">
            Digital Marketing Agency
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="font-urbanist font-black text-white leading-[0.88] mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            letterSpacing: '-0.04em',
            maxWidth: '70%',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Websites That{' '}
          <span className="relative inline-block">
            Work.
            {/* Animated scribble SVG underline */}
            <svg
              className="absolute left-0 w-full overflow-visible pointer-events-none"
              style={{ bottom: '-16px', height: '20px' }}
              viewBox="0 0 300 20"
              preserveAspectRatio="none"
            >
              <path
                d="M4 14 C40 4, 80 18, 120 10 C160 2, 200 16, 240 8 C270 3, 285 14, 296 10"
                stroke="#14EAEA"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 400,
                  strokeDashoffset: 400,
                  animation: 'scribble-draw 1s cubic-bezier(0.4,0,0.2,1) 1s forwards',
                }}
              />
            </svg>
          </span>
          <br />
          Marketing{' '}
          <span className="text-[#14EAEA]">That</span>
          <br />
          <span className="relative">
            <span className="relative inline-block">
              <span className="relative z-10 text-[#14EAEA]">Converts</span>
              <span className="absolute inset-0 -mx-1 bg-[#14EAEA]/40 origin-left animate-highlight" />
            </span>
            {' '}in{' '}
            {/* Word cycling */}
            <span
              className="inline-block text-white transition-all duration-300"
              style={{
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? 'translateY(0)' : 'translateY(-12px)',
              }}
            >
              {CYCLING_WORDS[wordIndex]}.
            </span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="font-urbanist text-white/55 text-xl leading-relaxed mb-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton. Real results, real relationships.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a
            href="#contact"
            className="magnetic-btn group relative inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 bg-white text-[#0A0A0A] rounded-full hover:bg-[#14EAEA] transition-all duration-300 shadow-lg"
          >
            Get a Free Audit
            <span className="w-6 h-6 rounded-full bg-[#14EAEA] group-hover:bg-[#0A0A0A] flex items-center justify-center transition-colors duration-300 text-xs">→</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 border-2 border-white/25 text-white rounded-full hover:border-white/60 transition-all duration-300"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="mt-16 pt-10 border-t border-white/10 flex flex-wrap gap-8 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <span className="font-urbanist text-xs text-white/25 tracking-[0.35em] uppercase">Trusted By</span>
          {['Gulf Sands Realty', 'Nathan Benderson Park', 'Brown Mechanical', 'Bradenton Classical Academy'].map((c) => (
            <span key={c} className="font-urbanist text-sm text-white/40 font-semibold">{c}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <div
          className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2"
        >
          <div
            className="w-1 h-2 bg-[#14EAEA] rounded-full"
            style={{ animation: 'scroll-dot 2s ease-in-out infinite' }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
