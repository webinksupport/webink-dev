'use client'

export default function BlogContent() {
  return (
    <section className="pt-40 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <p
          data-page="blog" data-block="eyebrow"
          className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-4"
        >
          InkBlog
        </p>
        <h1
          data-page="blog" data-block="heading"
          className="font-urbanist font-black text-[#1A1A1A] mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
        >
          Coming Soon
        </h1>
        <p
          data-page="blog" data-block="description"
          className="text-[17px] leading-relaxed text-[#333] max-w-xl mx-auto mb-10"
        >
          We&apos;re building something great. Our blog will feature digital marketing insights, SEO strategies, web design trends, and actionable tips for growing your business online.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 bg-[#F813BE] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#d10fa3] transition-colors duration-200"
        >
          <span data-page="blog" data-block="cta_text">Get Notified When We Launch</span>
        </a>
      </div>
    </section>
  )
}
