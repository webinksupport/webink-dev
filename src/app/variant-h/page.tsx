import NavH from '@/components/variant-h/NavH'
import HeroH from '@/components/variant-h/HeroH'
import ServicesH from '@/components/variant-h/ServicesH'
import MarqueeH from '@/components/variant-h/MarqueeH'
import AboutH from '@/components/variant-h/AboutH'
import TestimonialH from '@/components/variant-h/TestimonialH'
import CTAH from '@/components/variant-h/CTAH'
import FooterH from '@/components/variant-h/FooterH'

export const metadata = {
  title: 'Webink Solutions — Variant H: Editorial Bold',
  description: "Webink Solutions — Sarasota's premiere web design, SEO, and digital marketing agency.",
}

export default function VariantH() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased">
      <NavH />
      <HeroH />
      <MarqueeH />
      <ServicesH />
      <AboutH />
      <TestimonialH />
      <CTAH />
      <FooterH />
    </main>
  )
}
