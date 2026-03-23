'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

// Rotating badge component
function RotatingBadge() {
  return (
    <div className="absolute right-8 top-32 lg:right-16 lg:top-40 z-20 hidden md:block">
      <div className="relative w-32 h-32">
        {/* Spinning text ring */}
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          style={{ animation: 'spin-badge 12s linear infinite' }}
        >
          <defs>
            <path
              id="badge-circle"
              d="M 60, 60 m -42, 0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            />
          </defs>
          <text
            fill="#0A0A0A"
            fontSize="9.5"
            fontFamily="Urbanist, sans-serif"
            fontWeight="800"
            letterSpacing="2"
          >
            <textPath href="#badge-circle">
              ⭐ SARASOTA&apos;S #1 DIGITAL AGENCY ⭐ SINCE 2020 ·
            </textPath>
          </text>
        </svg>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#14EAEA] flex items-center justify-center">
            <span className="text-black font-black text-xs font-urbanist">#1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Collage image card with rotation
function CollageImage({
  src,
  alt,
  style,
  delay = 0,
}: {
  src: string
  alt: string
  style: React.CSSProperties
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute overflow-hidden shadow-2xl"
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 30vw"
      />
    </motion.div>
  )
}

export default function HeroG() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-white overflow-hidden flex items-center"
    >
      {/* Left: Text content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-10 h-[3px] bg-[#F813BE]" />
            <span className="font-urbanist text-xs font-black tracking-[0.45em] text-black/40 uppercase">
              Sarasota · Tampa · Bradenton
            </span>
          </motion.div>

          {/* Massive headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-urbanist font-black text-[#0A0A0A] leading-[0.88] mb-8"
            style={{ fontSize: 'clamp(4rem, 9vw, 9rem)', letterSpacing: '-0.03em' }}
          >
            WE BUILD<br />
            <span className="text-[#14EAEA]">DIGITAL</span><br />
            POWER.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-urbanist text-lg text-black/50 leading-relaxed max-w-md mb-10"
          >
            High-performance websites and data-driven marketing that generates real results for Southwest Florida businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <Link
              href="/contact"
              className="font-urbanist font-black text-sm px-10 py-4 bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black transition-all duration-300 tracking-wide"
            >
              Start a Project →
            </Link>
            <Link
              href="/portfolio"
              className="font-urbanist font-black text-sm px-10 py-4 border-2 border-black/15 text-black hover:border-[#F813BE] transition-all duration-300 tracking-wide"
            >
              See Our Work
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-8"
          >
            <div>
              <div className="font-urbanist font-black text-3xl text-[#0A0A0A]">50+</div>
              <div className="font-urbanist text-xs text-black/40 tracking-wider">Clients Served</div>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div>
              <div className="font-urbanist font-black text-3xl text-[#0A0A0A]">6+</div>
              <div className="font-urbanist text-xs text-black/40 tracking-wider">Years Active</div>
            </div>
            <div className="w-px h-10 bg-black/10" />
            <div>
              <div className="font-urbanist font-black text-3xl text-[#F813BE]">#1</div>
              <div className="font-urbanist text-xs text-black/40 tracking-wider">DesignRush FL</div>
            </div>
          </motion.div>
        </div>

        {/* Right: Collage image cluster */}
        <motion.div
          className="relative hidden lg:block"
          style={{ height: '620px', y: yParallax }}
        >
          {/* Background Baja beach photo — largest */}
          <CollageImage
            src="/images/photos/baja-beach.jpg"
            alt="Webink team at Baja"
            style={{
              width: '78%',
              height: '480px',
              right: 0,
              top: 0,
              borderRadius: '2px',
            }}
            delay={0.1}
          />

          {/* Sean portrait — overlapping, offset lower left */}
          <CollageImage
            src="/images/photos/sean-portrait.jpg"
            alt="Sean — Webink Founder"
            style={{
              width: '46%',
              height: '320px',
              left: 0,
              bottom: 20,
              borderRadius: '2px',
              transform: 'rotate(-2.5deg)',
              zIndex: 10,
            }}
            delay={0.3}
          />

          {/* Team photo — overlapping top-left of baja */}
          <CollageImage
            src="/images/photos/team-rooftop.jpg"
            alt="Webink team"
            style={{
              width: '42%',
              height: '220px',
              right: '4%',
              bottom: 0,
              borderRadius: '2px',
              transform: 'rotate(1.8deg)',
              zIndex: 11,
            }}
            delay={0.45}
          />

          {/* Accent line */}
          <div
            className="absolute top-8 left-[20%] w-[3px] h-24 bg-[#14EAEA] z-20"
            style={{ animation: 'slideDown 0.8s ease 0.8s both' }}
          />

          {/* Pink accent dot */}
          <div className="absolute top-4 left-[19%] w-4 h-4 rounded-full bg-[#F813BE] z-20" />
        </motion.div>
      </div>

      {/* Rotating badge */}
      <RotatingBadge />

      {/* Bottom cyan bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33]" />

      <style jsx>{`
        @keyframes spin-badge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
      `}</style>
    </section>
  )
}
