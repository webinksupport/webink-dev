import Image from 'next/image'
import Link from 'next/link'

const quickLinks = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'SEO Services', href: '/services/sarasota-seo' },
  { label: 'PPC Advertising', href: '/services/ppc-management-sarasota' },
  { label: 'Social Media', href: '/services/social-media-marketing' },
  { label: 'Web Hosting', href: '/services/web-hosting' },
  { label: 'Portfolio', href: '/portfolio' },
]

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/webinksolutions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/webinksolutions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/webink-solutions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://twitter.com/webinksolutions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
]

export default function FooterB() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/[0.06]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/variant-b/logo-white.png"
              alt="Webink Solutions"
              width={140}
              height={38}
              className="h-8 w-auto mb-5"
            />
            <p className="font-public-sans text-white/25 text-sm leading-relaxed mb-6">
              Sarasota&apos;s premiere full-service digital agency. Web design, SEO, and marketing for local businesses across Southwest Florida.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 border border-white/[0.08] flex items-center justify-center text-white/25 hover:text-[#14EAEA] hover:border-[#14EAEA]/30 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="font-inter text-[10px] font-bold text-white/20 tracking-[0.25em] uppercase mb-5">
              Services
            </div>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-public-sans text-white/30 text-sm hover:text-[#14EAEA] transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <div className="font-inter text-[10px] font-bold text-white/20 tracking-[0.25em] uppercase mb-5">
              Company
            </div>
            <ul className="space-y-2.5">
              {company.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-public-sans text-white/30 text-sm hover:text-[#14EAEA] transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <div className="font-inter text-[10px] font-bold text-white/20 tracking-[0.25em] uppercase mb-5">
              Contact
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-inter text-[10px] text-white/15 tracking-widest uppercase mb-1">Phone</div>
                <a
                  href="tel:9418401381"
                  className="font-public-sans text-white/40 text-sm hover:text-[#14EAEA] transition-colors"
                >
                  (941) 840-1381
                </a>
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/15 tracking-widest uppercase mb-1">Email</div>
                <a
                  href="mailto:hello@webink.solutions"
                  className="font-public-sans text-white/40 text-sm hover:text-[#14EAEA] transition-colors"
                >
                  hello@webink.solutions
                </a>
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/15 tracking-widest uppercase mb-1">Address</div>
                <address className="font-public-sans text-white/25 text-sm not-italic leading-relaxed">
                  1609 Georgetowne Blvd<br />
                  Sarasota, FL 34232
                </address>
              </div>
              <div>
                <div className="font-inter text-[10px] text-white/15 tracking-widest uppercase mb-1">Hours</div>
                <div className="font-public-sans text-white/25 text-sm">Mon–Fri: 9am–5pm ET</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-inter text-[11px] text-white/15">
            &copy; 2026 Webink Solutions, LLC. All rights reserved.
          </span>
          <span className="font-inter text-[11px] text-white/15 italic">
            Rethink Design.
          </span>
        </div>
      </div>
    </footer>
  )
}
