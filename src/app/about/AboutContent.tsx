'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Target, Users, Zap } from 'lucide-react'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'

const ease = [0.25, 0.46, 0.45, 0.94]

const teamPhotos = [
  { src: '/images/photos/team-duo.jpg', alt: 'Webink Solutions team members collaborating in Sarasota', blockKey: 'team_photo_1' },
  { src: '/images/photos/team-rooftop.jpg', alt: 'Webink Solutions team on rooftop — Sarasota digital agency', blockKey: 'team_photo_2' },
  { src: '/images/photos/team-kelley.jpg', alt: 'Kelley from the Webink Solutions team', blockKey: 'team_photo_3' },
  { src: '/images/photos/team-family.jpg', alt: 'The Webink Solutions family — Sarasota, FL', blockKey: 'team_photo_4' },
]

const values = [
  { icon: Target, title: 'Results-Driven', description: 'Every strategy is tied to a measurable outcome. We don\'t chase vanity metrics — we chase growth.', color: '#14EAEA', key: 'value_results' },
  { icon: Heart, title: 'Built on Trust', description: 'Transparency in everything — pricing, reporting, and communication. No surprises, no hidden fees.', color: '#F813BE', key: 'value_trust' },
  { icon: Users, title: 'Local First', description: 'We live and work in Sarasota. We know the market, we know the community, and we show up.', color: '#B9FF33', key: 'value_local' },
  { icon: Zap, title: 'Forward-Thinking', description: 'AI, automation, and modern frameworks. We bring cutting-edge tools to Main Street businesses.', color: '#14EAEA', key: 'value_forward' },
]

export default function AboutContent({ content }: { content: Record<string, string> }) {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        <div className="absolute inset-0">
          <EditableImage
            blockKey="hero_image"
            src="/images/photos/team-rooftop.jpg"
            alt="Webink Solutions team"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            <EditableText
              as="span"
              blockKey="hero_eyebrow"
              defaultValue="About Us"
            />
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease }}
          >
            <EditableText
              as="h1"
              blockKey="hero_headline"
              defaultValue="Real People. Real Results."
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
              defaultValue="Webink Solutions is a Sarasota-based digital agency that helps local businesses grow through web design, SEO, and data-driven marketing."
              className="font-urbanist text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ FOUNDER STORY ═══ */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              viewport={{ once: true, margin: '-80px' }}
              className="overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="relative h-[400px] lg:h-[550px]">
                <EditableImage
                  blockKey="founder_image"
                  src="/images/photos/sean-hero.jpg"
                  alt="Sean Rowe — founder of Webink Solutions"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'top center' }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
            >
              <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4">
                <EditableText as="span" blockKey="founder_eyebrow" defaultValue="The Founder" />
              </p>
              <EditableText
                as="h2"
                blockKey="founder_name"
                defaultValue="Sean Rowe"
                className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
              />
              <div className="font-urbanist text-[17px] text-[#333]/60 leading-relaxed space-y-4">
                {content.founder_bio ? (
                  <div dangerouslySetInnerHTML={{ __html: content.founder_bio }} />
                ) : (
                  <>
                    <EditableText
                      as="p"
                      blockKey="founder_bio_1"
                      defaultValue="Before founding Webink Solutions, Sean Rowe spent years as a firefighter and paramedic — running into situations most people run from. That background instilled a work ethic, calm under pressure, and commitment to service that defines how Webink operates today."
                    />
                    <EditableText
                      as="p"
                      blockKey="founder_bio_2"
                      defaultValue="When Sean made the leap from emergency services to digital marketing, he brought that same intensity. He taught himself web development, SEO, and paid advertising from the ground up — not from a classroom, but from building real sites for real businesses."
                    />
                    <EditableText
                      as="p"
                      blockKey="founder_bio_3"
                      defaultValue="Today, Webink Solutions serves 50+ clients across Sarasota, Tampa, and Bradenton. Every strategy is built on data, every design is built for humans, and every client is treated like the only one."
                    />
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM PHOTOS ═══ */}
      <section className="bg-[#F8F8F8] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              blockKey="team_eyebrow"
              defaultValue="The Team"
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
              blockKey="team_heading"
              defaultValue="Small Team. Big Impact."
              className="font-urbanist font-black text-[#1A1A1A] mb-12 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {teamPhotos.map((photo, i) => (
              <motion.div
                key={photo.src}
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                viewport={{ once: true, margin: '-80px' }}
                className="overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="relative aspect-[3/4]">
                  <EditableImage
                    blockKey={photo.blockKey}
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MISSION & VALUES ═══ */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                viewport={{ once: true, margin: '-60px' }}
              >
                <EditableText
                  as="p"
                  blockKey="mission_eyebrow"
                  defaultValue="Our Mission"
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
                  blockKey="mission_heading"
                  defaultValue="We Drive Growth Through Structure & Process"
                  className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true, margin: '-60px' }}
              className="flex items-end"
            >
              <EditableText
                as="p"
                blockKey="mission_body"
                defaultValue="Too many agencies hide behind jargon and vanity metrics. We believe in transparent processes, measurable results, and honest communication. When you work with Webink, you know exactly what you are getting — and you can see it working."
                className="font-urbanist text-[17px] text-[#333]/60 leading-relaxed"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: val.color + '18' }}>
                    <Icon size={20} style={{ color: val.color }} strokeWidth={2} />
                  </div>
                  <EditableText
                    as="h3"
                    blockKey={`${val.key}_title`}
                    defaultValue={val.title}
                    className="font-urbanist font-bold text-lg text-[#1A1A1A] mb-3"
                  />
                  <EditableText
                    as="p"
                    blockKey={`${val.key}_desc`}
                    defaultValue={val.description}
                    className="font-urbanist text-[15px] text-[#333]/60 leading-relaxed"
                  />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-[#0F0F0F] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              blockKey="cta_eyebrow"
              defaultValue="Let's Work Together"
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
              defaultValue="Ready to Grow Your Business?"
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
              defaultValue="Schedule a free consultation and let us show you what a results-driven digital strategy looks like."
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
            <Link href="/contact" className="bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200">
              <EditableText as="span" blockKey="cta_button_1" defaultValue="Get a Free Quote" />
            </Link>
            <a href="tel:9418401381" className="border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200">
              <EditableText as="span" blockKey="cta_button_2" defaultValue="Call (941) 840-1381" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
