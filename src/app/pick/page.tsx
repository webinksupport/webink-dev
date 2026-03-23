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
  {
    route: '/variant-e',
    name: 'Variant E',
    title: 'White + Bold Accents',
    description: 'White background with Baja hero photo full-width. Urbanist font, bold brand color accents — cyan, pink, lime as structural elements. Scroll animations, counter stats, word-cycling headline. Premium Florida agency energy.',
    tags: ['White Mode', 'Animations', 'Bold Accents', 'Baja Hero'],
    preview: { bg: '#FFFFFF', accent: '#14EAEA', secondary: '#F813BE' },
    emoji: '🌊',
    from: 'from-cyan-100/60',
    border: 'border-[#14EAEA]/20',
    tagColor: 'bg-[#14EAEA]/10 text-[#14EAEA]',
    isNew: true,
  },
  {
    route: '/variant-f',
    name: 'Variant F',
    title: 'White + Minimal',
    description: 'Crisp white, editorial design studio feel. Urbanist font, cyan-only accent. Baja hero full-width. Gentle fade animations. SVG scribble underline on hero. Like a high-end design studio — restrained and confident.',
    tags: ['White Mode', 'Editorial', 'Minimal', 'Baja Hero'],
    preview: { bg: '#FFFFFF', accent: '#14EAEA', secondary: '#14EAEA' },
    emoji: '🤍',
    from: 'from-gray-50/90',
    border: 'border-black/5',
    tagColor: 'bg-black/5 text-black/40',
    isNew: true,
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
          <div className="text-xs text-white/20 font-mono">v0.2.0 · dev preview</div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#14EAEA]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#14EAEA] animate-pulse" />
            <span className="text-xs text-[#14EAEA] font-semibold tracking-widest uppercase">Homepage Design Preview</span>
          </div>
          <h1 className="font-urbanist text-5xl font-black text-white mb-4">
            Pick a Direction, Sean
          </h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            Six complete homepage variants — A through F. Each fully built with real photography, actual brand assets, and real copy. E & F are the new white variants with Urbanist font + Baja hero + real pricing.
          </p>
        </div>

        {/* NEW VARIANTS SPOTLIGHT */}
        <div className="mb-6">
          <div className="text-xs text-[#14EAEA] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[#14EAEA]" /> New — White Variants with Baja Hero
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {variants.filter(v => v.isNew).map((v) => (
            <Link
              key={v.route}
              href={v.route}
              className="group block border border-[#14EAEA]/30 hover:border-[#14EAEA]/70 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] bg-[#0D1A1A]"
              target="_blank"
            >
              <div className="h-2 w-full" style={{background: `linear-gradient(90deg, ${v.preview.accent} 0%, ${v.preview.secondary} 100%)`}} />
              <div className="p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-xs font-bold tracking-[0.3em] text-[#14EAEA]/50 uppercase mb-1">{v.name} ✦ NEW</div>
                    <div className="font-urbanist text-2xl font-black text-white flex items-center gap-3">
                      {v.emoji} {v.title}
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    <div className="w-6 h-6 rounded-full border-2 border-[#14EAEA]" style={{background: v.preview.bg}} />
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{background: v.preview.accent}} />
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{background: v.preview.secondary}} />
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{v.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {v.tags.map((tag) => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-[#14EAEA]/10 text-[#14EAEA]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[#14EAEA] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">View Variant →</div>
                  <div className="text-white/20 text-xs font-mono">{v.route}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-10" />
        <div className="text-xs text-white/20 font-semibold tracking-widest uppercase mb-6 flex items-center gap-2">
          <span className="w-8 h-px bg-white/20" /> Previous Variants
        </div>

        {/* All variants grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {variants.filter(v => !v.isNew).map((v) => (
            <Link
              key={v.route}
              href={v.route}
              className="group block border border-white/10 hover:border-[#14EAEA]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] bg-[#111]"
              target="_blank"
            >
              <div className="h-2 w-full" style={{background: `linear-gradient(90deg, ${v.preview.accent} 0%, ${v.preview.secondary} 100%)`}} />
              <div className="p-8">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-xs font-bold tracking-[0.3em] text-white/30 uppercase mb-1">{v.name}</div>
                    <div className="font-urbanist text-2xl font-black text-white flex items-center gap-3">{v.emoji} {v.title}</div>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    <div className="w-6 h-6 rounded-full border border-white/10" style={{background: v.preview.bg}} />
                    <div className="w-6 h-6 rounded-full" style={{background: v.preview.accent}} />
                    <div className="w-6 h-6 rounded-full" style={{background: v.preview.secondary}} />
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{v.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {v.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${v.tagColor}`}>{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[#14EAEA] text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200">View Variant →</div>
                  <div className="text-white/20 text-xs font-mono">{v.route}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick comparison table */}
        <div className="border border-white/10 rounded-2xl overflow-hidden">
          <div className="bg-[#111] px-8 py-4 border-b border-white/10">
            <h2 className="font-urbanist font-black text-white text-sm">Quick Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D0D0D]">
                <tr>
                  {['Variant', 'Theme', 'Font', 'Hero', 'Animations', 'Feel'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-white/30 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['A — Neon Noir', 'Dark', 'Syne', 'Split layout', 'Subtle', '/'],
                  ['B — Dark Pro', 'Dark', 'Inter', 'Split layout', 'Minimal', '/variant-b'],
                  ['C — FL Editorial', 'Light', 'Syne', 'Full photo', 'Moderate', '/variant-c'],
                  ['D — Clean White', 'White', 'Urbanist ✦', 'Split layout', 'None', '/variant-d'],
                  ['E — White + Bold', 'White', 'Urbanist ✦', 'Baja full-bleed ✦', 'Framer Motion ✦', '/variant-e'],
                  ['F — White + Minimal', 'White', 'Urbanist ✦', 'Baja full-bleed ✦', 'Gentle fades ✦', '/variant-f'],
                ].map(([name, theme, font, hero, anim, route]) => (
                  <tr key={route} className="hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={route} target="_blank" className="font-urbanist font-bold text-white text-sm hover:text-[#14EAEA] transition-colors">{name}</Link>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-sm">{theme}</td>
                    <td className="px-5 py-4 text-white/50 text-sm">{font}</td>
                    <td className="px-5 py-4 text-white/40 text-xs">{hero}</td>
                    <td className="px-5 py-4 text-white/40 text-xs">{anim}</td>
                    <td className="px-5 py-4">
                      <Link href={route} target="_blank" className="text-[#14EAEA] text-xs font-mono hover:text-white transition-colors">{route}</Link>
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
