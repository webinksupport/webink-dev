import Image from 'next/image'
import Link from 'next/link'

const steps = [
  {
    n: '01',
    title: 'Strategy First',
    desc: 'Every project starts with a deep dive into your business goals, your competitors, and your target audience in the Sarasota market.',
  },
  {
    n: '02',
    title: 'Design with Intent',
    desc: 'Beautiful design that\'s engineered to convert — not just to impress at first glance. Every element earns its place.',
  },
  {
    n: '03',
    title: 'Market & Measure',
    desc: 'Launch, run campaigns, track every metric, and optimize relentlessly. We don\'t stop until the numbers move.',
  },
]

export default function AboutA() {
  return (
    <section className="py-28 px-6 bg-[#0D0D0D] relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute right-0 top-0 w-[400px] h-[400px] pointer-events-none opacity-5"
        style={{ background: 'radial-gradient(circle, #14EAEA 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Image side */}
        <div className="relative order-2 md:order-1">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="/variant-a/sean-about.jpg"
              alt="Sean Rowe — Webink Solutions Founder"
              width={600}
              height={720}
              className="w-full object-cover"
              style={{ objectPosition: 'center 20%', maxHeight: '560px' }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/70 via-[#0D0D0D]/10 to-transparent" />
            {/* Cyan border accent */}
            <div className="absolute inset-0 rounded-2xl border border-[#14EAEA]/15 pointer-events-none" />
          </div>

          {/* Floating quote card */}
          <div className="absolute -bottom-6 -right-2 md:-right-8 bg-[#0A0A0A] border border-[#14EAEA]/20 rounded-2xl p-5 max-w-[280px] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="text-[#14EAEA] text-2xl leading-none mb-2">&ldquo;</div>
            <p className="text-white/60 text-xs leading-relaxed italic mb-3">
              From firefighter & paramedic to digital agency founder — I understand what it means to show up for people when it counts.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#14EAEA]/20 flex items-center justify-center text-[#14EAEA] text-xs font-bold">S</div>
              <div>
                <div className="text-white/70 text-xs font-semibold">Sean Rowe</div>
                <div className="text-white/30 text-[10px]">Founder, Webink Solutions</div>
              </div>
            </div>
          </div>

          {/* Kelley team member bubble */}
          <div className="absolute top-6 -left-4 md:-left-8 bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <Image
              src="/variant-a/kelley-headshot.png"
              alt="Kelley — Webink Team"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover object-top mb-2"
            />
            <div className="text-white/60 text-[10px] font-semibold">Kelley</div>
            <div className="text-[#14EAEA] text-[9px]">Creative Director</div>
          </div>
        </div>

        {/* Text side */}
        <div className="order-1 md:order-2">
          <div className="text-xs font-semibold tracking-[0.18em] text-[#14EAEA] uppercase mb-3">Our Approach</div>
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
            We Drive Growth Through{' '}
            <span className="text-[#14EAEA]">Structure &amp; Process</span>
          </h2>
          <p className="text-white/55 text-lg leading-relaxed mb-10">
            Before becoming a digital agency founder, Sean Rowe was a firefighter and paramedic in Sarasota.
            Someone who knew that when you show up for people, you deliver — no excuses, no shortcuts.
            That mentality is baked into everything we do at Webink.
          </p>

          {/* Process steps */}
          <div className="space-y-7 mb-10">
            {steps.map((step) => (
              <div key={step.n} className="flex gap-5 group">
                <div
                  className="font-syne text-3xl font-extrabold flex-shrink-0 w-10 leading-none pt-1 transition-colors duration-300 group-hover:text-[#14EAEA]/40"
                  style={{ color: 'rgba(20,234,234,0.12)' }}
                >
                  {step.n}
                </div>
                <div>
                  <div className="font-syne font-bold text-white mb-1.5 group-hover:text-[#14EAEA] transition-colors duration-300">
                    {step.title}
                  </div>
                  <div className="text-white/45 text-sm leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Service areas */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['Sarasota', 'Tampa', 'Bradenton', 'Manatee County', 'Charlotte County'].map((area) => (
              <span key={area} className="text-xs border border-white/10 text-white/35 px-3 py-1 rounded-full">
                {area}
              </span>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-[#14EAEA]/25 hover:border-[#14EAEA]/60 text-[#14EAEA] text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:bg-[#14EAEA]/5"
          >
            Meet the Team →
          </Link>
        </div>
      </div>
    </section>
  )
}
