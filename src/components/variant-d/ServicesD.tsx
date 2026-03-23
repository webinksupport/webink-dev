import Link from 'next/link'

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Web Design',
    desc: 'Custom responsive websites built to convert. Fast, modern, and engineered to rank well in search.',
    href: '/services/web-design',
    accent: '#14EAEA',
    tag: '01',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'SEO Services',
    desc: 'Keyword research, on-page SEO, local optimization, and transparent reporting that proves ROI.',
    href: '/services/sarasota-seo',
    accent: '#F813BE',
    tag: '02',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Digital Marketing',
    desc: 'Google Ads and Facebook/Instagram campaigns engineered for ROI — not just impressions.',
    href: '/services/ppc-management-sarasota',
    accent: '#B9FF33',
    tag: '03',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    title: 'Social Media',
    desc: 'Strategy, content creation, and community management that grows your audience and drives engagement.',
    href: '/services/social-media-marketing',
    accent: '#14EAEA',
    tag: '04',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Web Hosting',
    desc: 'Managed hosting with enterprise uptime, daily backups, SSL, and full technical support included.',
    href: '/services/web-hosting',
    accent: '#F813BE',
    tag: '05',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Branding',
    desc: 'Logo design, brand identity systems, and visual consistency that makes your business unforgettable.',
    href: '/services',
    accent: '#B9FF33',
    tag: '06',
  },
]

export default function ServicesD() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 lg:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 bg-[#F813BE]" />
              <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-sans">What We Do</span>
            </div>
            <h2 className="font-syne font-extrabold text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Full-Service<br />Digital Agency
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-[#333] text-lg leading-relaxed font-sans">
              Six core services. One integrated strategy. More traffic, more leads, more revenue — for local businesses across Southwest Florida.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/8">
          {services.map((svc) => (
            <Link
              key={svc.title}
              href={svc.href}
              className="group relative border-r border-b border-black/8 p-8 lg:p-10 bg-white hover:bg-[#F8F8F8] transition-all duration-300"
              style={{ '--accent': svc.accent } as React.CSSProperties}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ color: svc.accent, background: `${svc.accent}15` }}
                >
                  {svc.icon}
                </div>
                <span className="font-syne text-4xl font-extrabold text-black/5 group-hover:text-black/8 transition-colors">
                  {svc.tag}
                </span>
              </div>

              <h3 className="font-syne text-xl font-bold text-[#0A0A0A] mb-3 group-hover:text-[#0A0A0A] transition-colors">
                {svc.title}
              </h3>
              <p className="text-black/45 text-sm leading-relaxed font-sans mb-6">
                {svc.desc}
              </p>

              {/* Hover reveal arrow */}
              <div
                className="text-xs font-bold flex items-center gap-1.5 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 font-sans"
                style={{ color: svc.accent }}
              >
                Learn More <span>→</span>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ background: svc.accent }}
              />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex items-center justify-between flex-wrap gap-4">
          <p className="text-black/30 text-sm font-sans">Not sure what you need? Let&apos;s talk.</p>
          <Link
            href="/contact"
            className="text-sm font-bold text-black border-b-2 border-[#14EAEA] pb-0.5 hover:text-[#14EAEA] transition-colors duration-200 font-sans"
          >
            Get a Free Consultation →
          </Link>
        </div>
      </div>
    </section>
  )
}
