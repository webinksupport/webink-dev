import { marqueeItems } from '@/components/data'

export default function MarqueeC() {
  const text = marqueeItems.join(' ✦ ') + ' ✦ '

  return (
    <div
      className="overflow-hidden py-4"
      style={{
        background: 'linear-gradient(90deg, #14EAEA 0%, #F813BE 50%, #B9FF33 100%)',
      }}
    >
      {/* Row 1 — forward */}
      <div className="marquee-track animate-marquee whitespace-nowrap">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="font-grotesk text-sm font-bold text-black tracking-[0.2em] uppercase mx-6"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
