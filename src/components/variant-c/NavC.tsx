'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { navLinks } from '@/components/data'

export default function NavC() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/variant-c/logo-white.png"
              alt="Webink Solutions"
              width={160}
              height={42}
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-grotesk text-sm font-medium text-white/50 hover:text-white transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 font-grotesk text-sm font-bold px-6 py-2.5 rounded-full text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
            }}
          >
            Get a Quote
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-5'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-grotesk text-2xl font-bold text-white hover:text-[#14EAEA] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="font-grotesk text-sm font-bold px-8 py-3.5 rounded-full text-black mt-4"
            style={{ background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)' }}
          >
            Get a Quote
          </Link>
        </div>
      )}
    </>
  )
}
