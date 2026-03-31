'use client'
import { motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, getAnnualSavings } from '@/lib/product-content'

interface PricingCardProps {
  tierKey: string
  tierName: string
  tagline: string
  priceMonthly: number | null
  priceAnnual: number | null
  setupFee: number | null
  billing: 'monthly' | 'annual'
  isSelected: boolean
  isPopular: boolean
  isBestValue: boolean
  highlightedFeatures: string[]
  notIncluded: string[]
  ctaHref: string
  onSelect: () => void
  contactOnly?: boolean
  index: number
  /** When provided, "Get Started" opens checkout modal instead of navigating */
  onGetStarted?: () => void
}

const ease = [0.25, 0.46, 0.45, 0.94]

export default function PricingCard({
  tierName,
  tagline,
  priceMonthly,
  priceAnnual,
  setupFee,
  billing,
  isSelected,
  isPopular,
  isBestValue,
  highlightedFeatures,
  notIncluded,
  ctaHref,
  onSelect,
  contactOnly,
  index,
  onGetStarted,
}: PricingCardProps) {
  const isAnnual = billing === 'annual'
  const monthlyEquiv = priceAnnual ? Math.round(priceAnnual / 12) : null
  const displayPrice = isAnnual && monthlyEquiv ? monthlyEquiv : priceMonthly
  const annualTotal = priceAnnual || (priceMonthly ? priceMonthly * 12 : null)
  const savings = priceMonthly ? getAnnualSavings(priceMonthly) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease }}
      onClick={onSelect}
      className={`relative rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
        isPopular
          ? 'bg-[#111111] border-[#F813BE]/50 shadow-[0_8px_40px_rgba(248,19,190,0.15)] scale-[1.02] lg:scale-105'
          : isSelected
            ? 'bg-[#111111] border-[#14EAEA]/50 shadow-[0_8px_40px_rgba(20,234,234,0.15)]'
            : 'bg-[#111111] border-white/8 hover:border-[#14EAEA]/40 hover:shadow-[0_4px_20px_rgba(20,234,234,0.1)]'
      }`}
    >
      {/* Badges */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#F813BE] text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-full whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}
      {isBestValue && isAnnual && !isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#B9FF33] text-[#0A0A0A] text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-full whitespace-nowrap">
            Best Value
          </span>
        </div>
      )}

      {/* Tier name & tagline */}
      <h3 className="font-urbanist font-bold text-xl text-white mb-1">{tierName}</h3>
      <p className="font-urbanist text-sm text-white/40 mb-6">{tagline}</p>

      {/* Price */}
      {contactOnly ? (
        <div className="mb-6">
          <span className="font-urbanist text-2xl font-black text-[#F813BE]">
            Contact Us
          </span>
        </div>
      ) : (
        <div className="mb-6">
          {isAnnual && priceMonthly && (
            <div className="text-sm text-white/35 line-through mb-1">
              {formatPrice(priceMonthly)}/mo
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="font-urbanist text-4xl font-black text-white">
              {formatPrice(displayPrice)}
            </span>
            <span className="font-urbanist text-sm text-white/40">/mo</span>
          </div>
          {isAnnual && annualTotal && (
            <p className="font-urbanist text-xs text-white/30 mt-1">
              billed {formatPrice(annualTotal)}/yr
            </p>
          )}
          {isAnnual && savings > 0 && (
            <span className="inline-block mt-2 bg-[#B9FF33]/15 text-[#B9FF33] text-[10px] font-bold px-2.5 py-1 rounded-full">
              Save {formatPrice(savings)}/yr
            </span>
          )}
          {setupFee && setupFee > 0 && (
            <p className="font-urbanist text-xs text-white/30 mt-2">
              + {formatPrice(setupFee)} setup fee{' '}
              <span className="inline-block bg-amber-500/15 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">
                ONE-TIME
              </span>
            </p>
          )}
        </div>
      )}

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {highlightedFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2 size={14} className="text-[#14EAEA] flex-shrink-0 mt-0.5" />
            <span className="font-urbanist text-[13px] text-white/60 leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
        {notIncluded.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <X size={14} className="text-white/15 flex-shrink-0 mt-0.5" />
            <span className="font-urbanist text-[13px] text-white/20 leading-relaxed">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {onGetStarted ? (
        <button
          onClick={(e) => { e.stopPropagation(); onGetStarted(); }}
          className={`block w-full text-center font-urbanist font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 ${
            isPopular
              ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3] shadow-lg shadow-[#F813BE]/20'
              : isSelected
                ? 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-white shadow-lg shadow-[#14EAEA]/20'
                : 'border border-white/15 text-white/70 hover:border-[#14EAEA] hover:text-[#14EAEA]'
          }`}
        >
          Proceed to Checkout →
        </button>
      ) : (
        <Link
          href={ctaHref}
          onClick={(e) => e.stopPropagation()}
          className={`block text-center font-urbanist font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-200 ${
            isPopular
              ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3] shadow-lg shadow-[#F813BE]/20'
              : isSelected
                ? 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-white shadow-lg shadow-[#14EAEA]/20'
                : 'border border-white/15 text-white/70 hover:border-[#14EAEA] hover:text-[#14EAEA]'
          }`}
        >
          Proceed to Checkout →
        </Link>
      )}
    </motion.div>
  )
}
