import type { Metadata } from 'next'
import NavI from '@/components/variant-i/NavI'
import FooterI from '@/components/variant-i/FooterI'

export const metadata: Metadata = {
  title: 'Blog — InkBlog | Webink Solutions',
  description: 'Digital marketing insights, SEO tips, web design trends, and business growth strategies from the Webink Solutions team in Sarasota, FL.',
}

export default function BlogPage() {
  return (
    <main className="bg-white text-[#0A0A0A] font-urbanist antialiased overflow-x-hidden">
      <NavI />
      <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4">InkBlog</p>
          <h1
            className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
          >
            Coming Soon
          </h1>
          <p className="text-[17px] leading-relaxed text-[#333] max-w-xl mx-auto mb-10">
            We&apos;re building something great. Our blog will feature digital marketing insights, SEO strategies, web design trends, and actionable tips for growing your business online.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
          >
            Get Notified When We Launch
          </a>
        </div>
      </section>
      <FooterI />
    </main>
  )
}
