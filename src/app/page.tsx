'use client'
import Image from 'next/image'
import Link from 'next/link'
import { services, stats, testimonials, portfolio, marqueeItems, navLinks } from '@/components/data'

export default function VariantA() {
  const marqueeText = marqueeItems.join(' • ') + ' • '

  return (
    <div className="bg-[#0A0A0A] text-white font-sans">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#14EAEA]/20 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={160} height={44} className="h-9 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.slice(1).map((l) => (
              <Link key={l.label} href={l.href} className="text-sm font-medium text-white/70 hover:text-[#14EAEA] transition-colors duration-200">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/contact" className="hidden md:inline-flex items-center gap-2 bg-[#F813BE] hover:bg-[#F813BE]/80 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(248,19,190,0.5)]">
            Get a Quote
          </Link>
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(20,234,234,1) 1px, transparent 1px), linear-gradient(to right, rgba(20,234,234,1) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />
        {/* Cyan glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#14EAEA]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-[#F813BE]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#14EAEA]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
              <span className="text-xs font-medium text-[#14EAEA] tracking-widest uppercase">Sarasota&apos;s Premiere Digital Agency</span>
            </div>
            <h1 className="font-syne text-5xl md:text-7xl font-800 leading-[1.05] mb-6">
              <span className="text-white block">Websites</span>
              <span className="text-white block">That <em className="not-italic text-[#14EAEA] text-glow-cyan">Work.</em></span>
              <span className="text-white/40 block text-4xl md:text-5xl mt-1">Marketing That</span>
              <span className="block text-4xl md:text-5xl">
                <em className="not-italic text-[#F813BE]">Converts.</em>
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              We build high-performance websites and run data-driven marketing campaigns for local businesses in Sarasota, Tampa & Bradenton. Structure. Process. Results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#14EAEA] hover:bg-[#14EAEA]/80 text-black text-sm font-bold px-7 py-3.5 rounded-full transition-all duration-200 glow-cyan hover:scale-105">
                Get a Free Quote
              </Link>
              <Link href="/portfolio" className="inline-flex items-center gap-2 border border-white/20 hover:border-[#14EAEA]/60 text-white/80 hover:text-[#14EAEA] text-sm font-medium px-7 py-3.5 rounded-full transition-all duration-200">
                See Our Work →
              </Link>
            </div>
            <div className="flex gap-8 mt-12">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="font-syne text-2xl font-bold text-[#14EAEA]">{s.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#14EAEA]/20">
              <Image
                src="/images/photos/sean-hero.jpg"
                alt="Sean Rowe — Founder, Webink Solutions"
                width={600}
                height={700}
                className="w-full object-cover h-[520px]"
                style={{objectPosition: 'center top'}}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
              {/* Cyan border glow */}
              <div className="absolute inset-0 rounded-2xl border border-[#14EAEA]/30 pointer-events-none" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-[#0A0A0A] border border-[#14EAEA]/30 rounded-xl p-4 glow-cyan">
              <div className="font-syne text-3xl font-bold text-[#14EAEA]">300%</div>
              <div className="text-xs text-white/50 mt-0.5">Avg Traffic Increase</div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#F813BE] rounded-xl px-4 py-2 shadow-lg glow-pink">
              <div className="text-xs font-bold text-white">#1 Rated</div>
              <div className="text-[10px] text-white/80">on DesignRush</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden border-y border-[#14EAEA]/10 bg-[#0A0A0A] py-4">
        <div className="marquee-track animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-lg font-syne font-bold text-white/10 tracking-widest mx-8">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="text-xs font-semibold tracking-widest text-[#14EAEA] uppercase mb-3">What We Do</div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white">Full-Service Digital Agency</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <Link key={svc.title} href={svc.href} className="group block border border-white/10 hover:border-[#14EAEA]/50 rounded-2xl p-8 transition-all duration-300 hover:bg-[#14EAEA]/5">
                <div className="text-3xl mb-5">{svc.icon}</div>
                <h3 className="font-syne text-xl font-bold text-white mb-3 group-hover:text-[#14EAEA] transition-colors">{svc.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{svc.desc}</p>
                <div className="mt-6 text-[#14EAEA] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / WHY WEBINK ── */}
      <section className="py-28 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/photos/sean-about.jpg"
                alt="Sean Rowe — Webink Solutions Founder"
                width={600}
                height={700}
                className="w-full object-cover h-[540px]"
                style={{objectPosition: 'center 20%'}}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-[#0A0A0A] border border-[#14EAEA]/20 rounded-2xl p-6 max-w-xs">
              <p className="text-white/70 text-sm italic leading-relaxed">&ldquo;From firefighter & paramedic to digital agency founder — I understand what it means to show up for people when it counts.&rdquo;</p>
              <div className="mt-3 text-[#14EAEA] text-sm font-semibold">— Sean Rowe, Founder</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest text-[#14EAEA] uppercase mb-3">Our Approach</div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-6">
              We Drive Growth Through <em className="not-italic text-[#14EAEA]">Structure & Process</em>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              Before becoming a digital agency founder, Sean was a firefighter and paramedic — someone who knew that when you show up for people, you deliver. That&apos;s the culture at Webink.
            </p>
            <div className="space-y-6">
              {[
                { n: '01', title: 'Strategy First', desc: 'Every project starts with a deep dive into your business goals, competitors, and target audience.' },
                { n: '02', title: 'Design with Intent', desc: 'Beautiful design that\'s engineered to convert — not just to impress at first glance.' },
                { n: '03', title: 'Market & Measure', desc: 'Launch, run campaigns, track every metric, and optimize relentlessly until the numbers move.' },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div className="font-syne text-4xl font-bold text-[#14EAEA]/20 w-12 flex-shrink-0">{step.n}</div>
                  <div>
                    <div className="font-syne font-bold text-white mb-1">{step.title}</div>
                    <div className="text-white/50 text-sm leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="inline-flex items-center gap-2 mt-10 border border-[#14EAEA]/30 hover:border-[#14EAEA] text-[#14EAEA] text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200">
              Meet the Team →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS SHOWCASE ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest text-[#B9FF33] uppercase mb-3">The Edge You Need</div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4">AI-Powered. Human-Crafted.</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">We leverage the latest AI tools to move faster and deliver sharper results — while keeping your brand voice authentically yours.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Intelligent Copy', desc: 'AI-assisted copywriting that\'s trained on what converts in your industry — then refined by a human who knows your market.', color: '#14EAEA' },
              { title: 'Predictive SEO', desc: 'We use AI analysis to identify keyword opportunities your competitors haven\'t spotted yet.', color: '#F813BE' },
              { title: 'Automated Reporting', desc: 'Real-time dashboards and monthly AI-generated reports that tell you what\'s working and exactly what to do next.', color: '#B9FF33' },
            ].map((item) => (
              <div key={item.title} className="border rounded-2xl p-8 relative overflow-hidden" style={{borderColor: `${item.color}30`, background: `linear-gradient(135deg, ${item.color}08 0%, transparent 100%)`}}>
                <div className="w-10 h-1 rounded-full mb-5" style={{background: item.color}} />
                <h3 className="font-syne text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS DARK BAND ── */}
      <section className="py-20 px-6 bg-[#0D0D0D] border-y border-[#14EAEA]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-syne text-5xl md:text-6xl font-bold text-[#14EAEA]">{s.value}</div>
                <div className="text-white/40 text-sm mt-2 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="text-xs font-semibold tracking-widest text-[#14EAEA] uppercase mb-3">Recent Work</div>
              <h2 className="font-syne text-4xl md:text-5xl font-bold text-white">Built for Real Businesses</h2>
            </div>
            <Link href="/portfolio" className="hidden md:inline-flex text-[#14EAEA] text-sm font-medium hover:text-white transition-colors">
              View All Projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {portfolio.map((p) => (
              <div key={p.name} className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#14EAEA]/40 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-xs text-[#14EAEA] font-semibold tracking-wide uppercase mb-1">{p.type}</div>
                  <div className="font-syne text-lg font-bold text-white">{p.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest text-[#F813BE] uppercase mb-3">Client Stories</div>
            <h2 className="font-syne text-4xl font-bold text-white">Real Results, Real People</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-white/10 rounded-2xl p-8">
                <div className="text-[#F813BE] text-3xl mb-4">&ldquo;</div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#14EAEA]/20 flex items-center justify-center text-[#14EAEA] font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE REVERSE ── */}
      <div className="overflow-hidden border-y border-[#F813BE]/10 bg-[#0A0A0A] py-4">
        <div className="marquee-track animate-marquee-reverse whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-lg font-syne font-bold text-[#F813BE]/10 tracking-widest mx-8">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ── PRICING PREVIEW ── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest text-[#14EAEA] uppercase mb-3">Simple Pricing</div>
            <h2 className="font-syne text-4xl md:text-5xl font-bold text-white">Transparent. Flexible. Built for Small Business.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: '$31', period: '/mo', features: ['Managed Web Hosting', 'SSL Certificate', 'Daily Backups', 'Email Support'], cta: 'Get Started', highlight: false },
              { name: 'Growth', price: '$493', period: '/mo', features: ['Everything in Starter', 'Social Media Marketing', 'Content Creation', 'Monthly Reports', 'Priority Support'], cta: 'Most Popular', highlight: true },
              { name: 'Authority', price: '$1,103', period: '/mo', features: ['Everything in Growth', 'Fully Managed SEO', 'Google Ads Management', 'Weekly Strategy Calls', 'Dedicated Account Manager'], cta: 'Scale Up', highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 relative ${plan.highlight ? 'bg-[#14EAEA] text-black glow-cyan' : 'border border-white/10 text-white'}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F813BE] text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>}
                <div className={`font-syne text-sm font-bold tracking-widest uppercase mb-4 ${plan.highlight ? 'text-black/60' : 'text-[#14EAEA]'}`}>{plan.name}</div>
                <div className="font-syne text-5xl font-bold mb-1">
                  {plan.price}<span className="text-xl font-normal opacity-60">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className={`text-lg ${plan.highlight ? 'text-black' : 'text-[#14EAEA]'}`}>✓</span>
                      <span className="opacity-80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`block text-center text-sm font-bold py-3 rounded-full transition-all duration-200 ${plan.highlight ? 'bg-black text-[#14EAEA] hover:bg-black/80' : 'border border-[#14EAEA]/30 text-[#14EAEA] hover:border-[#14EAEA] hover:bg-[#14EAEA]/10'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#0A0A0A] to-[#0D1A1A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-syne text-5xl md:text-7xl font-bold text-white mb-6">
            Ready to <em className="not-italic text-[#14EAEA]">Grow?</em>
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed">
            Let&apos;s build something great together. Book a free discovery call — we&apos;ll look at your current site, your goals, and map out a plan that makes sense.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#14EAEA] hover:bg-[#14EAEA]/80 text-black text-sm font-bold px-8 py-4 rounded-full transition-all duration-200 glow-cyan hover:scale-105">
              Get a Free Quote
            </Link>
            <Link href="tel:9418401381" className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white text-sm font-medium px-8 py-4 rounded-full transition-all duration-200 hover:border-white/40">
              📞 (941) 840-1381
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-[#0A0A0A] py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={140} height={38} className="h-8 w-auto mb-4" />
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              Sarasota&apos;s premiere digital agency. We build websites that work and run marketing that converts.
            </p>
            <div className="mt-6 text-sm text-white/30">
              <div>(941) 840-1381</div>
              <div>hello@webink.solutions</div>
              <div className="mt-1">1609 Georgetowne Blvd, Sarasota, FL 34232</div>
            </div>
          </div>
          <div>
            <div className="font-syne font-bold text-white text-sm mb-4">Services</div>
            <ul className="space-y-2">
              {['Web Design', 'SEO Services', 'Digital Marketing', 'Social Media', 'Web Hosting', 'Branding'].map((s) => (
                <li key={s}><Link href="/services" className="text-white/40 text-sm hover:text-[#14EAEA] transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-syne font-bold text-white text-sm mb-4">Company</div>
            <ul className="space-y-2">
              {['About', 'Portfolio', 'Blog', 'Contact', 'Pricing', 'Privacy Policy'].map((s) => (
                <li key={s}><Link href="/" className="text-white/40 text-sm hover:text-[#14EAEA] transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/20 text-xs">© 2026 Webink Solutions. All rights reserved.</div>
          <div className="text-white/20 text-xs">Rethink Design.</div>
        </div>
      </footer>
    </div>
  )
}
