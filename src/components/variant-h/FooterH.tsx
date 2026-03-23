'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function FooterH() {
  return (
    <footer className="bg-[#0A0A0A] border-t-2 border-[#14EAEA] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <Image
              src="/images/logos/webink-white.png"
              alt="Webink Solutions"
              width={160}
              height={44}
              className="h-10 w-auto mb-5"
            />
            <p className="font-urbanist text-white/30 text-sm leading-relaxed max-w-xs mb-6">
              Sarasota&apos;s premiere digital agency. Web design, SEO, and marketing built to perform.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'LinkedIn', 'Twitter'].map((s) => (
                <a key={s} href="#" className="font-urbanist text-xs text-white/20 hover:text-[#14EAEA] transition-colors font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-urbanist text-xs font-black text-white/20 tracking-[0.3em] uppercase mb-5">Services</div>
            <ul className="space-y-3">
              {['Web Design', 'SEO Services', 'Digital Marketing', 'Social Media', 'Web Hosting', 'Branding'].map((s) => (
                <li key={s}>
                  <Link href="/services" className="font-urbanist text-sm text-white/35 hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-urbanist text-xs font-black text-white/20 tracking-[0.3em] uppercase mb-5">Contact</div>
            <ul className="space-y-3 font-urbanist text-sm text-white/35">
              <li>(941) 840-1381</li>
              <li>hello@webink.solutions</li>
              <li className="leading-relaxed">1609 Georgetowne Blvd<br />Sarasota, FL 34232</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-wrap gap-4 items-center justify-between">
          <p className="font-urbanist text-xs text-white/15">© 2026 Webink Solutions LLC. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Refunds'].map((s) => (
              <Link key={s} href="#" className="font-urbanist text-xs text-white/15 hover:text-white/40 transition-colors">{s}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
