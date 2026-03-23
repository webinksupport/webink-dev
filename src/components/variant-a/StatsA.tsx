const stats = [
  { value: '6+', label: 'Years in Business', detail: 'Serving Sarasota since 2018' },
  { value: '50+', label: 'Clients Served', detail: 'Local businesses across Sarasota, Tampa & Bradenton' },
  { value: '300%', label: 'Avg Traffic Increase', detail: 'For clients within the first 6 months' },
  { value: '#1', label: 'Rated Agency', detail: 'Top Web Design Company in Florida — DesignRush' },
]

const testimonial = {
  quote: "Webink transformed our online presence completely. Our bookings have tripled since launching the new site. Sean and the team genuinely care about your success — they don't just build a website and disappear.",
  name: 'Tiffini Brown',
  company: 'Brown Mechanical Services',
  location: 'Sarasota, FL',
}

export default function StatsA() {
  return (
    <section className="bg-[#0D0D0D] border-y border-[#14EAEA]/10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-20">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center relative">
              {/* Divider */}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/8" />
              )}
              <div
                className="font-syne font-extrabold mb-2 leading-none"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  color: i % 2 === 0 ? '#14EAEA' : '#F813BE',
                  textShadow: `0 0 30px ${i % 2 === 0 ? 'rgba(20,234,234,0.3)' : 'rgba(248,19,190,0.3)'}`,
                }}
              >
                {s.value}
              </div>
              <div className="text-white/70 font-semibold text-sm mb-1 tracking-wide">{s.label}</div>
              <div className="text-white/25 text-xs leading-snug max-w-[160px] mx-auto">{s.detail}</div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[#F813BE] text-5xl font-bold leading-none mb-6" style={{ textShadow: '0 0 20px rgba(248,19,190,0.3)' }}>&ldquo;</div>
          <blockquote className="text-white/75 text-xl leading-relaxed mb-8 font-light italic">
            {testimonial.quote}
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F813BE]/40 to-[#14EAEA]/40 flex items-center justify-center font-bold text-white text-sm">
              {testimonial.name[0]}
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-sm">{testimonial.name}</div>
              <div className="text-white/40 text-xs">{testimonial.company} · {testimonial.location}</div>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#F813BE">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-white/40 text-xs ml-2">5.0 rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
