'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const services = [
  { title: 'Web Design', desc: 'Custom responsive websites built to convert. Fast, modern, and engineered to rank well in search.', href: '/services/web-design', tag: '01' },
  { title: 'SEO Services', desc: 'Keyword research, on-page SEO, local optimization, and transparent reporting that proves ROI.', href: '/services/sarasota-seo', tag: '02' },
  { title: 'Digital Marketing', desc: 'Google Ads and Facebook/Instagram campaigns engineered for ROI — not just impressions.', href: '/services/ppc-management-sarasota', tag: '03' },
  { title: 'Social Media', desc: 'Strategy, content creation, and community management that grows your audience and drives engagement.', href: '/services/social-media-marketing', tag: '04' },
  { title: 'Web Hosting', desc: 'Managed hosting with enterprise uptime, daily backups, SSL, and full technical support included.', href: '/services/web-hosting', tag: '05' },
  { title: 'Branding', desc: 'Logo design, brand identity systems, and visual consistency that makes your business unforgettable.', href: '/services', tag: '06' },
]

export default function ServicesF() {
  return (
    <section id="services" className="py-24 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">

        {/* Minimal header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-xs tracking-[0.45em] text-black/25 uppercase font-urbanist mb-6">What We Do</p>
          <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight max-w-xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            One agency.<br />Every channel.
          </h2>
        </motion.div>

        {/* Services — editorial list layout */}
        <div className="divide-y divide-black/6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link
                href={svc.href}
                className="group flex items-start lg:items-center justify-between py-8 lg:py-10 gap-8 hover:pl-2 transition-all duration-300"
              >
                <div className="flex items-start lg:items-center gap-8 lg:gap-16 flex-1">
                  <span className="font-urbanist text-sm text-black/20 font-medium w-8 flex-shrink-0 mt-1 lg:mt-0">{svc.tag}</span>
                  <h3 className="font-urbanist font-black text-[#0A0A0A] group-hover:text-[#14EAEA] transition-colors duration-300" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                    {svc.title}
                  </h3>
                  <p className="hidden lg:block text-black/35 text-sm leading-relaxed font-urbanist max-w-sm flex-1">
                    {svc.desc}
                  </p>
                </div>
                <div className="flex-shrink-0 w-8 h-8 border border-black/10 group-hover:border-[#14EAEA] group-hover:bg-[#14EAEA] flex items-center justify-center transition-all duration-300">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 text-black/30 group-hover:text-black transition-colors">
                    <path d="M2 2h8v8M2 10L10 2" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
