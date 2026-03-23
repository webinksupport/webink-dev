import Link from 'next/link'
import { services } from '@/components/data'

const gradients = [
  'linear-gradient(135deg, #14EAEA22 0%, #14EAEA08 100%)',
  'linear-gradient(135deg, #F813BE22 0%, #F813BE08 100%)',
  'linear-gradient(135deg, #B9FF3322 0%, #B9FF3308 100%)',
  'linear-gradient(135deg, #14EAEA22 0%, #F813BE22 100%)',
  'linear-gradient(135deg, #F813BE22 0%, #B9FF3322 100%)',
  'linear-gradient(135deg, #B9FF3322 0%, #14EAEA22 100%)',
]

const borderColors = [
  'rgba(20, 234, 234, 0.25)',
  'rgba(248, 19, 190, 0.25)',
  'rgba(185, 255, 51, 0.25)',
  'rgba(20, 234, 234, 0.2)',
  'rgba(248, 19, 190, 0.2)',
  'rgba(185, 255, 51, 0.2)',
]

const accentColors = ['#14EAEA', '#F813BE', '#B9FF33', '#14EAEA', '#F813BE', '#B9FF33']

export default function ServicesC() {
  return (
    <section className="py-28 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16 items-end">
          <div>
            <div className="inline-flex items-center gap-3 mb-5 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="font-grotesk text-xs font-semibold text-white/50 tracking-widest uppercase">
                What We Do
              </span>
            </div>
            <h2 className="font-grotesk text-4xl lg:text-5xl font-bold text-white leading-tight">
              Full-Service{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Digital Agency.
              </span>
            </h2>
          </div>
          <p className="font-sans text-white/40 text-lg leading-relaxed">
            From building your website to running your ads — we handle every aspect of your digital presence so you can focus on running your business.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => (
            <Link
              key={svc.title}
              href={svc.href}
              className="group relative block rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
              style={{
                background: gradients[i],
                border: `1px solid ${borderColors[i]}`,
              }}
            >
              {/* Subtle gradient glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${accentColors[i]}15, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative text-3xl mb-5 w-14 h-14 flex items-center justify-center rounded-xl"
                style={{
                  background: `${accentColors[i]}15`,
                  border: `1px solid ${accentColors[i]}30`,
                }}
              >
                {svc.icon}
              </div>

              {/* Content */}
              <h3 className="relative font-grotesk text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                {svc.title}
              </h3>
              <p className="relative font-sans text-sm text-white/50 leading-relaxed">
                {svc.desc}
              </p>

              {/* Arrow */}
              <div
                className="relative mt-6 flex items-center gap-2 text-sm font-semibold transition-all duration-200 group-hover:gap-3"
                style={{ color: accentColors[i] }}
              >
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
