'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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
  X,
  Eye,
  ExternalLink,
  RotateCcw,
  Search,
  MousePointerClick,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Type,
  GripVertical,
  Database,
  Globe,
  PenLine,
  CircleDot,
  Clock,
  FilePlus2,
  Shield,
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'
import { PAGE_SCHEMAS, AVAILABLE_ICONS, type ContentFieldSchema } from '@/lib/content-schemas'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlockType = 'TEXT' | 'HTML' | 'IMAGE' | 'LINK' | 'BUTTON' | 'SEO' | 'JSON'

interface ContentBlock {
  id: string
  pageSlug: string
  blockKey: string
  blockType: BlockType
  value: string
  jsonValue?: unknown
  updatedAt: string
}

interface PageRecord {
  id: string
  title: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT'
  isCore: boolean
  template: string
  createdAt: string
  updatedAt: string
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
    case 'BUTTON': return <MousePointerClick className="w-4 h-4" />
    case 'SEO': return <Search className="w-4 h-4" />
    case 'JSON': return <Database className="w-4 h-4" />
  }
}

function blockTypeColor(type: BlockType) {
  switch (type) {
    case 'TEXT': return 'text-[#14EAEA]'
    case 'HTML': return 'text-[#F813BE]'
    case 'IMAGE': return 'text-[#B9FF33]'
    case 'LINK': return 'text-[#14EAEA]'
    case 'BUTTON': return 'text-[#F813BE]'
    case 'SEO': return 'text-[#B9FF33]'
    case 'JSON': return 'text-[#14EAEA]'
  }
}

function formatBlockKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

function fieldTypeToBlockType(fieldType: string): BlockType {
  switch (fieldType) {
    case 'text':
    case 'textarea': return 'TEXT'
    case 'html': return 'HTML'
    case 'image': return 'IMAGE'
    case 'link': return 'LINK'
    case 'seo': return 'SEO'
    case 'image_array':
    case 'feature_list':
    case 'process_steps':
    case 'faq_list':
    case 'pricing_tiers':
    case 'stat_list': return 'JSON'
    default: return 'TEXT'
  }
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getPageUrl(slug: string): string {
  const schema = PAGE_SCHEMAS.find((p) => p.slug === slug)
  if (schema) return schema.url
  return `/${slug}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Generic blocks for new custom pages
const GENERIC_PAGE_FIELDS: ContentFieldSchema[] = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
  { key: 'hero_subtext', label: 'Hero Subtext', type: 'textarea' },
  { key: 'hero_image', label: 'Hero Image', type: 'image' },
  { key: 'body_content', label: 'Body Content', type: 'html' },
  { key: 'seo_meta_title', label: 'Meta Title', type: 'seo' },
  { key: 'seo_meta_description', label: 'Meta Description', type: 'seo' },
  { key: 'seo_og_image', label: 'OG / Featured Image', type: 'image' },
]

// ---------------------------------------------------------------------------
// TipTap Rich Text Editor
// ---------------------------------------------------------------------------

function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#14EAEA] underline' } }),
      UnderlineExtension,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'prose prose-invert prose-sm max-w-none min-h-[120px] focus:outline-none px-4 py-3 text-white/80' },
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="border border-[#333] rounded-lg overflow-hidden bg-[#0A0A0A]">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#333] bg-[#111] flex-wrap">
        {[
          { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
          { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
          { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
        ].map(({ icon: Icon, action, active, title }) => (
          <button key={title} onClick={action} className={`p-1.5 rounded transition-colors ${active ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`} title={title}>
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <div className="w-px h-5 bg-[#333] mx-1" />
        {[
          { icon: Heading1, level: 1 as const },
          { icon: Heading2, level: 2 as const },
          { icon: Heading3, level: 3 as const },
        ].map(({ icon: Icon, level }) => (
          <button key={level} onClick={() => editor.chain().focus().toggleHeading({ level }).run()} className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level }) ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`} title={`Heading ${level}`}>
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <div className="w-px h-5 bg-[#333] mx-1" />
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`} title="Bullet List">
          <ListIcon className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#333] mx-1" />
        <button onClick={addLink} className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`} title="Add Link">
          <Link2 className="w-4 h-4" />
        </button>
        <div className="ml-auto text-white/20 text-xs">{editor.getText().length} chars</div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border transition-all ${type === 'success' ? 'bg-[#0A0A0A] border-[#14EAEA]/40 text-[#14EAEA]' : 'bg-[#0A0A0A] border-red-500/40 text-red-400'}`}>
      {type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Media Picker Modal
// ---------------------------------------------------------------------------

function MediaPickerModal({ onSelect, onClose }: { onSelect: (path: string) => void; onClose: () => void }) {
  const [files, setFiles] = useState<{ name: string; path: string; size: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/media').then((r) => r.json()).then(setFiles).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = files.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-bold">Select Image</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input type="text" placeholder="Search images..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50" />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/30 py-12">No images found</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((file) => (
                <button key={file.path} onClick={() => onSelect(file.path)} className="group relative bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden hover:border-[#14EAEA] transition-colors aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.path}
                    alt={file.name}
                    className={`w-full h-full ${file.name.endsWith('.svg') ? 'object-contain p-3' : 'object-cover'}`}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement
                      img.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-[10px] truncate">{file.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Image Array Editor
// ---------------------------------------------------------------------------

function ImageArrayEditor({ value, onChange }: { value: Array<{ src: string; alt: string; objectPosition?: string }>; onChange: (v: Array<{ src: string; alt: string; objectPosition?: string }>) => void }) {
  const [showPicker, setShowPicker] = useState<number | null>(null)

  const addItem = () => onChange([...value, { src: '', alt: '', objectPosition: 'center' }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: string) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-[#555]" />
            <span className="text-white/40 text-xs font-bold">#{i + 1}</span>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex items-center gap-2">
            {item.src && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.src}
                alt={item.alt}
                className="w-16 h-12 object-cover rounded border border-[#333]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <input type="text" value={item.src} onChange={(e) => updateItem(i, 'src', e.target.value)} placeholder="/images/photos/example.jpg" className="flex-1 bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] font-mono text-xs" />
            <button onClick={() => setShowPicker(i)} className="px-2 py-1.5 border border-dashed border-[#555] hover:border-[#14EAEA] text-[#999] hover:text-[#14EAEA] rounded text-xs transition-colors">Browse</button>
          </div>
          <input type="text" value={item.alt} onChange={(e) => updateItem(i, 'alt', e.target.value)} placeholder="Alt text..." className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] text-xs" />
          <input type="text" value={item.objectPosition || 'center'} onChange={(e) => updateItem(i, 'objectPosition', e.target.value)} placeholder="Object position (center, top center...)" className="w-full bg-[#111] text-white/60 text-xs border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add Image
      </button>
      {showPicker !== null && (
        <MediaPickerModal
          onSelect={(path) => { updateItem(showPicker, 'src', path); setShowPicker(null) }}
          onClose={() => setShowPicker(null)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Feature List Editor
// ---------------------------------------------------------------------------

function FeatureListEditor({ value, onChange }: { value: Array<{ icon: string; title: string; description: string }>; onChange: (v: Array<{ icon: string; title: string; description: string }>) => void }) {
  const addItem = () => onChange([...value, { icon: 'Zap', title: '', description: '' }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: string) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-[#555]" />
            <span className="text-white/40 text-xs font-bold">#{i + 1}</span>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <select value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]">
            {AVAILABLE_ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
          <input type="text" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Feature title" className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          <textarea value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Feature description..." rows={2} className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] resize-y" />
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add Feature
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Process Steps Editor
// ---------------------------------------------------------------------------

function ProcessStepsEditor({ value, onChange }: { value: Array<{ title: string; description: string }>; onChange: (v: Array<{ title: string; description: string }>) => void }) {
  const addItem = () => onChange([...value, { title: '', description: '' }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: string) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-urbanist font-black text-2xl text-[#14EAEA]/40 select-none">{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <input type="text" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Step title" className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          <textarea value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Step description..." rows={2} className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] resize-y" />
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add Step
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FAQ Editor
// ---------------------------------------------------------------------------

function FAQEditor({ value, onChange }: { value: Array<{ question: string; answer: string }>; onChange: (v: Array<{ question: string; answer: string }>) => void }) {
  const addItem = () => onChange([...value, { question: '', answer: '' }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: string) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs font-bold">Q{i + 1}</span>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <input type="text" value={item.question} onChange={(e) => updateItem(i, 'question', e.target.value)} placeholder="Question..." className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          <textarea value={item.answer} onChange={(e) => updateItem(i, 'answer', e.target.value)} placeholder="Answer..." rows={3} className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] resize-y" />
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add FAQ
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pricing Tiers Editor
// ---------------------------------------------------------------------------

function PricingTiersEditor({ value, onChange }: { value: Array<{ name: string; price: string; period?: string; features: string[]; recommended?: boolean; contactOnly?: boolean }>; onChange: (v: typeof value) => void }) {
  const addItem = () => onChange([...value, { name: '', price: '', period: 'mo', features: [], recommended: false, contactOnly: false }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: unknown) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs font-bold">Tier {i + 1}</span>
            <label className="flex items-center gap-1 text-xs text-[#14EAEA]">
              <input type="checkbox" checked={item.recommended || false} onChange={(e) => updateItem(i, 'recommended', e.target.checked)} className="rounded" /> Recommended
            </label>
            <label className="flex items-center gap-1 text-xs text-[#F813BE]">
              <input type="checkbox" checked={item.contactOnly || false} onChange={(e) => updateItem(i, 'contactOnly', e.target.checked)} className="rounded" /> Contact Only
            </label>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Tier name" className="bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
            <input type="text" value={item.price} onChange={(e) => updateItem(i, 'price', e.target.value)} placeholder="$1,103" className="bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
            <input type="text" value={item.period || ''} onChange={(e) => updateItem(i, 'period', e.target.value)} placeholder="mo / year" className="bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          </div>
          <textarea
            value={(item.features || []).join('\n')}
            onChange={(e) => updateItem(i, 'features', e.target.value.split('\n'))}
            placeholder="One feature per line..."
            rows={4}
            className="w-full bg-[#111] text-white text-xs border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA] resize-y font-mono"
          />
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add Tier
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat List Editor
// ---------------------------------------------------------------------------

function StatListEditor({ value, onChange }: { value: Array<{ value: number; suffix: string; label: string; sublabel: string; underlineColor: string }>; onChange: (v: typeof value) => void }) {
  const addItem = () => onChange([...value, { value: 0, suffix: '+', label: '', sublabel: '', underlineColor: '#14EAEA' }])
  const removeItem = (i: number) => onChange(value.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, v: unknown) => {
    const updated = [...value]
    updated[i] = { ...updated[i], [field]: v }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#333] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs font-bold">Stat {i + 1}</span>
            <div className="flex-1" />
            <button onClick={() => removeItem(i)} className="p-1 text-[#666] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={item.value} onChange={(e) => updateItem(i, 'value', Number(e.target.value))} placeholder="50" className="bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
            <input type="text" value={item.suffix} onChange={(e) => updateItem(i, 'suffix', e.target.value)} placeholder="+ or % or ★" className="bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          </div>
          <input type="text" value={item.label} onChange={(e) => updateItem(i, 'label', e.target.value)} placeholder="Label (e.g. Clients Served)" className="w-full bg-[#111] text-white text-sm border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          <input type="text" value={item.sublabel} onChange={(e) => updateItem(i, 'sublabel', e.target.value)} placeholder="Sublabel (e.g. Across Florida)" className="w-full bg-[#111] text-white/60 text-xs border border-[#333] rounded px-2 py-1.5 focus:outline-none focus:border-[#14EAEA]" />
          <div className="flex items-center gap-2">
            <label className="text-white/40 text-xs">Color:</label>
            <input type="color" value={item.underlineColor} onChange={(e) => updateItem(i, 'underlineColor', e.target.value)} className="w-8 h-6 rounded cursor-pointer" />
            <span className="text-white/30 text-xs font-mono">{item.underlineColor}</span>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4" /> Add Stat
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Schema-Aware Field Editor
// ---------------------------------------------------------------------------

function SchemaFieldEditor({
  field,
  block,
  onValueChange,
  onJsonChange,
}: {
  field: ContentFieldSchema
  block: ContentBlock
  onValueChange: (v: string) => void
  onJsonChange: (v: unknown) => void
}) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const jsonVal = block.jsonValue

  switch (field.type) {
    case 'text':
      return (
        <input type="text" value={block.value} onChange={(e) => onValueChange(e.target.value)} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]" />
      )

    case 'textarea':
      return (
        <textarea value={block.value} onChange={(e) => onValueChange(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y leading-relaxed" />
      )

    case 'html':
      return <RichTextEditor content={block.value} onChange={onValueChange} />

    case 'image':
      return (
        <div className="space-y-2">
          {block.value && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.value} alt={field.label} className="w-24 h-16 object-cover rounded-lg border border-[#333]" />
              <span className="text-[#999] text-xs font-mono truncate flex-1">{block.value}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input type="text" value={block.value} onChange={(e) => onValueChange(e.target.value)} placeholder="/images/photos/example.jpg" className="flex-1 bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono" />
            <button onClick={() => setShowMediaPicker(true)} className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#555] hover:border-[#14EAEA] text-[#999] hover:text-[#14EAEA] rounded-lg text-sm transition-colors whitespace-nowrap">
              <ImageIcon className="w-4 h-4" /> Browse
            </button>
          </div>
          {showMediaPicker && <MediaPickerModal onSelect={(path) => { onValueChange(path); setShowMediaPicker(false) }} onClose={() => setShowMediaPicker(false)} />}
        </div>
      )

    case 'link':
      return (
        <input type="text" value={block.value} onChange={(e) => onValueChange(e.target.value)} placeholder="https://... or /path" className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono" />
      )

    case 'seo':
      return (
        <textarea value={block.value} onChange={(e) => onValueChange(e.target.value)} rows={2} placeholder={field.key.includes('title') ? 'Page Title for SEO...' : 'Meta description for SEO...'} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y" />
      )

    case 'image_array':
      return <ImageArrayEditor value={(jsonVal as Array<{ src: string; alt: string; objectPosition?: string }>) || []} onChange={onJsonChange} />

    case 'feature_list':
      return <FeatureListEditor value={(jsonVal as Array<{ icon: string; title: string; description: string }>) || []} onChange={onJsonChange} />

    case 'process_steps':
      return <ProcessStepsEditor value={(jsonVal as Array<{ title: string; description: string }>) || []} onChange={onJsonChange} />

    case 'faq_list':
      return <FAQEditor value={(jsonVal as Array<{ question: string; answer: string }>) || []} onChange={onJsonChange} />

    case 'pricing_tiers':
      return <PricingTiersEditor value={(jsonVal as Array<{ name: string; price: string; period?: string; features: string[]; recommended?: boolean; contactOnly?: boolean }>) || []} onChange={onJsonChange} />

    case 'stat_list':
      return <StatListEditor value={(jsonVal as Array<{ value: number; suffix: string; label: string; sublabel: string; underlineColor: string }>) || []} onChange={onJsonChange} />

    default:
      return (
        <textarea value={block.value} onChange={(e) => onValueChange(e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y leading-relaxed" />
      )
  }
}

// ---------------------------------------------------------------------------
// Add block form
// ---------------------------------------------------------------------------

function AddBlockForm({ onCreated }: { onCreated: (key: string, type: BlockType, value: string) => void }) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  const [type, setType] = useState<BlockType>('TEXT')
  const [value, setValue] = useState('')

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-xl transition-colors">
        <Plus className="w-4 h-4" /><span className="text-sm font-semibold">Add Custom Block</span>
      </button>
    )
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#14EAEA]/30 rounded-xl p-4 space-y-3">
      <h4 className="text-white font-semibold text-sm">New Content Block</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1">Block Key</label>
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="hero_headline" className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono" />
        </div>
        <div>
          <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as BlockType)} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]">
            <option value="TEXT">Text</option>
            <option value="HTML">Rich Text</option>
            <option value="IMAGE">Image</option>
            <option value="LINK">Link</option>
            <option value="BUTTON">Button/CTA</option>
            <option value="SEO">SEO</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => { if (!key.trim()) return; const sanitizedKey = key.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); onCreated(sanitizedKey, type, value); setKey(''); setValue(''); setType('TEXT'); setOpen(false) }} className="flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white transition-colors">
          <Plus className="w-4 h-4" /> Add
        </button>
        <button onClick={() => setOpen(false)} className="text-sm text-[#999] hover:text-white px-3 py-2 rounded-lg border border-[#333] hover:border-[#555] transition-colors">Cancel</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// New Page Modal
// ---------------------------------------------------------------------------

function NewPageModal({ onCreated, onClose }: { onCreated: (page: PageRecord) => void; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('DRAFT')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slugEdited) setSlug(slugFromTitle(v))
  }

  const handleCreate = async () => {
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), slug: slug.trim(), status }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create page')
        return
      }
      const page = await res.json()
      onCreated(page)
    } catch {
      setError('Failed to create page')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-bold text-lg">Create New Page</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1.5">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My New Page"
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#14EAEA]"
              autoFocus
            />
          </div>
          <div>
            <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1.5">URL Slug</label>
            <div className="flex items-center gap-0">
              <span className="bg-[#1A1A1A] text-[#666] text-sm border border-r-0 border-[#333] rounded-l-lg px-3 py-2.5">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
                placeholder="my-new-page"
                className="flex-1 bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-r-lg px-3 py-2.5 focus:outline-none focus:border-[#14EAEA] font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1.5">Status</label>
            <div className="flex gap-2">
              {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    status === s
                      ? s === 'PUBLISHED'
                        ? 'bg-[#14EAEA]/10 border-[#14EAEA]/40 text-[#14EAEA]'
                        : 'bg-[#F813BE]/10 border-[#F813BE]/40 text-[#F813BE]'
                      : 'border-[#333] text-[#666] hover:text-white hover:border-[#555]'
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5" />
                  {s === 'PUBLISHED' ? 'Published' : 'Draft'}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 p-5 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#999] hover:text-white border border-[#333] rounded-lg transition-colors">Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm rounded-lg hover:bg-white transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4" />}
            Create Page
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Editor
// ---------------------------------------------------------------------------

export default function ContentEditor() {
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [savedBlocks, setSavedBlocks] = useState<ContentBlock[]>([])
  const [expandedField, setExpandedField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  // Page records from DB
  const [pages, setPages] = useState<PageRecord[]>([])
  const [pagesLoading, setPagesLoading] = useState(true)
  const [pageSearch, setPageSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all')
  const [showNewPageModal, setShowNewPageModal] = useState(false)

  // Fetch pages from DB
  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pages')
      if (res.ok) {
        const data = await res.json()
        setPages(data)
      }
    } catch {
      // Pages table might not exist yet; fall back to schema-only
    } finally {
      setPagesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // Build a merged page list: all PAGE_SCHEMAS + any custom DB pages not in schemas
  const mergedPages = (() => {
    const schemaPages = PAGE_SCHEMAS.map((s) => {
      const dbPage = pages.find((p) => p.slug === s.slug)
      return {
        slug: s.slug,
        title: s.label,
        url: s.url,
        status: dbPage?.status || ('PUBLISHED' as const),
        isCore: dbPage?.isCore ?? true,
        updatedAt: dbPage?.updatedAt || '',
        dbId: dbPage?.id || null,
        hasSchema: true,
        fieldCount: s.fields.length,
      }
    })
    // Custom pages (in DB but not in PAGE_SCHEMAS)
    const schemaSlugs = new Set(PAGE_SCHEMAS.map((s) => s.slug))
    const customPages = pages
      .filter((p) => !schemaSlugs.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        url: `/${p.slug}`,
        status: p.status,
        isCore: p.isCore,
        updatedAt: p.updatedAt,
        dbId: p.id,
        hasSchema: false,
        fieldCount: GENERIC_PAGE_FIELDS.length,
      }))
    return [...schemaPages, ...customPages]
  })()

  const filteredPages = mergedPages.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (pageSearch) {
      const q = pageSearch.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q) || p.url.toLowerCase().includes(q)
    }
    return true
  })

  // Content editing logic
  const fetchBlocks = useCallback(async (slug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setBlocks(data)
      setSavedBlocks(JSON.parse(JSON.stringify(data)))
      setExpandedField(null)
    } catch {
      showToast('Failed to load content blocks', 'error')
      setBlocks([])
      setSavedBlocks([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleSelectPage = (slug: string) => {
    if (hasDirtyBlocks && !confirm('You have unsaved changes. Switch pages?')) return
    setSelectedPage(slug)
    setView('edit')
    fetchBlocks(slug)
    setSaveStatus('idle')
  }

  const handleBackToList = () => {
    if (hasDirtyBlocks && !confirm('You have unsaved changes. Go back?')) return
    setSelectedPage(null)
    setView('list')
    setBlocks([])
    setSavedBlocks([])
    setSaveStatus('idle')
  }

  const hasDirtyBlocks = blocks.some((block) => {
    const saved = savedBlocks.find((s) => s.blockKey === block.blockKey)
    if (!saved) return true
    return saved.value !== block.value || saved.blockType !== block.blockType || JSON.stringify(saved.jsonValue) !== JSON.stringify(block.jsonValue)
  })

  const isDirty = (blockKey: string) => {
    const current = blocks.find((b) => b.blockKey === blockKey)
    const saved = savedBlocks.find((b) => b.blockKey === blockKey)
    if (!current) return false
    if (!saved) return true
    return current.value !== saved.value || current.blockType !== saved.blockType || JSON.stringify(saved.jsonValue) !== JSON.stringify(current.jsonValue)
  }

  // Auto-save debounce
  useEffect(() => {
    if (!hasDirtyBlocks || !selectedPage) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => { handleSave() }, 3000)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  const handleSave = async () => {
    if (!selectedPage || saving) return
    setSaving(true)
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(selectedPage)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: blocks.map((b) => ({
            blockKey: b.blockKey,
            blockType: b.blockType,
            value: b.value,
            jsonValue: b.jsonValue ?? null,
          })),
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      setBlocks(data)
      setSavedBlocks(JSON.parse(JSON.stringify(data)))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleRevert = () => {
    if (!confirm('Revert all changes to last saved state?')) return
    setBlocks(JSON.parse(JSON.stringify(savedBlocks)))
    setSaveStatus('idle')
    showToast('Reverted to last saved state', 'success')
  }

  const handleClearCache = async () => {
    if (!confirm('Clear cache to force immediate content refresh?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/clear-cache', { method: 'POST' })
      if (res.ok) {
        showToast('Cache cleared! Refresh the page to see changes.', 'success')
      } else {
        showToast('Failed to clear cache', 'error')
      }
    } catch {
      showToast('Failed to clear cache', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleValueChange = (blockKey: string, newValue: string) => {
    setBlocks((prev) => prev.map((b) => b.blockKey === blockKey ? { ...b, value: newValue } : b))
  }

  const handleJsonChange = (blockKey: string, newValue: unknown) => {
    setBlocks((prev) => prev.map((b) => b.blockKey === blockKey ? { ...b, jsonValue: newValue, value: JSON.stringify(newValue) } : b))
  }

  const handleDeleteBlock = async (blockKey: string) => {
    if (!selectedPage) return
    if (!confirm(`Delete block "${blockKey}"?`)) return
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(selectedPage)}/${encodeURIComponent(blockKey)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setBlocks((prev) => prev.filter((b) => b.blockKey !== blockKey))
      setSavedBlocks((prev) => prev.filter((b) => b.blockKey !== blockKey))
      if (expandedField === blockKey) setExpandedField(null)
      showToast(`Deleted "${blockKey}"`, 'success')
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const handleAddBlock = (key: string, type: BlockType, value: string) => {
    const newBlock: ContentBlock = {
      id: `new_${Date.now()}`,
      pageSlug: selectedPage || '',
      blockKey: key,
      blockType: type,
      value: value || '',
      jsonValue: null,
      updatedAt: new Date().toISOString(),
    }
    setBlocks((prev) => [...prev, newBlock])
    setExpandedField(key)
  }

  // Seed missing blocks from schema
  const handleSeedFromSchema = () => {
    if (!selectedPage) return
    const schema = PAGE_SCHEMAS.find((p) => p.slug === selectedPage)
    // For custom pages not in PAGE_SCHEMAS, use generic fields
    const fields = schema?.fields || GENERIC_PAGE_FIELDS
    const existingKeys = new Set(blocks.map((b) => b.blockKey))
    let added = 0
    for (const field of fields) {
      if (!existingKeys.has(field.key)) {
        handleAddBlock(field.key, fieldTypeToBlockType(field.type), '')
        added++
      }
    }
    if (added > 0) showToast(`Added ${added} field(s) from schema`, 'success')
  }

  // Toggle page status
  const handleToggleStatus = async (pageSlug: string) => {
    const page = pages.find((p) => p.slug === pageSlug)
    if (!page) {
      // Page might not be in DB yet (schema-only). Create it.
      const schemaPage = PAGE_SCHEMAS.find((p) => p.slug === pageSlug)
      if (!schemaPage) return
      try {
        const res = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: schemaPage.label, slug: pageSlug, status: 'DRAFT' }),
        })
        if (res.ok) {
          await fetchPages()
          showToast(`"${schemaPage.label}" set to Draft`, 'success')
        }
      } catch {
        showToast('Failed to update status', 'error')
      }
      return
    }

    const newStatus = page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id, status: newStatus }),
      })
      if (res.ok) {
        await fetchPages()
        showToast(`"${page.title}" set to ${newStatus === 'PUBLISHED' ? 'Published' : 'Draft'}`, 'success')
      }
    } catch {
      showToast('Failed to update status', 'error')
    }
  }

  // Delete page
  const handleDeletePage = async (pageSlug: string) => {
    const page = pages.find((p) => p.slug === pageSlug)
    if (!page || page.isCore) return
    if (!confirm(`Delete page "${page.title}"? This will also delete all its content blocks.`)) return
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: page.id }),
      })
      if (res.ok) {
        await fetchPages()
        showToast(`"${page.title}" deleted`, 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to delete', 'error')
      }
    } catch {
      showToast('Failed to delete page', 'error')
    }
  }

  // Handle new page created
  const handleNewPageCreated = async (page: PageRecord) => {
    setShowNewPageModal(false)
    await fetchPages()
    showToast(`Page "${page.title}" created`, 'success')
    // Open it for editing
    handleSelectPage(page.slug)
  }

  // Get page schema
  const schema = selectedPage ? PAGE_SCHEMAS.find((p) => p.slug === selectedPage) : null
  const activeFields = schema?.fields || (selectedPage && !schema ? GENERIC_PAGE_FIELDS : [])
  const schemaFieldMap = new Map<string, ContentFieldSchema>()
  for (const f of activeFields) schemaFieldMap.set(f.key, f)

  const existingKeys = new Set(blocks.map((b) => b.blockKey))
  const missingSchemaFields = activeFields.filter((f) => !existingKeys.has(f.key)).length

  const pageUrl = selectedPage ? getPageUrl(selectedPage) : undefined

  // -----------------------------------------------------------------------
  // RENDER — Page List View
  // -----------------------------------------------------------------------

  if (view === 'list') {
    return (
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-2">Content</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Pages</h1>
            <p className="text-[#999] text-sm">Manage all site pages, content, SEO, and publishing status.</p>
          </div>
          <button
            onClick={() => setShowNewPageModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm rounded-lg hover:bg-white transition-colors shrink-0"
          >
            <FilePlus2 className="w-4 h-4" /> New Page
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search pages..."
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            {(['all', 'PUBLISHED', 'DRAFT'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === f
                    ? 'bg-[#14EAEA]/20 text-[#14EAEA] border border-[#14EAEA]/30'
                    : 'text-[#666] hover:text-white border border-[#333] hover:border-[#555]'
                }`}
              >
                {f === 'all' ? 'All' : f === 'PUBLISHED' ? 'Published' : 'Drafts'}
              </button>
            ))}
          </div>
        </div>

        {/* Page count */}
        <p className="text-[#666] text-sm mb-4">
          {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''}
          {pageSearch && ` matching "${pageSearch}"`}
        </p>

        {pagesLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="bg-[#0A0A0A] border border-[#333] rounded-2xl overflow-hidden hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#333] text-[#666] text-xs uppercase tracking-wider">
                    <th className="p-4 text-left">Page</th>
                    <th className="p-4 text-left">URL</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Modified</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => (
                    <tr key={page.slug} className="border-b border-[#222] hover:bg-[#1A1A1A]/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
                            {page.hasSchema ? (
                              <Globe className="w-4 h-4 text-[#14EAEA]" />
                            ) : (
                              <FileText className="w-4 h-4 text-[#F813BE]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-white font-medium block truncate">{page.title}</span>
                            {page.isCore && (
                              <span className="flex items-center gap-1 text-[10px] text-[#666]">
                                <Shield className="w-2.5 h-2.5" /> Core
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="text-[#14EAEA]/60 text-xs font-mono">{page.url}</code>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(page.slug)}
                          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                            page.status === 'PUBLISHED'
                              ? 'bg-[#14EAEA]/10 text-[#14EAEA] hover:bg-[#14EAEA]/20'
                              : 'bg-[#F813BE]/10 text-[#F813BE] hover:bg-[#F813BE]/20'
                          }`}
                        >
                          <CircleDot className="w-3 h-3" />
                          {page.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4">
                        {page.updatedAt ? (
                          <span className="flex items-center gap-1.5 text-[#666] text-xs">
                            <Clock className="w-3 h-3" />
                            {formatDate(page.updatedAt)}
                          </span>
                        ) : (
                          <span className="text-[#444] text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSelectPage(page.slug)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 rounded-lg hover:bg-[#14EAEA]/10 transition-colors"
                          >
                            <PenLine className="w-3 h-3" />
                            Edit
                          </button>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] border border-[#333] rounded-lg hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            Preview
                          </a>
                          {!page.isCore && (
                            <button
                              onClick={() => handleDeletePage(page.slug)}
                              className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-[#666] border border-[#333] rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filteredPages.map((page) => (
                <div key={page.slug} className="bg-[#0A0A0A] border border-[#333] rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{page.title}</p>
                      <code className="text-[#14EAEA]/60 text-xs font-mono">{page.url}</code>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      page.status === 'PUBLISHED'
                        ? 'bg-[#14EAEA]/10 text-[#14EAEA]'
                        : 'bg-[#F813BE]/10 text-[#F813BE]'
                    }`}>
                      {page.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSelectPage(page.slug)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 rounded-lg">
                      <PenLine className="w-3 h-3" /> Edit
                    </button>
                    <a href={page.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] border border-[#333] rounded-lg">
                      <Eye className="w-3 h-3" /> Preview
                    </a>
                    {!page.isCore && (
                      <button onClick={() => handleDeletePage(page.slug)} className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#666] border border-[#333] rounded-lg hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPages.length === 0 && (
              <div className="text-center py-16 text-[#555]">
                <Globe className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No pages match your filter.</p>
              </div>
            )}
          </>
        )}

        {showNewPageModal && <NewPageModal onCreated={handleNewPageCreated} onClose={() => setShowNewPageModal(false)} />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // RENDER — Edit View
  // -----------------------------------------------------------------------

  const currentPageInfo = mergedPages.find((p) => p.slug === selectedPage)

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 sm:px-5 py-3">
        <button onClick={handleBackToList} className="text-white/60 hover:text-white text-sm transition-colors">&larr; Pages</button>
        <div className="w-px h-5 bg-[#333] hidden sm:block" />
        <h2 className="text-white font-bold text-sm sm:text-base">{currentPageInfo?.title || schema?.label || formatBlockKey(selectedPage || '')}</h2>
        <span className="text-[#666] text-xs font-mono hidden sm:inline">{pageUrl}</span>

        {/* Status badge */}
        {currentPageInfo && (
          <button
            onClick={() => selectedPage && handleToggleStatus(selectedPage)}
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full transition-colors ${
              currentPageInfo.status === 'PUBLISHED'
                ? 'bg-[#14EAEA]/10 text-[#14EAEA] hover:bg-[#14EAEA]/20'
                : 'bg-[#F813BE]/10 text-[#F813BE] hover:bg-[#F813BE]/20'
            }`}
          >
            <CircleDot className="w-3 h-3" />
            {currentPageInfo.status === 'PUBLISHED' ? 'Published' : 'Draft'}
          </button>
        )}

        <div className="flex-1 min-w-0" />

        {saveStatus === 'saving' && <span className="flex items-center gap-2 text-xs sm:text-sm text-white/50"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span className="hidden sm:inline">Saving...</span></span>}
        {saveStatus === 'saved' && <span className="flex items-center gap-2 text-xs sm:text-sm text-[#14EAEA]"><Check className="w-3.5 h-3.5" /><span className="hidden sm:inline">Saved</span></span>}
        {saveStatus === 'error' && <span className="flex items-center gap-2 text-xs sm:text-sm text-red-400"><AlertCircle className="w-3.5 h-3.5" /><span className="hidden sm:inline">Error</span></span>}

        <button onClick={handleRevert} disabled={!hasDirtyBlocks} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-[#999] border border-[#333] rounded-lg hover:border-[#555] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Revert">
          <RotateCcw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Revert</span>
        </button>
        <button onClick={handleClearCache} className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-[#F813BE] border border-[#F813BE]/30 hover:border-[#F813BE] hover:text-[#F813BE] rounded-lg transition-colors" title="Clear cache">
          <Database className="w-3.5 h-3.5" /><span className="hidden sm:inline">Clear Cache</span>
        </button>
        <button onClick={handleSave} disabled={!hasDirtyBlocks || saving} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          <Save className="w-3.5 h-3.5" /> Save
        </button>
        {pageUrl && (
          <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-[#999] border border-[#333] rounded-lg hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors" title="Preview">
            <ExternalLink className="w-3.5 h-3.5" /><span className="hidden sm:inline">Preview</span>
          </a>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" /></div>
      ) : (
        <div className="max-w-4xl">
          {/* Schema seed button */}
          {missingSchemaFields > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <button onClick={handleSeedFromSchema} className="flex items-center gap-2 text-sm text-[#F813BE] border border-[#F813BE]/30 hover:border-[#F813BE] px-3 py-1.5 rounded-lg transition-colors">
                <Plus className="w-4 h-4" /> Add {missingSchemaFields} schema field{missingSchemaFields > 1 ? 's' : ''}
              </button>
              <span className="text-[#666] text-xs">Fields defined in content schema but not yet in DB</span>
            </div>
          )}

          {blocks.length === 0 && (
            <div className="text-center py-16 text-[#555]">
              <Type className="w-10 h-10 mx-auto mb-4 opacity-40" />
              <p className="text-sm mb-2">No content blocks yet.</p>
              <p className="text-xs">Click &quot;Add schema fields&quot; above to populate from the content schema.</p>
            </div>
          )}

          {/* Field list — accordion style */}
          <div className="space-y-2">
            {blocks.map((block) => {
              const schemaField = schemaFieldMap.get(block.blockKey)
              const label = schemaField?.label || formatBlockKey(block.blockKey)
              const isExpanded = expandedField === block.blockKey
              const dirty = isDirty(block.blockKey)
              const blockType = block.blockType

              return (
                <div key={block.blockKey} className={`bg-[#1A1A1A] border rounded-xl transition-all ${isExpanded ? 'border-[#14EAEA]/40' : 'border-white/10 hover:border-white/20'}`}>
                  {/* Header */}
                  <button onClick={() => setExpandedField(isExpanded ? null : block.blockKey)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <ChevronRight className={`w-4 h-4 text-[#555] transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    <span className={`shrink-0 ${blockTypeColor(blockType)}`}>{blockTypeIcon(blockType)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-sm font-medium truncate">{label}</h4>
                        {dirty && <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" title="Unsaved changes" />}
                        {schemaField && <span className="text-[8px] font-bold tracking-wider uppercase text-[#14EAEA]/40">{schemaField.type}</span>}
                      </div>
                      {!isExpanded && (
                        <p className="text-[#666] text-xs truncate mt-0.5">
                          {blockType === 'JSON' && block.jsonValue
                            ? `${Array.isArray(block.jsonValue) ? block.jsonValue.length + ' items' : 'object'}`
                            : truncate(block.value.replace(/<[^>]*>/g, ''), 60) || '(empty)'}
                        </p>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.blockKey) }} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </button>

                  {/* Editor */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {schemaField?.description && (
                        <p className="text-[#666] text-xs mb-3">{schemaField.description}</p>
                      )}
                      {schemaField ? (
                        <SchemaFieldEditor
                          field={schemaField}
                          block={block}
                          onValueChange={(v) => handleValueChange(block.blockKey, v)}
                          onJsonChange={(v) => handleJsonChange(block.blockKey, v)}
                        />
                      ) : blockType === 'HTML' ? (
                        <RichTextEditor content={block.value} onChange={(v) => handleValueChange(block.blockKey, v)} />
                      ) : blockType === 'IMAGE' ? (
                        <SchemaFieldEditor field={{ key: block.blockKey, label, type: 'image' }} block={block} onValueChange={(v) => handleValueChange(block.blockKey, v)} onJsonChange={(v) => handleJsonChange(block.blockKey, v)} />
                      ) : (
                        <textarea value={block.value} onChange={(e) => handleValueChange(block.blockKey, e.target.value)} rows={3} className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y leading-relaxed" />
                      )}
                      <p className="text-[#555] text-xs font-mono mt-2">Key: {block.blockKey}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add custom block */}
          <div className="mt-4">
            <AddBlockForm onCreated={handleAddBlock} />
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
