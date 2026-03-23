const items = [
  'Web Design',
  'SEO Services',
  'Digital Marketing',
  'Social Media',
  'Web Hosting',
  'Branding',
  'Sarasota',
  'Tampa',
  'Bradenton',
  'AI-Powered',
]

export default function MarqueeA({ reverse = false, accent = '#14EAEA' }: { reverse?: boolean; accent?: string }) {
  const text = items.join('  •  ') + '  •  '

  return (
    <div
      className="overflow-hidden py-4 border-y"
      style={{ borderColor: `${accent}18`, background: '#0A0A0A' }}
    >
      <div
        className={`marquee-track whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="font-syne font-bold tracking-[0.15em] mx-6 text-base"
            style={{ color: `${accent}18` }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
