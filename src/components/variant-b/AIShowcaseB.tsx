const aiCapabilities = [
  {
    number: '01',
    title: 'AI-Assisted Copywriting',
    desc: 'Every page, every ad, every email — optimized by AI trained on high-converting marketing copy and tuned for your specific audience and local market.',
  },
  {
    number: '02',
    title: 'Predictive SEO Intelligence',
    desc: 'Identify emerging keyword opportunities before your competitors discover them. Our AI models analyze search trend data to surface content gaps you can capitalize on now.',
  },
  {
    number: '03',
    title: 'Automated Performance Reporting',
    desc: 'Real-time dashboards that pull from Google Analytics, Search Console, and your ad platforms into a single view — no spreadsheet wrangling required.',
  },
  {
    number: '04',
    title: 'Smart Social Media Scheduling',
    desc: 'AI-optimized publishing schedules based on your audience\'s activity patterns. We test, learn, and refine content strategy continuously.',
  },
]

export default function AIShowcaseB() {
  return (
    <section className="bg-[#0A0A0A] border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#14EAEA]" />
              <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
                Powered by AI
              </span>
            </div>
            <h2 className="font-inter text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Modern Marketing<br />
              Infrastructure for<br />
              <span className="text-white/30">Local Business</span>
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-6">
            <p className="font-public-sans text-white/45 text-base leading-relaxed mb-6">
              We&apos;ve integrated AI tools across every service we offer — not as a gimmick, but as a systematic way to deliver faster results, sharper targeting, and more insightful reporting for every client.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {['Google AI', 'OpenAI GPT-4', 'Meta AI Ads', 'Jasper AI', 'Surfer SEO', 'DataForSEO'].map((tool) => (
                <div
                  key={tool}
                  className="border border-white/[0.08] px-4 py-2 text-[11px] font-semibold text-white/30 tracking-wider font-inter text-center hover:border-[#14EAEA]/30 hover:text-white/50 transition-colors"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Capabilities list */}
        <div className="border-t border-white/[0.06]">
          {aiCapabilities.map((cap, i) => (
            <div
              key={cap.number}
              className="grid lg:grid-cols-12 gap-6 border-b border-white/[0.06] py-8 group hover:bg-white/[0.015] transition-colors -mx-6 lg:-mx-10 px-6 lg:px-10"
            >
              <div className="lg:col-span-1">
                <span className="font-inter text-[11px] font-bold text-[#14EAEA]/40 group-hover:text-[#14EAEA] transition-colors tracking-widest">
                  {cap.number}
                </span>
              </div>
              <div className="lg:col-span-4">
                <h3 className="font-inter text-base font-bold text-white group-hover:text-[#14EAEA] transition-colors tracking-tight">
                  {cap.title}
                </h3>
              </div>
              <div className="lg:col-span-6">
                <p className="font-public-sans text-white/35 text-sm leading-relaxed">
                  {cap.desc}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center justify-end">
                <span className="text-white/10 group-hover:text-[#14EAEA]/50 transition-colors text-xl font-inter">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Data point callout */}
        <div className="mt-16 border border-[#14EAEA]/15 p-8 lg:p-10 bg-[#14EAEA]/[0.03]">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <blockquote className="font-inter text-xl sm:text-2xl font-bold text-white leading-tight mb-4">
                &ldquo;93% of consumers research online before making a purchase decision.&rdquo;
              </blockquote>
              <p className="font-public-sans text-white/35 text-sm">
                Your digital presence isn&apos;t optional — it&apos;s your first impression, your 24/7 salesperson, and your most scalable growth channel.
              </p>
            </div>
            <div className="text-right">
              <div
                className="font-inter text-6xl font-black text-[#14EAEA]/20"
                style={{ textShadow: '0 0 40px rgba(20,234,234,0.1)' }}
              >
                93%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
