import NavF from '@/components/variant-f/NavF'
import HeroF from '@/components/variant-f/HeroF'
import ServicesF from '@/components/variant-f/ServicesF'
import StatsF from '@/components/variant-f/StatsF'
import PricingF from '@/components/variant-f/PricingF'
import CTAF from '@/components/variant-f/CTAF'
import FooterF from '@/components/variant-f/FooterF'

export const metadata = {
  title: 'Webink Solutions — Variant F: White + Minimal',
  description: 'Webink Solutions — Sarasota\'s premiere web design, SEO, and digital marketing agency.',
}

export default function VariantF() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased">
      <NavF />
      <HeroF />
      <ServicesF />
      <StatsF />
      <PricingF />
      <CTAF />
      <FooterF />
    </main>
  )
}
