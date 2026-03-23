import Image from 'next/image'
import Link from 'next/link'

const serviceLinks = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'SEO Services', href: '/services/sarasota-seo' },
  { label: 'Digital Marketing / PPC', href: '/services/ppc-management-sarasota' },
  { label: 'Social Media Marketing', href: '/services/social-media-marketing' },
  { label: 'Web Hosting', href: '/services/web-hosting' },
  { label: 'AI-Powered Marketing', href: '/services' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog (InkBlog)', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Shop', href: '/shop' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Refund Policy', href: '/refunds' },
  { label: 'Knowledgebase', href: '/knowledgebase' },
]

const socials = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

export default function FooterA() {
  return (
    <footer className="border-t border-white/8 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-4">
            <Image
              src="/variant-a/logo-white.png"
              alt="Webink Solutions"
              width={150}
              height={42}
              className="h-8 w-auto mb-5"
            />
            <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Sarasota&apos;s premiere digital agency — building websites that work and marketing that converts 
              since 2018.
            </p>
            {/* Contact info */}
            <div className="space-y-2 text-sm text-white/30">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.22 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
                </svg>
                <a href="tel:9418401381" className="hover:text-[#14EAEA] transition-colors">(941) 840-1381</a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:hello@webink.solutions" className="hover:text-[#14EAEA] transition-colors">hello@webink.solutions</a>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span>1609 Georgetowne Blvd<br />Sarasota, FL 34232</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-[#14EAEA] hover:border-[#14EAEA]/40 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <div className="font-syne font-bold text-white text-sm mb-5 tracking-wide">Services</div>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/35 text-sm hover:text-[#14EAEA] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <div className="font-syne font-bold text-white text-sm mb-5 tracking-wide">Company</div>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/35 text-sm hover:text-[#14EAEA] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3">
            <div className="font-syne font-bold text-white text-sm mb-5 tracking-wide">Legal</div>
            <ul className="space-y-2.5 mb-8">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/35 text-sm hover:text-[#14EAEA] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* DesignRush badge area */}
            <div className="border border-white/8 rounded-xl p-4 bg-white/[0.02]">
              <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Recognized by</div>
              <div className="text-white/50 text-sm font-semibold">DesignRush</div>
              <div className="text-[#14EAEA] text-xs mt-0.5">Top Web Design Company in Florida</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-white/18 text-xs">
            © {new Date().getFullYear()} Webink Solutions, LLC. All rights reserved.
          </div>
          <div className="text-white/18 text-xs font-syne italic tracking-wide">
            Rethink Design.
          </div>
        </div>
      </div>
    </footer>
  )
}
