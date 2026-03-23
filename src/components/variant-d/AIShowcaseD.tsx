export default function AIShowcaseD() {
  const tools = [
    {
      tag: 'Content AI',
      tagColor: '#14EAEA',
      title: 'Intelligent Copywriting',
      desc: 'AI drafts, humans refine. We combine AI speed with expert judgment to produce website copy, blog posts, and ad creative that actually converts.',
      detail: '3x faster content production',
    },
    {
      tag: 'SEO AI',
      tagColor: '#F813BE',
      title: 'Predictive SEO Analysis',
      desc: 'AI-powered keyword gap analysis surfaces high-value opportunities your competitors haven\'t discovered yet. Data-first, not gut-feel.',
      detail: 'Hundreds of keywords analyzed per campaign',
    },
    {
      tag: 'Analytics AI',
      tagColor: '#B9FF33',
      title: 'Smart Performance Reporting',
      desc: 'Automated dashboards surface insights and next-step recommendations weekly — no waiting for monthly meetings to know what\'s working.',
      detail: 'Live dashboards, weekly digests',
    },
    {
      tag: 'Design AI',
      tagColor: '#14EAEA',
      title: 'AI-Assisted Design',
      desc: 'Rapid wireframing and visual exploration powered by AI tools — so we spend more time on execution and strategy, less on guesswork.',
      detail: 'Faster iteration, sharper outcomes',
    },
    {
      tag: 'Ads AI',
      tagColor: '#F813BE',
      title: 'Automated Ad Optimization',
      desc: 'AI monitors campaign performance 24/7, adjusting bids and targeting in real time to maximize your ad spend efficiency.',
      detail: 'Lower CPL, higher ROAS',
    },
    {
      tag: 'Local AI',
      tagColor: '#B9FF33',
      title: 'Hyper-Local Intelligence',
      desc: 'AI maps your local competitive landscape in Sarasota, Tampa, and Bradenton — so we outmaneuver the competition block by block.',
      detail: 'Market-specific strategy',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-2 bg-[#B9FF33]" />
          <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-sans">Technology Edge</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          <div className="lg:col-span-5">
            <h2 className="font-urbanist font-extrabold text-[#0A0A0A] leading-tight" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              AI-Enhanced.<br />
              <span className="text-[#14EAEA]">Human-Driven.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <div>
              {/* Cyan accent line */}
              <div className="w-12 h-0.5 bg-[#14EAEA] mb-4" />
              <p className="text-[#333] text-lg leading-relaxed font-sans">
                We leverage AI tools to move faster and deliver sharper results — without losing the human judgment, local knowledge, and creative strategy that makes the real difference.
              </p>
            </div>
          </div>
        </div>

        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group bg-white border border-black/6 p-8 hover:shadow-md transition-all duration-300"
            >
              {/* Tag */}
              <div
                className="inline-block text-xs font-bold px-3 py-1 mb-5 font-mono rounded-sm"
                style={{ background: `${tool.tagColor}20`, color: tool.tagColor, border: `1px solid ${tool.tagColor}40` }}
              >
                {tool.tag}
              </div>

              <h3 className="font-urbanist text-lg font-bold text-[#0A0A0A] mb-3">{tool.title}</h3>
              <p className="text-black/45 text-sm leading-relaxed font-sans mb-5">{tool.desc}</p>

              {/* Metric */}
              <div className="pt-4 border-t border-black/6 text-xs text-black/30 font-bold tracking-wide uppercase font-sans">
                {tool.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div className="mt-12 bg-white border border-black/6 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-urbanist text-xl font-bold text-[#0A0A0A] mb-1">Ready to see AI in action?</div>
            <div className="text-sm text-black/40 font-sans">We&apos;ll show you exactly how we&apos;d apply these tools to your business.</div>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 bg-[#0A0A0A] text-white text-sm font-bold px-8 py-3.5 hover:bg-[#14EAEA] hover:text-black transition-all duration-200 font-sans"
          >
            Book a Strategy Call
          </a>
        </div>
      </div>
    </section>
  )
}

