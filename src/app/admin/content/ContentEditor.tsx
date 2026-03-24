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
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlockType = 'TEXT' | 'HTML' | 'IMAGE' | 'LINK' | 'BUTTON' | 'SEO'

interface ContentBlock {
  id: string
  pageSlug: string
  blockKey: string
  blockType: BlockType
  value: string
  updatedAt: string
  _dirty?: boolean
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
  { slug: 'home', label: 'Homepage', url: '/' },
  { slug: 'about', label: 'About', url: '/about' },
  { slug: 'services', label: 'Services Hub', url: '/services' },
  { slug: 'services/web-design', label: 'Web Design', url: '/services/web-design' },
  { slug: 'services/seo', label: 'SEO Services', url: '/services/seo' },
  { slug: 'services/social-media', label: 'Social Media', url: '/services/social-media' },
  { slug: 'services/paid-advertising', label: 'Paid Advertising', url: '/services/paid-advertising' },
  { slug: 'services/ai-marketing', label: 'AI Marketing', url: '/services/ai-marketing' },
  { slug: 'services/custom-crm', label: 'Custom CRM', url: '/services/custom-crm' },
  { slug: 'pricing', label: 'Pricing', url: '/pricing' },
  { slug: 'contact', label: 'Contact', url: '/contact' },
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
    { key: 'seo_meta_title', type: 'SEO', label: 'Meta Title', defaultValue: 'Digital Marketing Agency Sarasota | Webink Solutions' },
    { key: 'seo_meta_description', type: 'SEO', label: 'Meta Description', defaultValue: 'Web design, SEO, and digital marketing for local businesses in Sarasota, Tampa & Bradenton.' },
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
    case 'BUTTON': return <MousePointerClick className="w-4 h-4" />
    case 'SEO': return <Search className="w-4 h-4" />
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
  }
}

function formatBlockKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

// ---------------------------------------------------------------------------
// TipTap Rich Text Editor
// ---------------------------------------------------------------------------

function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#14EAEA] underline' },
      }),
      UnderlineExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm max-w-none min-h-[120px] focus:outline-none px-4 py-3 text-white/80',
      },
    },
  })

  if (!editor) return null

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border border-[#333] rounded-lg overflow-hidden bg-[#0A0A0A]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[#333] bg-[#111] flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#333] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#333] mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Bullet List"
        >
          <ListIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#333] mx-1" />

        <button
          onClick={addLink}
          className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
          title="Add Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {/* Character count */}
        <div className="ml-auto text-white/20 text-xs">
          {editor.storage.characterCount?.characters?.() ?? editor.getText().length} chars
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}) {
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
// Media Picker Modal
// ---------------------------------------------------------------------------

function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (path: string) => void
  onClose: () => void
}) {
  const [files, setFiles] = useState<{ name: string; path: string; size: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then(setFiles)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = files.filter(
    (f) =>
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-bold">Select Image</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-white/30 py-12">No images found</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((file) => (
                <button
                  key={file.path}
                  onClick={() => onSelect(file.path)}
                  className="group relative bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden hover:border-[#14EAEA] transition-colors aspect-square"
                >
                  {file.name.endsWith('.svg') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={file.path}
                      alt={file.name}
                      className="w-full h-full object-contain p-3"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={file.path}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <p className="text-white text-[10px] truncate">
                      {file.name}
                    </p>
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
// Block Editor component
// ---------------------------------------------------------------------------

function BlockEditorItem({
  block,
  label,
  isActive,
  onSelect,
  onValueChange,
  isDirty,
}: {
  block: ContentBlock
  label: string
  isActive: boolean
  onSelect: () => void
  onValueChange: (value: string) => void
  isDirty: boolean
}) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  return (
    <>
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-all ${
          isActive
            ? 'bg-[#1A1A1A] border border-[#14EAEA]/40'
            : 'hover:bg-[#1A1A1A] border border-transparent'
        }`}
      >
        <span className={`shrink-0 ${blockTypeColor(block.blockType)}`}>
          {blockTypeIcon(block.blockType)}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white text-sm font-medium truncate">{label}</h4>
            {isDirty && (
              <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" title="Unsaved changes" />
            )}
          </div>
          <p className="text-[#666] text-xs truncate mt-0.5">
            {truncate(block.value.replace(/<[^>]*>/g, ''), 60) || '(empty)'}
          </p>
        </div>
        <span className={`text-[8px] font-bold tracking-wider uppercase ${blockTypeColor(block.blockType)}`}>
          {block.blockType}
        </span>
      </button>

      {/* Inline editor when active */}
      {isActive && (
        <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 -mt-1 ml-2 mr-2 mb-2">
          {block.blockType === 'HTML' ? (
            <RichTextEditor
              content={block.value}
              onChange={onValueChange}
            />
          ) : block.blockType === 'IMAGE' ? (
            <div className="space-y-3">
              {block.value && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.value}
                    alt={label}
                    className="w-24 h-16 object-cover rounded-lg border border-[#333]"
                  />
                  <span className="text-[#999] text-xs font-mono truncate flex-1">
                    {block.value}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={block.value}
                  onChange={(e) => onValueChange(e.target.value)}
                  placeholder="/images/photos/example.jpg"
                  className="flex-1 bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono"
                />
                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-dashed border-[#555] hover:border-[#14EAEA] text-[#999] hover:text-[#14EAEA] rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  <ImageIcon className="w-4 h-4" />
                  Browse
                </button>
              </div>
            </div>
          ) : block.blockType === 'BUTTON' ? (
            <div className="space-y-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Button Text</label>
                <input
                  type="text"
                  value={block.value.split('|')[0] || ''}
                  onChange={(e) => {
                    const parts = block.value.split('|')
                    onValueChange(`${e.target.value}|${parts[1] || ''}|${parts[2] || 'primary'}`)
                  }}
                  placeholder="Get a Quote"
                  className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">URL</label>
                <input
                  type="text"
                  value={block.value.split('|')[1] || ''}
                  onChange={(e) => {
                    const parts = block.value.split('|')
                    onValueChange(`${parts[0] || ''}|${e.target.value}|${parts[2] || 'primary'}`)
                  }}
                  placeholder="/contact"
                  className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Style</label>
                <select
                  value={block.value.split('|')[2] || 'primary'}
                  onChange={(e) => {
                    const parts = block.value.split('|')
                    onValueChange(`${parts[0] || ''}|${parts[1] || ''}|${e.target.value}`)
                  }}
                  className="bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]"
                >
                  <option value="primary">Primary (Cyan)</option>
                  <option value="secondary">Secondary (Outline)</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
            </div>
          ) : block.blockType === 'SEO' ? (
            <textarea
              value={block.value}
              onChange={(e) => onValueChange(e.target.value)}
              rows={2}
              placeholder={block.blockKey.includes('title') ? 'Page Title for SEO...' : 'Meta description for SEO...'}
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y"
            />
          ) : block.blockType === 'LINK' ? (
            <input
              type="text"
              value={block.value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="https://... or /path"
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono"
            />
          ) : (
            <textarea
              value={block.value}
              onChange={(e) => onValueChange(e.target.value)}
              rows={3}
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-y leading-relaxed"
            />
          )}
        </div>
      )}

      {showMediaPicker && (
        <MediaPickerModal
          onSelect={(path) => {
            onValueChange(path)
            setShowMediaPicker(false)
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Add block form
// ---------------------------------------------------------------------------

function AddBlockForm({
  onCreated,
}: {
  onCreated: (key: string, type: BlockType, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState('')
  const [type, setType] = useState<BlockType>('TEXT')
  const [value, setValue] = useState('')

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#333] hover:border-[#14EAEA] text-[#666] hover:text-[#14EAEA] rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-semibold">Add Block</span>
      </button>
    )
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#14EAEA]/30 rounded-xl p-4 space-y-3">
      <h4 className="text-white font-semibold text-sm">New Content Block</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1">
            Block Key
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="hero_headline"
            className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono"
          />
        </div>
        <div>
          <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BlockType)}
            className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]"
          >
            <option value="TEXT">Text</option>
            <option value="HTML">Rich Text</option>
            <option value="IMAGE">Image</option>
            <option value="LINK">Link</option>
            <option value="BUTTON">Button/CTA</option>
            <option value="SEO">SEO</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[#999] text-[10px] font-bold uppercase tracking-wider block mb-1">
          Initial Value
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Optional..."
          className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA]"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (!key.trim()) return
            const sanitizedKey = key.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
            onCreated(sanitizedKey, type, value)
            setKey('')
            setValue('')
            setType('TEXT')
            setOpen(false)
          }}
          className="flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm px-4 py-2 rounded-lg hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-[#999] hover:text-white px-3 py-2 rounded-lg border border-[#333] hover:border-[#555] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Editor
// ---------------------------------------------------------------------------

export default function ContentEditor() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [savedBlocks, setSavedBlocks] = useState<ContentBlock[]>([])
  const [activeBlockKey, setActiveBlockKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

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
      setSavedBlocks(JSON.parse(JSON.stringify(data)))
      setActiveBlockKey(data.length > 0 ? data[0].blockKey : null)
    } catch {
      showToast('Failed to load content blocks', 'error')
      setBlocks([])
      setSavedBlocks([])
    } finally {
      setLoading(false)
    }
  }, [showToast])

  const handleSelectPage = (slug: string) => {
    // Warn if unsaved changes
    if (hasDirtyBlocks && !confirm('You have unsaved changes. Switch pages?')) return
    setSelectedPage(slug)
    fetchBlocks(slug)
    setSaveStatus('idle')
  }

  // Check for dirty blocks
  const hasDirtyBlocks = blocks.some((block) => {
    const saved = savedBlocks.find((s) => s.blockKey === block.blockKey)
    if (!saved) return true // new block
    return saved.value !== block.value || saved.blockType !== block.blockType
  })

  const isDirty = (blockKey: string) => {
    const current = blocks.find((b) => b.blockKey === blockKey)
    const saved = savedBlocks.find((b) => b.blockKey === blockKey)
    if (!current) return false
    if (!saved) return true
    return current.value !== saved.value || current.blockType !== saved.blockType
  }

  // Auto-save debounce
  useEffect(() => {
    if (!hasDirtyBlocks || !selectedPage) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      handleSave()
    }, 3000)
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    }
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

  const handleValueChange = (blockKey: string, newValue: string) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.blockKey === blockKey ? { ...b, value: newValue } : b
      )
    )
  }

  const handleDeleteBlock = async (blockKey: string) => {
    if (!selectedPage) return
    if (!confirm(`Delete block "${blockKey}"?`)) return

    try {
      const res = await fetch(
        `/api/content/${encodeURIComponent(selectedPage)}/${encodeURIComponent(blockKey)}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('Delete failed')
      setBlocks((prev) => prev.filter((b) => b.blockKey !== blockKey))
      setSavedBlocks((prev) => prev.filter((b) => b.blockKey !== blockKey))
      if (activeBlockKey === blockKey) setActiveBlockKey(null)
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
      updatedAt: new Date().toISOString(),
    }
    setBlocks((prev) => [...prev, newBlock])
    setActiveBlockKey(key)
  }

  const handleSeedDefaults = async () => {
    if (!selectedPage) return
    const defaults = DEFAULT_BLOCKS[selectedPage]
    if (!defaults) return
    const existingKeys = new Set(blocks.map((b) => b.blockKey))
    const missing = defaults.filter((d) => !existingKeys.has(d.key))
    if (missing.length === 0) return

    for (const d of missing) {
      handleAddBlock(d.key, d.type, d.defaultValue)
    }
    showToast(`Added ${missing.length} default block(s)`, 'success')
  }

  // Build label map from defaults
  const labelMap: Record<string, string> = {}
  if (selectedPage && DEFAULT_BLOCKS[selectedPage]) {
    for (const d of DEFAULT_BLOCKS[selectedPage]) {
      labelMap[d.key] = d.label
    }
  }

  const existingKeys = new Set(blocks.map((b) => b.blockKey))
  const missingDefaults = selectedPage && DEFAULT_BLOCKS[selectedPage]
    ? DEFAULT_BLOCKS[selectedPage].filter((d) => !existingKeys.has(d.key)).length
    : 0

  const pageUrl = PAGES.find((p) => p.slug === selectedPage)?.url

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Page Editor</h1>
        <p className="text-[#999]">
          Edit content, images, and SEO across the site. Changes auto-save after 3 seconds.
        </p>
      </div>

      {/* Page list (when no page selected) */}
      {!selectedPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGES.map((page) => {
            const defaults = DEFAULT_BLOCKS[page.slug]
            return (
              <div
                key={page.slug}
                className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5 hover:border-[#14EAEA]/40 transition-all group cursor-pointer"
                onClick={() => handleSelectPage(page.slug)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-[#14EAEA] transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-[#666] text-xs font-mono mt-0.5">
                      {page.url}
                    </p>
                  </div>
                  <span className="text-[#666] text-xs">
                    {defaults?.length || 0} blocks
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button className="flex items-center gap-2 text-sm text-[#14EAEA] font-semibold hover:underline">
                    <FileText className="w-4 h-4" />
                    Edit Page
                  </button>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-sm text-[#999] hover:text-white ml-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor view */}
      {selectedPage && (
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 sm:px-5 py-3">
            <button
              onClick={() => {
                if (hasDirtyBlocks && !confirm('You have unsaved changes. Go back?')) return
                setSelectedPage(null)
                setBlocks([])
                setSavedBlocks([])
                setSaveStatus('idle')
              }}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              ← Back
            </button>

            <div className="w-px h-5 bg-[#333] hidden sm:block" />

            <h2 className="text-white font-bold text-sm sm:text-base">
              {PAGES.find((p) => p.slug === selectedPage)?.label}
            </h2>
            <span className="text-[#666] text-xs font-mono hidden sm:inline">
              {selectedPage}
            </span>

            <div className="flex-1 min-w-0" />

            {/* Save status */}
            {saveStatus === 'saving' && (
              <span className="flex items-center gap-2 text-xs sm:text-sm text-white/50">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-2 text-xs sm:text-sm text-[#14EAEA]">
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Saved</span>
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-2 text-xs sm:text-sm text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Error</span>
              </span>
            )}

            {/* Revert */}
            <button
              onClick={handleRevert}
              disabled={!hasDirtyBlocks}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-[#999] border border-[#333] rounded-lg hover:border-[#555] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Revert"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Revert</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!hasDirtyBlocks || saving}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#14EAEA] text-[#0A0A0A] font-semibold text-sm rounded-lg hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>

            {/* Preview */}
            {pageUrl && (
              <a
                href={pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-sm text-[#999] border border-[#333] rounded-lg hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors"
                title="Preview"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </a>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-6 h-6 text-[#14EAEA] animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Block list (left panel — full width on mobile) */}
              <div className="w-full lg:w-[380px] shrink-0 space-y-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold tracking-[3px] uppercase text-[#14EAEA]">
                    Content Blocks
                  </h3>
                  {missingDefaults > 0 && (
                    <button
                      onClick={handleSeedDefaults}
                      className="flex items-center gap-1.5 text-[10px] text-[#F813BE] border border-[#F813BE]/30 hover:border-[#F813BE] px-2 py-1 rounded-lg transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      +{missingDefaults} defaults
                    </button>
                  )}
                </div>

                {blocks.length === 0 && (
                  <div className="text-center py-12 text-[#555]">
                    <Type className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No blocks yet.</p>
                    <p className="text-xs mt-1">
                      {DEFAULT_BLOCKS[selectedPage]
                        ? 'Click "+X defaults" above to get started.'
                        : 'Add blocks below.'}
                    </p>
                  </div>
                )}

                {blocks.map((block) => (
                  <div key={block.blockKey} className="group relative">
                    <BlockEditorItem
                      block={block}
                      label={labelMap[block.blockKey] || formatBlockKey(block.blockKey)}
                      isActive={activeBlockKey === block.blockKey}
                      onSelect={() =>
                        setActiveBlockKey(
                          activeBlockKey === block.blockKey ? null : block.blockKey
                        )
                      }
                      onValueChange={(v) => handleValueChange(block.blockKey, v)}
                      isDirty={isDirty(block.blockKey)}
                    />

                    {/* Delete button on hover */}
                    <button
                      onClick={() => handleDeleteBlock(block.blockKey)}
                      className="absolute top-3 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-all"
                      title="Delete block"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <div className="pt-2">
                  <AddBlockForm onCreated={handleAddBlock} />
                </div>
              </div>

              {/* Preview panel (right) */}
              <div className="flex-1 min-w-0 hidden lg:block">
                <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xs font-bold tracking-[3px] uppercase text-[#F813BE] mb-4">
                    Block Preview
                  </h3>

                  {activeBlockKey ? (
                    (() => {
                      const block = blocks.find(
                        (b) => b.blockKey === activeBlockKey
                      )
                      if (!block)
                        return (
                          <p className="text-[#555]">Block not found</p>
                        )

                      const label =
                        labelMap[block.blockKey] ||
                        formatBlockKey(block.blockKey)

                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className={blockTypeColor(block.blockType)}>
                              {blockTypeIcon(block.blockType)}
                            </span>
                            <h4 className="text-white font-semibold">
                              {label}
                            </h4>
                            {isDirty(block.blockKey) && (
                              <span className="w-2 h-2 rounded-full bg-yellow-400" />
                            )}
                          </div>

                          {block.blockType === 'IMAGE' && block.value ? (
                            <div className="rounded-lg overflow-hidden border border-[#333]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={block.value}
                                alt={label}
                                className="w-full max-h-[300px] object-contain bg-[#0A0A0A]"
                              />
                            </div>
                          ) : block.blockType === 'HTML' ? (
                            <div
                              className="prose prose-invert prose-sm max-w-none text-white/80 bg-[#0A0A0A] rounded-lg p-4 border border-[#333]"
                              dangerouslySetInnerHTML={{
                                __html: block.value,
                              }}
                            />
                          ) : block.blockType === 'BUTTON' ? (
                            <div className="bg-[#0A0A0A] rounded-lg p-6 border border-[#333] flex items-center justify-center">
                              {(() => {
                                const [text, , style] = block.value.split('|')
                                const buttonStyle =
                                  style === 'secondary'
                                    ? 'border border-[#14EAEA] text-[#14EAEA]'
                                    : style === 'ghost'
                                      ? 'border border-white/30 text-white/70'
                                      : 'bg-[#14EAEA] text-[#0A0A0A]'
                                return (
                                  <span
                                    className={`px-6 py-3 rounded-full font-semibold text-sm ${buttonStyle}`}
                                  >
                                    {text || 'Button Text'}
                                  </span>
                                )
                              })()}
                            </div>
                          ) : (
                            <div className="bg-[#0A0A0A] rounded-lg p-4 border border-[#333]">
                              <p className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed">
                                {block.value || '(empty)'}
                              </p>
                            </div>
                          )}

                          <p className="text-[#555] text-xs font-mono mt-3">
                            Key: {block.blockKey}
                          </p>
                        </div>
                      )
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[#555]">
                      <ChevronRight className="w-8 h-8 mb-3 opacity-30" />
                      <p className="text-sm">
                        Select a block to preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
