import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'

export const metadata: Metadata = {
  title: 'Portfolio — Our Work | Webink Solutions',
  description: 'See real results from Webink Solutions — web design, SEO, and digital marketing projects for businesses in Sarasota, Tampa, and Bradenton.',
}

export default function PortfolioPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4">Our Work</p>
          <h1
            className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
          >
            Coming Soon
          </h1>
          <p className="text-[17px] leading-relaxed text-[#333] max-w-xl mx-auto mb-10">
            We&apos;re putting the finishing touches on our portfolio. Soon you&apos;ll be able to explore the web design, SEO, and marketing projects we&apos;ve delivered for businesses across Sarasota, Tampa, and Bradenton.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
          >
            Start Your Project
          </a>
        </div>
      </section>
      <FooterI />
    </main>
  )
}
