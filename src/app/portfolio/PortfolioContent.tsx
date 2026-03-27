'use client'

import EditableText from '@/components/editor/EditableText'

export default function PortfolioContent() {
  return (
    <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <EditableText
          as="p"
          blockKey="eyebrow"
          defaultValue="Our Work"
          className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-4"
        />
        <EditableText
          as="h1"
          blockKey="heading"
          defaultValue="Coming Soon"
          className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
        />
        <EditableText
          as="p"
          blockKey="description"
          defaultValue="We're putting the finishing touches on our portfolio. Soon you'll be able to explore the web design, SEO, and marketing projects we've delivered for businesses across Sarasota, Tampa, and Bradenton."
          className="text-[17px] leading-relaxed text-[#333] max-w-xl mx-auto mb-10"
        />
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
        >
          <EditableText as="span" blockKey="cta_text" defaultValue="Start Your Project" />
        </a>
      </div>
    </section>
  )
}
