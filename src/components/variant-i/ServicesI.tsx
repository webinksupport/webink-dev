'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Globe, Search, TrendingUp, Share2, Server, Brain,
} from 'lucide-react'
import EditableText from '@/components/editor/EditableText'

/* ── SERVICE CARDS (3x2 grid) ─────────────────────────────── */
const services = [
  {
    icon: Globe,
    title: 'Web Design',
    desc: 'Custom responsive websites engineered for performance and real conversion. Fast, modern, built to last.',
    color: '#14EAEA',
    href: '/services/web-design',
  },
  {
    icon: Search,
    title: 'SEO Services',
    desc: 'Keyword research, technical optimization, local SEO, and transparent monthly reporting.',
    color: '#F813BE',
    href: '/services/seo',
  },
  {
    icon: TrendingUp,
    title: 'Paid Advertising',
    desc: 'Google Ads and Meta campaigns engineered for ROI. Real leads, not vanity metrics.',
    color: '#B9FF33',
    href: '/services/paid-advertising',
  },
  {
    icon: Share2,
    title: 'Social Media',
    desc: 'Strategy, content creation, scheduling, and community management that converts.',
    color: '#14EAEA',
    href: '/services/social-media',
  },
  {
    icon: Server,
    title: 'Web Hosting',
    desc: 'Managed hosting with enterprise uptime, daily backups, SSL, and full technical support.',
    color: '#F813BE',
    href: '/services/web-hosting',
  },
  {
    icon: Brain,
    title: 'AI-Powered Marketing',
    desc: 'We leverage AI to automate, optimize, and scale your marketing beyond what traditional agencies deliver.',
    color: '#B9FF33',
    href: '/services/ai-marketing',
  },
]

/* ── PROCESS PANELS (horizontal scroll) ─────────────────── */
const processPanels = [
  {
    num: '01',
    numColor: '#14EAEA',
    title: 'Audit & Strategy',
    desc: 'We start by reviewing your current digital presence — website, SEO, ads, and social. We map gaps, find opportunities, and build a clear strategy before spending a single dollar.',
    image: '/images/photos/workspace-dark.jpg',
    objectPosition: 'center',
  },
  {
    num: '02',
    numColor: '#F813BE',
    title: 'Design & Build',
    desc: 'Every design decision is tied to conversion. We build fast, modern websites and launch campaigns that are engineered to perform — not just to look good.',
    image: '/images/digital-workspace-flatlay.png',
    objectPosition: 'center',
  },
  {
    num: '03',
    numColor: '#B9FF33',
    title: 'Launch & Optimize',
    desc: 'We launch with precision and monitor everything. Real-time dashboards, A/B testing, and continuous refinement mean your results compound over time.',
    image: '/images/photos/tech-laptop.jpg',
    objectPosition: 'center',
  },
  {
    num: '04',
    numColor: '#14EAEA',
    title: 'Measure & Grow',
    desc: 'Monthly reporting with zero jargon. You see exactly what\'s working, what\'s not, and what\'s next. No smoke and mirrors — just clear data and real results.',
    image: '/images/photos/sean-street.jpg',
    objectPosition: 'top center',
  },
]

function ServiceCard({
  icon: Icon,
  title,
  desc,
  color,
  href,
  index,
}: {
  icon: React.ElementType
  title: string
  desc: string
  color: string
  href: string
  index: number
}) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-white rounded-2xl p-8 border border-[#E5E5E5] hover:border-[#14EAEA] hover:shadow-lg transition-all duration-300 cursor-pointer"
      style={{ '--accent': color } as React.CSSProperties}
    >
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
        style={{ backgroundColor: color + '18' }}
      >
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="font-urbanist font-black text-[20px] text-[#0F0F0F] mb-3 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="font-urbanist text-[14px] text-[#333]/60 leading-relaxed flex-1 mb-6">
        {desc}
      </p>

      {/* Learn More link */}
      <span
        className="font-urbanist font-bold text-sm transition-colors duration-200"
        style={{ color }}
      >
        Learn More →
      </span>

      {/* Hover accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundColor: color }}
      />
    </motion.a>
  )
}

/* ── HORIZONTAL SCROLL PROCESS SECTION ──────────────────── */
function HorizontalProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tweenRef: any = null

    const init = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { gsap } = await import('gsap') as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { ScrollTrigger } = await import('gsap/ScrollTrigger') as any
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const panels = track.querySelectorAll('.process-panel')
      const totalPanels = panels.length
      const panelWidth = window.innerWidth
      const totalWidth = panelWidth * totalPanels

      track.style.width = `${totalWidth}px`

      tweenRef = gsap.to(track, {
        x: -(totalWidth - panelWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth - panelWidth}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }

    init()

    return () => {
      if (tweenRef) tweenRef.kill()
      import('gsap/ScrollTrigger').then((mod) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ST = (mod as any).ScrollTrigger
        ST.getAll().forEach((t: { kill: () => void }) => t.kill())
        ST.refresh()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      style={{ height: '100vh' }}
    >
      {/* Section label — fixed during pin */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="w-6 h-[2px] bg-[#14EAEA]" />
          <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#0F0F0F]/30 uppercase">How We Work</span>
          <span className="w-6 h-[2px] bg-[#14EAEA]" />
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ willChange: 'transform' }}
      >
        {processPanels.map((panel) => (
          <div
            key={panel.num}
            className="process-panel flex-shrink-0 h-full bg-white flex items-center"
            style={{ width: '100vw' }}
          >
            <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-20 h-full flex items-center">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">

                {/* Text side */}
                <div>
                  {/* Large editorial number */}
                  <div
                    className="font-urbanist leading-none select-none mb-6"
                    style={{
                      fontSize: 'clamp(8rem, 18vw, 200px)',
                      fontWeight: 100,
                      letterSpacing: '-0.05em',
                      color: panel.numColor,
                      opacity: 0.9,
                    }}
                  >
                    {panel.num}
                  </div>

                  {/* Divider line */}
                  <div className="w-16 h-[1px] bg-[#E5E5E5] mb-8" />

                  {/* Process title */}
                  <h3
                    className="font-urbanist font-black text-[#0F0F0F] leading-tight mb-6"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
                  >
                    {panel.title}
                  </h3>

                  {/* Description */}
                  <p className="font-urbanist text-[#333]/55 text-lg leading-relaxed max-w-md">
                    {panel.desc}
                  </p>
                </div>

                {/* Image side — no whileInView here; GSAP horizontal scroll prevents IntersectionObserver from firing */}
                <div className="relative hidden lg:block h-[420px]">
                  <div className="w-full h-full rounded-[24px] overflow-hidden shadow-xl">
                    <div className="relative w-full h-full">
                      <Image
                        src={panel.image}
                        alt={panel.title + ' — Webink Solutions process'}
                        fill
                        className="object-cover"
                        style={{ objectPosition: panel.objectPosition }}
                        sizes="50vw"
                      />
                      {/* Accent bottom line */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: panel.numColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 z-30 hidden lg:flex items-center gap-2 text-[#0F0F0F]/25">
        <span className="font-urbanist text-xs tracking-wider uppercase">Scroll to continue</span>
        <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
          <path d="M0 4H22M22 4L19 1M22 4L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}

/* ── MAIN EXPORT ─────────────────────────────────────────── */
export default function ServicesI() {
  return (
    <>
      {/* ── SERVICES GRID SECTION ── */}
      <section id="services" className="bg-white py-24 lg:py-36">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-[#F813BE]" />
            <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#0F0F0F]/30 uppercase">Our Services</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <EditableText
              as="h2"
              blockKey="services_heading"
              defaultValue="Full-Service Digital Agency."
              className="font-urbanist font-black text-[#0F0F0F] leading-[0.88]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', letterSpacing: '-0.04em' }}
            />
            <EditableText
              as="p"
              blockKey="services_subtext"
              defaultValue="Everything your business needs to dominate the digital landscape — under one roof."
              className="font-urbanist text-[#333]/50 text-lg leading-relaxed max-w-sm lg:text-right"
            />
          </div>

          {/* 3×2 card grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <ServiceCard key={svc.title} {...svc} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-14">
            <a
              href="/services"
              className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-4 bg-[#0F0F0F] text-white rounded-full hover:bg-[#14EAEA] hover:text-[#0F0F0F] transition-all duration-300"
            >
              View All Services →
            </a>
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLL PROCESS ── */}
      <HorizontalProcess />
    </>
  )
}
