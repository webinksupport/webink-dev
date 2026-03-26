'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'
import EditableBackground, { type BackgroundData } from '@/components/editor/EditableBackground'

interface HeroIProps {
  content?: Record<string, string>
  heroBgData?: Partial<BackgroundData>
}

export default function HeroI({ content, heroBgData }: HeroIProps = {}) {
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
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/images/photos/baja-beach.jpg'), radial-gradient(ellipse at 30% 50%, rgba(20,234,234,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(248,19,190,0.05) 0%, transparent 60%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Baja beach full-bleed background with parallax + editable background */}
      <EditableBackground
        pageSlug="home"
        blockKey="hero_bg"
        defaultSrc="/images/photos/baja-beach.jpg"
        defaultOverlayOpacity={0.55}
        defaultPosition="center"
        cmsData={heroBgData}
        imageProps={{ priority: true, quality: 75, sizes: '100vw' }}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Subtle gradient — darker bottom for strip transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-[1]" />
      </EditableBackground>

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
          className="font-urbanist font-black text-white leading-[0.88] mb-8 max-w-full md:max-w-[55%]"
          style={{
            fontSize: 'clamp(2.5rem, 9vw, 9rem)',
            letterSpacing: '-0.04em',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {(() => {
            const headline = content?.hero_headline || 'Websites That Work.\nMarketing That Converts.'
            const lines = headline.split('\n')
            return lines.map((line, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap' }}>
                {i === 0 ? (
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {line.replace(/\.$/, '')}
                    <span className="relative inline-block" style={{ whiteSpace: 'nowrap' }}>
                      {line.endsWith('.') ? '.' : ''}
                      <span
                        className="absolute inset-x-0 bottom-0 h-[8px] bg-[#14EAEA] origin-left"
                        style={{ animation: 'highlightSweep 0.7s cubic-bezier(0.4,0,0.2,1) 1.1s forwards', transform: 'scaleX(0)', bottom: '6px' }}
                      />
                    </span>
                  </span>
                ) : line}
                {i < lines.length - 1 && <br />}
              </span>
            ))
          })()}
        </motion.h1>

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <EditableText
            as="p"
            pageSlug="home"
            blockKey="hero_subtext"
            value={content?.hero_subtext}
            defaultValue="Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton. Real results, real relationships."
            className="font-urbanist text-white/55 text-xl leading-relaxed mb-12 max-w-lg"
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <a
            href={content?.hero_cta_link || '/pricing'}
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 bg-[#14EAEA] text-[#0F0F0F] rounded-full hover:bg-white transition-all duration-300 shadow-lg"
          >
            <EditableText
              as="span"
              pageSlug="home"
              blockKey="hero_cta_text"
              value={content?.hero_cta_text}
              defaultValue="Get Started"
            /> →
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 border-2 border-white/25 text-white rounded-full hover:border-white/60 transition-all duration-300"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Card fan hero image — right side, vertically centered */}
        <div
          className="absolute hidden lg:block pointer-events-none"
          style={{ right: '4%', top: '50%', marginTop: '-290px', width: '460px', height: '580px', overflow: 'visible' }}
        >
          {/* Card 1 — Cyan background card (fans in then fully tucks BEHIND photo) */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#14EAEA]"
            style={{ zIndex: 5 }}
            initial={{ opacity: 0, x: 160, rotate: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [160, 30, 30, 0],
              rotate: [0, 10, 10, 0],
              scale: [1, 1, 1, 0.82],
            }}
            transition={{
              duration: 2.4,
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.3, 0.6, 1],
            }}
          />

          {/* Card 2 — Pink background card (fans in then fully tucks BEHIND photo) */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#F813BE]"
            style={{ zIndex: 5 }}
            initial={{ opacity: 0, x: 160, rotate: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [160, -20, -20, 0],
              rotate: [0, -8, -8, 0],
              scale: [1, 1, 1, 0.82],
            }}
            transition={{
              duration: 2.4,
              delay: 0.45,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.3, 0.6, 1],
            }}
          />

          {/* Card 3 — The actual Baja photo */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{ zIndex: 10 }}
            initial={{ opacity: 0, x: 80, rotate: -6 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <EditableImage
              pageSlug="home"
              blockKey="hero_card_image"
              src="/images/photos/baja-6.jpg"
              alt="Baja California beach — Webink Solutions Sarasota digital marketing"
              fill
              priority
              quality={75}
              className="object-cover"
              style={{ objectPosition: 'center' }}
              sizes="460px"
            />
            {/* Subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* Webink logo overlay — no background box, glow effect only */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{ top: '-28px', width: '340px' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* White logo PNG — mix-blend-mode screen on dark bg = transparent background, logo glows */}
            <Image
              src="/images/logos/webink-white.png"
              alt="Webink Solutions logo"
              width={340}
              height={85}
              className="w-full block"
              style={{
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 20px rgba(20, 234, 234, 0.6)) drop-shadow(0 0 40px rgba(248, 19, 190, 0.3))',
              }}
            />
          </motion.div>
        </div>
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
