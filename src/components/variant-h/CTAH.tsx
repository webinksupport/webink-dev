'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTAH() {
  return (
    <section className="bg-[#0A0A0A] py-32 lg:py-48 overflow-hidden relative">
      {/* Massive background letter */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-urbanist font-black"
          style={{
            fontSize: 'clamp(20rem, 40vw, 50rem)',
            letterSpacing: '-0.05em',
            WebkitTextStroke: '1px rgba(20,234,234,0.08)',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          W
        </span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
            <span className="font-urbanist text-xs font-black tracking-[0.5em] text-white/20 uppercase">Let&apos;s Talk</span>
          </div>

          <h2
            className="font-urbanist font-black text-white leading-[0.85] mb-14"
            style={{ fontSize: 'clamp(4rem, 12vw, 12rem)', letterSpacing: '-0.04em' }}
          >
            READY?<br />
            <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
              LET&apos;S
            </span><br />
            <span className="text-[#14EAEA]">BUILD.</span>
          </h2>

          <div className="flex flex-wrap gap-5 mb-14">
            <Link
              href="/contact"
              className="font-urbanist font-black text-base px-12 py-5 bg-[#14EAEA] text-black hover:bg-white transition-all duration-300 tracking-wider uppercase"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact"
              className="font-urbanist font-black text-base px-12 py-5 border-2 border-white/20 text-white hover:border-[#14EAEA] hover:text-[#14EAEA] transition-all duration-300 tracking-wider uppercase"
            >
              Book a Call
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 text-white/20 font-urbanist text-sm">
            <span>(941) 840-1381</span>
            <span>hello@webink.solutions</span>
            <span>Sarasota, Florida</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
