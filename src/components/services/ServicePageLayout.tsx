'use client'
import { useState } from 'react'
import EditableImage from '@/components/editor/EditableImage'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe, Search, TrendingUp, Share2, Server, Brain,
  Zap, Shield, BarChart3, Clock, Users, Target,
  Megaphone, Palette, Code, Cpu, CheckCircle2, ChevronDown,
} from 'lucide-react'
import EditableText from '@/components/editor/EditableText'
import EditableBackground from '@/components/editor/EditableBackground'
import { useEditor } from '@/components/editor/EditorContext'

/* ── Icon Map ─────────────────────────────────────────────── */
const iconMap: Record<string, React.ElementType> = {
  Globe, Search, TrendingUp, Share2, Server, Brain,
  Zap, Shield, BarChart3, Clock, Users, Target,
  Megaphone, Palette, Code, Cpu, CheckCircle2, ChevronDown,
}

/* ── Types ────────────────────────────────────────────────── */
interface PricingTier {
  name: string
  price: string
  period?: string
  features: string[]
  recommended?: boolean
  contactOnly?: boolean
}

interface ServicePhoto {
  src: string
  alt: string
  objectPosition?: string
}

interface ServicePageProps {
  pageSlug?: string
  eyebrow: string
  headline: string
  headlineAccent: string
  subtext: string
  heroImage: string
  features: { icon: string; title: string; description: string }[]
  processSteps: { title: string; description: string }[]
  pricing?: PricingTier[]
  pricingNote?: string
  faqs: { question: string; answer: string }[]
  ctaText?: string
  ctaHref?: string
  photos?: ServicePhoto[]
  heroImagePosition?: string
  /** Product slug for linking Get Started buttons to /products/[slug]?tier=X */
  productSlug?: string
}

/* ── Shared Easing ────────────────────────────────────────── */
const ease = [0.25, 0.46, 0.45, 0.94]

/* ── Feature Colors Cycle ─────────────────────────────────── */
const accentColors = ['#14EAEA', '#F813BE', '#B9FF33', '#14EAEA']

/* ── FAQ Accordion Item ───────────────────────────────────── */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[#E5E5E5] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-urbanist font-bold text-lg text-[#1A1A1A] pr-8 group-hover:text-[#14EAEA] transition-colors duration-200">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#14EAEA] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        className="overflow-hidden"
      >
        <p className="font-urbanist text-[16px] leading-relaxed text-[#333]/60 pb-6">
          {answer}
        </p>
      </motion.div>
    </div>
  )
}

/* ── Main Layout Component ────────────────────────────────── */
export default function ServicePageLayout({
  pageSlug,
  eyebrow,
  headline,
  headlineAccent,
  subtext,
  heroImage,
  features,
  processSteps,
  pricing,
  pricingNote,
  faqs,
  ctaText = 'Get a Free Quote',
  ctaHref = '/contact',
  photos = [],
  heroImagePosition = 'center',
  productSlug,
}: ServicePageProps) {
  const { editMode } = useEditor()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-[#0F0F0F] overflow-hidden">
        {pageSlug ? (
          <EditableBackground
            pageSlug={pageSlug}
            blockKey="hero_bg"
            defaultSrc={heroImage}
            defaultOverlayOpacity={0.6}
            defaultPosition={heroImagePosition}
            imageProps={{ priority: true, sizes: '100vw' }}
            className="absolute inset-0"
          >
            <span />
          </EditableBackground>
        ) : (
          <div className="absolute inset-0">
            <EditableImage
              blockKey="hero_bg_fallback"
              src={heroImage}
              alt="Hero background"
              fill
              className="object-cover"
              style={{ objectPosition: heroImagePosition }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease }}
            className="font-urbanist font-black text-white leading-[0.92] mb-6"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
          >
            {pageSlug ? (
              <EditableText
                as="span"
                pageSlug={pageSlug}
                blockKey="hero_headline"
                defaultValue={`${headline} ${headlineAccent}`}
              >
                {headline}{' '}
                <span className="text-[#14EAEA]">{headlineAccent}</span>
              </EditableText>
            ) : (
              <>{headline}{' '}<span className="text-[#14EAEA]">{headlineAccent}</span></>
            )}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            <EditableText
              as="p"
              pageSlug={pageSlug || ''}
              blockKey="hero_subtext"
              defaultValue={subtext}
              className="font-urbanist text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="flex flex-wrap gap-4"
          >
            {pricing && pricing.length > 0 ? (
              <a
                href="#pricing"
                className="inline-block bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
              >
                View Pricing
              </a>
            ) : (
              <Link
                href={ctaHref}
                className="inline-block bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
              >
                {ctaText}
              </Link>
            )}
            {pricing && pricing.length > 0 && (
              <Link
                href={ctaHref}
                className="inline-block border border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-[#0A0A0A] transition-colors duration-200"
              >
                {ctaText}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════════════════════ */}
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
              pageSlug={pageSlug || 'services'}
              blockKey="features_eyebrow"
              defaultValue="Why Choose Us"
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
              pageSlug={pageSlug || 'services'}
              blockKey="features_heading"
              defaultValue="What Sets Us Apart"
              className="font-urbanist font-black text-[#1A1A1A] mb-16 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Zap
              const color = accentColors[i % accentColors.length]
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease }}
                  className="group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
                    style={{ backgroundColor: color + '18' }}
                  >
                    <Icon size={20} style={{ color }} strokeWidth={2} />
                  </div>
                  <h3 className="font-urbanist font-bold text-lg text-[#1A1A1A] mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-urbanist text-[15px] text-[#333]/60 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PROCESS SECTION
      ════════════════════════════════════════════════════════ */}
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
              pageSlug={pageSlug || 'services'}
              blockKey="process_eyebrow"
              defaultValue="Our Process"
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
              pageSlug={pageSlug || 'services'}
              blockKey="process_heading"
              defaultValue="How We Work"
              className="font-urbanist font-black text-[#1A1A1A] mb-16 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {processSteps.map((step, i) => {
              const stepColor = accentColors[i % accentColors.length]
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease }}
                >
                  <div
                    className="font-urbanist leading-none select-none mb-4"
                    style={{
                      fontSize: 'clamp(4rem, 8vw, 6rem)',
                      fontWeight: 100,
                      letterSpacing: '-0.04em',
                      color: stepColor,
                      opacity: 0.8,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-urbanist font-bold text-xl text-[#1A1A1A] mb-3">
                    {step.title}
                  </h3>
                  <p className="font-urbanist text-[15px] text-[#333]/60 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TEAM / WORKSPACE PHOTO STRIP
      ════════════════════════════════════════════════════════ */}
      {photos.length >= 3 && (
        <section className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                viewport={{ once: true, margin: '-80px' }}
                className="lg:col-span-5 overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="relative h-[350px] lg:h-[480px]">
                  <EditableImage
                    pageSlug={pageSlug || 'services'}
                    blockKey="team_photo_main"
                    src={photos[2].src}
                    alt={photos[2].alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: photos[2].objectPosition || 'center' }}
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="lg:col-span-7"
              >
                <EditableText
                  as="p"
                  pageSlug={pageSlug || 'services'}
                  blockKey="team_eyebrow"
                  defaultValue="Real People, Real Results"
                  className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
                />
                <EditableText
                  as="h2"
                  pageSlug={pageSlug || 'services'}
                  blockKey="team_heading"
                  defaultValue="Built by a Team That Gets It."
                  className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
                />
                <EditableText
                  as="p"
                  pageSlug={pageSlug || 'services'}
                  blockKey="team_body_1"
                  defaultValue="Webink Solutions is a Sarasota-based digital agency founded by Sean Rowe. Every strategy is backed by data, built for humans, and optimized for growth."
                  className="font-urbanist text-[17px] text-[#333]/60 leading-relaxed mb-6"
                />
                <EditableText
                  as="p"
                  pageSlug={pageSlug || 'services'}
                  blockKey="team_body_2"
                  defaultValue="No outsourcing, no cookie-cutter templates. Just a dedicated local team that shows up, delivers results, and genuinely cares about your success."
                  className="font-urbanist text-[15px] text-[#333]/40 leading-relaxed"
                />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════════════════════ */}
      {pricing && pricing.length > 0 && (
        <section id="pricing" className="bg-white px-6 md:px-16 lg:px-24 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <EditableText
                as="p"
                pageSlug={pageSlug || 'services'}
                blockKey="pricing_eyebrow"
                defaultValue="Pricing"
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
                pageSlug={pageSlug || 'services'}
                blockKey="pricing_heading"
                defaultValue="Transparent Pricing"
                className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
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
                pageSlug={pageSlug || 'services'}
                blockKey="pricing_subtext"
                defaultValue="No hidden fees, no long-term contracts. Choose the plan that fits your business and scale as you grow."
                className="font-urbanist text-[17px] text-[#333]/60 leading-relaxed max-w-2xl mb-14"
              />
            </motion.div>

            <div
              className={`grid gap-8 ${
                pricing.length === 1
                  ? 'max-w-md mx-auto'
                  : pricing.length === 2
                  ? 'md:grid-cols-2 max-w-3xl mx-auto'
                  : pricing.length === 3
                  ? 'md:grid-cols-3'
                  : 'md:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {pricing.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease }}
                  className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 ${
                    tier.recommended
                      ? 'border-[#14EAEA] shadow-[0_8px_40px_rgba(20,234,234,0.15)]'
                      : 'border-[#E5E5E5] hover:border-[#14EAEA] hover:shadow-lg'
                  }`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[#14EAEA] text-[#0A0A0A] text-xs font-bold tracking-wider uppercase px-4 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}

                  <h3 className="font-urbanist font-bold text-lg text-[#1A1A1A] mb-4">
                    {tier.name}
                  </h3>

                  {tier.contactOnly ? (
                    <div className="mb-6">
                      <span className="font-urbanist text-2xl font-black text-[#1A1A1A]">
                        Contact Us
                      </span>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <span className="font-urbanist text-4xl font-black text-[#1A1A1A]">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="font-urbanist text-base font-normal text-[#333]/50">
                          /{tier.period}
                        </span>
                      )}
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-[#14EAEA] flex-shrink-0 mt-0.5" />
                        <span className="font-urbanist text-[14px] text-[#333]/60 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={productSlug && !tier.contactOnly
                      ? `/products/${productSlug}?tier=${tier.name.toLowerCase()}&billing=monthly`
                      : ctaHref
                    }
                    className={`block text-center font-semibold px-6 py-3 rounded-full transition-colors duration-200 ${
                      tier.recommended
                        ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3]'
                        : 'border border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {tier.contactOnly ? 'Contact Us' : 'Buy Now'}
                  </Link>
                </motion.div>
              ))}
            </div>

            {pricingNote && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                className="font-urbanist text-sm text-[#333]/40 text-center mt-8"
              >
                {pricingNote}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════
          FAQ SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8F8F8] px-6 md:px-16 lg:px-24 py-20 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <EditableText
              as="p"
              pageSlug={pageSlug || 'services'}
              blockKey="faq_eyebrow"
              defaultValue="FAQ"
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
              pageSlug={pageSlug || 'services'}
              blockKey="faq_heading"
              defaultValue="Frequently Asked Questions"
              className="font-urbanist font-black text-[#1A1A1A] mb-12 leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            viewport={{ once: true, margin: '-60px' }}
            className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-8"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════════ */}
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
              pageSlug={pageSlug || 'services'}
              blockKey="cta_eyebrow"
              defaultValue="Let's Talk"
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
              pageSlug={pageSlug || 'services'}
              blockKey="cta_heading"
              defaultValue="Ready to Get Started?"
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
              pageSlug={pageSlug || 'services'}
              blockKey="cta_subtext"
              defaultValue="Schedule a free consultation and let us show you how we can grow your business with a clear, results-driven strategy."
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
              href={ctaHref}
              onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
              className="bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
            >
              <EditableText
                as="span"
                pageSlug={pageSlug || 'services'}
                blockKey="cta_button_text"
                defaultValue={ctaText}
              />
            </Link>
            <a
              href="tel:9418401381"
              onClick={(e) => { if (editMode) { e.preventDefault(); e.stopPropagation() } }}
              className="border border-[#14EAEA] text-[#14EAEA] font-semibold px-8 py-4 rounded-full hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200"
            >
              <EditableText
                as="span"
                pageSlug={pageSlug || 'services'}
                blockKey="cta_phone_text"
                defaultValue="Call (941) 840-1381"
              />
            </a>
          </motion.div>
        </div>
      </section>

    </>
  )
}
