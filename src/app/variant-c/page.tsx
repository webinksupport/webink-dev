'use client'
import NavC from '@/components/variant-c/NavC'
import HeroC from '@/components/variant-c/HeroC'
import MarqueeC from '@/components/variant-c/MarqueeC'
import ServicesC from '@/components/variant-c/ServicesC'
import AIShowcaseC from '@/components/variant-c/AIShowcaseC'
import StatsC from '@/components/variant-c/StatsC'
import PricingC from '@/components/variant-c/PricingC'
import CTABannerC from '@/components/variant-c/CTABannerC'
import FooterC from '@/components/variant-c/FooterC'

export default function VariantC() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Public Sans', sans-serif",
        background: '#000000',
        color: '#ffffff',
      }}
    >
      {/* Navigation */}
      <NavC />

      {/* Hero — Dark gradient with cyan-pink blobs */}
      <HeroC />

      {/* Gradient Marquee Banner */}
      <MarqueeC />

      {/* Services — 6 cards with gradient borders */}
      <ServicesC />

      {/* AI Tools Showcase */}
      <AIShowcaseC />

      {/* Stats — gradient accent numbers + testimonial */}
      <StatsC />

      {/* Pricing Preview — 3 tiers */}
      <PricingC />

      {/* CTA Banner — gradient background */}
      <CTABannerC />

      {/* Footer */}
      <FooterC />
    </div>
  )
}
