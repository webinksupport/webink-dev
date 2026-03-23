'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

export default function NavB() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/variant-b/logo-white.png"
              alt="Webink Solutions"
              width={148}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[11px] font-semibold text-white/40 hover:text-white tracking-[0.18em] uppercase transition-colors duration-200 font-inter"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="tel:9418401381"
              className="text-[11px] font-medium text-white/30 hover:text-white/60 tracking-wider transition-colors font-inter"
            >
              (941) 840-1381
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center border border-[#14EAEA]/60 text-[#14EAEA] text-[11px] font-bold px-5 py-2 tracking-[0.18em] uppercase hover:bg-[#14EAEA] hover:text-black transition-all duration-200 font-inter"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-white transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0F0F0F] pt-16 flex flex-col px-6 py-10">
          <div className="flex flex-col gap-8 mt-6">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold text-white/80 hover:text-[#14EAEA] transition-colors font-inter"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="inline-block border border-[#14EAEA] text-[#14EAEA] text-sm font-bold px-8 py-4 tracking-widest uppercase hover:bg-[#14EAEA] hover:text-black transition-all duration-200 font-inter"
            >
              Get a Free Quote
            </Link>
            <div className="mt-6 text-white/25 text-sm font-inter">
              (941) 840-1381<br />
              hello@webink.solutions
            </div>
          </div>
        </div>
      )}
    </>
  )
}
