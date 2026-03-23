import Image from 'next/image'
import Link from 'next/link'

const nav = [
  { label: 'Web Design', href: '/services/web-design' },
  { label: 'SEO', href: '/services/sarasota-seo' },
  { label: 'Digital Marketing', href: '/services/ppc-management-sarasota' },
  { label: 'Social Media', href: '/services/social-media-marketing' },
  { label: 'Hosting', href: '/services/web-hosting' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export default function FooterF() {
  return (
    <footer className="bg-white border-t border-black/6">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-14 lg:py-18">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <Image
              src="/images/logos/webink-black.png"
              alt="Webink Solutions"
              width={140}
              height={40}
              className="h-8 w-auto mb-5 opacity-70"
            />
            <p className="text-black/35 text-sm leading-relaxed font-urbanist max-w-xs mb-6">
              Full-service digital agency based in Sarasota, FL. Web design, SEO, and marketing for local businesses.
            </p>
            <div className="flex gap-3">
              {['I', 'F', 'L', 'X'].map((s, i) => (
                <a key={i} href="#" className="w-7 h-7 border border-black/10 flex items-center justify-center text-black/25 hover:border-[#14EAEA] hover:text-[#14EAEA] transition-all duration-200 text-xs font-urbanist">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-6">
            <div className="font-urbanist text-xs tracking-[0.3em] uppercase text-black/20 mb-5">Navigation</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {nav.map((n) => (
                <Link key={n.label} href={n.href} className="text-sm text-black/35 hover:text-black transition-colors font-urbanist">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="font-urbanist text-xs tracking-[0.3em] uppercase text-black/20 mb-5">Contact</div>
            <div className="space-y-2">
              <a href="tel:9418401381" className="block text-sm text-black/40 hover:text-black transition-colors font-urbanist">(941) 840-1381</a>
              <a href="mailto:hello@webink.solutions" className="block text-sm text-black/40 hover:text-black transition-colors font-urbanist">hello@webink.solutions</a>
              <p className="text-sm text-black/25 font-urbanist">Sarasota, FL 34232</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-black/20 text-xs font-urbanist">© 2026 Webink Solutions. All rights reserved.</p>
          <div className="flex gap-5">
            {[['Privacy', '/privacy-policy'], ['Terms', '/terms-and-conditions'], ['Refunds', '/refunds']].map(([l, h]) => (
              <Link key={l} href={h} className="text-black/20 text-xs hover:text-black/40 transition-colors font-urbanist">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
