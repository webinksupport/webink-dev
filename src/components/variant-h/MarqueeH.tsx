'use client'

const items = ['Web Design', 'SEO', 'Digital Marketing', 'Social Media', 'Branding', 'Web Hosting']

export default function MarqueeH() {
  return (
    <section className="bg-white border-y-4 border-[#0A0A0A] py-8 overflow-hidden">
      {/* Row 1 — LTR, solid black */}
      <div className="flex mb-3">
        <div className="flex whitespace-nowrap animate-marquee-left">
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6">
              <span className="font-urbanist font-black text-3xl lg:text-5xl text-[#0A0A0A] tracking-tight">{item}</span>
              <span className="text-[#14EAEA] text-2xl">✦</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-left" aria-hidden>
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6">
              <span className="font-urbanist font-black text-3xl lg:text-5xl text-[#0A0A0A] tracking-tight">{item}</span>
              <span className="text-[#14EAEA] text-2xl">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — RTL, outline style */}
      <div className="flex">
        <div className="flex whitespace-nowrap animate-marquee-right">
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6">
              <span
                className="font-urbanist font-black text-3xl lg:text-5xl tracking-tight"
                style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}
              >
                {item}
              </span>
              <span style={{ color: '#F813BE', fontSize: '1.5rem' }}>✦</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-right" aria-hidden>
          {[...items, ...items, ...items].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6">
              <span
                className="font-urbanist font-black text-3xl lg:text-5xl tracking-tight"
                style={{ WebkitTextStroke: '2px #0A0A0A', color: 'transparent' }}
              >
                {item}
              </span>
              <span style={{ color: '#F813BE', fontSize: '1.5rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
