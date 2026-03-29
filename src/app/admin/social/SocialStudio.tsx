'use client'

import { useState, useEffect } from 'react'
import BrandAssistant from './tabs/BrandAssistant'
import ImageStudio from './tabs/ImageStudio'
import CarouselBuilder from './tabs/CarouselBuilder'
import ReviewQueue from './tabs/ReviewQueue'
import CalendarView from './tabs/CalendarView'
import Recycler from './tabs/Recycler'
import Analytics from './tabs/Analytics'
import PublishingSettings from './tabs/PublishingSettings'
import Intelligence from './tabs/Intelligence'
import ClientManager from './tabs/ClientManager'
import StoriesPlanner from './tabs/StoriesPlanner'
import PostBuilder from './tabs/PostBuilder'
import {
  ImageIcon,
  Calendar,
  BarChart2,
  Palette,
  ClipboardCheck,
  Settings,
  Layers,
  Recycle,
  Radar,
  Users,
  Film,
  Wand2,
  ChevronDown,
} from 'lucide-react'

interface SocialClient {
  id: string
  name: string
  instagramHandle: string | null
  status: string
}

const tabGroups = [
  {
    label: 'CREATE',
    tabs: [
      { id: 'postbuilder', label: 'Builder', icon: Wand2 },
      { id: 'images', label: 'Image Studio', icon: ImageIcon },
      { id: 'brand', label: 'Brand Assistant', icon: Palette },
      { id: 'carousel', label: 'Carousel/Reels', icon: Layers },
    ],
  },
  {
    label: 'MANAGE',
    tabs: [
      { id: 'calendar', label: 'Calendar', icon: Calendar },
      { id: 'review', label: 'Review Queue', icon: ClipboardCheck },
      { id: 'stories', label: 'Stories', icon: Film },
    ],
  },
  {
    label: 'GROW',
    tabs: [
      { id: 'recycler', label: 'Recycler', icon: Recycle },
      { id: 'analytics', label: 'Analytics', icon: BarChart2 },
      { id: 'intelligence', label: 'Intelligence', icon: Radar },
    ],
  },
  {
    label: 'SETTINGS',
    tabs: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'clients', label: 'Clients', icon: Users },
    ],
  },
]

export default function SocialStudio() {
  const [activeTab, setActiveTab] = useState('postbuilder')
  // Shared state: pass selected idea/image into composer
  const [composerDraft, setComposerDraft] = useState<{
    caption?: string
    hashtags?: string
    mediaPath?: string
  }>({})
  // Image studio prompt (pre-filled from Brand Assistant or Ideas)
  const [imageStudioPrompt, setImageStudioPrompt] = useState('')
  const [imageStudioTopic, setImageStudioTopic] = useState('')
  const [imageStudioIdea, setImageStudioIdea] = useState('')

  // Client context switcher
  const [clients, setClients] = useState<SocialClient[]>([])
  const [activeClientId, setActiveClientId] = useState<string | null>(null)
  const [showClientDropdown, setShowClientDropdown] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const res = await fetch('/api/social/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data.filter((c: SocialClient) => c.status === 'ACTIVE'))
      }
    } catch {}
  }

  const activeClient = clients.find((c) => c.id === activeClientId) || null

  function goToComposer(draft: { caption?: string; hashtags?: string; mediaPath?: string }) {
    setComposerDraft(draft)
    setActiveTab('composer')
  }

  function goToImageStudio(prompt: string) {
    setImageStudioPrompt(prompt)
    setActiveTab('images')
  }

  function goToImageStudioWithContext(topic: string, idea: string) {
    setImageStudioTopic(topic)
    setImageStudioIdea(idea)
    setImageStudioPrompt('') // Let the studio generate from context
    setActiveTab('images')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Social Media Studio</h1>
            <p className="text-[#666] text-sm mt-1">
              AI-powered content creation, scheduling, and publishing for Facebook, Instagram & LinkedIn
            </p>
          </div>

          {/* Client Context Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowClientDropdown(!showClientDropdown)}
              className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333] hover:border-[#444] rounded-lg px-4 py-2 text-sm transition-colors"
            >
              <span className="text-[#666]">Managing:</span>
              <span className="text-white font-medium">
                {activeClient ? activeClient.name : 'Webink Solutions'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
            </button>

            {showClientDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => { setActiveClientId(null); setShowClientDropdown(false) }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    !activeClientId ? 'bg-[#F813BE]/10 text-[#F813BE]' : 'text-white hover:bg-[#252525]'
                  }`}
                >
                  Webink Solutions
                  <span className="text-[#555] text-xs block">Main account</span>
                </button>
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => { setActiveClientId(client.id); setShowClientDropdown(false) }}
                    className={`w-full text-left px-4 py-3 text-sm border-t border-[#222] transition-colors ${
                      activeClientId === client.id ? 'bg-[#F813BE]/10 text-[#F813BE]' : 'text-white hover:bg-[#252525]'
                    }`}
                  >
                    {client.name}
                    {client.instagramHandle && (
                      <span className="text-[#555] text-xs block">@{client.instagramHandle}</span>
                    )}
                  </button>
                ))}
                {clients.length === 0 && (
                  <p className="px-4 py-3 text-[#555] text-xs border-t border-[#222]">
                    No clients added yet. Go to Settings → Clients.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active client indicator */}
        {activeClient && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#F813BE] animate-pulse" />
            <span className="text-[#F813BE]">
              Client mode: {activeClient.name}
              {activeClient.instagramHandle && ` (@${activeClient.instagramHandle})`}
            </span>
          </div>
        )}
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
            initialTopic={imageStudioTopic}
            initialIdea={imageStudioIdea}
          />
        )}
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
        {activeTab === 'stories' && <StoriesPlanner />}
        {activeTab === 'recycler' && <Recycler onRecyclePost={(data) => goToComposer({
          caption: data.caption,
          hashtags: data.hashtags,
          mediaPath: data.mediaPath,
        })} />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'intelligence' && <Intelligence />}
        {activeTab === 'settings' && <PublishingSettings />}
        {activeTab === 'clients' && <ClientManager />}
        {activeTab === 'postbuilder' && <PostBuilder onGoToCalendar={() => setActiveTab('calendar')} />}
      </div>
    </div>
  )
}
