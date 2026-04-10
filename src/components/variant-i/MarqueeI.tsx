'use client'

const items = [
  'Web Design', 'SEO', 'Digital Marketing', 'Social Media', 'Web Hosting',
  'Short Form Video', 'Google Ads', 'Local SEO', 'Branding', 'Sarasota',
]

export default function MarqueeI() {
  const repeated = [...items, ...items, ...items]

  return (
    <section className="bg-white py-6 border-y border-black/6 overflow-hidden contain-paint">
      <div className="relative">
        {/* Row 1 — left */}
        <div className="flex overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee-left shrink-0">
            {repeated.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-5 mx-5 font-urbanist font-black text-sm tracking-widest uppercase text-[#0A0A0A]/20">
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-[#14EAEA] inline-block" />
              </span>
            ))}
          </div>
          <div aria-hidden className="flex whitespace-nowrap animate-marquee-left shrink-0">
            {repeated.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-5 mx-5 font-urbanist font-black text-sm tracking-widest uppercase text-[#0A0A0A]/20">
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-[#14EAEA] inline-block" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
