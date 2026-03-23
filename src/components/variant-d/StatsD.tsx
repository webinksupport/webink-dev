export default function StatsD() {
  const stats = [
    {
      value: '6+',
      suffix: ' Years',
      label: 'Serving Southwest Florida businesses',
      accent: '#14EAEA',
    },
    {
      value: '50+',
      suffix: '',
      label: 'Clients served across Sarasota, Tampa & Bradenton',
      accent: '#F813BE',
    },
    {
      value: '300',
      suffix: '%',
      label: 'Average traffic increase for SEO clients',
      accent: '#B9FF33',
    },
    {
      value: '#1',
      suffix: '',
      label: 'Rated web design agency on DesignRush — Florida',
      accent: '#14EAEA',
    },
  ]

  const testimonial = {
    quote: "Webink transformed our online presence completely. Our bookings have tripled since launching the new site. Sean and the team are the real deal — professional, responsive, and they actually understand local business.",
    name: 'Tiffini Brown',
    title: 'Owner, Brown Mechanical Services',
  }

  return (
    <section className="py-24 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-14">
          <div className="w-2 h-2 rounded-full bg-[#14EAEA]" />
          <span className="text-xs font-bold tracking-[0.35em] text-black/30 uppercase font-sans">By The Numbers</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-black/8 mb-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="border-r border-b border-black/8 p-8 lg:p-10 group"
            >
              {/* Big number */}
              <div
                className="font-urbanist font-extrabold leading-none mb-3 transition-colors duration-300"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  color: stat.accent,
                }}
              >
                {stat.value}
                <span style={{ fontSize: '0.5em', color: stat.accent }}>{stat.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-black/40 text-sm leading-snug font-sans">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial highlight */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="font-urbanist text-6xl text-[#14EAEA] leading-none mb-4">&ldquo;</div>
            <blockquote className="font-urbanist text-2xl lg:text-3xl font-bold text-[#0A0A0A] leading-snug mb-6">
              {testimonial.quote}
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-10 h-0.5 bg-[#14EAEA]" />
              <div>
                <div className="font-bold text-[#0A0A0A] text-sm font-sans">{testimonial.name}</div>
                <div className="text-black/35 text-xs font-sans mt-0.5">{testimonial.title}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Mini stat cards */}
            {[
              { label: 'Client Satisfaction', value: '100%', color: '#14EAEA' },
              { label: 'On-Time Delivery', value: '97%', color: '#F813BE' },
              { label: 'Client Retention Rate', value: '85%', color: '#B9FF33' },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between border border-black/8 px-6 py-4 bg-[#F8F8F8]">
                <span className="text-sm text-black/40 font-sans">{m.label}</span>
                <span className="font-urbanist text-2xl font-extrabold" style={{ color: m.color }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

