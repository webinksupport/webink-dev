'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function HeroI() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -60])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#0F0F0F]"
    >
      {/* Baja beach full-bleed background with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 h-[130%] top-[-15%]"
        >
          <Image
            src="/images/photos/baja-beach.jpg"
            alt="Baja beach — Webink Solutions Sarasota digital marketing"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>
        {/* Single clean dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Subtle gradient — darker bottom for strip transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
      </div>

      {/* Hero text content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 min-h-screen flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-20 pt-32 pb-48"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="w-8 h-[2px] bg-[#14EAEA]" />
          <span className="font-urbanist text-xs font-black tracking-[0.5em] text-white/60 uppercase">
            Sarasota Digital Marketing Agency
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="font-urbanist font-black text-white leading-[0.88] mb-8"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            letterSpacing: '-0.04em',
            maxWidth: '55%',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Websites That{' '}
          <span className="relative inline-block">
            Work.
            {/* Single cyan highlight sweep */}
            <span
              className="absolute inset-x-0 bottom-0 h-[8px] bg-[#14EAEA] origin-left"
              style={{ animation: 'highlightSweep 0.7s cubic-bezier(0.4,0,0.2,1) 1.1s forwards', transform: 'scaleX(0)', bottom: '6px' }}
            />
          </span>
          <br />
          Marketing That
          <br />
          Converts.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="font-urbanist text-white/55 text-xl leading-relaxed mb-12 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa &amp; Bradenton. Real results, real relationships.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 bg-[#14EAEA] text-[#0F0F0F] rounded-full hover:bg-white transition-all duration-300 shadow-lg"
          >
            Get a Free Audit →
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 border-2 border-white/25 text-white rounded-full hover:border-white/60 transition-all duration-300"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Baja landscape photo — large, right side, elegant entrance */}
        <motion.div
          className="absolute hidden lg:block z-10"
          style={{ right: '6%', top: '50%', transform: 'translateY(-50%)', width: '420px', height: '560px' }}
          initial={{ opacity: 0, scale: 0.9, rotate: -2, x: 60 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="relative w-full h-full"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
            }}
          >
            <Image
              src="/images/photos/baja-6.jpg"
              alt="Baja California beach — inspiring digital work from anywhere"
              fill
              priority
              className="object-cover object-center"
              sizes="420px"
            />
            {/* Subtle cyan accent bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA]" />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </motion.div>
      </motion.div>

      {/* Sub-hero info strip — anchored to bottom of hero */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4 flex flex-wrap items-center gap-0 divide-x divide-white/10">
            {[
              'Sarasota & Tampa Digital Marketing',
              'AI-Powered Results',
              'Free Consultation →',
            ].map((item, i) => (
              <span
                key={i}
                className={`font-urbanist text-xs font-semibold tracking-wide px-6 first:pl-0 ${i === 2 ? 'text-[#14EAEA] cursor-pointer hover:text-white transition-colors' : 'text-white/50'}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — center bottom */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <path d="M5 1v10M1 7l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes highlightSweep {
          to { transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}
