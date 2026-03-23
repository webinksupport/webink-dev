import Image from 'next/image'
import Link from 'next/link'

export default function FooterC() {
  return (
    <footer
      className="relative bg-[#050505] pt-16 pb-10 px-6 overflow-hidden"
      style={{
        borderTop: '1px solid rgba(20, 234, 234, 0.1)',
      }}
    >
      {/* Subtle gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #14EAEA30, #F813BE30, transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Image
              src="/variant-c/logo-white.png"
              alt="Webink Solutions"
              width={160}
              height={42}
              className="h-9 w-auto mb-5"
            />
            <p className="font-sans text-white/35 text-sm leading-relaxed max-w-sm mb-6">
              Sarasota&apos;s premiere full-service digital agency. We build world-class websites and run digital marketing for local businesses across the Gulf Coast.
            </p>

            {/* Contact info */}
            <div className="space-y-2 text-sm font-sans text-white/40">
              <a
                href="tel:9418401381"
                className="flex items-center gap-2 hover:text-[#14EAEA] transition-colors"
              >
                <span className="text-[#14EAEA]">📞</span> (941) 840-1381
              </a>
              <a
                href="mailto:hello@webink.solutions"
                className="flex items-center gap-2 hover:text-[#14EAEA] transition-colors"
              >
                <span className="text-[#14EAEA]">✉️</span> hello@webink.solutions
              </a>
              <div className="flex items-center gap-2">
                <span className="text-[#14EAEA]">📍</span> 1609 Georgetowne Blvd, Sarasota, FL 34232
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: '𝕏', href: '#', label: 'Twitter' },
                { icon: 'f', href: '#', label: 'Facebook' },
                { icon: 'in', href: '#', label: 'LinkedIn' },
                { icon: '◎', href: '#', label: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:border-[#14EAEA]/40 hover:text-[#14EAEA] transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services links */}
          <div>
            <div
              className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: '#14EAEA' }}
            >
              Services
            </div>
            <ul className="space-y-3">
              {[
                { label: 'Web Design', href: '/services/web-design' },
                { label: 'SEO Services', href: '/services/sarasota-seo' },
                { label: 'Digital Marketing', href: '/services/ppc-management-sarasota' },
                { label: 'Social Media', href: '/services/social-media-marketing' },
                { label: 'Web Hosting', href: '/services/web-hosting' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <div
              className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase mb-5"
              style={{ color: '#F813BE' }}
            >
              Company
            </div>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Blog', href: '/blog' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-sans text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-sans text-white/25 text-xs">
            © 2026 Webink Solutions LLC. All rights reserved. Sarasota, FL.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms-and-conditions' },
              { label: 'Refunds', href: '/refunds' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-sans text-white/25 text-xs hover:text-white/50 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div
            className="font-grotesk text-xs font-bold tracking-widest"
            style={{
              background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            RETHINK DESIGN.
          </div>
        </div>
      </div>
    </footer>
  )
}
