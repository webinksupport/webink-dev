'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEditor } from '@/components/editor/EditorContext'

const ease = [0.15, 0.75, 0.5, 1]

export default function FounderI({ content }: { content?: Record<string, string> } = {}) {
  const { editMode } = useEditor()
  return (
    <section className="bg-[#0F0F0F] py-24 lg:py-36 overflow-hidden contain-paint">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Headshot */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40, rotate: -4 }}
            whileInView={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.6, ease: [0.2, 0.65, 0.3, 1] }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-4 flex justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="overflow-hidden rounded-full shadow-2xl w-64 h-64 lg:w-80 lg:h-80 border-4 border-[#14EAEA]/20">
              <Image
                data-page="home"
                data-block="founder_image"
                src={content?.founder_image || '/images/photoshoot/SquareSean2.jpg'}
                alt="Sean Rowe — Founder of Webink Solutions, Sarasota digital marketing agency"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'top center' }}
              />
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, y: 40, x: 30 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease }}
            className="lg:col-span-8"
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#14EAEA]" />
              <span
                data-page="home"
                data-block="founder_eyebrow"
                className="font-urbanist text-xs font-black tracking-[0.5em] text-white/30 uppercase"
              >
                {content?.founder_eyebrow || 'Meet the Founder'}
              </span>
            </div>

            <h2
              data-page="home"
              data-block="founder_heading"
              className="font-urbanist font-black text-white leading-[0.92] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}
            >
              {content?.founder_heading || 'Sean Rowe.'}
            </h2>

            <p
              data-page="home"
              data-block="founder_bio_1"
              className="font-urbanist text-white/60 text-xl leading-relaxed mb-6"
            >
              {content?.founder_bio_1 || 'Sean Rowe founded Webink Solutions in Sarasota, FL with a simple mission: build websites and marketing systems that actually drive business. Every strategy is built around data, designed for humans, and optimized for growth.'}
            </p>

            <p
              data-page="home"
              data-block="founder_bio_2"
              className="font-urbanist text-white/35 text-lg leading-relaxed mb-10"
            >
              {content?.founder_bio_2 || 'Before building the agency, Sean served as a firefighter and paramedic — a background that instilled discipline, problem-solving under pressure, and a service-first mindset that shapes every client relationship at Webink.'}
            </p>

            <Link
              href="/about"
              onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
              className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-4 border border-[#14EAEA] text-[#14EAEA] rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-all duration-300"
            >
              <span
                data-page="home"
                data-block="founder_cta_text"
              >
                {content?.founder_cta_text || 'Learn Our Story →'}
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
