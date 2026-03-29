'use client'

import { useState } from 'react'
import IdeaGenerator from './tabs/IdeaGenerator'
import BrandAssistant from './tabs/BrandAssistant'
import ImageStudio from './tabs/ImageStudio'
import PostComposer from './tabs/PostComposer'
import CarouselBuilder from './tabs/CarouselBuilder'
import ReviewQueue from './tabs/ReviewQueue'
import CalendarView from './tabs/CalendarView'
import Recycler from './tabs/Recycler'
import Analytics from './tabs/Analytics'
import PublishingSettings from './tabs/PublishingSettings'
import {
  Lightbulb,
  ImageIcon,
  PenSquare,
  Calendar,
  BarChart2,
  Palette,
  ClipboardCheck,
  Settings,
  Layers,
  Recycle,
} from 'lucide-react'

const tabGroups = [
  {
    label: 'CREATE',
    tabs: [
      { id: 'ideas', label: 'Ideas', icon: Lightbulb },
      { id: 'brand', label: 'Brand Assistant', icon: Palette },
      { id: 'carousel', label: 'Carousel/Reels', icon: Layers },
      { id: 'images', label: 'Image Studio', icon: ImageIcon },
      { id: 'composer', label: 'Composer', icon: PenSquare },
    ],
  },
  {
    label: 'MANAGE',
    tabs: [
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'review', label: 'Review Queue', icon: ClipboardCheck },
    ],
  },
  {
    label: 'GROW',
    tabs: [
      { id: 'recycler', label: 'Recycler', icon: Recycle },
      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'SETTINGS',
    tabs: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function SocialStudio() {
  const [activeTab, setActiveTab] = useState('ideas')
  // Shared state: pass selected idea/image into composer
  const [composerDraft, setComposerDraft] = useState<{
    caption?: string
    hashtags?: string
    mediaPath?: string
  }>({})
  // Image studio prompt (pre-filled from Brand Assistant)
  const [imageStudioPrompt, setImageStudioPrompt] = useState('')

  function goToComposer(draft: { caption?: string; hashtags?: string; mediaPath?: string }) {
    setComposerDraft(draft)
    setActiveTab('composer')
  }

  function goToImageStudio(prompt: string) {
    setImageStudioPrompt(prompt)
    setActiveTab('images')
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

      {/* Tab Bar — Grouped */}
      <div className="flex gap-1 mb-6 bg-[#1A1A1A] rounded-xl p-1.5 overflow-x-auto">
        {tabGroups.map((group, gi) => (
          <div key={group.label} className="flex items-center gap-1">
            {gi > 0 && <div className="w-px h-6 bg-[#333] mx-1 shrink-0" />}
            <span className="text-[#444] text-[10px] font-bold tracking-[2px] uppercase px-1.5 shrink-0 hidden sm:block">
              {group.label}
            </span>
            {group.tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F813BE] text-white'
                      : 'text-[#666] hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'ideas' && <IdeaGenerator onUseIdea={goToComposer} />}
        {activeTab === 'brand' && (
          <BrandAssistant
            onUseContent={(content) => goToComposer({
              caption: content.caption,
              hashtags: content.hashtags,
            })}
            onGoToImageStudio={goToImageStudio}
          />
        )}
        {activeTab === 'carousel' && (
          <CarouselBuilder
            onSaveAsPost={(data) => goToComposer({
              caption: data.caption,
              hashtags: data.hashtags,
            })}
            onGenerateImages={(prompts) => {
              setImageStudioPrompt(prompts[0] || '')
              setActiveTab('images')
            }}
          />
        )}
        {activeTab === 'images' && (
          <ImageStudio
            onUseImage={(path) => goToComposer({ mediaPath: path })}
            initialPrompt={imageStudioPrompt}
          />
        )}
        {activeTab === 'composer' && <PostComposer initialDraft={composerDraft} />}
        {activeTab === 'review' && <ReviewQueue onEditPost={(post) => goToComposer({
          caption: post.caption || '',
          hashtags: post.hashtags || '',
          mediaPath: post.mediaPath || '',
        })} />}
        {activeTab === 'calendar' && <CalendarView onEditPost={(post) => goToComposer({
          caption: post.caption || '',
          hashtags: post.hashtags || '',
          mediaPath: post.mediaPath || '',
        })} />}
        {activeTab === 'recycler' && <Recycler onRecyclePost={(data) => goToComposer({
          caption: data.caption,
          hashtags: data.hashtags,
          mediaPath: data.mediaPath,
        })} />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <PublishingSettings />}
      </div>
    </div>
  )
}
