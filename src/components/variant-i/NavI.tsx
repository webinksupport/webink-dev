'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { ChevronDown } from 'lucide-react'

const serviceLinks = [
  { label: 'Web Design', href: '/services/web-design', desc: 'Custom responsive sites built to convert' },
  { label: 'SEO', href: '/services/seo', desc: 'Rank higher on Google organically' },
  { label: 'Social Media Marketing', href: '/services/social-media', desc: 'Strategy, content & community management' },
  { label: 'Paid Advertising', href: '/services/paid-advertising', desc: 'Google Ads & Meta campaigns for ROI' },
  { label: 'AI-Powered Marketing', href: '/services/ai-marketing', desc: 'Leverage AI to scale your marketing' },
  { label: 'Custom CRM & SaaS', href: '/services/custom-crm', desc: 'Tailored software for your business' },
]

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Results', href: '#results' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
]

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function NavI() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)

  const isAdmin = session?.user?.role === 'ADMIN'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }
    if (dropdownOpen || servicesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen, servicesOpen])

  const handleLinkClick = () => {
    setOpen(false)
    setDropdownOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl bg-white/85 border-b border-black/8 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4 flex items-center justify-between">
          {/* Logo — white over hero, black when scrolled */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            {scrolled ? (
              <Image
                src="/images/logos/webink-black-4x1.png"
                alt="Webink Solutions"
                width={176}
                height={44}
                className="h-12 w-auto"
                priority
              />
            ) : (
              <Image
                src="/images/logos/webink-white.png"
                alt="Webink Solutions"
                width={176}
                height={44}
                className="h-12 w-auto"
                priority
              />
            )}
          </Link>

          {/* Desktop nav links — centered */}
          <nav className="hidden lg:flex items-center gap-10">
            {/* Services dropdown */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 font-urbanist text-sm font-semibold transition-colors duration-200 tracking-wide ${
                  scrolled
                    ? 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-black/8 overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {serviceLinks.map((svc) => (
                        <Link
                          key={svc.href}
                          href={svc.href}
                          onClick={() => setServicesOpen(false)}
                          className="flex flex-col px-5 py-3 hover:bg-[#14EAEA]/5 transition-colors group"
                        >
                          <span className="font-urbanist text-sm font-bold text-[#0A0A0A] group-hover:text-[#14EAEA] transition-colors">
                            {svc.label}
                          </span>
                          <span className="font-urbanist text-xs text-[#0A0A0A]/40 mt-0.5">
                            {svc.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-black/5 px-5 py-3">
                      <Link
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        className="font-urbanist text-sm font-bold text-[#F813BE] hover:text-[#d10fa3] transition-colors"
                      >
                        View All Services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`font-urbanist text-sm font-semibold transition-colors duration-200 tracking-wide ${
                  scrolled
                    ? 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: Auth + CTA + hamburger */}
          <div className="flex items-center gap-4">
            {/* Desktop auth section */}
            <div className="hidden lg:flex items-center gap-3">
              {status === 'authenticated' && session?.user ? (
                /* Logged in — avatar + dropdown */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 group"
                    aria-label="Account menu"
                  >
                    {/* Avatar circle */}
                    <div className="w-9 h-9 rounded-full bg-[#14EAEA] flex items-center justify-center text-[#0A0A0A] text-xs font-bold select-none">
                      {getInitials(session.user.name)}
                    </div>
                    {isAdmin && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F813BE] text-white px-2 py-0.5 rounded-full leading-none">
                        Admin
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-black/8 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-black/5">
                          <p className="font-urbanist text-sm font-bold text-[#0A0A0A] truncate">
                            {session.user.name || session.user.email}
                          </p>
                          <p className="font-urbanist text-xs text-[#0A0A0A]/50 truncate">
                            {session.user.email}
                          </p>
                        </div>

                        <div className="py-1">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={handleLinkClick}
                              className="flex items-center gap-2 px-4 py-2.5 font-urbanist text-sm text-[#F813BE] hover:bg-[#F813BE]/5 transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            href="/dashboard"
                            onClick={handleLinkClick}
                            className="flex items-center gap-2 px-4 py-2.5 font-urbanist text-sm text-[#0A0A0A]/70 hover:bg-black/5 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            My Portal
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            onClick={handleLinkClick}
                            className="flex items-center gap-2 px-4 py-2.5 font-urbanist text-sm text-[#0A0A0A]/70 hover:bg-black/5 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                            Account Settings
                          </Link>
                        </div>

                        <div className="border-t border-black/5 py-1">
                          <button
                            onClick={() => {
                              setDropdownOpen(false)
                              signOut({ callbackUrl: '/' })
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2.5 font-urbanist text-sm text-[#0A0A0A]/50 hover:bg-black/5 hover:text-[#0A0A0A]/70 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : status === 'unauthenticated' ? (
                /* Logged out — Sign In button */
                <Link
                  href="/auth/signin"
                  className={`font-urbanist text-sm font-semibold px-5 py-2 rounded-full border transition-colors duration-200 ${
                    scrolled
                      ? 'border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A]'
                      : 'border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A]'
                  }`}
                >
                  Sign In
                </Link>
              ) : null}
            </div>

            <a
              href="#contact"
              className={`hidden lg:inline-flex items-center gap-2 font-urbanist text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-[#0A0A0A] text-white hover:bg-[#14EAEA] hover:text-black'
                  : 'bg-white text-[#0A0A0A] hover:bg-[#14EAEA] hover:text-black'
              }`}
            >
              Get Free Audit
            </a>

            {/* Hamburger — all screen sizes */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="relative w-10 h-10 flex flex-col justify-center items-center gap-[6px] z-50"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
              <motion.span
                animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
              <motion.span
                animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] origin-center ${scrolled ? 'bg-[#0A0A0A]' : 'bg-white'}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas slide-out menu — elegant side panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-black/8">
                <Image
                  src="/images/logos/webink-black-4x1.png"
                  alt="Webink Solutions"
                  width={140}
                  height={36}
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1L17 17M17 1L1 17" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto px-8 py-10">
                <div className="space-y-1">
                  {/* Services accordion */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between font-urbanist font-black text-4xl text-[#0A0A0A] py-4 border-b border-black/5 hover:text-[#14EAEA] transition-colors duration-200"
                    >
                      Services
                      <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 py-2 space-y-1">
                            {serviceLinks.map((svc) => (
                              <Link
                                key={svc.href}
                                href={svc.href}
                                onClick={handleLinkClick}
                                className="block font-urbanist text-lg font-semibold text-[#0A0A0A]/60 py-2 hover:text-[#14EAEA] transition-colors"
                              >
                                {svc.label}
                              </Link>
                            ))}
                            <Link
                              href="/services"
                              onClick={handleLinkClick}
                              className="block font-urbanist text-lg font-bold text-[#F813BE] py-2 hover:text-[#d10fa3] transition-colors"
                            >
                              View All Services →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {navLinks.map((l, i) => (
                    <motion.a
                      key={l.label}
                      href={l.href}
                      onClick={handleLinkClick}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.16 }}
                      className="block font-urbanist font-black text-4xl text-[#0A0A0A] py-4 border-b border-black/5 hover:text-[#14EAEA] transition-colors duration-200"
                    >
                      {l.label}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile auth section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 pt-6 border-t border-black/8"
                >
                  {status === 'authenticated' && session?.user ? (
                    <div className="space-y-1">
                      {/* User info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#14EAEA] flex items-center justify-center text-[#0A0A0A] text-sm font-bold select-none">
                          {getInitials(session.user.name)}
                        </div>
                        <div>
                          <p className="font-urbanist text-sm font-bold text-[#0A0A0A]">
                            {session.user.name || 'Account'}
                          </p>
                          {isAdmin && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F813BE] text-white px-2 py-0.5 rounded-full leading-none">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={handleLinkClick}
                          className="block font-urbanist text-base font-semibold text-[#F813BE] py-3 hover:text-[#d10fa3] transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        onClick={handleLinkClick}
                        className="block font-urbanist text-base font-semibold text-[#0A0A0A]/70 py-3 hover:text-[#0A0A0A] transition-colors"
                      >
                        My Portal
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={handleLinkClick}
                        className="block font-urbanist text-base font-semibold text-[#0A0A0A]/70 py-3 hover:text-[#0A0A0A] transition-colors"
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLinkClick()
                          signOut({ callbackUrl: '/' })
                        }}
                        className="block font-urbanist text-base font-semibold text-[#0A0A0A]/40 py-3 hover:text-[#0A0A0A]/70 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : status === 'unauthenticated' ? (
                    <Link
                      href="/auth/signin"
                      onClick={handleLinkClick}
                      className="inline-flex font-urbanist text-sm font-bold px-6 py-3 rounded-full border border-[#14EAEA] text-[#14EAEA] hover:bg-[#14EAEA] hover:text-[#0A0A0A] transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  ) : null}
                </motion.div>

                {/* Contact in panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-8 space-y-4"
                >
                  <a
                    href="tel:9418401381"
                    className="flex items-center gap-3 font-urbanist text-base text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors"
                    onClick={handleLinkClick}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#14EAEA]/15 flex items-center justify-center text-[#14EAEA]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                    </span>
                    (941) 840-1381
                  </a>
                  <a
                    href="mailto:hello@webink.solutions"
                    className="flex items-center gap-3 font-urbanist text-base text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors"
                    onClick={handleLinkClick}
                  >
                    <span className="w-8 h-8 rounded-full bg-[#14EAEA]/15 flex items-center justify-center text-[#14EAEA]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </span>
                    hello@webink.solutions
                  </a>
                </motion.div>
              </div>

              {/* CTA at bottom */}
              <div className="px-8 py-8 border-t border-black/8">
                <a
                  href="/contact"
                  onClick={handleLinkClick}
                  className="block w-full text-center font-urbanist font-bold py-4 bg-[#0A0A0A] text-white rounded-2xl hover:bg-[#14EAEA] hover:text-black transition-all duration-300 text-sm tracking-wide"
                >
                  Get a Free Audit →
                </a>
                <p className="text-center text-xs text-black/30 mt-3 font-urbanist">No commitment. Response in 24h.</p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
