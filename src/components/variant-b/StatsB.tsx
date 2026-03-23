const stats = [
  {
    value: '6+',
    label: 'Years in Business',
    sub: 'Serving Southwest Florida since 2019',
  },
  {
    value: '50+',
    label: 'Clients Served',
    sub: 'From Sarasota to Tampa and beyond',
  },
  {
    value: '300%',
    label: 'Average Traffic Increase',
    sub: 'Across SEO clients in year one',
  },
  {
    value: '#1',
    label: 'Rated on DesignRush',
    sub: 'Top Web Design Company in Florida',
  },
]

const testimonial = {
  quote: 'Webink transformed our online presence completely. Our bookings have tripled since launching the new site — and Sean\'s team is always responsive and professional.',
  name: 'Tiffini Brown',
  company: 'Brown Mechanical Services',
  location: 'Sarasota, FL',
}

export default function StatsB() {
  return (
    <section className="bg-[#0F0F0F] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-14">
          <div className="w-6 h-px bg-[#14EAEA]" />
          <span className="text-[#14EAEA] text-[10px] font-bold tracking-[0.3em] uppercase font-inter">
            Results by the Numbers
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/[0.08] divide-x divide-y lg:divide-y-0 divide-white/[0.08] mb-16">
          {stats.map((s) => (
            <div key={s.label} className="p-8 lg:p-10 text-center">
              <div
                className="font-inter text-5xl lg:text-6xl font-black text-[#14EAEA] mb-3 leading-none"
                style={{ textShadow: '0 0 30px rgba(20,234,234,0.3)' }}
              >
                {s.value}
              </div>
              <div className="font-inter text-sm font-bold text-white mb-1 tracking-tight">{s.label}</div>
              <div className="font-public-sans text-[11px] text-white/25">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="border-l-2 border-[#14EAEA] pl-8 lg:pl-12">
          <blockquote className="font-inter text-xl sm:text-2xl lg:text-3xl font-semibold text-white/80 leading-relaxed mb-6 max-w-4xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div>
              <div className="font-inter text-sm font-bold text-white">{testimonial.name}</div>
              <div className="font-public-sans text-[12px] text-white/35">
                {testimonial.company} &mdash; {testimonial.location}
              </div>
            </div>
            {/* Star rating */}
            <div className="flex gap-0.5 ml-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#14EAEA" className="opacity-80">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
