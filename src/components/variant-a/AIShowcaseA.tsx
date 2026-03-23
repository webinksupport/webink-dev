const aiTools = [
  {
    label: '01',
    title: 'Intelligent Content Generation',
    desc: 'AI-assisted copywriting trained on conversion data for your industry — then refined by a human who knows the Sarasota market. No generic filler, ever.',
    accent: '#14EAEA',
  },
  {
    label: '02',
    title: 'Predictive SEO Analysis',
    desc: 'We use AI to analyze thousands of keywords and surface opportunities your competitors haven\'t spotted yet. Get to the top of Google faster.',
    accent: '#F813BE',
  },
  {
    label: '03',
    title: 'Automated Performance Dashboards',
    desc: 'Real-time reporting dashboards and monthly AI-generated summaries that translate data into plain English — and tell you exactly what to do next.',
    accent: '#B9FF33',
  },
  {
    label: '04',
    title: 'Smart Ad Optimization',
    desc: 'AI-driven bidding and audience targeting for Google and Meta campaigns. Lower cost-per-click, higher conversion rates, more money in your pocket.',
    accent: '#14EAEA',
  },
  {
    label: '05',
    title: 'Design Intelligence',
    desc: 'We use AI to test layouts, headlines, and CTAs before launch — so your site is already optimized the moment it goes live.',
    accent: '#F813BE',
  },
  {
    label: '06',
    title: 'Social Content at Scale',
    desc: 'AI-assisted content calendars and caption generation that keeps your brand consistent across every platform, every week.',
    accent: '#B9FF33',
  },
]

export default function AIShowcaseA() {
  return (
    <section className="py-28 px-6 bg-[#070707] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(185,255,51,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="text-xs font-semibold tracking-[0.18em] text-[#B9FF33] uppercase mb-3">The Edge You Need</div>
          <h2 className="font-syne text-4xl md:text-5xl font-bold text-white mb-5">
            We Use AI to Deliver{' '}
            <span className="text-[#B9FF33]" style={{ textShadow: '0 0 25px rgba(185,255,51,0.35)' }}>
              Better Results
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            The agencies winning in 2026 are those that combine human creativity with AI intelligence. 
            We&apos;ve built that into every service we offer — so you get more for every dollar spent.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {aiTools.map((tool) => (
            <div
              key={tool.label}
              className="border rounded-2xl p-7 group relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
              style={{
                borderColor: `${tool.accent}20`,
                background: `linear-gradient(135deg, ${tool.accent}06 0%, transparent 60%)`,
              }}
            >
              {/* Number */}
              <div
                className="font-syne text-5xl font-extrabold mb-5 leading-none"
                style={{ color: `${tool.accent}18` }}
              >
                {tool.label}
              </div>
              {/* Accent dot */}
              <div
                className="w-6 h-1 rounded-full mb-4"
                style={{ background: tool.accent }}
              />
              <h3 className="font-syne text-lg font-bold text-white mb-3">{tool.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-16 border border-[#B9FF33]/20 rounded-2xl p-8 md:p-12 bg-[#B9FF33]/[0.03] text-center">
          <p className="font-syne text-2xl md:text-3xl font-bold text-white mb-4">
            &ldquo;Digital Marketing for the Digital Age.&rdquo;
          </p>
          <p className="text-white/45 text-sm">
            AI tools. Human strategy. Local expertise. That&apos;s the Webink difference.
          </p>
        </div>
      </div>
    </section>
  )
}
