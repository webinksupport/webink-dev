'use client'
import {
  Server, Search, Globe, Share2, Brain, Zap, Target,
  Shield, Video, MapPin, FileSearch, Plus, Link2, Megaphone,
} from 'lucide-react'

const iconMap: Record<string, React.ElementType> = {
  Hosting: Server,
  Marketing: Search,
  SEO: FileSearch,
  Social: Share2,
  AI: Brain,
  Design: Globe,
  Video: Video,
  Local: MapPin,
  Ads: Target,
  Addon: Plus,
  Link: Link2,
  PPC: Megaphone,
}

const slugIconMap: Record<string, string> = {
  'managed-web-hosting': 'Hosting',
  'fully-managed-seo': 'SEO',
  'social-media-marketing': 'Social',
  'local-seo': 'Local',
  'short-form-video-marketing': 'Video',
  'google-lsa-management': 'Ads',
  'google-business-profile-optimization': 'Local',
  'seo-primer': 'SEO',
  'add-on-hosting-site': 'Addon',
  'inktree-page': 'Link',
  'paid-advertising': 'PPC',
}

interface ProductGraphicPlaceholderProps {
  slug?: string
  category?: string
  className?: string
}

export default function ProductGraphicPlaceholder({
  slug,
  category,
  className = '',
}: ProductGraphicPlaceholderProps) {
  const iconKey = (slug && slugIconMap[slug]) || category || 'Marketing'
  const Icon = iconMap[iconKey] || Zap

  return (
    <div
      className={`relative w-[300px] h-[300px] flex items-center justify-center ${className}`}
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Animated pulse rings */}
      <div className="absolute inset-4 rounded-full border border-[#14EAEA]/10 animate-product-pulse" />
      <div
        className="absolute inset-10 rounded-full border border-[#14EAEA]/8 animate-product-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute inset-16 rounded-full border border-[#14EAEA]/5 animate-product-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* Icon */}
      <Icon size={120} className="text-[#14EAEA] relative z-10" strokeWidth={1} />
    </div>
  )
}
