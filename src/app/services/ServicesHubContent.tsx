'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Globe, Search, TrendingUp, Share2, Brain, Code, Server,
} from 'lucide-react'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'

const services = [
  {
    icon: Globe,
    title: 'Web Design',
    desc: 'Custom responsive websites engineered for performance, speed, and real conversion. Built to grow with your business.',
    color: '#14EAEA',
    href: '/services/web-design',
    image: '/images/services/web-design-hero.png',
    key: 'svc_web_design',
  },
  {
    icon: Search,
    title: 'SEO Services',
    desc: 'Technical audits, content strategy, local SEO, and transparent monthly reporting. Dominate search results in Sarasota and beyond.',
    color: '#F813BE',
    href: '/services/seo',
    image: '/images/services/seo-hero.png',
    key: 'svc_seo',
  },
  {
    icon: Share2,
    title: 'Social Media Marketing',
    desc: 'Content creation, scheduling, community management, and analytics across every major platform.',
    color: '#B9FF33',
    href: '/services/social-media',
    image: '/images/services/social-media-hero.png',
    key: 'svc_social',
  },
  {
    icon: TrendingUp,
    title: 'Paid Advertising',
    desc: 'Google Ads and Meta campaigns engineered for ROI. Real leads, data-driven optimization, no vanity metrics.',
    color: '#14EAEA',
    href: '/services/paid-advertising',
    image: '/images/services/ppc-ads-hero.png',
    key: 'svc_ppc',
  },
  {
    icon: Brain,
    title: 'AI-Powered Marketing',
    desc: 'Leverage AI to automate, optimize, and scale your marketing beyond what traditional agencies can deliver.',
    color: '#F813BE',
    href: '/services/ai-marketing',
    image: '/images/services/ai-marketing-hero.png',
    key: 'svc_ai',
  },
  {
    icon: Server,
    title: 'Web Hosting',
    desc: 'Fully managed web hosting with free SSL, daily backups, 99.9% uptime, and 24/7 monitoring. Starting at $31/mo.',
    color: '#14EAEA',
    href: '/services/web-hosting',
    image: '/images/services/web-design-hero.png',
    key: 'svc_hosting',
  },
  {
    icon: Code,
    title: 'Custom CRM & SaaS',
    desc: 'Purpose-built software and CRM systems tailored to your workflows. Own your tools, not rent them.',
    color: '#B9FF33',
    href: '/services/custom-crm',
    image: '/images/services/crm-hero.png',
    key: 'svc_crm',
  },
]

const ease = [0.25, 0.46, 0.45, 0.94]

export default function ServicesHubContent() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/photoshoot/_UTA4057.jpg"
            alt=""
            fill
            className="object-cover opacity-15"
            style={{ objectPosition: 'center' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[#0F0F0F]/75" />
        </div>
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <EditableText
                as="p"
                blockKey="hero_eyebrow"
                defaultValue="Our Services"
                className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease }}
            >
              <EditableText
                as="h1"
                blockKey="hero_headline"
                defaultValue="Full-Service Digital Agency."
                className="font-urbanist font-black text-white leading-[0.92] mb-6"
                style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              <EditableText
                as="p"
                blockKey="hero_subtext"
                defaultValue="Everything your Sarasota business needs to dominate the digital landscape — web design, SEO, social media, paid ads, AI marketing, and custom software — all under one roof."
                className="font-urbanist text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl"
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 40 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease }}
            className="hidden lg:block overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="relative h-[400px]">
              <EditableImage
                blockKey="hero_image"
                src="/images/photoshoot/DSC04500-2.jpg"
                alt="Sean Rowe and the Webink Solutions team — full-service digital agency in Sarasota"
                fill
                className="object-cover"
                style={{ objectPosition: 'top center' }}
                sizes="50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              blockKey="grid_eyebrow"
              defaultValue="What We Do"
              className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="h2"
              blockKey="grid_heading"
              defaultValue="Services Built for Growth"
              className="font-urbanist font-black text-[#1A1A1A] mb-16 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>

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
                        style={{ objectPosition: 'center' }}
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

                      <EditableText
                        as="h3"
                        blockKey={`${svc.key}_title`}
                        defaultValue={svc.title}
                        className="font-urbanist font-black text-[20px] text-[#0F0F0F] mb-3 leading-tight"
                      />

                      <EditableText
                        as="p"
                        blockKey={`${svc.key}_desc`}
                        defaultValue={svc.desc}
                        className="font-urbanist text-[14px] text-[#333]/60 leading-relaxed flex-1 mb-6"
                      />

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
            style={{ objectPosition: 'center' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0F0F0F]/85" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              blockKey="cta_eyebrow"
              defaultValue="Get Started"
              className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="h2"
              blockKey="cta_heading"
              defaultValue="Not Sure Where to Start?"
              className="font-urbanist font-black text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              blockKey="cta_subtext"
              defaultValue="Book a free consultation and we will audit your digital presence, identify quick wins, and build a custom strategy for your business."
              className="font-urbanist text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-10"
            />
          </motion.div>
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
              <EditableText as="span" blockKey="cta_button_1" defaultValue="Get a Free Quote" />
            </Link>
            <a
              href="tel:9418401381"
              className="border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200"
            >
              <EditableText as="span" blockKey="cta_button_2" defaultValue="Call (941) 840-1381" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
