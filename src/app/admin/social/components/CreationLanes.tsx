'use client'

import { Wand2, Sparkles, Zap, ArrowRight } from 'lucide-react'

interface CreationLanesProps {
  onSelectLane: (lane: 'manual' | 'ai_assist' | 'automated') => void
}

const lanes = [
  {
    id: 'manual' as const,
    label: 'Manual',
    description: 'Write your own caption, upload an image, and schedule. Full control.',
    icon: Wand2,
    color: '#14EAEA',
    bgColor: 'rgba(20, 234, 234, 0.08)',
    borderColor: 'rgba(20, 234, 234, 0.25)',
    steps: ['Write caption', 'Upload or select image', 'Pick platforms & schedule'],
  },
  {
    id: 'ai_assist' as const,
    label: 'AI-Assisted',
    description: 'Give a topic — AI generates ideas, captions, and images. You pick and refine.',
    icon: Sparkles,
    color: '#F813BE',
    bgColor: 'rgba(248, 19, 190, 0.08)',
    borderColor: 'rgba(248, 19, 190, 0.25)',
    steps: ['Enter topic', 'AI generates ideas', 'AI creates image', 'Review & schedule'],
  },
  {
    id: 'automated' as const,
    label: 'Automated',
    description: 'Auto-generate a batch of posts from your brand pillars. Review and approve.',
    icon: Zap,
    color: '#B9FF33',
    bgColor: 'rgba(185, 255, 51, 0.08)',
    borderColor: 'rgba(185, 255, 51, 0.25)',
    steps: ['Pick content pillar', 'Set quantity', 'AI generates batch', 'Review in queue'],
  },
]

export default function CreationLanes({ onSelectLane }: CreationLanesProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-2">How do you want to create?</h2>
        <p className="text-[#666] text-sm">Choose a creation path based on how much control you want.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lanes.map((lane) => {
          const Icon = lane.icon
          return (
            <button
              key={lane.id}
              onClick={() => onSelectLane(lane.id)}
              className="text-left p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02] group"
              style={{
                backgroundColor: lane.bgColor,
                borderColor: lane.borderColor,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${lane.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: lane.color }} />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{lane.label}</h3>
              <p className="text-[#888] text-sm mb-4 leading-relaxed">{lane.description}</p>

              <div className="space-y-1.5 mb-4">
                {lane.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${lane.color}20`, color: lane.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[#999] text-xs">{step}</span>
                  </div>
                ))}
              </div>

              <div
                className="flex items-center gap-1 text-sm font-medium opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color: lane.color }}
              >
                Start <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
