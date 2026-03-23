import Image from 'next/image'
import Link from 'next/link'

const nav = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'SEO Services', href: '/services/sarasota-seo' },
  { label: 'Digital Marketing', href: '/services/ppc-management-sarasota' },
  { label: 'Social Media', href: '/services/social-media-marketing' },
  { label: 'Web Hosting', href: '/services/web-hosting' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export default function FooterF() {
  return (
    <footer className="bg-white border-t border-black/6 overflow-hidden">

      {/* Hero tagline band */}
      <div className="border-b border-black/5 overflow-hidden py-16 lg:py-20 relative">
        <div
          className="font-urbanist font-black leading-none tracking-tight text-black/[0.04] select-none whitespace-nowrap"
          style={{ fontSize: 'clamp(5rem, 14vw, 12rem)' }}
          aria-hidden="true"
        >
          RETHINK DESIGN.
        </div>
        {/* Overlay content centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="font-urbanist text-black/40 text-sm tracking-[0.3em] uppercase mb-4">
            Sarasota, FL
          </p>
          <h2 className="font-urbanist font-black text-[#0A0A0A] leading-tight mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            Ready to Rethink Your Digital Presence?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="font-urbanist text-sm font-semibold px-8 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black transition-all duration-300 rounded-full"
            >
              Start a Project
            </Link>
            <a
              href="tel:9418401381"
              className="font-urbanist text-sm font-medium text-black/40 hover:text-black transition-colors"
            >
              (941) 840-1381
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-14 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <Image
              src="/images/logos/webink-black.png"
              alt="Webink Solutions"
              width={160}
              height={44}
              className="h-10 w-auto mb-5"
            />
            <p className="text-black/35 text-sm leading-relaxed font-urbanist max-w-xs mb-6">
              Full-service digital agency based in Sarasota, FL — web design, SEO, and marketing for local businesses.
            </p>
            <div className="space-y-2 mb-6">
              <a href="tel:9418401381" className="block text-sm text-black/40 hover:text-black transition-colors font-urbanist">(941) 840-1381</a>
              <a href="mailto:hello@webink.solutions" className="block text-sm text-black/40 hover:text-black transition-colors font-urbanist">hello@webink.solutions</a>
              <p className="text-sm text-black/25 font-urbanist">1609 Georgetowne Blvd, Sarasota, FL 34232</p>
            </div>
            <div className="flex gap-3">
              {['I', 'F', 'L', 'X'].map((s, i) => (
                <a key={i} href="#" className="w-8 h-8 border border-black/10 rounded-lg flex items-center justify-center text-black/25 hover:border-[#14EAEA] hover:text-[#14EAEA] transition-all duration-200 text-xs font-urbanist">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-6">
            <div className="font-urbanist text-xs tracking-[0.3em] uppercase text-black/20 mb-5">Navigation</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {nav.map((n) => (
                <Link key={n.label} href={n.href} className="text-sm text-black/35 hover:text-black transition-colors duration-200 font-urbanist">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-urbanist text-xs tracking-[0.3em] uppercase text-black/20 mb-5">Legal</div>
            <div className="flex flex-col gap-2">
              {[['Privacy Policy', '/privacy-policy'], ['Terms & Conditions', '/terms-and-conditions'], ['Refunds', '/refunds']].map(([l, h]) => (
                <Link key={l} href={h} className="text-sm text-black/30 hover:text-black transition-colors font-urbanist">{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar with cyan accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33]" />
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-black/20 text-xs font-urbanist">© {new Date().getFullYear()} Webink Solutions. All rights reserved.</p>
        <p className="text-black/15 text-xs font-urbanist tracking-[0.3em] uppercase">Rethink Design.</p>
      </div>
    </footer>
  )
}
