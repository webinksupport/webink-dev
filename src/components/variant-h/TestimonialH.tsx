'use client'
import { motion } from 'framer-motion'

export default function TestimonialH() {
  return (
    <section className="bg-white py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Big typographic quote — the text IS the design */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="w-8 h-[2px] bg-[#14EAEA]" />
            <span className="font-urbanist text-xs font-black tracking-[0.4em] text-black/30 uppercase">Client Love</span>
          </div>

          <blockquote className="relative">
            {/* Giant quote mark */}
            <div
              className="absolute -top-8 -left-4 font-urbanist font-black text-[#14EAEA] select-none pointer-events-none"
              style={{ fontSize: '12rem', lineHeight: 1, opacity: 0.12 }}
              aria-hidden
            >
              &ldquo;
            </div>

            <p
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.9] relative z-10"
              style={{
                fontSize: 'clamp(2rem, 5vw, 5rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Webink transformed<br />
              our online presence.<br />
              <span className="text-[#14EAEA]">Our leads doubled</span><br />
              within 90 days.
            </p>

            <footer className="mt-10 flex items-center gap-5">
              <div className="w-12 h-[2px] bg-[#14EAEA]" />
              <div>
                <div className="font-urbanist font-black text-black/70 text-sm">Tiffini Brown</div>
                <div className="font-urbanist text-black/35 text-xs">Brown Mechanical Services · Sarasota, FL</div>
              </div>
              <div className="ml-auto flex">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-[#F813BE] text-lg">★</span>
                ))}
              </div>
            </footer>
          </blockquote>
        </motion.div>

        {/* Stats row — minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/5"
        >
          {[
            { val: '50+', label: 'Clients Served' },
            { val: '6+', label: 'Years in Business' },
            { val: '300%', label: 'Avg Traffic Increase' },
            { val: '#1', label: 'DesignRush Florida' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-8 lg:p-12">
              <div
                className="font-urbanist font-black text-[#0A0A0A] mb-2"
                style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', letterSpacing: '-0.04em' }}
              >
                {s.val}
              </div>
              <div className="font-urbanist text-sm text-black/35 font-semibold tracking-wide">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
