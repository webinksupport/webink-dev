import Link from 'next/link'
import Image from 'next/image'

const variants = [
  {
    route: '/',
    name: 'Variant A',
    title: 'Neon Noir',
    description: 'Dark, bold, electric. Deep black backgrounds with neon cyan, hot pink, and lime as structural elements. Full agency energy — owns the brand colors unapologetically.',
    tags: ['Dark Mode', 'High Impact', 'Neon Accents'],
    preview: { bg: '#0A0A0A', accent: '#14EAEA', secondary: '#F813BE' },
    emoji: '🌑',
    from: 'from-[#14EAEA]/20',
    border: 'border-[#14EAEA]/30',
    tagColor: 'bg-[#14EAEA]/10 text-[#14EAEA]',
  },
  {
    route: '/variant-b',
    name: 'Variant B',
    title: 'Dark Professional',
    description: 'Same dark foundation, cyan-only accent system. More restrained, corporate, and trustworthy — clean grid layouts with strict typographic hierarchy.',
    tags: ['Dark Mode', 'Corporate', 'Minimal'],
    preview: { bg: '#0A0A0A', accent: '#14EAEA', secondary: '#14EAEA' },
    emoji: '🏢',
    from: 'from-cyan-900/20',
    border: 'border-white/10',
    tagColor: 'bg-white/5 text-white/50',
  },
  {
    route: '/variant-c',
    name: 'Variant C',
    title: 'Florida Editorial',
    description: 'Light, airy, and coastal. Off-white base with bold neon moments. Real photography-forward with editorial grid layouts. Sophisticated and approachable.',
    tags: ['Light Mode', 'Editorial', 'Photo-Forward'],
    preview: { bg: '#F8F8F8', accent: '#F813BE', secondary: '#14EAEA' },
    emoji: '🌴',
    from: 'from-pink-100/50',
    border: 'border-black/10',
    tagColor: 'bg-[#F813BE]/10 text-[#F813BE]',
  },
  {
    route: '/variant-d',
    name: 'Variant D',
    title: 'Clean White',
    description: 'Pure white, Swiss-influenced grid. Extreme whitespace, sharp typography, neon accents used sparingly for maximum impact. Premium and authoritative.',
    tags: ['White Mode', 'Bold Minimal', 'Premium'],
    preview: { bg: '#FFFFFF', accent: '#14EAEA', secondary: '#B9FF33' },
    emoji: '⚡',
    from: 'from-gray-100/80',
    border: 'border-black/5',
    tagColor: 'bg-black/5 text-black/50',
  },
]

export default function PickPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logos/webink-white.png" alt="Webink Solutions" width={130} height={36} className="h-8 w-auto" />
            <span className="text-white/20 text-sm">|</span>
            <span className="text-white/40 text-sm font-medium">Design Variant Selector</span>
          </div>
          <div className="text-xs text-white/20 font-mono">v0.1.0 · dev preview</div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#14EAEA]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
            <span className="text-xs text-[#14EAEA] font-semibold tracking-widest uppercase">Homepage Design Preview</span>
          </div>
          <h1 className="font-syne text-5xl font-bold text-white mb-4">
            Pick a Direction, Sean
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Four complete homepage variants for webink.solutions. Each is fully built with real photography, actual brand assets, and real copy. Click any card to view the live variant.
          </p>
        </div>

        {/* Variant grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {variants.map((v) => (
            <Link
              key={v.route}
              href={v.route}
              className="group block border border-white/10 hover:border-[#14EAEA]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] bg-[#111]"
              target="_blank"
            >
              {/* Color preview bar */}
              <div className="h-2 w-full" style={{background: `linear-gradient(90deg, ${v.preview.accent} 0%, ${v.preview.secondary} 100%)`}} />

              <div className="p-8">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase mb-1">{v.name}</div>
                    <div className="font-syne text-2xl font-bold text-white flex items-center gap-3">
                      {v.emoji} {v.title}
                    </div>
                  </div>
                  {/* Tiny color swatch preview */}
                  <div className="flex gap-1.5 mt-1">
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{background: v.preview.bg}} />
                    <div className="w-6 h-6 rounded-full" style={{background: v.preview.accent}} />
                    <div className="w-6 h-6 rounded-full" style={{background: v.preview.secondary}} />
                  </div>
                </div>

                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {v.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {v.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${v.tagColor}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-[#14EAEA] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">
                    View Variant →
                  </div>
                  <div className="text-white/20 text-xs font-mono">{v.route}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick comparison table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-[#111] px-8 py-4 border-b border-white/10">
            <h2 className="font-syne font-bold text-white text-sm">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D0D0D]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">Variant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">Theme</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">Feel</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">Best For</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['A — Neon Noir', 'Dark', 'Electric / Bold', 'Making a statement, standing out in market', '/'],
                  ['B — Dark Pro', 'Dark', 'Corporate / Trust', 'Professional service buyers, B2B', '/variant-b'],
                  ['C — FL Editorial', 'Light', 'Coastal / Creative', 'SMB clients who want approachable + premium', '/variant-c'],
                  ['D — Clean White', 'White', 'Minimal / Authority', 'High-end clients, premium positioning', '/variant-d'],
                ].map(([name, theme, feel, bestFor, route]) => (
                  <tr key={route} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-syne font-bold text-white text-sm">{name}</span>
                    </td>
                    <td className="px-6 py-4 text-white/50 text-sm">{theme}</td>
                    <td className="px-6 py-4 text-white/50 text-sm">{feel}</td>
                    <td className="px-6 py-4 text-white/40 text-xs leading-relaxed max-w-xs">{bestFor}</td>
                    <td className="px-6 py-4">
                      <Link href={route} target="_blank" className="text-[#14EAEA] text-xs font-mono hover:text-white transition-colors">
                        {route}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center text-white/20 text-xs">
          Built by Octo 🐙 · Webink Solutions Dev Preview · March 2026
        </div>
      </div>
    </div>
  )
}
