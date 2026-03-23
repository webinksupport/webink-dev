'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Globe, Search, TrendingUp, Share2, Server, Brain, Database,
} from 'lucide-react'

const services = [
  {
    num: '01',
    title: 'Web Design',
    tagline: 'Built to convert.',
    desc: 'Custom responsive websites engineered for performance, SEO, and real conversion. Fast, modern, and built to last.',
    image: '/images/photos/workspace-dark.jpg',
    icon: Globe,
    accent: '#14EAEA',
    bg: '#F0FEFE',
  },
  {
    num: '02',
    title: 'SEO Services',
    tagline: 'Rank. Get found. Grow.',
    desc: 'Keyword research, technical optimization, local SEO, and transparent monthly reporting. We get you to page one.',
    image: '/images/photos/sean-street.jpg',
    icon: Search,
    accent: '#F813BE',
    bg: '#FEF0FB',
  },
  {
    num: '03',
    title: 'Paid Advertising',
    tagline: 'Every dollar accountable.',
    desc: 'Google Ads and Meta campaigns engineered for ROI. Real leads, not vanity metrics. We manage every dollar.',
    image: '/images/photos/team-rooftop.jpg',
    icon: TrendingUp,
    accent: '#B9FF33',
    bg: '#F5FEE8',
  },
  {
    num: '04',
    title: 'Social Media',
    tagline: 'Content that stops the scroll.',
    desc: 'Strategy, content creation, scheduling, and community management. We build audiences that convert to customers.',
    image: '/images/photos/team-duo.jpg',
    icon: Share2,
    accent: '#14EAEA',
    bg: '#F0FEFE',
  },
  {
    num: '05',
    title: 'Web Hosting',
    tagline: 'Always on. Always fast.',
    desc: 'Managed hosting with enterprise uptime, daily backups, SSL, and full technical support. From $31/mo.',
    image: '/images/photos/team-family.jpg',
    icon: Server,
    accent: '#F813BE',
    bg: '#FEF0FB',
  },
  {
    num: '06',
    title: 'AI-Powered Marketing',
    tagline: 'Beyond what agencies deliver.',
    desc: 'We leverage AI to automate, optimize, and scale your marketing beyond what traditional agencies can deliver.',
    image: '/images/photos/workspace-dark.jpg',
    icon: Brain,
    accent: '#B9FF33',
    bg: '#F5FEE8',
  },
  {
    num: '07',
    title: 'Custom CRM & SaaS',
    tagline: 'Software built for your industry.',
    desc: 'We build industry-specific software platforms — booking systems, CRM tools, client portals. Like VoltDesk, our platform for electrical contractors.',
    image: '/images/photos/tech-laptop.jpg',
    icon: Database,
    accent: '#14EAEA',
    bg: '#F0FEFE',
  },
]

export default function ServicesI() {
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

      const panels = track.querySelectorAll('.service-panel')
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
      id="services"
      className="relative overflow-hidden bg-white"
      style={{ height: '100vh' }}
    >
      {/* Section label — fixed inside pin */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="w-6 h-[2px] bg-[#14EAEA]" />
          <span className="font-urbanist text-xs font-black tracking-[0.5em] text-[#0A0A0A]/35 uppercase">Our Services</span>
          <span className="w-6 h-[2px] bg-[#14EAEA]" />
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ willChange: 'transform' }}
      >
        {services.map((svc, i) => {
          const Icon = svc.icon
          return (
            <div
              key={svc.num}
              className="service-panel flex-shrink-0 h-full flex items-center justify-center"
              style={{ width: '100vw', backgroundColor: svc.bg }}
            >
              <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-20 h-full flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

                  {/* Text side */}
                  <div>
                    {/* Number */}
                    <div
                      className="font-urbanist font-black text-[120px] lg:text-[180px] leading-none select-none mb-2"
                      style={{ color: `${svc.accent}20`, letterSpacing: '-0.05em' }}
                    >
                      {svc.num}
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-center gap-4 mb-4 -mt-16 lg:-mt-24">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: svc.accent }}
                      >
                        <Icon size={24} className="text-[#0A0A0A]" />
                      </div>
                      <h2
                        className="font-urbanist font-black text-[#0A0A0A] leading-tight"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', letterSpacing: '-0.03em' }}
                      >
                        {svc.title}
                      </h2>
                    </div>

                    <p
                      className="font-urbanist font-bold text-xl mb-4"
                      style={{ color: svc.accent === '#B9FF33' ? '#4A7C10' : svc.accent }}
                    >
                      {svc.tagline}
                    </p>

                    <p className="font-urbanist text-[#0A0A0A]/55 text-lg leading-relaxed mb-10 max-w-md">
                      {svc.desc}
                    </p>

                    <a
                      href="/services"
                      className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-4 bg-[#0A0A0A] text-white rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-all duration-300"
                    >
                      Learn More →
                    </a>

                    {/* Progress dots */}
                    <div className="flex items-center gap-2 mt-12">
                      {services.map((_, j) => (
                        <div
                          key={j}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === j ? '24px' : '6px',
                            height: '6px',
                            backgroundColor: i === j ? svc.accent : 'rgba(0,0,0,0.15)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="relative hidden lg:block h-[500px]">
                    <div className="relative w-full h-full rounded-[24px] overflow-hidden shadow-2xl">
                      <Image
                        src={svc.image}
                        alt={svc.title + ' — Webink Solutions'}
                        fill
                        className="object-cover"
                        sizes="50vw"
                      />
                      {/* Accent border */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ backgroundColor: svc.accent }}
                      />
                    </div>
                    {/* Floating number badge */}
                    <div
                      className="absolute -top-6 -right-6 w-20 h-20 rounded-full flex items-center justify-center font-urbanist font-black text-2xl shadow-xl"
                      style={{ backgroundColor: svc.accent, color: '#0A0A0A' }}
                    >
                      {svc.num}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Horizontal scroll hint */}
      <div className="absolute bottom-8 right-8 z-30 hidden lg:flex items-center gap-2 text-[#0A0A0A]/30">
        <span className="font-urbanist text-xs tracking-wider uppercase">Scroll to explore</span>
        <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
          <path d="M0 4H22M22 4L19 1M22 4L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}
