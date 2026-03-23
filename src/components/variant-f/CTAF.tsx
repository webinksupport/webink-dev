'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTAF() {
  return (
    <section className="py-24 lg:py-36 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xs tracking-[0.45em] text-black/25 uppercase font-urbanist mb-8">Get Started</p>
          <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Let&apos;s build something{' '}
            <span className="relative inline-block">
              great.
              <svg
                aria-hidden="true"
                viewBox="0 0 200 16"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '100%',
                  height: '14px',
                  overflow: 'visible',
                }}
              >
                <path
                  d="M3 9 Q40 4, 80 10 Q120 16, 160 8 Q185 4, 197 10"
                  fill="none"
                  stroke="#14EAEA"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 300,
                    strokeDashoffset: 300,
                    animation: 'scribble-draw 0.9s cubic-bezier(0.4,0,0.2,1) 0.4s forwards',
                  }}
                />
              </svg>
            </span>
          </h2>
          <p className="text-black/40 text-lg leading-relaxed font-urbanist font-light mb-10 max-w-xl mx-auto">
            Free consultation. We&apos;ll review your current online presence, identify gaps, and outline a clear strategy — no pressure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block text-sm font-semibold px-10 py-4 bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black transition-all duration-300 font-urbanist"
            >
              Book a Free Consultation
            </Link>
            <a
              href="tel:9418401381"
              className="text-sm font-urbanist text-black/40 hover:text-black transition-colors tracking-wide"
            >
              (941) 840-1381
            </a>
          </div>

          {/* Trust badges — quiet */}
          <div className="mt-12 flex items-center justify-center gap-8 text-black/20 text-xs font-urbanist tracking-wider">
            <span>Top Rated · DesignRush</span>
            <span>·</span>
            <span>50+ Clients</span>
            <span>·</span>
            <span>Sarasota, FL</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
