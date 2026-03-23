import { stats } from '@/components/data'

export default function StatsC() {
  const gradients = [
    'linear-gradient(90deg, #14EAEA 0%, #B9FF33 100%)',
    'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
    'linear-gradient(90deg, #F813BE 0%, #B9FF33 100%)',
    'linear-gradient(90deg, #B9FF33 0%, #14EAEA 100%)',
  ]

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111 50%, #0A0A0A 100%)' }}
    >
      {/* Decorative line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #14EAEA40, #F813BE40, transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="relative py-10 px-8 text-center group"
            >
              {/* Divider lines */}
              {i > 0 && (
                <div
                  className="absolute left-0 top-[20%] bottom-[20%] w-px"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)' }}
                />
              )}

              {/* Number */}
              <div
                className="font-grotesk text-5xl lg:text-6xl font-bold mb-2"
                style={{
                  background: gradients[i % gradients.length],
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>

              {/* Label */}
              <div className="font-sans text-white/40 text-sm tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial below stats */}
        <div
          className="mt-12 rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-8"
          style={{
            background: '#080808',
            border: '1px solid rgba(20, 234, 234, 0.12)',
          }}
        >
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-grotesk font-bold text-black text-xl"
            style={{ background: 'linear-gradient(135deg, #14EAEA 0%, #F813BE 100%)' }}
          >
            T
          </div>
          <div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#F813BE' }}>★</span>
              ))}
            </div>
            <blockquote className="font-sans text-lg text-white/70 leading-relaxed mb-3 italic max-w-3xl">
              &ldquo;Webink transformed our online presence completely. Our bookings have tripled since launching the new site. Sean and his team deliver exactly what they promise — and then some.&rdquo;
            </blockquote>
            <div>
              <span className="font-grotesk font-semibold text-white">Tiffini Brown</span>
              <span className="text-white/30 text-sm ml-2">— Brown Mechanical Services</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
