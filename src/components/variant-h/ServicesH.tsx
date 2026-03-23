'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const services = [
  {
    num: '01',
    title: 'Web Design',
    desc: 'Custom responsive websites built to convert visitors into customers. Fast, modern, SEO-ready.',
    image: '/images/photos/workspace-dark.jpg',
    href: '/services/web-design',
    accent: '#14EAEA',
  },
  {
    num: '02',
    title: 'SEO Services',
    desc: 'Keyword research, technical SEO, local optimization, and transparent monthly reporting.',
    image: '/images/photos/sean-about.jpg',
    href: '/services/sarasota-seo',
    accent: '#14EAEA',
  },
  {
    num: '03',
    title: 'Digital Marketing',
    desc: 'Google Ads and Meta campaigns engineered for ROI — real leads, not just impressions.',
    image: '/images/photos/team-rooftop.jpg',
    href: '/services/ppc-management-sarasota',
    accent: '#14EAEA',
  },
  {
    num: '04',
    title: 'Social Media',
    desc: 'Strategy, content creation, and community management that grows your audience.',
    image: '/images/photos/baja-beach.jpg',
    href: '/services/social-media-marketing',
    accent: '#14EAEA',
  },
  {
    num: '05',
    title: 'Web Hosting',
    desc: 'Managed hosting with enterprise uptime, daily backups, SSL, and full support.',
    image: '/images/photos/team-duo.jpg',
    href: '/services/web-hosting',
    accent: '#14EAEA',
  },
  {
    num: '06',
    title: 'Branding',
    desc: 'Logo design, brand identity systems, and visual consistency that makes you unforgettable.',
    image: '/images/photos/sean-street.jpg',
    href: '/services',
    accent: '#14EAEA',
  },
]

export default function ServicesH() {
  const [hovered, setHovered] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [60, 0])

  return (
    <section ref={sectionRef} id="services" className="bg-white py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header — editorial typographic */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20 items-end">
          <motion.div
            style={{ y: titleY }}
            className="lg:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#14EAEA]" />
              <span className="font-urbanist text-xs font-black tracking-[0.4em] text-black/30 uppercase">Services</span>
            </div>
            <h2
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', letterSpacing: '-0.04em' }}
            >
              WHAT WE<br />
              DO <span className="text-[#14EAEA]">BEST.</span>
            </h2>
          </motion.div>
          <div className="lg:col-span-4">
            <p className="font-urbanist text-black/45 leading-relaxed">
              Six core services. One integrated strategy. Built for Southwest Florida businesses ready to grow.
            </p>
          </div>
        </div>

        {/* Services: numbered list with expanding image reveal on hover */}
        <div className="divide-y-2 divide-black/5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link
                href={svc.href}
                className="group relative flex items-center gap-6 lg:gap-12 py-8 lg:py-10 overflow-hidden"
              >
                {/* Hover fill background */}
                <div
                  className="absolute inset-0 bg-[#0A0A0A] origin-left transition-all duration-500"
                  style={{
                    transform: hovered === i ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />

                {/* Number */}
                <span
                  className="relative font-urbanist font-black text-4xl lg:text-6xl tabular-nums transition-colors duration-500 w-20 shrink-0 text-right"
                  style={{ color: hovered === i ? '#14EAEA' : 'rgba(0,0,0,0.1)' }}
                >
                  {svc.num}
                </span>

                {/* Title */}
                <h3
                  className="relative font-urbanist font-black transition-colors duration-500 flex-1"
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 4rem)',
                    letterSpacing: '-0.025em',
                    color: hovered === i ? '#fff' : '#0A0A0A',
                  }}
                >
                  {svc.title}
                </h3>

                {/* Description — appears on hover */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className="relative hidden lg:block font-urbanist text-white/50 text-sm max-w-xs leading-relaxed"
                    >
                      {svc.desc}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Image reveal on hover */}
                <div className="relative overflow-hidden shrink-0 transition-all duration-500 rounded-sm"
                  style={{
                    width: hovered === i ? '160px' : '0px',
                    height: '100px',
                  }}
                >
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>

                {/* Arrow */}
                <span
                  className="relative font-urbanist font-black text-2xl transition-all duration-300 shrink-0"
                  style={{ color: hovered === i ? '#14EAEA' : 'rgba(0,0,0,0.15)' }}
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
