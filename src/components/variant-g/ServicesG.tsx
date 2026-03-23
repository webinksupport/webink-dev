'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const services = [
  { tag: '01', title: 'Web Design', desc: 'Custom responsive websites built to convert. Fast, engineered to rank.', accent: '#14EAEA', href: '/services/web-design' },
  { tag: '02', title: 'SEO Services', desc: 'Keyword research, on-page SEO, local optimization, and transparent ROI reporting.', accent: '#F813BE', href: '/services/sarasota-seo' },
  { tag: '03', title: 'Digital Marketing', desc: 'Google Ads and Meta campaigns engineered for measurable return.', accent: '#B9FF33', href: '/services/ppc-management-sarasota' },
  { tag: '04', title: 'Social Media', desc: 'Strategy, content, and community that grows your audience.', accent: '#14EAEA', href: '/services/social-media-marketing' },
  { tag: '05', title: 'Web Hosting', desc: 'Managed hosting with enterprise uptime, backups, and SSL.', accent: '#F813BE', href: '/services/web-hosting' },
  { tag: '06', title: 'Branding', desc: 'Logo design and brand systems that make your business unforgettable.', accent: '#B9FF33', href: '/services' },
]

// Scroll-scale image component
function ScaleImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 1.04])

  return (
    <div ref={ref} className="overflow-hidden rounded-sm">
      <motion.div style={{ scale }} className="relative h-64 lg:h-80">
        <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" />
      </motion.div>
    </div>
  )
}

export default function ServicesG() {
  return (
    <section id="services" className="bg-white py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Asymmetric header: text left overlapping into right */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[3px] bg-[#14EAEA]" />
              <span className="font-urbanist text-xs font-black tracking-[0.4em] text-black/30 uppercase">What We Do</span>
            </div>
            <h2
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', letterSpacing: '-0.025em' }}
            >
              SIX WAYS<br />
              WE <span className="text-[#F813BE]">GROW</span><br />
              YOUR BUSINESS.
            </h2>
          </motion.div>

          {/* Offset image — text overlaps */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block absolute right-0 top-0 w-[38%]"
          >
            <ScaleImage src="/images/photos/sean-about.jpg" alt="Sean at Webink" />
            <div className="mt-4 text-right">
              <p className="font-urbanist text-sm text-black/40 italic">
                &ldquo;We Drive Growth Through Structure &amp; Process&rdquo;
              </p>
            </div>
          </motion.div>
        </div>

        {/* Services: asymmetric grid — alternating */}
        <div className="space-y-0 divide-y divide-black/8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={svc.href}
                className="group flex items-center gap-6 lg:gap-12 py-8 hover:bg-[#F5F5F5] px-4 -mx-4 transition-colors duration-200"
              >
                <span
                  className="font-urbanist font-black text-5xl lg:text-7xl tabular-nums transition-colors duration-300"
                  style={{ color: `${svc.accent}30` }}
                >
                  {svc.tag}
                </span>
                <h3 className="font-urbanist font-black text-2xl lg:text-4xl text-[#0A0A0A] flex-1 group-hover:translate-x-2 transition-transform duration-300">
                  {svc.title}
                </h3>
                <p className="hidden lg:block font-urbanist text-black/45 text-sm max-w-xs leading-relaxed">
                  {svc.desc}
                </p>
                <div
                  className="ml-auto font-urbanist font-black text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ color: svc.accent }}
                >
                  →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap gap-4 items-center justify-between"
        >
          <p className="font-urbanist text-black/35 text-sm">Not sure where to start?</p>
          <Link
            href="/contact"
            className="font-urbanist font-black text-sm px-10 py-4 bg-[#14EAEA] text-black hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
          >
            Free Consultation →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
