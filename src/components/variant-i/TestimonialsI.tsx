'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Tiffini Brown',
    company: 'Brown Mechanical Services',
    location: 'Sarasota, FL',
    service: 'Web Design + Marketing',
    initials: 'TB',
    preview: '"Webink completely transformed our online presence..."',
    full: '"Webink completely transformed our online presence. We went from almost no online visibility to ranking on the first page of Google within just a few months. Sean and the team are responsive, professional, and genuinely care about our business growing. I can\'t recommend them enough."',
    stars: 5,
    accentColor: '#14EAEA',
  },
  {
    name: 'Mike Rodriguez',
    company: 'Gulf Sands Realty',
    location: 'Sarasota, FL',
    service: 'Web Design',
    initials: 'MR',
    preview: '"Our new site drives real leads every single week..."',
    full: '"Our new site drives real leads every single week. Webink built us something that actually works — it looks amazing, loads fast, and converts. We\'ve seen a measurable increase in inquiries since launch. Worth every penny."',
    stars: 5,
    accentColor: '#F813BE',
  },
  {
    name: 'Sarah Chen',
    company: 'Bradenton Classical Academy',
    location: 'Bradenton, FL',
    service: 'Marketing + Web Design',
    initials: 'SC',
    preview: '"Professional, communicative, and results-focused..."',
    full: '"Working with Webink has been a game-changer. They\'re professional, communicative, and laser-focused on results. Our enrollment inquiries increased significantly after the website redesign and SEO campaign launched. I trust them completely with our digital presence."',
    stars: 5,
    accentColor: '#B9FF33',
  },
  {
    name: 'James Fitzgerald',
    company: 'Ankle Arthritis Centers',
    location: 'Sarasota, FL',
    service: 'SEO Services',
    initials: 'JF',
    preview: '"From invisible to page one — that\'s the Webink effect."',
    full: '"From invisible to page one — that\'s the Webink effect. Before working with Sean\'s team, we struggled to get found online. Now we rank for every major keyword in our market. The monthly reports are clear, the results are real, and the team is fantastic to work with."',
    stars: 5,
    accentColor: '#14EAEA',
  },
]

function FlipCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const [flipped, setFlipped] = useState(false)

  const stars = Array.from({ length: t.stars }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0, y: 75, rotateX: -15, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.95,
        delay: index * 0.12,
        ease: [0.2, 1, 0.2, 1],
      }}
      className="h-72 cursor-pointer select-none"
      style={{ perspective: '1000px', willChange: 'transform, opacity' }}
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      role="button"
      tabIndex={0}
      aria-label={`Testimonial from ${t.name} — tap to reveal full review`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped(!flipped) }}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl bg-white border border-black/8 shadow-md p-8 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {/* Stars */}
          <div className="flex gap-1">
            {stars.map((s) => (
              <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={t.accentColor}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>

          {/* Preview quote */}
          <p className="font-urbanist text-[#0A0A0A]/70 text-base leading-relaxed italic flex-1 mt-4">
            {t.preview}
          </p>

          {/* Attribution */}
          <div className="flex items-center gap-3 mt-6">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-urbanist font-black text-sm text-[#0A0A0A] flex-shrink-0"
              style={{ backgroundColor: t.accentColor }}
            >
              {t.initials}
            </div>
            <div>
              <div className="font-urbanist font-bold text-sm text-[#0A0A0A]">{t.name}</div>
              <div className="font-urbanist text-xs text-[#0A0A0A]/40">{t.company}</div>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#0A0A0A]/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            <span className="font-urbanist text-xs">Hover to read</span>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0A0A0A',
          }}
        >
          {/* Service badge */}
          <div
            className="inline-flex self-start text-[#0A0A0A] font-urbanist font-bold text-xs px-3 py-1.5 rounded-full"
            style={{ backgroundColor: t.accentColor }}
          >
            {t.service}
          </div>

          {/* Full quote */}
          <p className="font-urbanist text-white/70 text-sm leading-relaxed italic flex-1 mt-4 overflow-hidden">
            {t.full}
          </p>

          {/* Attribution */}
          <div className="flex items-center gap-3 mt-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-urbanist font-black text-sm text-[#0A0A0A] flex-shrink-0"
              style={{ backgroundColor: t.accentColor }}
            >
              {t.initials}
            </div>
            <div>
              <div className="font-urbanist font-bold text-sm text-white">{t.name}</div>
              <div className="font-urbanist text-xs text-white/40">{t.company} · {t.location}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TestimonialsI({ content }: { content?: Record<string, string> } = {}) {
  return (
    <section id="testimonials" className="bg-white py-24 lg:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#14EAEA]" />
              <span
                data-page="home"
                data-block="testimonials_eyebrow"
                className="font-urbanist text-xs font-black tracking-[0.5em] text-black/30 uppercase"
              >
                {content?.testimonials_eyebrow || 'Testimonials'}
              </span>
            </div>
            <h2
              data-page="home"
              data-block="testimonials_heading"
              className="font-urbanist font-black text-[#0A0A0A] leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', letterSpacing: '-0.04em' }}
            >
              {content?.testimonials_heading || 'What Clients Actually Say.'}
            </h2>
          </div>
          <p
            data-page="home"
            data-block="testimonials_subtext"
            className="font-urbanist text-[#0A0A0A]/50 text-base leading-relaxed max-w-xs"
          >
            {content?.testimonials_subtext || 'Hover each card to read the full review. Real clients, real results.'}
          </p>
        </div>

        {/* 3D flip card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <FlipCard key={t.name} t={t} index={i} />
          ))}
        </div>

        {/* Team photo strip */}
        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: -40, rotate: -2 }}
            whileInView={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="relative h-[200px]">
              <Image
                data-page="home"
                data-block="testimonials_photo_1"
                src={content?.testimonials_photo_1 || '/images/photos/team-kelley.jpg'}
                alt="Webink Solutions team member Kelley — Sarasota digital marketing"
                fill
                className="object-cover"
                style={{ objectPosition: 'top center' }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 50, rotateX: -8 }}
            whileInView={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.2, 0.65, 0.3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="overflow-hidden rounded-2xl shadow-xl"
            style={{ perspective: '1200px' }}
          >
            <div className="relative h-[200px]">
              <Image
                data-page="home"
                data-block="testimonials_photo_2"
                src={content?.testimonials_photo_2 || '/images/photoshoot/DSC04488.jpg'}
                alt="Webink Solutions professional team photo — client results"
                fill
                className="object-cover"
                style={{ objectPosition: 'top center' }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: 40, rotate: 2 }}
            whileInView={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.24, ease: [0.2, 0.65, 0.3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="relative h-[200px]">
              <Image
                data-page="home"
                data-block="testimonials_photo_3"
                src={content?.testimonials_photo_3 || '/images/photos/team-family.jpg'}
                alt="The Webink Solutions family — Sarasota based digital agency team"
                fill
                className="object-cover"
                style={{ objectPosition: 'top center' }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </motion.div>
        </div>

        {/* Google review CTA */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {['TB', 'MR', 'SC', 'JF'].map((init, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-urbanist font-bold text-xs text-[#0A0A0A]"
                style={{ backgroundColor: ['#14EAEA', '#F813BE', '#B9FF33', '#14EAEA'][i] }}
              >
                {init}
              </div>
            ))}
          </div>
          <div>
            <div
              data-page="home"
              data-block="testimonials_rating_title"
              className="font-urbanist font-bold text-sm text-[#0A0A0A]"
            >
              {content?.testimonials_rating_title || '5.0 on Google'}
            </div>
            <div
              data-page="home"
              data-block="testimonials_rating_subtitle"
              className="font-urbanist text-xs text-[#0A0A0A]/40"
            >
              {content?.testimonials_rating_subtitle || '50+ five-star reviews'}
            </div>
          </div>
          <a
            href="https://webink.solutions/review"
            className="ml-4 font-urbanist font-bold text-sm text-[#0A0A0A] border-b-2 border-[#14EAEA] pb-0.5 hover:text-[#14EAEA] transition-colors"
          >
            <span
              data-page="home"
              data-block="testimonials_cta_text"
            >
              {content?.testimonials_cta_text || 'Leave a Review →'}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
