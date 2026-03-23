'use client'
import Image from 'next/image'
import Link from 'next/link'
import { services, stats, testimonials, portfolio, navLinks } from '@/components/data'

export default function VariantB() {
  return (
    <div className="bg-[#0A0A0A] text-white font-sans">
      {/* ── NAV — restrained, corporate ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={140} height={38} className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.slice(1).map((l) => (
              <Link key={l.label} href={l.href} className="text-xs font-semibold text-white/50 hover:text-white tracking-widest uppercase transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="hidden md:inline-flex items-center gap-2 border border-[#14EAEA] text-[#14EAEA] text-xs font-bold px-6 py-2.5 uppercase tracking-widest hover:bg-[#14EAEA] hover:text-black transition-all duration-200">
            Get a Quote
          </Link>
        </div>
      </nav>

      {/* ── HERO — split with workspace photo ── */}
      <section className="min-h-screen grid md:grid-cols-2 pt-16">
        {/* Left: text */}
        <div className="flex flex-col justify-center px-12 lg:px-20 py-24">
          <div className="w-12 h-0.5 bg-[#14EAEA] mb-8" />
          <div className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase mb-6">
            Sarasota · Tampa · Bradenton
          </div>
          <h1 className="font-syne text-5xl lg:text-6xl font-bold leading-tight mb-8">
            Digital Agency<br />
            <span className="text-white/30">for Local</span><br />
            <span className="text-white">Business Growth</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
            Webink Solutions builds high-performance websites and runs measurable marketing campaigns for businesses across Southwest Florida. Straightforward pricing. Real results.
          </p>
          <div className="flex gap-4 mb-16">
            <Link href="/contact" className="inline-block bg-[#14EAEA] text-black text-xs font-bold px-8 py-4 uppercase tracking-widest hover:bg-[#14EAEA]/80 transition-all duration-200">
              Start a Project
            </Link>
            <Link href="/portfolio" className="inline-block border border-white/20 text-white/60 text-xs font-bold px-8 py-4 uppercase tracking-widest hover:border-white/50 hover:text-white transition-all duration-200">
              Our Work
            </Link>
          </div>
          {/* Stats inline */}
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <div className="font-syne text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/30 text-xs mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: full-bleed photo */}
        <div className="relative min-h-[60vh] md:min-h-full">
          <Image
            src="/images/photos/workspace-dark.jpg"
            alt="Digital workspace"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
          <div className="absolute inset-0 bg-[#0A0A0A]/30" />
          {/* Cyan accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#14EAEA]/30" />
        </div>
      </section>

      {/* ── SERVICES — tight grid ── */}
      <section className="py-24 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-6 gap-0 border border-white/10">
            {/* Section header */}
            <div className="md:col-span-2 p-10 border-r border-white/10">
              <div className="w-6 h-0.5 bg-[#14EAEA] mb-6" />
              <div className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase mb-4">Services</div>
              <h2 className="font-syne text-3xl font-bold text-white leading-tight">What We Deliver</h2>
              <p className="text-white/40 text-sm leading-relaxed mt-4">
                End-to-end digital solutions. One agency, all channels covered.
              </p>
              <Link href="/services" className="inline-block mt-8 text-xs font-bold text-[#14EAEA] uppercase tracking-widest hover:text-white transition-colors">
                All Services →
              </Link>
            </div>
            {/* Services grid */}
            <div className="md:col-span-4 grid grid-cols-2 divide-x divide-y divide-white/10">
              {services.slice(0, 6).map((svc, i) => (
                <Link key={svc.title} href={svc.href} className="group p-8 hover:bg-[#14EAEA]/5 transition-colors duration-200">
                  <div className="text-2xl mb-4">{svc.icon}</div>
                  <div className="font-syne text-sm font-bold text-white mb-2 group-hover:text-[#14EAEA] transition-colors">{svc.title}</div>
                  <div className="text-white/30 text-xs leading-relaxed">{svc.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT — minimal ── */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-0 border border-white/10">
          {/* Photo */}
          <div className="relative min-h-80 md:min-h-full">
            <Image
              src="/images/photos/sean-hero.jpg"
              alt="Sean Rowe — Webink Founder"
              fill
              className="object-cover"
              style={{objectPosition: 'center top'}}
            />
            <div className="absolute inset-0 bg-[#0A0A0A]/20" />
          </div>
          {/* Content */}
          <div className="p-10 lg:p-16 border-t md:border-t-0 md:border-l border-white/10">
            <div className="w-6 h-0.5 bg-[#14EAEA] mb-6" />
            <div className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase mb-4">About</div>
            <h2 className="font-syne text-3xl font-bold text-white mb-6">
              Built by a Founder Who<br />Has Been in the Field
            </h2>
            <p className="text-white/50 text-sm leading-loose mb-6">
              Before building websites, Sean Rowe was a firefighter and paramedic — someone who understood that showing up for people, every single time, isn&apos;t optional. That same standard defines every client relationship at Webink Solutions.
            </p>
            <p className="text-white/50 text-sm leading-loose mb-8">
              Based in Sarasota, FL. Serving local businesses across Sarasota, Tampa, and Bradenton with web design, SEO, and digital marketing that actually moves the needle.
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-xs font-bold text-[#14EAEA] uppercase tracking-widest hover:text-white transition-colors">
                Our Story →
              </Link>
              <Link href="/contact" className="text-xs font-bold text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                Contact →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS ── */}
      <section className="py-24 px-8 bg-[#0D0D0D] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 items-start">
            <div>
              <div className="w-6 h-0.5 bg-[#14EAEA] mb-6" />
              <div className="text-xs font-bold tracking-[0.3em] text-[#14EAEA] uppercase mb-4">Technology</div>
              <h2 className="font-syne text-2xl font-bold text-white">AI-Enhanced Delivery</h2>
            </div>
            {[
              { title: 'Smarter Copy', desc: 'AI-assisted content that\'s optimized for both readers and search algorithms.' },
              { title: 'Predictive SEO', desc: 'Identify keyword opportunities before your competitors discover them.' },
              { title: 'Live Reporting', desc: 'Real-time dashboards showing exactly where your traffic and leads come from.' },
            ].map((item) => (
              <div key={item.title} className="border-l border-[#14EAEA]/30 pl-6">
                <div className="font-syne font-bold text-white text-sm mb-2">{item.title}</div>
                <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10 border border-white/10">
            {stats.map((s) => (
              <div key={s.label} className="p-10 text-center">
                <div className="font-syne text-4xl font-bold text-[#14EAEA]">{s.value}</div>
                <div className="text-white/30 text-xs mt-2 tracking-widest uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="py-24 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="w-6 h-0.5 bg-[#14EAEA] mb-4" />
              <h2 className="font-syne text-3xl font-bold text-white">Recent Work</h2>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-[#14EAEA] uppercase tracking-widest hover:text-white transition-colors">
              All Projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {portfolio.map((p) => (
              <div key={p.name} className="group relative overflow-hidden">
                <div className="relative h-56 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#0A0A0A]/50" />
                </div>
                <div className="mt-3">
                  <div className="text-[#14EAEA] text-xs font-bold tracking-widest uppercase mb-1">{p.type}</div>
                  <div className="font-syne text-base font-bold text-white">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-8 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="w-6 h-0.5 bg-[#14EAEA] mb-6" />
          <h2 className="font-syne text-3xl font-bold text-white mb-12">Client Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="border-l border-[#14EAEA]/20 pl-6">
                <p className="text-white/50 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="font-syne font-bold text-white text-sm">{t.name}</div>
                <div className="text-white/30 text-xs mt-0.5">{t.company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-6 h-0.5 bg-[#14EAEA] mb-4 mx-auto" />
            <h2 className="font-syne text-3xl font-bold text-white">Transparent Pricing</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border border-white/10 divide-x divide-white/10">
            {[
              { name: 'Starter', price: '$31/mo', features: ['Managed Hosting', 'SSL Certificate', 'Daily Backups', 'Email Support'] },
              { name: 'Growth', price: '$493/mo', features: ['Everything in Starter', 'Social Media Marketing', 'Content Creation', 'Monthly Reports'], popular: true },
              { name: 'Authority', price: '$1,103/mo', features: ['Everything in Growth', 'Full Managed SEO', 'Google Ads', 'Weekly Strategy Calls'] },
            ].map((plan) => (
              <div key={plan.name} className={`p-10 ${plan.popular ? 'bg-[#14EAEA]/5' : ''}`}>
                {plan.popular && <div className="text-[#14EAEA] text-xs font-bold tracking-widest uppercase mb-4">Most Popular</div>}
                <div className="font-syne text-sm font-bold text-white/40 tracking-widest uppercase mb-2">{plan.name}</div>
                <div className="font-syne text-3xl font-bold text-white mb-6">{plan.price}</div>
                <ul className="space-y-2 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                      <span className="text-[#14EAEA]">—</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center text-xs font-bold py-3 uppercase tracking-widest transition-all duration-200 ${plan.popular ? 'bg-[#14EAEA] text-black hover:bg-[#14EAEA]/80' : 'border border-white/20 text-white/50 hover:border-[#14EAEA] hover:text-[#14EAEA]'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-8 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-0.5 bg-[#14EAEA] mb-8 mx-auto" />
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-10">
            Free consultation, no obligation. We&apos;ll review your current situation and outline a clear path to more traffic, more leads, and more revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-block bg-[#14EAEA] text-black text-xs font-bold px-10 py-4 uppercase tracking-widest hover:bg-[#14EAEA]/80 transition-all duration-200">
              Book a Free Call
            </Link>
            <Link href="tel:9418401381" className="inline-block border border-white/20 text-white/40 text-xs font-bold px-10 py-4 uppercase tracking-widest hover:border-white/40 hover:text-white transition-all duration-200">
              (941) 840-1381
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={120} height={32} className="h-7 w-auto mb-3" />
            <div className="text-white/20 text-xs">(941) 840-1381 · hello@webink.solutions</div>
            <div className="text-white/20 text-xs mt-1">1609 Georgetowne Blvd, Sarasota, FL 34232</div>
          </div>
          <div className="flex gap-8">
            {['Services', 'Portfolio', 'About', 'Blog', 'Contact'].map((s) => (
              <Link key={s} href="/" className="text-white/30 text-xs uppercase tracking-widest hover:text-[#14EAEA] transition-colors">{s}</Link>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/5 text-white/15 text-xs flex justify-between">
          <span>© 2026 Webink Solutions</span>
          <span>Rethink Design.</span>
        </div>
      </footer>
    </div>
  )
}
