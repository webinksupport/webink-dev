'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, type TextProps, type ImageProps } from './EditorContext'
import MediaPicker from './MediaPicker'
import {
  Save, Check, X, Type, AlignLeft, AlignCenter, AlignRight,
  ImageIcon, Move, ZoomIn, Sparkles, ChevronDown, Database,
} from 'lucide-react'

const BRAND_COLORS = [
  { hex: '#14EAEA', label: 'Cyan' },
  { hex: '#F813BE', label: 'Pink' },
  { hex: '#B9FF33', label: 'Lime' },
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#0F0F0F', label: 'Dark' },
  { hex: '#333333', label: 'Carbon' },
  { hex: '#1A1A1A', label: 'Near Black' },
]

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '600', label: 'Semi-Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra-Bold' },
  { value: '900', label: 'Black' },
]

const POSITION_GRID = [
  ['top left', 'top center', 'top right'],
  ['center left', 'center', 'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]

export function EditorToolbar() {
  const { selectedElement, selectElement, saveBlock, saving } = useEditor()
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showEffects, setShowEffects] = useState(false)
  const [saved, setSaved] = useState(false)

  // Local state for edits
  const [textState, setTextState] = useState<TextProps>({ text: '' })
  const [imageState, setImageState] = useState<ImageProps>({ src: '' })

  // Initialize local state from selected element
  useEffect(() => {
    if (!selectedElement) return
    if (selectedElement.type === 'text') {
      setTextState(selectedElement.data as TextProps)
    } else {
      setImageState(selectedElement.data as ImageProps)
    }
    setSaved(false)
    setShowEffects(false)
  }, [selectedElement])

  // Position toolbar near the selected element
  useEffect(() => {
    if (!selectedElement) return

    const updatePosition = () => {
      const rect = selectedElement.element.getBoundingClientRect()
      const toolbarHeight = toolbarRef.current?.offsetHeight || 200
      const toolbarWidth = toolbarRef.current?.offsetWidth || 360

      // Fixed positioning uses viewport coords (no scrollY needed)
      let top = rect.top - toolbarHeight - 12
      let left = rect.left + (rect.width / 2) - (toolbarWidth / 2)

      // If toolbar would go above viewport, position below element
      if (top < 8) {
        top = rect.bottom + 12
      }

      // If toolbar would go below viewport, clamp it
      if (top + toolbarHeight > window.innerHeight - 8) {
        top = window.innerHeight - toolbarHeight - 8
      }

      // Keep within viewport horizontally
      left = Math.max(8, Math.min(left, window.innerWidth - toolbarWidth - 8))

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [selectedElement])

  const handleClearCache = async () => {
    try {
      const res = await fetch('/api/clear-cache', { method: 'POST' })
      if (res.ok) {
        alert('Cache cleared! Refresh the page to see changes.')
      } else {
        alert('Failed to clear cache')
      }
    } catch {
      alert('Failed to clear cache')
    }
  }

  const handleSave = useCallback(async () => {
    if (!selectedElement) return

    let success: boolean
    if (selectedElement.type === 'text') {
      success = await saveBlock(
        selectedElement.pageSlug,
        selectedElement.blockKey,
        'TEXT',
        textState.text,
        {
          fontSize: textState.fontSize,
          fontWeight: textState.fontWeight,
          color: textState.color,
          alignment: textState.alignment,
          effects: textState.effects,
        },
      )
      // Update DOM immediately
      if (success && selectedElement.element) {
        selectedElement.element.textContent = textState.text
      }
    } else {
      success = await saveBlock(
        selectedElement.pageSlug,
        selectedElement.blockKey,
        'JSON',
        imageState.src,
        {
          src: imageState.src,
          objectPosition: imageState.objectPosition,
          zoom: imageState.zoom,
        },
      )
    }

    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }, [selectedElement, saveBlock, textState, imageState])

  if (!selectedElement) return null

  const isText = selectedElement.type === 'text'

  const toolbar = (
    <>
      <div
        ref={toolbarRef}
        data-editor-toolbar
        className="fixed z-[10000] bg-[#0F0F0F] rounded-2xl shadow-2xl border border-white/10 p-4 min-w-[340px] max-w-[420px]"
        style={{ top: position.top, left: position.left }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isText ? <Type size={14} className="text-[#14EAEA]" /> : <ImageIcon size={14} className="text-[#14EAEA]" />}
            <span className="font-urbanist font-bold text-xs text-white/60 uppercase tracking-wider">
              {isText ? 'Edit Text' : 'Edit Image'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-urbanist text-[10px] text-white/30 tracking-wide">
              {selectedElement.blockKey}
            </span>
            <button
              onClick={() => selectElement(null)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* TEXT CONTROLS */}
        {isText && (
          <div className="space-y-3">
            {/* Inline text editor */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Content</label>
              <textarea
                value={textState.text}
                onChange={(e) => setTextState(prev => ({ ...prev, text: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-urbanist text-sm text-white resize-none focus:outline-none focus:border-[#14EAEA]/50 transition-colors"
                rows={Math.min(4, Math.max(2, textState.text.split('\n').length))}
              />
            </div>

            {/* Font size + weight row */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Size</label>
                <input
                  type="text"
                  value={textState.fontSize || ''}
                  onChange={(e) => setTextState(prev => ({ ...prev, fontSize: e.target.value }))}
                  placeholder="e.g. 48px"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-urbanist text-xs text-white focus:outline-none focus:border-[#14EAEA]/50"
                />
              </div>
              <div className="flex-1">
                <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Weight</label>
                <select
                  value={textState.fontWeight || ''}
                  onChange={(e) => setTextState(prev => ({ ...prev, fontWeight: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-urbanist text-xs text-white focus:outline-none focus:border-[#14EAEA]/50 appearance-none"
                >
                  <option value="">Default</option>
                  {FONT_WEIGHTS.map(w => (
                    <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Color</label>
              <div className="flex items-center gap-2">
                {BRAND_COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setTextState(prev => ({ ...prev, color: c.hex }))}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      textState.color === c.hex ? 'border-[#14EAEA] scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
                <input
                  type="text"
                  value={textState.color || ''}
                  onChange={(e) => setTextState(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#hex"
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 font-urbanist text-xs text-white focus:outline-none focus:border-[#14EAEA]/50"
                />
              </div>
            </div>

            {/* Alignment */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Alignment</label>
              <div className="flex gap-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTextState(prev => ({ ...prev, alignment: value }))}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      textState.alignment === value
                        ? 'bg-[#14EAEA]/20 text-[#14EAEA]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Effects */}
            <div>
              <button
                onClick={() => setShowEffects(!showEffects)}
                className="flex items-center gap-2 font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 hover:text-white/60 transition-colors"
              >
                <Sparkles size={10} />
                Text Effects
                <ChevronDown size={10} className={`transition-transform ${showEffects ? 'rotate-180' : ''}`} />
              </button>
              {showEffects && (
                <div className="space-y-2 bg-white/5 rounded-lg p-3">
                  {[
                    { key: 'highlight', label: 'Highlight Underline (Cyan)' },
                    { key: 'gradient', label: 'Gradient Text (Cyan→Pink)' },
                    { key: 'glow', label: 'Glow Effect (Cyan)' },
                    { key: 'uppercase', label: 'ALL CAPS' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!textState.effects?.[key as keyof NonNullable<TextProps['effects']>]}
                        onChange={(e) => setTextState(prev => ({
                          ...prev,
                          effects: { ...prev.effects, [key]: e.target.checked },
                        }))}
                        className="rounded border-white/20 bg-white/5 text-[#14EAEA] focus:ring-[#14EAEA]/30"
                      />
                      <span className="font-urbanist text-xs text-white/60">{label}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <label className="font-urbanist text-xs text-white/60 whitespace-nowrap">Letter Spacing</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={parseFloat(textState.effects?.letterSpacing || '0')}
                      onChange={(e) => setTextState(prev => ({
                        ...prev,
                        effects: { ...prev.effects, letterSpacing: `${e.target.value}px` },
                      }))}
                      className="flex-1 accent-[#14EAEA]"
                    />
                    <span className="font-urbanist text-xs text-white/40 w-8">
                      {textState.effects?.letterSpacing || '0'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IMAGE CONTROLS */}
        {!isText && (
          <div className="space-y-3">
            {/* Position grid */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Move size={10} />
                Object Position
              </label>
              <div className="grid grid-cols-3 gap-1 w-28">
                {POSITION_GRID.map((row, ri) =>
                  row.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setImageState(prev => ({ ...prev, objectPosition: pos }))}
                      className={`w-8 h-8 rounded border transition-colors ${
                        imageState.objectPosition === pos
                          ? 'bg-[#14EAEA] border-[#14EAEA] shadow-sm shadow-[#14EAEA]/30'
                          : 'bg-white/5 border-white/10 hover:border-[#14EAEA]/50'
                      }`}
                      title={pos}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mx-auto ${
                          imageState.objectPosition === pos ? 'bg-[#0A0A0A]' : 'bg-white/30'
                        }`}
                        style={{
                          marginTop: ri === 0 ? '2px' : ri === 2 ? 'auto' : undefined,
                        }}
                      />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Zoom slider */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ZoomIn size={10} />
                Zoom ({((imageState.zoom || 1) * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.05"
                value={imageState.zoom || 1}
                onChange={(e) => setImageState(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                className="w-full accent-[#14EAEA]"
              />
            </div>

            {/* Current image preview */}
            <div>
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Current Image</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {imageState.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageState.src} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="font-urbanist text-xs text-white/40 truncate flex-1">
                  {imageState.src || 'No image'}
                </span>
              </div>
            </div>

            {/* Swap image button */}
            <button
              onClick={() => setShowMediaPicker(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-urbanist font-bold text-xs text-white/60 hover:text-white hover:border-[#14EAEA]/50 transition-colors"
            >
              <ImageIcon size={12} />
              Swap Image
            </button>

            {/* Clear Cache button */}
            <button
              onClick={handleClearCache}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 bg-[#F813BE]/20 border border-[#F813BE]/30 rounded-lg font-urbanist font-bold text-xs text-[#F813BE] hover:bg-[#F813BE]/30 hover:text-white transition-colors"
              title="Clear cache to force immediate content refresh"
            >
              <Database size={12} />
              Clear Cache
            </button>
          </div>
        )}

        {/* Save button */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-urbanist font-bold text-sm transition-all duration-300 ${
              saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : saving
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-white shadow-lg shadow-[#14EAEA]/20'
            }`}
          >
            {saved ? (
              <><Check size={14} /> Saved</>
            ) : saving ? (
              <>Saving...</>
            ) : (
              <><Save size={14} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(src) => {
            setImageState(prev => ({ ...prev, src }))
            setShowMediaPicker(false)
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  )

  return createPortal(toolbar, document.body)
}
