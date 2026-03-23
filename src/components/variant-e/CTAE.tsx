'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTAE() {
  return (
    <section className="py-24 lg:py-32 bg-[#0A0A0A] overflow-hidden relative">
      {/* Gradient accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14EAEA] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F813BE] to-transparent opacity-30" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.35em] text-white/25 uppercase font-urbanist">Next Step</span>
            </div>

            <h2 className="font-urbanist font-black text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to Grow<br />
              Your <span className="text-[#14EAEA]">Business?</span>
            </h2>

            <p className="text-white/40 text-lg leading-relaxed font-urbanist mb-10 max-w-lg">
              Free consultation. We&apos;ll review your website, identify your biggest growth opportunities, and build a clear roadmap — no pressure, no obligation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-block bg-[#14EAEA] text-black text-sm font-bold px-8 py-4 hover:bg-white transition-all duration-200 font-urbanist"
              >
                Get a Free Consultation
              </Link>
              <a
                href="tel:9418401381"
                className="inline-block border-2 border-white/15 text-white/50 text-sm font-bold px-8 py-4 hover:border-white/40 hover:text-white transition-all duration-200 font-urbanist"
              >
                Call (941) 840-1381
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-white/8">
              {[
                { icon: '★', text: 'Top Rated on DesignRush' },
                { icon: '✦', text: '50+ Businesses Served' },
                { icon: '⊙', text: 'Sarasota, FL Based' },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2">
                  <span className="text-[#14EAEA] text-sm">{t.icon}</span>
                  <span className="text-white/30 text-xs font-urbanist">{t.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: large accent card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#14EAEA] p-10 lg:p-12">
              <div className="font-urbanist font-black text-black leading-none mb-1" style={{ fontSize: 'clamp(4rem, 8vw, 6rem)' }}>
                Free
              </div>
              <div className="text-black/60 text-lg font-urbanist mb-6">Discovery Call</div>
              <p className="text-black/70 text-sm leading-relaxed font-urbanist mb-8">
                30-minute strategy session. Zero pressure. We&apos;ll identify your top 3 growth opportunities and outline a realistic action plan.
              </p>
              <Link
                href="/contact"
                className="block text-center bg-black text-white text-sm font-bold py-4 hover:bg-[#333] transition-all duration-200 font-urbanist"
              >
                Book Your Free Call →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
