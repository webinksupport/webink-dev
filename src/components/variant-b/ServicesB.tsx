import Link from 'next/link'

const services = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Web Design',
    desc: 'Custom responsive websites built to convert visitors into paying customers. Fast, modern, and built to rank in Google.',
    href: '/services/web-design',
    stat: '100+',
    statLabel: 'Sites Launched',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'SEO Services',
    desc: 'Keyword research, on-page optimization, and local SEO that puts your business at the top of Google search results.',
    href: '/services/sarasota-seo',
    stat: '300%',
    statLabel: 'Avg Traffic Increase',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'PPC Advertising',
    desc: 'Google Ads, Facebook & Instagram campaigns engineered for ROI — not just impressions. Every dollar tracked.',
    href: '/services/ppc-management-sarasota',
    stat: '$2M+',
    statLabel: 'Ad Spend Managed',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    title: 'Social Media',
    desc: 'Strategy, content creation, and management that builds your audience and drives real engagement across all platforms.',
    href: '/services/social-media-marketing',
    stat: '10K+',
    statLabel: 'Avg Follower Growth',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Managed Hosting',
    desc: 'Enterprise-grade hosting with 99.9% uptime, daily backups, SSL, and full technical support — all included.',
    href: '/services/web-hosting',
    stat: '99.9%',
    statLabel: 'Uptime Guarantee',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'AI Marketing',
    desc: 'AI-powered content, predictive SEO insights, and automated reporting that keeps you ahead of the competition.',
    href: '/services',
    stat: 'New',
    statLabel: '2026 Capability',
  },
]

export default function ServicesB() {
  return (
    <section className="bg-[#0F0F0F] border-t border-white/[0.06]">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#14EAEA]" />
              <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
                What We Do
              </span>
            </div>
            <h2 className="font-inter text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Full-Service Digital Agency<br />
              <span className="text-white/30">for Local Business Growth</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="font-inter text-[11px] font-bold text-[#14EAEA] tracking-[0.2em] uppercase hover:text-white transition-colors flex-shrink-0"
          >
            View All Services &rarr;
          </Link>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="border border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 sm:divide-y sm:divide-x sm:divide-x-reverse divide-white/[0.08]">
          {services.map((svc, i) => (
            <Link
              key={svc.title}
              href={svc.href}
              className={`group p-8 lg:p-10 hover:bg-[#14EAEA]/[0.04] transition-colors duration-300
                ${i > 0 ? 'sm:border-l-0' : ''}
                ${i >= 3 ? 'lg:border-t lg:border-white/[0.08]' : ''}
              `}
            >
              {/* Icon */}
              <div className="text-white/25 group-hover:text-[#14EAEA] transition-colors duration-300 mb-5">
                {svc.icon}
              </div>
              {/* Title */}
              <h3 className="font-inter text-base font-bold text-white group-hover:text-[#14EAEA] transition-colors duration-300 mb-3 tracking-tight">
                {svc.title}
              </h3>
              {/* Description */}
              <p className="font-public-sans text-white/35 text-sm leading-relaxed mb-6">
                {svc.desc}
              </p>
              {/* Stat */}
              <div className="flex items-baseline gap-2 mt-auto">
                <span className="font-inter text-lg font-black text-[#14EAEA]/70 group-hover:text-[#14EAEA] transition-colors">
                  {svc.stat}
                </span>
                <span className="font-inter text-[10px] text-white/20 tracking-wider uppercase">
                  {svc.statLabel}
                </span>
              </div>
              {/* Hover indicator */}
              <div className="flex items-center gap-1 mt-4 text-[#14EAEA] opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold tracking-widest uppercase font-inter">
                Learn More <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
