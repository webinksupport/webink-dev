'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEditor } from '@/components/editor/EditorContext'

interface BackgroundData {
  src?: string
  objectPosition?: string
  overlayOpacity?: number
  backgroundSize?: string
}

interface HeroIProps {
  content?: Record<string, string>
  heroBgData?: Partial<BackgroundData>
}

/* Salient premium easing curves */
const salientEase = [0.15, 0.75, 0.5, 1] as const      // Smooth decel — Salient's #1 curve
const salientReveal = [0.2, 1, 0.2, 1] as const          // Overshoot-smooth — Salient's #2 curve
const salientGrowIn = [0.15, 0.84, 0.35, 1.15] as const  // Grow-in with subtle overshoot

export default function HeroI({ content, heroBgData }: HeroIProps = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { editMode } = useEditor()

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
      className="relative overflow-hidden bg-[#0F0F0F] min-h-[100svh]"
    >
      {/* Baja beach full-bleed background with parallax */}
      <div className="absolute inset-0 overflow-hidden" data-type="background" data-page="home" data-block="hero_bg">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: bgY }}
        >
          <Image
            src={heroBgData?.src || '/images/photos/baja-beach.jpg'}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: heroBgData?.objectPosition || 'center' }}
            priority
            quality={75}
            sizes="100vw"
          />
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: `rgba(0,0,0,${heroBgData?.overlayOpacity ?? 0.55})` }}
          />
        </motion.div>
        {/* Subtle gradient — darker bottom for strip transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 z-[1]" />
      </div>

      {/* Hero text content */}
      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-30 min-h-[100svh] flex flex-col justify-center max-w-[1400px] mx-auto px-6 lg:px-20 py-20 sm:py-24"
      >
        {/* Eyebrow — Salient slide-in from left */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: salientEase }}
        >
          <span className="w-8 h-[2px] bg-[#14EAEA]" />
          <span
            data-page="home"
            data-block="hero_eyebrow"
            className="font-urbanist text-xs font-black tracking-[0.5em] text-white/60 uppercase"
          >
            {content?.hero_eyebrow || 'Sarasota Digital Marketing Agency'}
          </span>
        </motion.div>

        {/* Main headline — Salient hinge-drop inspired entrance */}
        <motion.h1
          className="font-urbanist font-black text-white leading-[0.88] mb-8 max-w-full lg:max-w-[42%]"
          style={{
            fontSize: 'clamp(2.5rem, 9vw, 9rem)',
            letterSpacing: '-0.04em',
          }}
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: salientReveal }}
        >
          <span
            data-page="home"
            data-block="hero_headline"
            className="font-urbanist font-black text-white"
          >
            {content?.hero_headline || 'Websites That Work. Marketing That Converts.'}
          </span>
        </motion.h1>

        {/* Sub-headline — smooth fade-in-from-bottom */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: salientEase }}
        >
          <p
            data-page="home"
            data-block="hero_subtext"
            className="font-urbanist text-white/55 text-xl leading-relaxed mb-12 max-w-lg"
          >
            {content?.hero_subtext || 'Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton. Real results, real relationships.'}
          </p>
        </motion.div>

        {/* CTAs — Salient slide-up */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: salientEase }}
        >
          <a
            href={content?.hero_cta_link || '/pricing'}
            onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 bg-[#14EAEA] text-[#0F0F0F] rounded-full hover:bg-white transition-all duration-300 shadow-lg"
          >
            <span
              data-page="home"
              data-block="hero_cta_text"
            >
              {content?.hero_cta_text || 'Get Started'}
            </span> →
          </a>
          <a
            href="#services"
            onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
            className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-5 border-2 border-white/25 text-white rounded-full hover:border-white/60 transition-all duration-300"
          >
            <span
              data-page="home"
              data-block="hero_cta2_text"
            >
              {content?.hero_cta2_text || 'View Our Work'}
            </span>
          </a>
        </motion.div>

        {/* Card fan hero image — right side, vertically centered */}
        <div
          className={`absolute hidden lg:block ${editMode ? '' : 'pointer-events-none'}`}
          style={{ right: '4%', top: '50%', marginTop: '-260px', width: '420px', height: '520px', overflow: 'visible' }}
        >
          {/* Card 1 — Cyan background card — Salient reveal-from-right */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#14EAEA]"
            style={{ zIndex: 5, willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            initial={{ opacity: 0, x: 200, rotate: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [200, 30, 30, 0],
              rotate: [0, 10, 10, 0],
              scale: [1, 1, 1, 0.82],
            }}
            transition={{
              duration: 2.3,
              delay: 0.4,
              ease: [0.2, 0.65, 0.3, 1],
              times: [0, 0.3, 0.6, 1],
            }}
          />

          {/* Card 2 — Pink background card — Salient reveal-from-right */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-[#F813BE]"
            style={{ zIndex: 5, willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            initial={{ opacity: 0, x: 200, rotate: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [200, -20, -20, 0],
              rotate: [0, -8, -8, 0],
              scale: [1, 1, 1, 0.82],
            }}
            transition={{
              duration: 2.3,
              delay: 0.55,
              ease: [0.2, 0.65, 0.3, 1],
              times: [0, 0.3, 0.6, 1],
            }}
          />

          {/* Card 3 — The actual Baja photo — Salient grow-in with rotation */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{ zIndex: 10, willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
            initial={{ opacity: 0, x: 100, rotate: -6, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.7, ease: salientGrowIn }}
          >
            <Image
              data-page="home"
              data-block="hero_card_image"
              src={content?.hero_card_image || '/images/photos/baja-6.jpg'}
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
            transition={{ duration: 0.8, delay: 1.8, ease: salientGrowIn }}
          >
            {/* White logo PNG — mix-blend-mode screen on dark bg = transparent background, logo glows */}
            <Image
              data-page="home"
              data-block="hero_logo_overlay"
              src={content?.hero_logo_overlay || '/images/logos/webink-white.png'}
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
        transition={{ delay: 1.2, duration: 0.8, ease: salientEase }}
      >
        <div className="bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4 flex flex-wrap items-center gap-0 divide-x divide-white/10">
            {[
              { key: 'hero_strip_1', def: 'Sarasota & Tampa Digital Marketing', cyan: false },
              { key: 'hero_strip_2', def: 'AI-Powered Results', cyan: false },
              { key: 'hero_strip_3', def: 'Free Consultation →', cyan: true },
            ].map(({ key, def, cyan }, i) => (
              <span
                key={i}
                data-page="home"
                data-block={key}
                className={`font-urbanist text-xs font-semibold tracking-wide px-6 first:pl-0 ${cyan ? 'text-[#14EAEA] cursor-pointer hover:text-white transition-colors' : 'text-white/50'}`}
              >
                {content?.[key] || def}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator — center bottom */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
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
    </section>
  )
}
