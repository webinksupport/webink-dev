'use client'
import NavA from '@/components/variant-a/NavA'
import HeroA from '@/components/variant-a/HeroA'
import MarqueeA from '@/components/variant-a/MarqueeA'
import ServicesA from '@/components/variant-a/ServicesA'
import AIShowcaseA from '@/components/variant-a/AIShowcaseA'
import StatsA from '@/components/variant-a/StatsA'
import PricingA from '@/components/variant-a/PricingA'
import CTABannerA from '@/components/variant-a/CTABannerA'
import FooterA from '@/components/variant-a/FooterA'
import AboutA from '@/components/variant-a/AboutA'

export default function VariantA() {
  return (
    <div className="bg-[#0A0A0A] text-white font-sans antialiased">
      {/* Fixed Navigation */}
      <NavA />

      {/* Hero — Full bleed dark with grid + glow */}
      <HeroA />

      {/* Marquee Band — Services scrolling text */}
      <MarqueeA />

      {/* Services — 6 cards */}
      <ServicesA />

      {/* About / Founder Story */}
      <AboutA />

      {/* Marquee Band reverse — Pink accent */}
      <MarqueeA reverse accent="#F813BE" />

      {/* AI Tools Showcase */}
      <AIShowcaseA />

      {/* Stats + Testimonial */}
      <StatsA />

      {/* Pricing Preview — 3 tiers */}
      <PricingA />

      {/* CTA Banner — Full width */}
      <CTABannerA />

      {/* Footer */}
      <FooterA />
    </div>
  )
}
