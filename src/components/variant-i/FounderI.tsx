'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'

const ease = [0.25, 0.46, 0.45, 0.94]

export default function FounderI({ content }: { content?: Record<string, string> } = {}) {
  return (
    <section className="bg-[#0F0F0F] py-24 lg:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Headshot */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="overflow-hidden rounded-full shadow-2xl w-64 h-64 lg:w-80 lg:h-80 border-4 border-[#14EAEA]/20">
              <EditableImage
                pageSlug="home"
                blockKey="founder_image"
                src="/images/photoshoot/SquareSean2.jpg"
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="lg:col-span-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#14EAEA]" />
              <span className="font-urbanist text-xs font-black tracking-[0.5em] text-white/30 uppercase">Meet the Founder</span>
            </div>

            <h2
              className="font-urbanist font-black text-white leading-[0.92] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}
            >
              Sean{' '}
              <span className="text-[#14EAEA]">Rowe.</span>
            </h2>

            <EditableText
              as="p"
              pageSlug="home"
              blockKey="founder_bio_1"
              defaultValue="Sean Rowe founded Webink Solutions in Sarasota, FL with a simple mission: build websites and marketing systems that actually drive business. Every strategy is built around data, designed for humans, and optimized for growth."
              className="font-urbanist text-white/60 text-xl leading-relaxed mb-6"
            />

            <EditableText
              as="p"
              pageSlug="home"
              blockKey="founder_bio_2"
              defaultValue="Before building the agency, Sean served as a firefighter and paramedic — a background that instilled discipline, problem-solving under pressure, and a service-first mindset that shapes every client relationship at Webink."
              className="font-urbanist text-white/35 text-lg leading-relaxed mb-10"
            />

            <Link
              href="/about"
              className="inline-flex items-center gap-3 font-urbanist font-bold text-sm px-8 py-4 border border-[#14EAEA] text-[#14EAEA] rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-all duration-300"
            >
              Learn Our Story →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
