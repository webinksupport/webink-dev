'use client'

import { useState } from 'react'
import IdeaGenerator from './tabs/IdeaGenerator'
import ImageStudio from './tabs/ImageStudio'
import PostComposer from './tabs/PostComposer'
import CalendarView from './tabs/CalendarView'
import Analytics from './tabs/Analytics'
import {
  Lightbulb,
  ImageIcon,
  PenSquare,
  Calendar,
  BarChart2,
} from 'lucide-react'

const tabs = [
  { id: 'ideas', label: 'Idea Generator', icon: Lightbulb },
  { id: 'images', label: 'Image Studio', icon: ImageIcon },
  { id: 'composer', label: 'Post Composer', icon: PenSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
]

export default function SocialStudio() {
  const [activeTab, setActiveTab] = useState('ideas')
  // Shared state: pass selected idea/image into composer
  const [composerDraft, setComposerDraft] = useState<{
    caption?: string
    hashtags?: string
    mediaPath?: string
  }>({})

  function goToComposer(draft: { caption?: string; hashtags?: string; mediaPath?: string }) {
    setComposerDraft(draft)
    setActiveTab('composer')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Social Media Studio</h1>
        <p className="text-[#666] text-sm mt-1">
          AI-powered content creation, scheduling, and publishing for Facebook, Instagram & LinkedIn
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-[#1A1A1A] rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#F813BE] text-white'
                  : 'text-[#666] hover:text-white hover:bg-[#252525]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ideas' && <IdeaGenerator onUseIdea={goToComposer} />}
        {activeTab === 'images' && <ImageStudio onUseImage={(path) => goToComposer({ mediaPath: path })} />}
        {activeTab === 'composer' && <PostComposer initialDraft={composerDraft} />}
        {activeTab === 'calendar' && <CalendarView onEditPost={(post) => goToComposer({
          caption: post.caption || '',
          hashtags: post.hashtags || '',
          mediaPath: post.mediaPath || '',
        })} />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}
