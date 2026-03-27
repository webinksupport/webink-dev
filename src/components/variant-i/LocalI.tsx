'use client'
import { motion } from 'framer-motion'
import EditableText from '@/components/editor/EditableText'
import EditableImage from '@/components/editor/EditableImage'

const ease = [0.25, 0.46, 0.45, 0.94]

export default function LocalI({ content }: { content?: Record<string, string> } = {}) {
  return (
    <section className="bg-white py-24 lg:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#F813BE]" />
              <EditableText
                as="span"
                blockKey="local_eyebrow"
                defaultValue="Proudly Local"
                className="font-urbanist text-xs font-black tracking-[0.5em] text-[#0F0F0F]/30 uppercase"
              />
            </div>

            <EditableText
              as="h2"
              blockKey="local_heading"
              defaultValue="Sarasota's Digital Agency."
              className="font-urbanist font-black text-[#0F0F0F] leading-[0.92] mb-8"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}
            />

            <EditableText
              as="p"
              blockKey="local_body_1"
              defaultValue="We live and work on the Gulf Coast. That means we understand Sarasota, Tampa, and Bradenton — the markets, the people, and what it takes to stand out locally."
              className="font-urbanist text-[#333]/55 text-xl leading-relaxed mb-6"
            />

            <EditableText
              as="p"
              blockKey="local_body_2"
              defaultValue="When you work with Webink, you get a team that answers the phone, shows up to meetings, and genuinely cares about your success. No offshore outsourcing. No runaround. Just results."
              className="font-urbanist text-[#333]/35 text-lg leading-relaxed mb-8"
            />

            <div className="flex flex-wrap gap-3">
              {['Sarasota, FL', 'Tampa, FL', 'Bradenton, FL'].map((city) => (
                <span
                  key={city}
                  className="font-urbanist text-sm font-bold px-5 py-2 rounded-full border border-[#14EAEA]/30 text-[#14EAEA]"
                >
                  {city}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            viewport={{ once: true, margin: '-80px' }}
            className="overflow-hidden rounded-2xl shadow-xl"
          >
            <EditableImage
              blockKey="local_image"
              src="/images/photoshoot/_UTA3992-Edit.jpg"
              alt="Webink Solutions team in downtown Sarasota, FL — local digital marketing agency"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              style={{ objectPosition: 'top center' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
