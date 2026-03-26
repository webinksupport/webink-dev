'use client'
import { useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Camera, Move, ZoomIn, Save, Check, X, ImageIcon, SunDim } from 'lucide-react'
import { useEditor } from './EditorContext'
import MediaPicker from './MediaPicker'

const POSITION_GRID = [
  ['top left', 'top center', 'top right'],
  ['center left', 'center', 'center right'],
  ['bottom left', 'bottom center', 'bottom right'],
]

const SIZE_OPTIONS = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'auto', label: 'Auto' },
]

export interface BackgroundData {
  src: string
  objectPosition: string
  overlayOpacity: number
  backgroundSize: string
}

interface EditableBackgroundProps {
  pageSlug: string
  blockKey: string
  /** Default background image src */
  defaultSrc: string
  /** Default overlay opacity (0–0.8) */
  defaultOverlayOpacity?: number
  /** Default object-position */
  defaultPosition?: string
  /** Default background-size */
  defaultSize?: string
  /** CMS-loaded data overrides */
  cmsData?: Partial<BackgroundData>
  /** The image fill className (applied to next/image) */
  imageClassName?: string
  /** Extra props for the Image (priority, quality, sizes, etc.) */
  imageProps?: Partial<React.ComponentProps<typeof Image>>
  /** Children rendered on top of the background */
  children: ReactNode
  /** Additional className for the wrapper section */
  className?: string
}

export default function EditableBackground({
  pageSlug,
  blockKey,
  defaultSrc,
  defaultOverlayOpacity = 0.55,
  defaultPosition = 'center',
  defaultSize = 'cover',
  cmsData,
  imageClassName = 'object-cover',
  imageProps,
  children,
  className = '',
}: EditableBackgroundProps) {
  const { editMode, saveBlock, saving } = useEditor()
  const [showToolbar, setShowToolbar] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [saved, setSaved] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Resolve current values from CMS or defaults — fall back to defaultSrc on load error
  const resolvedSrc = imgError ? defaultSrc : (cmsData?.src || defaultSrc)
  const resolvedPosition = cmsData?.objectPosition || defaultPosition
  const resolvedOverlay = cmsData?.overlayOpacity ?? defaultOverlayOpacity
  const resolvedSize = cmsData?.backgroundSize || defaultSize

  // Local edit state
  const [bgState, setBgState] = useState<BackgroundData>({
    src: resolvedSrc,
    objectPosition: resolvedPosition,
    overlayOpacity: resolvedOverlay,
    backgroundSize: resolvedSize,
  })

  // Reset local state when toolbar opens
  const openToolbar = useCallback(() => {
    setBgState({
      src: resolvedSrc,
      objectPosition: resolvedPosition,
      overlayOpacity: resolvedOverlay,
      backgroundSize: resolvedSize,
    })
    setSaved(false)
    setShowToolbar(true)
  }, [resolvedSrc, resolvedPosition, resolvedOverlay, resolvedSize])

  const handleSave = useCallback(async () => {
    const success = await saveBlock(
      pageSlug,
      blockKey,
      'JSON',
      bgState.src,
      {
        src: bgState.src,
        objectPosition: bgState.objectPosition,
        overlayOpacity: bgState.overlayOpacity,
        backgroundSize: bgState.backgroundSize,
      },
    )
    if (success) {
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setShowToolbar(false)
      }, 1200)
    }
  }, [saveBlock, pageSlug, blockKey, bgState])

  // Use local state src while toolbar is open for live preview
  const displaySrc = showToolbar ? bgState.src : resolvedSrc
  const displayPosition = showToolbar ? bgState.objectPosition : resolvedPosition
  const displayOverlay = showToolbar ? bgState.overlayOpacity : resolvedOverlay
  const displaySize = showToolbar ? bgState.backgroundSize : resolvedSize

  // Don't add 'relative' if className already includes a position utility (absolute/fixed/sticky)
  // — Tailwind's 'relative' comes later in the CSS than 'absolute', overriding it and breaking layout
  const hasPosition = /\b(absolute|fixed|sticky)\b/.test(className)

  return (
    <div className={`${hasPosition ? '' : 'relative'} ${className}`}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={displaySrc}
          alt=""
          fill
          className={imageClassName}
          style={{
            objectPosition: displayPosition,
            objectFit: displaySize as 'cover' | 'contain',
          }}
          onError={() => {
            if (!imgError && cmsData?.src && cmsData.src !== defaultSrc) {
              setImgError(true)
            }
          }}
          {...imageProps}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ backgroundColor: `rgba(0,0,0,${displayOverlay})` }}
        />
      </div>

      {/* Actual section content */}
      {children}

      {/* Camera icon badge — edit mode only */}
      {editMode && (
        <button
          onClick={openToolbar}
          data-editor-toolbar
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-[#14EAEA] hover:border-[#14EAEA] transition-all duration-200 shadow-lg"
          title="Edit background image"
        >
          <Camera size={16} />
        </button>
      )}

      {/* Background toolbar — portal */}
      {showToolbar && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[10000] bg-black/40"
            onClick={() => setShowToolbar(false)}
          />
          {/* Toolbar panel */}
          <div
            data-editor-toolbar
            className="fixed top-1/2 right-6 -translate-y-1/2 z-[10001] bg-[#0F0F0F] rounded-2xl shadow-2xl border border-white/10 p-5 w-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Camera size={14} className="text-[#14EAEA]" />
                <span className="font-urbanist font-bold text-xs text-white/60 uppercase tracking-wider">
                  Background Image
                </span>
              </div>
              <button
                onClick={() => setShowToolbar(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            {/* Current image preview */}
            <div className="mb-4">
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Current Image</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bgState.src} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="font-urbanist text-xs text-white/40 truncate flex-1">
                  {bgState.src.split('/').pop()}
                </span>
              </div>
            </div>

            {/* Swap image */}
            <button
              onClick={() => setShowMediaPicker(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-urbanist font-bold text-xs text-white/60 hover:text-white hover:border-[#14EAEA]/50 transition-colors mb-4"
            >
              <ImageIcon size={12} />
              Swap Background Image
            </button>

            {/* Position grid */}
            <div className="mb-4">
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Move size={10} />
                Background Position
              </label>
              <div className="grid grid-cols-3 gap-1 w-28">
                {POSITION_GRID.map((row, ri) =>
                  row.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setBgState(prev => ({ ...prev, objectPosition: pos }))}
                      className={`w-8 h-8 rounded border transition-colors ${
                        bgState.objectPosition === pos
                          ? 'bg-[#14EAEA] border-[#14EAEA] shadow-sm shadow-[#14EAEA]/30'
                          : 'bg-white/5 border-white/10 hover:border-[#14EAEA]/50'
                      }`}
                      title={pos}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mx-auto ${
                          bgState.objectPosition === pos ? 'bg-[#0A0A0A]' : 'bg-white/30'
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

            {/* Overlay opacity slider */}
            <div className="mb-4">
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <SunDim size={10} />
                Overlay Opacity ({Math.round(bgState.overlayOpacity * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={bgState.overlayOpacity}
                onChange={(e) => setBgState(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                className="w-full accent-[#14EAEA]"
              />
              <div className="flex justify-between font-urbanist text-[9px] text-white/20 mt-0.5">
                <span>0%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Background size */}
            <div className="mb-4">
              <label className="font-urbanist text-[10px] text-white/40 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <ZoomIn size={10} />
                Background Size
              </label>
              <div className="flex gap-1">
                {SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setBgState(prev => ({ ...prev, backgroundSize: opt.value }))}
                    className={`flex-1 px-3 py-1.5 rounded-lg font-urbanist text-xs font-bold transition-colors ${
                      bgState.backgroundSize === opt.value
                        ? 'bg-[#14EAEA]/20 text-[#14EAEA]'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Save button */}
            <div className="pt-3 border-t border-white/10">
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

          {/* Media Picker */}
          {showMediaPicker && (
            <MediaPicker
              onSelect={(src) => {
                setBgState(prev => ({ ...prev, src }))
                setShowMediaPicker(false)
              }}
              onClose={() => setShowMediaPicker(false)}
            />
          )}
        </>,
        document.body,
      )}
    </div>
  )
}
