'use client'
import Image from 'next/image'
import Link from 'next/link'
import { services, stats, testimonials, portfolio, navLinks } from '@/components/data'

export default function VariantD() {
  return (
    <div className="bg-white text-[#0A0A0A] font-sans">
      {/* ── NAV — minimal white ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logos/webink-black.png" alt="Webink Solutions" width={150} height={40} className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.slice(1).map((l) => (
              <Link key={l.label} href={l.href} className="text-sm text-black/40 hover:text-black transition-colors font-medium">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="hidden md:inline-flex items-center gap-2 border-2 border-[#14EAEA] text-black text-sm font-bold px-6 py-2.5 hover:bg-[#14EAEA] transition-all duration-200">
            Get a Quote
          </Link>
        </div>
      </nav>

      {/* ── HERO — bold typographic ── */}
      <section className="min-h-screen pt-16 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-12 gap-0">
          {/* Main headline — spans 8 cols */}
          <div className="md:col-span-8 py-20 md:py-32">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-3 h-3 rounded-full bg-[#14EAEA]" />
              <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">Sarasota&apos;s Premiere Digital Agency</span>
            </div>
            <h1 className="font-syne text-[clamp(3rem,8vw,7rem)] font-extrabold leading-[0.95] text-black mb-8">
              WEB<br />
              DESIGN<br />
              <span style={{WebkitTextStroke: '2px #0A0A0A', color: 'transparent'}}>THAT</span><br />
              <span className="text-[#14EAEA]">WORKS.</span>
            </h1>
            <p className="text-black/40 text-xl leading-relaxed max-w-lg mb-10">
              We build high-performance websites and run digital marketing campaigns for local businesses. Results-driven. Transparently priced.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-block bg-[#0A0A0A] text-white text-sm font-bold px-10 py-4 hover:bg-[#333] transition-all duration-200">
                Start Your Project
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-bold text-black/40 hover:text-black px-4 py-4 transition-all duration-200">
                View Work <span className="text-[#14EAEA]">→</span>
              </Link>
            </div>
          </div>

          {/* Right col — photo + stats ── */}
          <div className="md:col-span-4 flex flex-col">
            <div className="relative flex-1 min-h-80 md:min-h-full">
              <Image
                src="/images/photos/sean-about.jpg"
                alt="Sean Rowe — Webink Founder"
                fill
                className="object-cover"
                style={{objectPosition: 'center top'}}
                priority
              />
              {/* Cyan accent overlay bar */}
              <div className="absolute left-0 bottom-0 right-0 h-1 bg-[#14EAEA]" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-b border-black/5 bg-[#F8F8F8]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-4 divide-x divide-black/5">
              {stats.map((s) => (
                <div key={s.label} className="py-6 px-8">
                  <div className="font-syne text-3xl font-extrabold text-black">{s.value}</div>
                  <div className="text-black/30 text-xs mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES — bold grid ── */}
      <section className="py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-[#F813BE]" />
                <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">What We Do</span>
              </div>
              <h2 className="font-syne text-5xl font-extrabold text-black leading-tight">
                Full-Service<br />Digital Agency
              </h2>
            </div>
            <div className="md:col-span-7 flex items-end">
              <p className="text-black/40 text-lg leading-relaxed">
                Six core services. One integrated strategy. More traffic, more leads, more revenue — for local businesses across Southwest Florida.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 border-t border-l border-black/10">
            {services.map((svc, i) => (
              <Link key={svc.title} href={svc.href} className="group border-r border-b border-black/10 p-8 hover:bg-[#F8F8F8] transition-colors duration-200">
                <div className="text-2xl mb-4">{svc.icon}</div>
                <h3 className="font-syne text-lg font-bold text-black mb-2 group-hover:text-[#14EAEA] transition-colors">{svc.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{svc.desc}</p>
                <div className="mt-5 text-[#14EAEA] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — clean layout ── */}
      <section className="py-28 px-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#14EAEA]" />
              <span className="text-xs font-bold tracking-[0.4em] text-white/30 uppercase">About Webink</span>
            </div>
            <h2 className="font-syne text-5xl font-extrabold text-white leading-tight mb-6">
              We Drive Growth Through<br /><span className="text-[#14EAEA]">Structure & Process</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-6">
              Sean Rowe founded Webink after years as a firefighter and paramedic in Southwest Florida. When you show up for someone, you show up completely — that&apos;s the standard every Webink client receives.
            </p>
            <div className="space-y-5 mb-10">
              {[
                { label: 'Strategy', desc: 'Deep-dive discovery into your business, goals, and competitors.' },
                { label: 'Design', desc: 'World-class design engineered to convert, not just impress.' },
                { label: 'Growth', desc: 'Data-driven campaigns with transparent reporting and real ROI.' },
              ].map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="font-syne text-xs font-bold text-[#14EAEA] w-6 pt-1">0{i + 1}</div>
                  <div>
                    <div className="font-syne font-bold text-white text-sm">{step.label}</div>
                    <div className="text-white/30 text-sm leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-block border-2 border-[#14EAEA] text-[#14EAEA] text-sm font-bold px-7 py-3 hover:bg-[#14EAEA] hover:text-black transition-all duration-200">
              Meet the Team
            </Link>
          </div>
          <div className="relative">
            <div className="relative rounded-none overflow-hidden h-[560px]">
              <Image
                src="/images/photos/team-duo.jpg"
                alt="Webink team"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#14EAEA] p-6">
              <div className="font-syne text-3xl font-extrabold text-black">#1</div>
              <div className="text-black/60 text-xs mt-0.5">Rated on DesignRush</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS ── */}
      <section className="py-28 px-8 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[#B9FF33]" />
            <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">Technology</span>
          </div>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-5 font-syne text-4xl font-extrabold text-black">AI-Enhanced. Human-Driven.</h2>
            <p className="md:col-span-7 text-black/40 text-lg leading-relaxed md:pt-3">
              We use AI tools to move faster and deliver sharper results — without losing the human judgment that makes the difference.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: 'Intelligent Copy', desc: 'AI-drafted, human-refined content that ranks and converts.', tag: 'Content', color: '#14EAEA' },
              { title: 'Predictive SEO', desc: 'AI analysis surfaces keyword gaps your competitors haven\'t found.', tag: 'SEO', color: '#F813BE' },
              { title: 'Smart Reporting', desc: 'Dashboards that surface insights and actionable next steps automatically.', tag: 'Analytics', color: '#B9FF33' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-black/5 p-8">
                <div className="inline-block text-xs font-bold px-3 py-1 mb-5 font-mono" style={{background: item.color, color: '#000'}}>
                  {item.tag}
                </div>
                <h3 className="font-syne text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="py-28 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-[#F813BE]" />
                <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">Portfolio</span>
              </div>
              <h2 className="font-syne text-4xl font-extrabold text-black">Recent Work</h2>
            </div>
            <Link href="/portfolio" className="text-sm font-bold text-black/30 hover:text-black flex items-center gap-1 transition-colors">
              All Projects <span className="text-[#14EAEA]">→</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {portfolio.map((p) => (
              <div key={p.name} className="group">
                <div className="relative h-60 overflow-hidden border border-black/5">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
                </div>
                <div className="pt-4 pb-2 border-b border-black/5">
                  <div className="text-[#F813BE] text-xs font-bold tracking-widest uppercase mb-1">{p.type}</div>
                  <div className="font-syne text-base font-bold text-black">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-8 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[#14EAEA]" />
            <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">Reviews</span>
          </div>
          <h2 className="font-syne text-4xl font-extrabold text-black mb-12">Client Results</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-black/5 p-8">
                <div className="font-syne text-5xl text-[#14EAEA] leading-none mb-4">&ldquo;</div>
                <p className="text-black/60 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="pt-4 border-t border-black/5">
                  <div className="font-bold text-black text-sm">{t.name}</div>
                  <div className="text-black/30 text-xs mt-0.5">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-28 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-[#B9FF33]" />
            <span className="text-xs font-bold tracking-[0.4em] text-black/30 uppercase">Pricing</span>
          </div>
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-5 font-syne text-4xl font-extrabold text-black">Transparent. Flexible.</h2>
            <p className="md:col-span-7 text-black/40 text-lg leading-relaxed md:pt-3">
              No hidden fees. No long-term lock-in. Plans built for real small businesses.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-0 border-t border-l border-black/10">
            {[
              { name: 'Starter', price: '$31', period: '/mo', features: ['Managed Hosting', 'SSL Certificate', 'Daily Backups', 'Email Support'], highlight: false },
              { name: 'Growth', price: '$493', period: '/mo', features: ['Everything in Starter', 'Social Media Marketing', 'Content Creation', 'Monthly Reports', 'Priority Support'], highlight: true },
              { name: 'Authority', price: '$1,103', period: '/mo', features: ['Everything in Growth', 'Full Managed SEO', 'Google Ads Mgmt', 'Weekly Strategy Calls', 'Account Manager'], highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`border-r border-b border-black/10 p-10 ${plan.highlight ? 'bg-[#14EAEA]' : ''}`}>
                {plan.highlight && <div className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-black/60">MOST POPULAR</div>}
                <div className={`text-xs font-bold tracking-[0.3em] uppercase mb-2 ${plan.highlight ? 'text-black/50' : 'text-black/30'}`}>{plan.name}</div>
                <div className="font-syne text-5xl font-extrabold mb-1 text-black">
                  {plan.price}<span className="text-lg font-normal opacity-50">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className={`text-lg ${plan.highlight ? 'text-black' : 'text-[#14EAEA]'}`}>✓</span>
                      <span className="text-black/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center text-sm font-bold py-3 transition-all duration-200 ${plan.highlight ? 'bg-black text-white hover:bg-[#333]' : 'border-2 border-black/10 text-black hover:border-[#14EAEA] hover:text-[#14EAEA]'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-8 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-[#14EAEA]" />
              <span className="text-xs font-bold tracking-[0.4em] text-white/30 uppercase">Next Step</span>
            </div>
            <h2 className="font-syne text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Ready to<br /><span className="text-[#14EAEA]">Grow?</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10">
              Free consultation. We&apos;ll review your website, identify quick wins, and build a clear roadmap — no sales pressure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-block border-2 border-[#14EAEA] text-[#14EAEA] text-sm font-bold px-8 py-4 hover:bg-[#14EAEA] hover:text-black transition-all duration-200">
                Get a Free Quote
              </Link>
              <Link href="tel:9418401381" className="inline-block border-2 border-white/10 text-white/40 text-sm font-bold px-8 py-4 hover:border-white/30 hover:text-white transition-all duration-200">
                Call (941) 840-1381
              </Link>
            </div>
          </div>
          <div className="relative h-80 md:h-auto">
            <Image
              src="/images/photos/team-family.jpg"
              alt="Webink team"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#0A0A0A]/20" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#14EAEA]" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/5 bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image src="/images/logos/webink-black.png" alt="Webink Solutions" width={140} height={38} className="h-8 w-auto mb-4" />
            <p className="text-black/30 text-sm leading-relaxed max-w-sm">
              Web design, SEO, and digital marketing for local businesses across Southwest Florida.
            </p>
            <div className="mt-5 text-sm text-black/20">
              <div>(941) 840-1381 · hello@webink.solutions</div>
              <div>Sarasota, FL 34232</div>
            </div>
          </div>
          <div>
            <div className="font-syne font-bold text-black text-sm mb-4">Services</div>
            <ul className="space-y-2">
              {['Web Design', 'SEO', 'Digital Marketing', 'Social Media', 'Web Hosting'].map((s) => (
                <li key={s}><Link href="/services" className="text-black/30 text-sm hover:text-black transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-syne font-bold text-black text-sm mb-4">Company</div>
            <ul className="space-y-2">
              {['About', 'Portfolio', 'Blog', 'Contact', 'Pricing'].map((s) => (
                <li key={s}><Link href="/" className="text-black/30 text-sm hover:text-black transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/5 flex justify-between text-black/15 text-xs">
          <span>© 2026 Webink Solutions</span>
          <span>Rethink Design.</span>
        </div>
      </footer>
    </div>
  )
}
