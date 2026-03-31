'use client'
import { Star, Shield, RefreshCcw, Award } from 'lucide-react'

const items = [
  { icon: Star, text: '5.0 Google Rating', color: '#14EAEA' },
  { icon: Shield, text: 'SSL Secured Checkout', color: '#14EAEA' },
  { icon: RefreshCcw, text: 'Month-to-Month — No Lock-In', color: '#14EAEA' },
  { icon: Award, text: 'DesignRush Top Agency', color: '#14EAEA' },
]

export default function SocialProofBar() {
  return (
    <div className="bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.text} className="flex items-center gap-2">
                <Icon size={14} style={{ color: item.color }} />
                <span className="font-urbanist text-xs text-white/50 font-medium">
                  {item.text}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
