'use client'
import Image from 'next/image'
import Link from 'next/link'
import { services, stats, testimonials, portfolio, marqueeItems, navLinks } from '@/components/data'

export default function VariantC() {
  const marqueeText = marqueeItems.join(' · ') + ' · '

  return (
    <div className="bg-[#F8F8F8] text-[#0A0A0A] font-sans">
      {/* ── NAV — light editorial ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logos/webink-black.png" alt="Webink Solutions" width={150} height={40} className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((l) => (
              <Link key={l.label} href={l.href} className="text-sm font-medium text-black/50 hover:text-black transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#333] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200">
            Get a Quote
          </Link>
        </div>
      </nav>

      {/* ── HERO — editorial split with large photo ── */}
      <section className="min-h-screen pt-16 grid md:grid-cols-2">
        {/* Left: full-bleed photo */}
        <div className="relative min-h-[70vh] md:min-h-full order-2 md:order-1">
          <Image
            src="/images/photos/sean-hero.jpg"
            alt="Sean Rowe — Founder, Webink Solutions"
            fill
            className="object-cover"
            style={{objectPosition: 'center top'}}
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          {/* Floating tag */}
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
            <div className="text-xs font-bold text-[#14EAEA] tracking-widest uppercase mb-1">6+ Years</div>
            <div className="font-syne font-bold text-black text-sm">Serving Southwest Florida Businesses</div>
          </div>
        </div>

        {/* Right: editorial content */}
        <div className="flex flex-col justify-center px-10 lg:px-20 py-24 order-1 md:order-2">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-px bg-[#F813BE]" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#F813BE] uppercase">Sarasota&apos;s Premiere Digital Agency</span>
          </div>
          <h1 className="font-syne text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-8 text-black">
            Rethink<br />
            <em className="not-italic text-[#14EAEA]">Design.</em><br />
            <span className="text-black/30">Drive Growth.</span>
          </h1>
          <p className="text-black/50 text-lg leading-relaxed mb-10 max-w-md">
            We build world-class websites and run digital marketing for local businesses in Sarasota, Tampa & Bradenton. High-design. High-performance.
          </p>
          <div className="flex flex-wrap gap-4 mb-16">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#F813BE] hover:bg-[#F813BE]/80 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-200">
              Start Your Project
            </Link>
            <Link href="/portfolio" className="inline-flex items-center gap-2 bg-white border border-black/10 hover:border-black/30 text-black text-sm font-medium px-7 py-3.5 rounded-full transition-all duration-200">
              View Portfolio
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-black/10">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <div className="font-syne text-3xl font-bold text-[#0A0A0A]">{s.value}</div>
                <div className="text-black/30 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE — tropical editorial ── */}
      <div className="overflow-hidden bg-[#0A0A0A] py-4">
        <div className="marquee-track animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-sm font-syne font-bold text-white/20 tracking-[0.25em] mx-8 uppercase">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES — editorial cards ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-16">
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-6 h-px bg-[#F813BE]" />
                <span className="text-xs font-bold tracking-[0.3em] text-[#F813BE] uppercase">Services</span>
              </div>
              <h2 className="font-syne text-4xl font-extrabold text-black leading-tight">
                Everything Your Business Needs Online.
              </h2>
            </div>
            <div className="md:col-span-3 flex items-end">
              <p className="text-black/40 text-lg leading-relaxed">
                From building your website to running your ads to managing your social media — we do it all under one roof, so you don&apos;t have to coordinate between agencies.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc, i) => (
              <Link key={svc.title} href={svc.href} className={`group block rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] ${i === 0 ? 'bg-[#0A0A0A] text-white' : i === 1 ? 'bg-[#14EAEA] text-black' : i === 2 ? 'bg-[#F813BE] text-white' : 'bg-[#F8F8F8] border border-black/5 text-black hover:bg-[#F0F0F0]'}`}>
                <div className="text-3xl mb-5">{svc.icon}</div>
                <h3 className={`font-syne text-xl font-bold mb-3 ${i < 3 ? '' : 'text-black'}`}>{svc.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? 'text-white/60' : i === 1 ? 'text-black/60' : i === 2 ? 'text-white/80' : 'text-black/50'}`}>{svc.desc}</p>
                <div className="mt-6 text-sm font-semibold opacity-70">Learn more →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-28 px-6 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-6 h-px bg-[#14EAEA]" />
              <span className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase">Our Story</span>
            </div>
            <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-black leading-tight mb-6">
              A Firefighter Who<br />Builds Websites.
            </h2>
            <p className="text-black/50 text-lg leading-relaxed mb-6">
              Before founding Webink, Sean Rowe spent years as a firefighter and paramedic in Southwest Florida — learning that when you show up for someone, you show up completely. That ethos drives every client engagement.
            </p>
            <p className="text-black/40 text-base leading-relaxed mb-10">
              Based in Sarasota. Proud to serve local businesses across the Gulf Coast with design, marketing, and hosting that makes a real difference on the bottom line.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white text-sm font-bold px-7 py-3.5 rounded-full hover:bg-[#333] transition-all duration-200">
              Meet the Team
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden h-64">
                <Image src="/images/photos/team-rooftop.jpg" alt="Webink team" fill className="object-cover" />
              </div>
              <div className="bg-[#0A0A0A] rounded-3xl p-6">
                <div className="font-syne text-4xl font-bold text-[#14EAEA]">50+</div>
                <div className="text-white/50 text-xs mt-1">Clients Served</div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-[#F813BE] rounded-3xl p-6">
                <div className="font-syne text-4xl font-bold text-white">6+</div>
                <div className="text-white/70 text-xs mt-1">Years in Business</div>
              </div>
              <div className="relative rounded-3xl overflow-hidden h-64">
                <Image src="/images/photos/sean-portrait.jpg" alt="Sean portrait" fill className="object-cover" style={{objectPosition: 'center top'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS — light section ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
            <div className="w-6 h-px bg-[#B9FF33]" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#0A0A0A]/40 uppercase">Technology</span>
            <div className="w-6 h-px bg-[#B9FF33]" />
          </div>
          <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-black mb-4">AI-Powered. Human-Led.</h2>
          <p className="text-black/40 text-lg max-w-2xl mx-auto">The same tools used by Fortune 500 companies — applied intelligently to local business.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { title: 'Intelligent Copy', desc: 'AI-generated content refined by human expertise. Optimized for conversion and search — without sounding like a robot.', accent: '#14EAEA' },
            { title: 'Predictive SEO', desc: 'AI analysis identifies keyword gaps and ranking opportunities your competitors haven\'t found yet.', accent: '#F813BE' },
            { title: 'Smart Reporting', desc: 'Dashboards that tell you what\'s working, what isn\'t, and exactly what to do next.', accent: '#B9FF33' },
          ].map((item) => (
            <div key={item.title} className="bg-[#F8F8F8] rounded-3xl p-8 border border-black/5">
              <div className="w-10 h-1.5 rounded-full mb-6" style={{background: item.accent}} />
              <h3 className="font-syne text-xl font-bold text-black mb-3">{item.title}</h3>
              <p className="text-black/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {stats.map((s) => (
            <div key={s.label} className="py-8 px-10 text-center">
              <div className="font-syne text-5xl font-bold text-white">{s.value}</div>
              <div className="text-white/30 text-xs mt-2 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-6 h-px bg-[#F813BE]" />
                <span className="text-xs font-bold tracking-[0.3em] text-[#F813BE] uppercase">Portfolio</span>
              </div>
              <h2 className="font-syne text-4xl font-extrabold text-black">Built for Real Businesses</h2>
            </div>
            <Link href="/portfolio" className="hidden md:block text-sm font-medium text-black/40 hover:text-black transition-colors">
              See all work →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {portfolio.map((p) => (
              <div key={p.name} className="group relative rounded-3xl overflow-hidden">
                <div className="relative h-72 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-[#14EAEA] text-xs font-bold uppercase tracking-wide mb-1">{p.type}</div>
                  <div className="font-syne text-lg font-bold text-white">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-syne text-4xl font-extrabold text-black mb-2">What Our Clients Say</h2>
            <p className="text-black/30 text-base">Real reviews from real businesses across Southwest Florida.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-8 border border-black/5">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#F813BE] text-lg">★</span>
                  ))}
                </div>
                <p className="text-black/60 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#14EAEA]/20 flex items-center justify-center text-[#14EAEA] font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm">{t.name}</div>
                    <div className="text-black/30 text-xs">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <div className="w-6 h-px bg-[#14EAEA]" />
              <span className="text-xs font-bold tracking-[0.3em] text-black/30 uppercase">Pricing</span>
              <div className="w-6 h-px bg-[#14EAEA]" />
            </div>
            <h2 className="font-syne text-4xl font-extrabold text-black">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Starter', price: '$31', period: '/mo', features: ['Managed Hosting', 'SSL Certificate', 'Daily Backups', 'Email Support'], highlight: false },
              { name: 'Growth', price: '$493', period: '/mo', features: ['Everything in Starter', 'Social Media Marketing', 'Content Creation', 'Monthly Reports', 'Priority Support'], highlight: true },
              { name: 'Authority', price: '$1,103', period: '/mo', features: ['Everything in Growth', 'Full Managed SEO', 'Google Ads Management', 'Weekly Strategy Calls', 'Dedicated Account Mgr'], highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-3xl p-8 relative ${plan.highlight ? 'bg-[#0A0A0A] text-white' : 'bg-[#F8F8F8] border border-black/5 text-black'}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#14EAEA] text-black text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
                <div className={`text-xs font-bold tracking-[0.3em] uppercase mb-3 ${plan.highlight ? 'text-[#14EAEA]' : 'text-black/30'}`}>{plan.name}</div>
                <div className="font-syne text-5xl font-bold mb-6">
                  {plan.price}<span className="text-xl opacity-40">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="text-[#14EAEA] text-lg">✓</span>
                      <span className={plan.highlight ? 'text-white/70' : 'text-black/50'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center text-sm font-bold py-3.5 rounded-full transition-all duration-200 ${plan.highlight ? 'bg-[#14EAEA] text-black hover:bg-[#14EAEA]/80' : 'border border-black/10 text-black hover:bg-[#0A0A0A] hover:text-white hover:border-transparent'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — dark with baja photo ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/photos/baja-beach.jpg" alt="Florida lifestyle" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0A0A0A]/80" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-px bg-[#14EAEA]" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase">Let&apos;s Work Together</span>
            <div className="w-6 h-px bg-[#14EAEA]" />
          </div>
          <h2 className="font-syne text-5xl md:text-6xl font-extrabold mb-6">
            Ready to Grow<br />Your Business?
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-10">
            Free consultation. We&apos;ll build you a clear roadmap in our first call — no fluff, no pressure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#14EAEA] text-black text-sm font-bold px-8 py-4 rounded-full hover:bg-[#14EAEA]/80 transition-all duration-200">
              Get a Free Quote
            </Link>
            <Link href="tel:9418401381" className="inline-flex items-center gap-2 border border-white/20 text-white text-sm font-medium px-8 py-4 rounded-full hover:border-white/40 transition-all duration-200">
              (941) 840-1381
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/10 bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image src="/images/logos/webink-black.png" alt="Webink Solutions" width={140} height={38} className="h-8 w-auto mb-4" />
            <p className="text-black/40 text-sm leading-relaxed max-w-sm">
              Sarasota&apos;s premiere digital agency. Web design, SEO, and digital marketing for local businesses.
            </p>
            <div className="mt-5 text-sm text-black/30">
              <div>(941) 840-1381</div>
              <div>hello@webink.solutions</div>
              <div className="mt-1">Sarasota, FL 34232</div>
            </div>
          </div>
          <div>
            <div className="font-syne font-bold text-black text-sm mb-4">Services</div>
            <ul className="space-y-2">
              {['Web Design', 'SEO Services', 'Digital Marketing', 'Social Media', 'Web Hosting'].map((s) => (
                <li key={s}><Link href="/services" className="text-black/40 text-sm hover:text-black transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-syne font-bold text-black text-sm mb-4">Company</div>
            <ul className="space-y-2">
              {['About', 'Portfolio', 'Blog', 'Contact', 'Pricing'].map((s) => (
                <li key={s}><Link href="/" className="text-black/40 text-sm hover:text-black transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/5 flex justify-between text-black/20 text-xs">
          <span>© 2026 Webink Solutions</span>
          <span>Rethink Design.</span>
        </div>
      </footer>
    </div>
  )
}
