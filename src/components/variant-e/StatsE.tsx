'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target: number, duration = 1500, trigger: boolean = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        clearInterval(timer)
      } else {
        setValue(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, trigger])
  return value
}

function StatCard({ value, suffix, label, accent, index }: {
  value: number; suffix: string; label: string; accent: string; index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const count = useCountUp(value, 1400, triggered)

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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white p-8 lg:p-10 border border-black/8 group hover:border-transparent hover:shadow-lg transition-all duration-300"
    >
      <div
        className="font-urbanist font-black leading-none mb-3"
        style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: accent }}
      >
        {count}{suffix}
      </div>
      <p className="text-black/40 text-sm leading-snug font-urbanist">{label}</p>

      {/* Accent bottom */}
      <div
        className="mt-6 h-0.5 w-0 group-hover:w-12 transition-all duration-300"
        style={{ background: accent }}
      />
    </motion.div>
  )
}

export default function StatsE() {
  const stats = [
    { value: 6, suffix: '+ Yrs', label: 'Serving Southwest Florida businesses', accent: '#14EAEA' },
    { value: 50, suffix: '+', label: 'Clients served across Sarasota, Tampa & Bradenton', accent: '#F813BE' },
    { value: 300, suffix: '%', label: 'Average traffic increase for SEO clients', accent: '#B9FF33' },
    { value: 100, suffix: '%', label: 'Client satisfaction — rated top agency on DesignRush', accent: '#14EAEA' },
  ]

  return (
    <section className="py-24 lg:py-28 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-6 h-px bg-[#14EAEA]" />
            <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-urbanist">By The Numbers</span>
          </div>
          <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Real Results for<br />
            <span className="text-[#F813BE]">Real Businesses</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#0A0A0A] p-10 lg:p-14 grid lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8">
            <div className="font-urbanist text-5xl text-[#14EAEA] leading-none mb-4">&ldquo;</div>
            <blockquote className="font-urbanist text-xl lg:text-2xl font-bold text-white leading-snug mb-6">
              Webink transformed our online presence completely. Our bookings have tripled since launching the new site. Sean and the team are the real deal — professional, responsive, and they actually understand local business.
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-[#14EAEA]" />
              <div>
                <div className="font-bold text-white text-sm font-urbanist">Tiffini Brown</div>
                <div className="text-white/35 text-xs font-urbanist mt-0.5">Owner, Brown Mechanical Services</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            {[
              { label: 'Client Satisfaction', value: '100%', color: '#14EAEA' },
              { label: 'On-Time Delivery', value: '97%', color: '#F813BE' },
              { label: 'Client Retention', value: '85%', color: '#B9FF33' },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between border border-white/10 px-5 py-3">
                <span className="text-sm text-white/40 font-urbanist">{m.label}</span>
                <span className="font-urbanist text-xl font-black" style={{ color: m.color }}>{m.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
