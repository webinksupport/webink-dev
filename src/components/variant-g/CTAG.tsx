'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTAG() {
  return (
    <section className="bg-[#0A0A0A] py-28 lg:py-40 overflow-hidden relative">
      {/* Big decorative text */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-urbanist font-black text-white/[0.03] whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 20vw, 22rem)', letterSpacing: '-0.05em' }}
        >
          GROW
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
            <span className="font-urbanist text-xs font-black tracking-[0.4em] text-white/30 uppercase">Let&apos;s Work Together</span>
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
          </div>

          <h2
            className="font-urbanist font-black text-white leading-[0.88] mb-10"
            style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', letterSpacing: '-0.03em' }}
          >
            READY TO<br />
            <span className="text-[#14EAEA]">GROW</span> YOUR<br />
            BUSINESS?
          </h2>

          <p className="font-urbanist text-white/45 text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Get a free consultation with Sean and his team. No hard sell. Just a real conversation about what would actually help your business.
          </p>

          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              href="/contact"
              className="font-urbanist font-black text-sm px-12 py-5 bg-[#14EAEA] text-black hover:bg-[#F813BE] hover:text-white transition-all duration-300 tracking-wider uppercase"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact"
              className="font-urbanist font-black text-sm px-12 py-5 border-2 border-white/20 text-white hover:border-white/60 transition-all duration-300 tracking-wider uppercase"
            >
              Book a Call
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center text-white/25 text-xs font-urbanist">
            <span>(941) 840-1381</span>
            <span>·</span>
            <span>hello@webink.solutions</span>
            <span>·</span>
            <span>Sarasota, FL</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
