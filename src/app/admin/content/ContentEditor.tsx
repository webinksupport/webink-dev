'use client'

import { useState, useCallback, useRef } from 'react'
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Save,
  Plus,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
  ChevronRight,
  Upload,
  X,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlockType = 'TEXT' | 'HTML' | 'IMAGE' | 'LINK'

interface ContentBlock {
  id: string
  pageSlug: string
  blockKey: string
  blockType: BlockType
  value: string
  updatedAt: string
}

interface DefaultBlock {
  key: string
  type: BlockType
  label: string
  defaultValue: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGES = [
  { slug: 'home', label: 'Homepage' },
  { slug: 'about', label: 'About' },
  { slug: 'services', label: 'Services Hub' },
  { slug: 'services/web-design', label: 'Web Design' },
  { slug: 'services/seo', label: 'SEO Services' },
  { slug: 'services/social-media', label: 'Social Media' },
  { slug: 'services/paid-advertising', label: 'Paid Advertising' },
  { slug: 'services/ai-marketing', label: 'AI Marketing' },
  { slug: 'services/custom-crm', label: 'Custom CRM' },
  { slug: 'pricing', label: 'Pricing' },
  { slug: 'contact', label: 'Contact' },
] as const

const DEFAULT_BLOCKS: Record<string, DefaultBlock[]> = {
  home: [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Websites That Work. Marketing That Converts.' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton.' },
    { key: 'hero_image', type: 'IMAGE', label: 'Hero Background Image', defaultValue: '/images/photos/baja-beach.jpg' },
    { key: 'hero_cta_text', type: 'TEXT', label: 'Hero CTA Text', defaultValue: 'Get a Free Audit' },
    { key: 'hero_cta_link', type: 'LINK', label: 'Hero CTA Link', defaultValue: '/contact' },
    { key: 'services_eyebrow', type: 'TEXT', label: 'Services Eyebrow', defaultValue: 'What We Do' },
    { key: 'services_heading', type: 'TEXT', label: 'Services Heading', defaultValue: 'Digital Solutions That Drive Growth' },
    { key: 'about_eyebrow', type: 'TEXT', label: 'About Eyebrow', defaultValue: 'Why Webink' },
    { key: 'about_heading', type: 'TEXT', label: 'About Heading', defaultValue: 'We Drive Growth Through Structure & Process' },
    { key: 'about_body', type: 'HTML', label: 'About Body', defaultValue: 'Founded in Sarasota, Webink Solutions delivers measurable results for local businesses.' },
    { key: 'stats_heading', type: 'TEXT', label: 'Stats Section Heading', defaultValue: 'Results That Speak' },
  ],
  about: [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'About Webink Solutions' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'A Sarasota digital agency founded on real results.' },
    { key: 'founder_bio', type: 'HTML', label: 'Founder Bio', defaultValue: 'Sean Rowe founded Webink Solutions after a career as a firefighter/paramedic.' },
    { key: 'team_image', type: 'IMAGE', label: 'Team Photo', defaultValue: '/images/photos/team-rooftop.jpg' },
    { key: 'mission_heading', type: 'TEXT', label: 'Mission Heading', defaultValue: 'Our Mission' },
    { key: 'mission_body', type: 'HTML', label: 'Mission Body', defaultValue: 'To help local businesses compete and win in the digital landscape.' },
  ],
  services: [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Our Services' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Full-service digital marketing for businesses ready to grow.' },
  ],
  'services/web-design': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Web Design & Development' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Beautiful, fast, conversion-focused websites built for results.' },
    { key: 'hero_image', type: 'IMAGE', label: 'Hero Image', defaultValue: '/images/photos/web-design-hero.jpg' },
    { key: 'intro_body', type: 'HTML', label: 'Intro Body', defaultValue: 'Every website we build is designed to convert visitors into customers.' },
  ],
  'services/seo': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'SEO Services' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Get found on Google. Rank higher. Drive organic traffic.' },
    { key: 'intro_body', type: 'HTML', label: 'Intro Body', defaultValue: 'Our SEO strategies are built on data, not guesswork.' },
  ],
  'services/social-media': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Social Media Marketing' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Engage your audience. Build your brand. Drive results.' },
  ],
  'services/paid-advertising': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Paid Advertising (PPC)' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Targeted ads that deliver measurable ROI.' },
  ],
  'services/ai-marketing': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'AI-Powered Marketing' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Leverage artificial intelligence to supercharge your marketing.' },
  ],
  'services/custom-crm': [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Custom CRM & SaaS' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Tailored software solutions built for your business.' },
  ],
  pricing: [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Transparent Pricing' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Simple, honest pricing with no hidden fees.' },
  ],
  contact: [
    { key: 'hero_headline', type: 'TEXT', label: 'Hero Headline', defaultValue: 'Get in Touch' },
    { key: 'hero_subtext', type: 'TEXT', label: 'Hero Subtext', defaultValue: 'Ready to grow your business? Let\'s talk.' },
    { key: 'form_heading', type: 'TEXT', label: 'Form Heading', defaultValue: 'Send Us a Message' },
  ],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function blockTypeIcon(type: BlockType) {
  switch (type) {
    case 'TEXT': return <FileText className="w-4 h-4" />
    case 'HTML': return <Code className="w-4 h-4" />
    case 'IMAGE': return <ImageIcon className="w-4 h-4" />
    case 'LINK': return <LinkIcon className="w-4 h-4" />
  }
}

function blockTypeColor(type: BlockType) {
  switch (type) {
    case 'TEXT': return 'text-[#14EAEA]'
    case 'HTML': return 'text-[#F813BE]'
    case 'IMAGE': return 'text-[#B9FF33]'
    case 'LINK': return 'text-[#14EAEA]'
  }
}

function formatBlockKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

// ---------------------------------------------------------------------------
// Toast component
// ---------------------------------------------------------------------------

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border transition-all ${
        type === 'success'
          ? 'bg-[#0A0A0A] border-[#14EAEA]/40 text-[#14EAEA]'
          : 'bg-[#0A0A0A] border-red-500/40 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <Check className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Block editor
// ---------------------------------------------------------------------------

function BlockEditor({
  block,
  label,
  pageSlug,
  onSaved,
  onDeleted,
  showToast,
}: {
  block: ContentBlock
  label: string
  pageSlug: string
  onSaved: () => void
  onDeleted: () => void
  showToast: (msg: string, type: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(block.value)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(
        `/api/content/${encodeURIComponent(pageSlug)}/${encodeURIComponent(block.blockKey)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, blockType: block.blockType }),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      showToast(`Saved "${label}"`, 'success')
      setEditing(false)
      onSaved()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete block "${label}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(
        `/api/content/${encodeURIComponent(pageSlug)}/${encodeURIComponent(block.blockKey)}`,
        { method: 'DELETE' }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }
      showToast(`Deleted "${label}"`, 'success')
      onDeleted()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(
        `/api/content/${encodeURIComponent(pageSlug)}/${encodeURIComponent(block.blockKey)}/upload`,
        { method: 'POST', body: formData }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }
      const data = await res.json()
      setValue(data.url)
      showToast(`Uploaded image for "${label}"`, 'success')
      onSaved()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`shrink-0 ${blockTypeColor(block.blockType)}`}>
            {blockTypeIcon(block.blockType)}
          </span>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm">{label}</h4>
            <p className="text-[#666] text-xs font-mono mt-0.5">{block.blockKey}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${blockTypeColor(block.blockType)} border-current/20`}>
            {block.blockType}
          </span>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-[#999] hover:text-white border border-[#333] hover:border-[#14EAEA] px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[#666] hover:text-red-400 p-1.5 rounded-lg transition-colors"
            title="Delete block"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview / Edit */}
      {!editing ? (
        <div className="mt-2">
          {block.blockType === 'IMAGE' ? (
            <div className="flex items-center gap-3">
              {block.value && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={block.value}
                  alt={label}
                  className="w-20 h-14 object-cover rounded-lg border border-[#333]"
                />
              )}
              <span className="text-[#999] text-sm font-mono truncate">{block.value || '(no image)'}</span>
            </div>
          ) : (
            <p className="text-[#999] text-sm leading-relaxed">
              {truncate(block.value, 200) || '(empty)'}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {block.blockType === 'IMAGE' ? (
            <div className="space-y-3">
              {/* Current image preview */}
              {value && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={value}
                    alt={label}
                    className="w-24 h-16 object-cover rounded-lg border border-[#333]"
                  />
                  <span className="text-[#999] text-xs font-mono truncate">{value}</span>
                </div>
              )}
              {/* URL input */}
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="/images/photos/example.jpg"
                className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 font-mono transition-colors"
              />
              {/* Upload button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(file)
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm border border-dashed border-[#555] hover:border-[#14EAEA] text-[#999] hover:text-[#14EAEA] px-4 py-2 rounded-lg transition-colors"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>
          ) : block.blockType === 'LINK' ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://... or /path"
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 font-mono transition-colors"
            />
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={block.blockType === 'HTML' ? 8 : 3}
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 font-mono leading-relaxed resize-y transition-colors"
            />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setValue(block.value)
                setEditing(false)
              }}
              className="text-sm text-[#999] hover:text-white px-4 py-2 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Add block form
// ---------------------------------------------------------------------------

function AddBlockForm({
  pageSlug,
  onCreated,
  showToast,
}: {
  pageSlug: string
  onCreated: () => void
  showToast: (msg: string, type: 'success' | 'error') => void
}) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  const [type, setType] = useState<BlockType>('TEXT')
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!key.trim()) {
      showToast('Block key is required', 'error')
      return
    }

    const sanitizedKey = key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

    setSaving(true)
    try {
      const res = await fetch(
        `/api/content/${encodeURIComponent(pageSlug)}/${encodeURIComponent(sanitizedKey)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: value || '', blockType: type }),
        }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Create failed')
      }
      showToast(`Created block "${sanitizedKey}"`, 'success')
      setKey('')
      setValue('')
      setType('TEXT')
      setOpen(false)
      onCreated()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Create failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-semibold">Add Content Block</span>
      </button>
    )
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#14EAEA]/30 rounded-xl p-5 space-y-4">
      <h4 className="text-white font-semibold text-sm">New Content Block</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[#999] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Block Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. hero_headline"
            className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 font-mono transition-colors"
          />
        </div>
        <div>
          <label className="text-[#999] text-xs font-semibold uppercase tracking-wider block mb-1.5">
            Block Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BlockType)}
            className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 transition-colors"
          >
            <option value="TEXT">Text</option>
            <option value="HTML">HTML</option>
            <option value="IMAGE">Image</option>
            <option value="LINK">Link</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[#999] text-xs font-semibold uppercase tracking-wider block mb-1.5">
          Initial Value
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          placeholder="Optional initial value..."
          className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#14EAEA] focus:ring-1 focus:ring-[#14EAEA]/30 font-mono resize-y transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCreate}
          disabled={saving}
          className="flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {saving ? 'Creating...' : 'Create Block'}
        </button>
        <button
          onClick={() => {
            setOpen(false)
            setKey('')
            setValue('')
          }}
          className="text-sm text-[#999] hover:text-white px-4 py-2 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Seed defaults button
// ---------------------------------------------------------------------------

function SeedDefaultsButton({
  pageSlug,
  existingKeys,
  onSeeded,
  showToast,
}: {
  pageSlug: string
  existingKeys: Set<string>
  onSeeded: () => void
  showToast: (msg: string, type: 'success' | 'error') => void
}) {
  const [seeding, setSeeding] = useState(false)
  const defaults = DEFAULT_BLOCKS[pageSlug]
  if (!defaults) return null

  const missing = defaults.filter((d) => !existingKeys.has(d.key))
  if (missing.length === 0) return null

  const handleSeed = async () => {
    setSeeding(true)
    try {
      await Promise.all(
        missing.map((d) =>
          fetch(
            `/api/content/${encodeURIComponent(pageSlug)}/${encodeURIComponent(d.key)}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ value: d.defaultValue, blockType: d.type }),
            }
          )
        )
      )
      showToast(`Seeded ${missing.length} default block(s)`, 'success')
      onSeeded()
    } catch {
      showToast('Failed to seed defaults', 'error')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={seeding}
      className="flex items-center gap-2 text-xs text-[#F813BE] border border-[#F813BE]/30 hover:border-[#F813BE] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {seeding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
      Populate {missing.length} default block{missing.length !== 1 ? 's' : ''}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main editor
// ---------------------------------------------------------------------------

export default function ContentEditor() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchBlocks = useCallback(async (slug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setBlocks(data)
    } catch {
      showToast('Failed to load content blocks', 'error')
      setBlocks([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleSelectPage = (slug: string) => {
    setSelectedPage(slug)
    fetchBlocks(slug)
  }

  const handleRefresh = () => {
    if (selectedPage) fetchBlocks(selectedPage)
  }

  // Build label map from defaults
  const labelMap: Record<string, string> = {}
  if (selectedPage && DEFAULT_BLOCKS[selectedPage]) {
    for (const d of DEFAULT_BLOCKS[selectedPage]) {
      labelMap[d.key] = d.label
    }
  }

  const existingKeys = new Set(blocks.map((b) => b.blockKey))

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Page Content Editor</h1>
        <p className="text-[#999]">
          Edit text, images, and links across the site without touching code.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — page list */}
        <div className="lg:w-64 shrink-0">
          <h3 className="text-xs font-bold tracking-[3px] uppercase text-[#14EAEA] mb-4">
            Pages
          </h3>
          <nav className="space-y-1">
            {PAGES.map((page) => (
              <button
                key={page.slug}
                onClick={() => handleSelectPage(page.slug)}
                className={`w-full flex items-center gap-2 text-left text-sm px-4 py-2.5 rounded-lg transition-all ${
                  selectedPage === page.slug
                    ? 'bg-[#14EAEA]/10 text-[#14EAEA] border border-[#14EAEA]/40 font-semibold'
                    : 'text-[#999] hover:text-white hover:bg-[#1A1A1A] border border-transparent'
                }`}
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    selectedPage === page.slug ? 'rotate-90 text-[#14EAEA]' : 'text-[#555]'
                  }`}
                />
                {page.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main panel */}
        <div className="flex-1 min-w-0">
          {!selectedPage ? (
            <div className="flex items-center justify-center h-64 text-[#555] text-sm">
              Select a page from the sidebar to begin editing.
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" />
            </div>
          ) : (
            <div>
              {/* Page title bar */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {PAGES.find((p) => p.slug === selectedPage)?.label}
                  </h2>
                  <p className="text-[#666] text-sm mt-0.5">
                    {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                    <span className="mx-2 text-[#333]">|</span>
                    <span className="font-mono text-xs">/{selectedPage}</span>
                  </p>
                </div>
                <SeedDefaultsButton
                  pageSlug={selectedPage}
                  existingKeys={existingKeys}
                  onSeeded={handleRefresh}
                  showToast={showToast}
                />
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {blocks.length === 0 && (
                  <div className="text-center py-12 text-[#555]">
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No content blocks defined for this page.</p>
                    <p className="text-xs mt-1">
                      {DEFAULT_BLOCKS[selectedPage]
                        ? 'Click "Populate default blocks" above, or add blocks manually below.'
                        : 'Add blocks manually below.'}
                    </p>
                  </div>
                )}

                {blocks.map((block) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    label={labelMap[block.blockKey] || formatBlockKey(block.blockKey)}
                    pageSlug={selectedPage}
                    onSaved={handleRefresh}
                    onDeleted={handleRefresh}
                    showToast={showToast}
                  />
                ))}

                <AddBlockForm
                  pageSlug={selectedPage}
                  onCreated={handleRefresh}
                  showToast={showToast}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
