'use client'
import { motion } from 'framer-motion'

export default function CTAI() {
  return (
    <section
      id="contact"
      className="bg-[#0A0A0A] py-32 lg:py-44 relative overflow-hidden"
    >
      {/* Subtle radial gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,234,234,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Decorative cyan lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14EAEA]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14EAEA]/20 to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="inline-flex items-center gap-3 mb-10">
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
            <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#14EAEA]/60 uppercase">Let&apos;s Work Together</span>
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
          </div>

          <h2
            className="font-urbanist font-black text-white leading-[0.85] mb-10 mx-auto"
            style={{
              fontSize: 'clamp(3rem, 9vw, 9.5rem)',
              letterSpacing: '-0.04em',
              maxWidth: '14ch',
            }}
          >
            Ready to
            {' '}
            <span className="text-[#B9FF33]">Grow</span>
            {' '}
            Your Business?
          </h2>

          <p className="font-urbanist text-white/45 text-xl leading-relaxed mb-14 max-w-2xl mx-auto">
            Free audit. No commitment. We&apos;ll review your website, SEO, and digital presence — and show you exactly what&apos;s holding you back.
          </p>

          <div className="flex flex-wrap gap-5 justify-center">
            <a
              href="https://webink.solutions/contact"
              className="group inline-flex items-center gap-3 font-urbanist font-bold text-base px-10 py-5 bg-[#14EAEA] text-[#0A0A0A] rounded-full hover:bg-white transition-all duration-300 shadow-lg shadow-[#14EAEA]/20"
            >
              Get a Free Audit
              <span className="w-7 h-7 rounded-full bg-[#0A0A0A] text-[#14EAEA] group-hover:bg-[#14EAEA] group-hover:text-[#0A0A0A] flex items-center justify-center text-sm font-black transition-all duration-300">→</span>
            </a>
            <a
              href="https://webink.solutions/portfolio"
              className="inline-flex items-center gap-3 font-urbanist font-bold text-base px-10 py-5 border-2 border-white/15 text-white rounded-full hover:border-[#14EAEA]/50 transition-all duration-300"
            >
              View Our Work
            </a>
          </div>

          {/* Contact details */}
          <div className="mt-16 flex flex-wrap justify-center gap-10 text-white/25">
            <a href="tel:9418401381" className="font-urbanist text-sm hover:text-[#14EAEA] transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
              (941) 840-1381
            </a>
            <a href="mailto:hello@webink.solutions" className="font-urbanist text-sm hover:text-[#14EAEA] transition-colors flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              hello@webink.solutions
            </a>
            <span className="font-urbanist text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              Sarasota, Florida
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
