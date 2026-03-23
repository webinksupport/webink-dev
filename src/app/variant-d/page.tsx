import NavD from '@/components/variant-d/NavD'
import HeroD from '@/components/variant-d/HeroD'
import ServicesD from '@/components/variant-d/ServicesD'
import AIShowcaseD from '@/components/variant-d/AIShowcaseD'
import StatsD from '@/components/variant-d/StatsD'
import PricingD from '@/components/variant-d/PricingD'
import CTABannerD from '@/components/variant-d/CTABannerD'
import FooterD from '@/components/variant-d/FooterD'

export const metadata = {
  title: 'Webink Solutions — Variant D: Clean White',
  description: 'Webink Solutions — Sarasota\'s premiere web design, SEO, and digital marketing agency.',
}

export default function VariantD() {
  return (
    <main className="bg-white text-[#0A0A0A] font-sans antialiased">
      <NavD />
      <HeroD />
      <ServicesD />
      <AIShowcaseD />
      <StatsD />
      <PricingD />
      <CTABannerD />
      <FooterD />
    </main>
  )
}
