import NavG from '@/components/variant-g/NavG'
import HeroG from '@/components/variant-g/HeroG'
import ServicesG from '@/components/variant-g/ServicesG'
import AboutG from '@/components/variant-g/AboutG'
import MarqueeG from '@/components/variant-g/MarqueeG'
import StatsG from '@/components/variant-g/StatsG'
import CTAG from '@/components/variant-g/CTAG'
import FooterG from '@/components/variant-g/FooterG'

export const metadata = {
  title: 'Webink Solutions — Variant G: Current Site Feel, Modernized',
  description: "Webink Solutions — Sarasota's premiere web design, SEO, and digital marketing agency.",
}

export default function VariantG() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased">
      <NavG />
      <HeroG />
      <MarqueeG />
      <ServicesG />
      <AboutG />
      <StatsG />
      <CTAG />
      <FooterG />
    </main>
  )
}
