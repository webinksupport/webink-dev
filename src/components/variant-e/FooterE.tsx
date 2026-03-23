import Image from 'next/image'
import Link from 'next/link'

const services = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'SEO Services', href: '/services/sarasota-seo' },
  { label: 'Digital Marketing', href: '/services/ppc-management-sarasota' },
  { label: 'Social Media', href: '/services/social-media-marketing' },
  { label: 'Web Hosting', href: '/services/web-hosting' },
  { label: 'Branding', href: '/services' },
]

const company = [
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export default function FooterE() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
            <Image
              src="/images/logos/webink-white.png"
              alt="Webink Solutions"
              width={160}
              height={44}
              className="h-9 w-auto mb-6"
            />
            <p className="text-white/30 text-sm leading-relaxed font-urbanist max-w-xs mb-6">
              Web design, SEO, and digital marketing for local businesses across Southwest Florida. Founded in Sarasota by a firefighter who believed every business deserves a world-class online presence.
            </p>
            <div className="space-y-2 mb-8">
              <a href="tel:9418401381" className="flex items-center gap-2 text-sm text-white/30 hover:text-[#14EAEA] transition-colors font-urbanist">
                <span className="text-[#14EAEA] text-xs">☎</span> (941) 840-1381
              </a>
              <a href="mailto:hello@webink.solutions" className="flex items-center gap-2 text-sm text-white/30 hover:text-[#14EAEA] transition-colors font-urbanist">
                <span className="text-[#14EAEA] text-xs">✉</span> hello@webink.solutions
              </a>
              <div className="flex items-center gap-2 text-sm text-white/20 font-urbanist">
                <span className="text-[#14EAEA] text-xs">⊙</span> Sarasota, FL 34232
              </div>
            </div>
            <div className="flex gap-3">
              {['I', 'F', 'L', 'X'].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/30 hover:border-[#14EAEA] hover:text-[#14EAEA] transition-all duration-200 text-xs font-urbanist font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <div className="font-urbanist font-bold text-white text-sm mb-6 tracking-wide">Services</div>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-sm text-white/30 hover:text-white transition-colors font-urbanist">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="font-urbanist font-bold text-white text-sm mb-6 tracking-wide">Company</div>
            <ul className="space-y-3">
              {company.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-sm text-white/30 hover:text-white transition-colors font-urbanist">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="font-urbanist font-bold text-white text-sm mb-3 tracking-wide">Stay in the Loop</div>
            <p className="text-white/25 text-xs leading-relaxed font-urbanist mb-5">
              Monthly tips on web design, SEO, and digital marketing for Southwest Florida businesses.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#14EAEA] transition-colors font-urbanist"
              />
              <button className="bg-[#14EAEA] text-black px-4 py-3 text-sm font-bold hover:bg-[#0DD4D4] transition-colors font-urbanist">→</button>
            </div>
            <p className="text-white/15 text-xs mt-2 font-urbanist">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/15 text-xs font-urbanist">© 2026 Webink Solutions. All rights reserved.</div>
          <div className="flex gap-5">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms-and-conditions' },
              { label: 'Refunds', href: '/refunds' },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-white/15 text-xs hover:text-white/30 transition-colors font-urbanist">{l.label}</Link>
            ))}
          </div>
          <div className="text-white/10 text-xs font-urbanist tracking-widest">RETHINK DESIGN.</div>
        </div>
      </div>
    </footer>
  )
}
