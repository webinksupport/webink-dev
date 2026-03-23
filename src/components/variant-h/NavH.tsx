'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavH() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '2px solid #14EAEA' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link href="/">
          <Image
            src={scrolled ? '/images/logos/webink-black.png' : '/images/logos/webink-white.png'}
            alt="Webink Solutions"
            width={130}
            height={36}
            className="h-8 w-auto transition-all duration-300"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Services', href: '/services' },
            { label: 'About', href: '/about' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'Blog', href: '/blog' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-urbanist text-sm font-bold tracking-wide transition-colors duration-200"
              style={{ color: scrolled ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.7)' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          className="font-urbanist font-black text-xs px-7 py-3 tracking-widest uppercase transition-all duration-300"
          style={{
            background: scrolled ? '#14EAEA' : 'transparent',
            color: scrolled ? '#000' : '#14EAEA',
            border: '2px solid #14EAEA',
          }}
        >
          Get a Quote
        </Link>
      </div>
    </nav>
  )
}
