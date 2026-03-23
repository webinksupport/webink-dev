'use client'

const items = ['Web Design', 'SEO', 'Digital Marketing', 'Social Media', 'Branding', 'Web Hosting']

export default function MarqueeG() {
  return (
    <section className="bg-[#0A0A0A] py-12 overflow-hidden">
      {/* Row 1 — LTR */}
      <div className="flex mb-4">
        <div className="flex whitespace-nowrap animate-marquee-left">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span className="font-urbanist font-black text-2xl lg:text-4xl text-white tracking-tight">
                {item}
              </span>
              <span className="text-[#14EAEA] text-2xl">✦</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-left" aria-hidden>
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span className="font-urbanist font-black text-2xl lg:text-4xl text-white tracking-tight">
                {item}
              </span>
              <span className="text-[#14EAEA] text-2xl">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — RTL, outlined text */}
      <div className="flex">
        <div className="flex whitespace-nowrap animate-marquee-right">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span
                className="font-urbanist font-black text-2xl lg:text-4xl tracking-tight"
                style={{
                  WebkitTextStroke: '1px #F813BE',
                  color: 'transparent',
                }}
              >
                {item}
              </span>
              <span className="text-[#F813BE] text-2xl">✦</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-right" aria-hidden>
          {[...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-8">
              <span
                className="font-urbanist font-black text-2xl lg:text-4xl tracking-tight"
                style={{
                  WebkitTextStroke: '1px #F813BE',
                  color: 'transparent',
                }}
              >
                {item}
              </span>
              <span className="text-[#F813BE] text-2xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
