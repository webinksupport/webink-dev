'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import EditableText from '@/components/editor/EditableText'

interface StatData {
  value: number
  suffix: string
  label: string
  sublabel: string
  underlineColor: string
}

const defaultStats: StatData[] = [
  { value: 50, suffix: '+', label: 'Clients Served', sublabel: 'Across Florida', underlineColor: '#14EAEA' },
  { value: 6, suffix: '+', label: 'Years in Business', sublabel: 'Est. in Sarasota', underlineColor: '#F813BE' },
  { value: 200, suffix: '%+', label: 'Avg Traffic Growth', sublabel: 'For our SEO clients', underlineColor: '#B9FF33' },
  { value: 5.0, suffix: '★', label: 'Google Rating', sublabel: '50+ five-star reviews', underlineColor: '#14EAEA' },
]

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.round(ease(progress) * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, target, duration])

  return count
}

function StatCard({ value, suffix, label, sublabel, delay, underlineColor }: {
  value: number
  suffix: string
  label: string
  sublabel: string
  delay: number
  underlineColor: string
}) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(value, 1800, active)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="text-center lg:text-left"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="font-urbanist font-black text-white leading-none mb-3"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 7rem)', letterSpacing: '-0.04em' }}
      >
        {count}
        <span className="text-[#14EAEA]">{suffix}</span>
      </div>
      <div className="font-urbanist font-bold text-white text-xl mb-1">{label}</div>
      <div className="font-urbanist text-white/35 text-sm">{sublabel}</div>
      <div className="mt-4 w-12 h-0.5 mx-auto lg:mx-0" style={{ backgroundColor: underlineColor }} />
    </div>
  )
}

export default function StatsI({ content = {}, stats }: { content?: Record<string, string>; stats?: StatData[] }) {
  // Only use DB stats if they contain non-zero values (prevents showing "0+" from empty DB)
  const hasValidStats = stats && stats.length > 0 && stats.some(s => s.value > 0)
  const displayStats = hasValidStats ? stats : defaultStats

  return (
    <section id="results" className="relative bg-[#0F0F0F] py-24 lg:py-36 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/photoshoot/_UTA4057.jpg"
          alt=""
          fill
          className="object-cover opacity-10"
          style={{ objectPosition: 'center' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0F0F0F]/80" />
      </div>

      {/* Top accent line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-[#14EAEA]/25 to-transparent mb-0" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-20">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#14EAEA]" />
              <span className="font-urbanist text-xs font-black tracking-[0.5em] text-white/30 uppercase">Results</span>
            </div>
            <h2
              className="font-urbanist font-black text-white leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.04em' }}
            >
              Numbers<br />
              <span className="text-[#14EAEA]">Don&apos;t Lie.</span>
            </h2>
          </div>
          <EditableText
            as="p"
            pageSlug="home"
            blockKey="stats_subtext"
            defaultValue="Six years of building digital foundations for Southwest Florida businesses. Here's what that looks like."
            className="font-urbanist text-white/40 text-lg leading-relaxed max-w-sm lg:text-right"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {displayStats.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 100} />
          ))}
        </div>

        {/* DesignRush badge */}
        <div className="mt-16 pt-10 border-t border-white/8 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#14EAEA] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0F0F0F">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <div className="font-urbanist font-bold text-sm text-white">Top Web Design Company in Florida</div>
              <div className="font-urbanist text-xs text-white/35">Recognized by DesignRush</div>
            </div>
          </div>
          <a
            href="https://webink.solutions/portfolio"
            className="font-urbanist font-bold text-sm text-white/40 border-b border-[#14EAEA] pb-0.5 hover:text-[#14EAEA] transition-colors duration-200"
          >
            See Our Work →
          </a>
        </div>
      </div>
    </section>
  )
}
