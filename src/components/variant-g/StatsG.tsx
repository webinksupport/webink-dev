'use client'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useInView } from 'framer-motion'

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const stats = [
  { value: 50, suffix: '+', label: 'Clients Served', accent: '#14EAEA' },
  { value: 6, suffix: '+', label: 'Years in Business', accent: '#F813BE' },
  { value: 300, suffix: '%', label: 'Avg Traffic Increase', accent: '#B9FF33' },
  { value: 1, suffix: '', label: 'DesignRush #1 Florida', accent: '#14EAEA' },
]

export default function StatsG() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Headline side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[3px] bg-[#B9FF33]" />
              <span className="font-urbanist text-xs font-black tracking-[0.4em] text-black/30 uppercase">Proven Results</span>
            </div>
            <h2
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.88] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.025em' }}
            >
              NUMBERS<br />
              DON&apos;T<br />
              <span className="text-[#14EAEA]">LIE.</span>
            </h2>

            <blockquote className="border-l-4 border-[#F813BE] pl-6 italic font-urbanist text-black/60 text-lg leading-relaxed">
              &ldquo;Webink transformed our online presence. Our leads doubled within 90 days.&rdquo;
              <footer className="mt-3 text-sm font-bold not-italic text-black/40">
                — Tiffini Brown, Brown Mechanical Services
              </footer>
            </blockquote>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-px bg-black/8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 lg:p-10"
              >
                <div
                  className="font-urbanist font-black mb-2 leading-none"
                  style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', color: stat.accent, letterSpacing: '-0.03em' }}
                >
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-urbanist text-sm text-black/40 font-semibold tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
