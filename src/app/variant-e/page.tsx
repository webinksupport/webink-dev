import NavE from '@/components/variant-e/NavE'
import HeroE from '@/components/variant-e/HeroE'
import ServicesE from '@/components/variant-e/ServicesE'
import StatsE from '@/components/variant-e/StatsE'
import PricingE from '@/components/variant-e/PricingE'
import CTAE from '@/components/variant-e/CTAE'
import FooterE from '@/components/variant-e/FooterE'

export const metadata = {
  title: 'Webink Solutions — Variant E: White + Bold Accents',
  description: 'Webink Solutions — Sarasota\'s premiere web design, SEO, and digital marketing agency.',
}

export default function VariantE() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased">
      <NavE />
      <HeroE />
      <ServicesE />
      <StatsE />
      <PricingE />
      <CTAE />
      <FooterE />
    </main>
  )
}
