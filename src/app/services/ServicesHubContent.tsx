'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Globe, Search, TrendingUp, Share2, Brain, Code,
} from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Web Design',
    desc: 'Custom responsive websites engineered for performance, speed, and real conversion. Built to grow with your business.',
    color: '#14EAEA',
    href: '/services/web-design',
    image: '/images/services/web-design-hero.png',
  },
  {
    icon: Search,
    title: 'SEO Services',
    desc: 'Technical audits, content strategy, local SEO, and transparent monthly reporting. Dominate search results in Sarasota and beyond.',
    color: '#F813BE',
    href: '/services/seo',
    image: '/images/services/seo-hero.png',
  },
  {
    icon: Share2,
    title: 'Social Media Marketing',
    desc: 'Content creation, scheduling, community management, and analytics across every major platform.',
    color: '#B9FF33',
    href: '/services/social-media',
    image: '/images/services/social-media-hero.png',
  },
  {
    icon: TrendingUp,
    title: 'Paid Advertising',
    desc: 'Google Ads and Meta campaigns engineered for ROI. Real leads, data-driven optimization, no vanity metrics.',
    color: '#14EAEA',
    href: '/services/paid-advertising',
    image: '/images/services/ppc-ads-hero.png',
  },
  {
    icon: Brain,
    title: 'AI-Powered Marketing',
    desc: 'Leverage AI to automate, optimize, and scale your marketing beyond what traditional agencies can deliver.',
    color: '#F813BE',
    href: '/services/ai-marketing',
    image: '/images/services/ai-marketing-hero.png',
  },
  {
    icon: Code,
    title: 'Custom CRM & SaaS',
    desc: 'Purpose-built software and CRM systems tailored to your workflows. Own your tools, not rent them.',
    color: '#B9FF33',
    href: '/services/custom-crm',
    image: '/images/services/crm-hero.png',
  },
]

const ease = [0.25, 0.46, 0.45, 0.94]

export default function ServicesHubContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-32 lg:py-40">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            Our Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease }}
            className="font-urbanist font-black text-white leading-[0.92] mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
          >
            Full-Service{' '}
            <span className="text-[#F813BE]">Digital Agency.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="font-urbanist text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            Everything your Sarasota business needs to dominate the digital landscape — web design, SEO, social media, paid ads, AI marketing, and custom software — all under one roof.
          </motion.p>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            What We Do
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="font-urbanist font-black text-[#1A1A1A] mb-16 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
          >
            Services Built for Growth
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease }}
                >
                  <Link
                    href={svc.href}
                    className="group relative flex flex-col bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#14EAEA] hover:shadow-[0_8px_40px_rgba(20,234,234,0.15)] transition-all duration-300 cursor-pointer h-full overflow-hidden"
                  >
                    {/* Card image */}
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image
                        src={svc.image}
                        alt={`${svc.title} — Webink Solutions`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      {/* Icon circle */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-6 flex-shrink-0 -mt-10 relative z-10 border-2 border-white shadow-md"
                        style={{ backgroundColor: svc.color + '18' }}
                      >
                        <Icon size={18} style={{ color: svc.color }} strokeWidth={2} />
                      </div>

                      <h3 className="font-urbanist font-black text-[20px] text-[#0F0F0F] mb-3 leading-tight">
                        {svc.title}
                      </h3>

                      <p className="font-urbanist text-[14px] text-[#333]/60 leading-relaxed flex-1 mb-6">
                        {svc.desc}
                      </p>

                      <span
                        className="font-urbanist font-bold text-sm transition-colors duration-200"
                        style={{ color: svc.color }}
                      >
                        Learn More &rarr;
                      </span>
                    </div>

                    {/* Hover accent line at top */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      style={{ backgroundColor: svc.color }}
                    />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative px-6 md:px-16 lg:px-24 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/services/sarasota-waterfront.png"
            alt="Sarasota waterfront skyline"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0F0F0F]/85" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            Get Started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="font-urbanist font-black text-white mb-6 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
          >
            Not Sure Where to Start?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="font-urbanist text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10"
          >
            Book a free consultation and we will audit your digital presence, identify quick wins, and build a custom strategy for your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:9418401381"
              className="border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200"
            >
              Call (941) 840-1381
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
