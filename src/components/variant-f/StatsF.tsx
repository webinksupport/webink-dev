'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target: number, duration = 1400, trigger = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const t = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(t) }
      else setValue(start)
    }, 16)
    return () => clearInterval(t)
  }, [target, duration, trigger])
  return value
}

function StatItem({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const count = useCountUp(value, 1200, triggered)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="py-10 border-b border-black/6 lg:border-b-0 lg:border-r last:border-0"
    >
      <div className="font-urbanist font-black text-[#0A0A0A] leading-none mb-3" style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}>
        {count}<span style={{ color: '#14EAEA' }}>{suffix}</span>
      </div>
      <p className="text-black/35 text-sm font-urbanist leading-snug max-w-[180px]">{label}</p>
    </motion.div>
  )
}

export default function StatsF() {
  const stats = [
    { value: 6, suffix: '+', label: 'Years serving Southwest Florida', delay: 0 },
    { value: 50, suffix: '+', label: 'Client websites launched', delay: 0.1 },
    { value: 300, suffix: '%', label: 'Average organic traffic growth', delay: 0.2 },
    { value: 100, suffix: '%', label: 'Client satisfaction rating', delay: 0.3 },
  ]

  return (
    <section className="py-16 lg:py-24 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x divide-black/6 gap-0">
          {stats.map((s) => <StatItem key={s.label} {...s} />)}
        </div>

        {/* Testimonial — very minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 lg:mt-20 border-l-2 border-[#14EAEA] pl-8 max-w-3xl"
        >
          <blockquote className="font-urbanist text-xl lg:text-2xl text-[#0A0A0A] leading-relaxed font-light mb-6">
            &ldquo;Webink transformed our online presence completely. Our bookings have tripled since launching the new site.&rdquo;
          </blockquote>
          <div className="text-black/35 text-sm font-urbanist">
            <span className="font-semibold text-black/60">Tiffini Brown</span> — Owner, Brown Mechanical Services
          </div>
        </motion.div>
      </div>
    </section>
  )
}
