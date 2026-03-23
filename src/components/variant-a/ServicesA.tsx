import Link from 'next/link'

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <rect x="3" y="3" width="18" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Web Design',
    desc: 'Custom responsive websites engineered to convert visitors into paying customers. Fast, modern, and built to rank from day one.',
    href: '/services/web-design',
    accent: '#14EAEA',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: 'SEO Services',
    desc: 'Keyword research, on-page optimization, and local SEO strategy that puts your business at the top of Google — and keeps it there.',
    href: '/services/sarasota-seo',
    accent: '#F813BE',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'PPC / Digital Marketing',
    desc: 'Google Ads, Facebook & Instagram campaigns engineered for ROI — not just impressions. Every dollar tracked, every lead measured.',
    href: '/services/ppc-management-sarasota',
    accent: '#B9FF33',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
      </svg>
    ),
    title: 'Social Media Marketing',
    desc: 'Strategy, content creation, and full-channel management that grows your audience and converts followers into loyal customers.',
    href: '/services/social-media-marketing',
    accent: '#14EAEA',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
    title: 'Web Hosting',
    desc: 'Managed cloud hosting with enterprise-grade uptime, daily backups, SSL, unlimited bandwidth, and real human support.',
    href: '/services/web-hosting',
    accent: '#F813BE',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'AI-Powered Marketing',
    desc: 'We leverage cutting-edge AI tools to generate smarter copy, predict keyword opportunities, and automate reporting — giving you an unfair advantage.',
    href: '/services',
    accent: '#B9FF33',
  },
]

export default function ServicesA() {
  return (
    <section className="py-28 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="text-xs font-semibold tracking-[0.18em] text-[#14EAEA] uppercase mb-3">What We Do</div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white max-w-xl">
              Full-Service Digital Agency
            </h2>
            <p className="text-white/45 text-sm max-w-xs leading-relaxed">
              93% of consumers search online before making a purchase. Make sure they find you first.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <Link
              key={svc.title}
              href={svc.href}
              className="group block border border-white/8 hover:border-opacity-60 rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Hover bg glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${svc.accent}0A 0%, transparent 70%)` }}
              />

              {/* Accent line */}
              <div
                className="w-8 h-0.5 rounded-full mb-6 transition-all duration-300 group-hover:w-12"
                style={{ background: svc.accent }}
              />

              {/* Icon */}
              <div
                className="mb-5 transition-colors duration-300"
                style={{ color: `${svc.accent}80` }}
              >
                <div className="group-hover:[&>svg]:stroke-current transition-colors duration-300"
                  style={{ color: svc.accent }}>
                  {svc.icon}
                </div>
              </div>

              {/* Text */}
              <h3 className="font-syne text-lg font-bold text-white mb-3 group-hover:text-white transition-colors">
                {svc.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                {svc.desc}
              </p>

              {/* Arrow */}
              <div
                className="mt-6 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                style={{ color: svc.accent }}
              >
                Learn more <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
