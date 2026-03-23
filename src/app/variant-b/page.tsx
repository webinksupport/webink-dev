import NavB from '@/components/variant-b/NavB'
import HeroB from '@/components/variant-b/HeroB'
import ServicesB from '@/components/variant-b/ServicesB'
import AIShowcaseB from '@/components/variant-b/AIShowcaseB'
import StatsB from '@/components/variant-b/StatsB'
import PricingB from '@/components/variant-b/PricingB'
import CTABannerB from '@/components/variant-b/CTABannerB'
import FooterB from '@/components/variant-b/FooterB'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Webink Solutions — Variant B | Dark Professional',
  description: 'Sarasota\'s premiere full-service digital agency. Web design, SEO, digital marketing & social media for local businesses across Southwest Florida.',
}

/**
 * Variant B — "Dark Professional"
 * Background: #0F0F0F
 * Accent: Neon Cyan #14EAEA (restrained)
 * Fonts: Inter (headings), Public Sans (body)
 * Feel: Corporate, trustworthy, sophisticated dark agency
 */
export default function VariantBPage() {
  return (
    <div
      className="bg-[#0F0F0F] text-white antialiased"
      style={{ fontFamily: "'Public Sans', sans-serif" }}
    >
      {/* Navigation */}
      <NavB />

      {/* Hero — Split layout, photo right */}
      <HeroB />

      {/* Services — 6 services in bordered grid */}
      <ServicesB />

      {/* AI Tools Showcase — Data-driven, professional tone */}
      <AIShowcaseB />

      {/* Stats — Cyan stat cards + testimonial */}
      <StatsB />

      {/* Pricing Preview — 3-tier pricing teaser */}
      <PricingB />

      {/* CTA Banner — Professional call to action */}
      <CTABannerB />

      {/* Footer */}
      <FooterB />
    </div>
  )
}
