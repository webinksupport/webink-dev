'use client'
import EditableImage from '@/components/editor/EditableImage'
import Link from 'next/link'
import { motion } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94]

const portfolioItems = [
  { src: '/images/portfolio/showcase.jpg', alt: 'Webink Solutions homepage design — modern web design Sarasota' },
  { src: '/images/portfolio/bca.jpg', alt: 'About page design — Sarasota web design agency portfolio' },
  { src: '/images/portfolio/ankle.jpg', alt: 'Services page design — custom web development Tampa FL' },
]

export default function WebDesignPortfolio() {
  return (
    <>
      {/* Portfolio Grid */}
      <section className="bg-[#F8F8F8] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            Our Work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="font-urbanist font-black text-[#1A1A1A] mb-16 leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
          >
            Recent Client Work
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {portfolioItems.map((item, i) => (
              <motion.div
                key={item.src}
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                viewport={{ once: true, margin: '-80px' }}
                className="overflow-hidden rounded-2xl shadow-xl"
              >
                <EditableImage
                  pageSlug="services/web-design"
                  blockKey={`portfolio_${i}_image`}
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Photo Split Section */}
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
              <EditableImage
                pageSlug="services/web-design"
                blockKey="portfolio_team_image"
                src="/images/photoshoot/DSC05067-Edit.jpg"
                alt="Webink Solutions team working on client website — Sarasota web design"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                style={{ objectPosition: 'center' }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4">
                Built by Hand
              </p>
              <h2
                className="font-urbanist font-black text-[#1A1A1A] leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
              >
                No Templates.{' '}
                <span className="text-[#14EAEA]">Ever.</span>
              </h2>
              <p className="font-urbanist text-[17px] leading-relaxed text-[#333]/60 mb-8">
                Every website we build starts with a blank canvas. We research your industry,
                study your competitors, and design a site that positions your business to win.
                The result is a website that looks and performs unlike anything else in your market.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
              >
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
