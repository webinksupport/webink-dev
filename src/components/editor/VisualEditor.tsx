'use client'
import { type ReactNode, useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { EditorProvider, useEditor, type TextProps, type ImageProps, type BackgroundProps } from './EditorContext'
import { EditorToolbar } from './EditorToolbar'
import { Pencil, X, Check, Camera } from 'lucide-react'

/* ── Save Toast ──────────────────────────────────────────── */
function SaveToast({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted || !show) return null
  return createPortal(
    <div className="fixed bottom-20 right-6 z-[10001] bg-green-500/90 text-white px-4 py-2.5 rounded-full font-urbanist font-bold text-sm flex items-center gap-2 shadow-lg animate-fade-in">
      <Check size={14} /> Saved ✓
    </div>,
    document.body,
  )
}

/* ── Image Overlay Info ──────────────────────────────────── */
interface ImgOverlay {
  el: HTMLElement
  rect: DOMRect
  blockKey: string
  pageSl: string
}

/* ── Inline Edit Scanner ─────────────────────────────────── */
function InlineEditScanner() {
  const { editMode, selectElement, saveBlock, pageSlug, getJsonContent } = useEditor()
  const [showSaveToast, setShowSaveToast] = useState(false)
  const listenersRef = useRef<Array<{ el: Element; type: string; handler: EventListener }>>([])
  const originalContents = useRef<Map<Element, string>>(new Map())
  const [imageOverlays, setImageOverlays] = useState<ImgOverlay[]>([])
  const rafRef = useRef<number>(0)

  // Apply stored styles from jsonValue to elements with data-block
  const applyStoredStyles = useCallback(() => {
    const elements = document.querySelectorAll('[data-block]:not(img):not([data-type="image"]):not([data-type="background"])')
    elements.forEach(el => {
      const blockKey = el.getAttribute('data-block')!
      const json = getJsonContent(blockKey) as TextProps | null
      if (!json) return

      const htmlEl = el as HTMLElement
      if (json.fontSize) htmlEl.style.fontSize = json.fontSize
      if (json.fontWeight) htmlEl.style.fontWeight = json.fontWeight
      if (json.alignment) htmlEl.style.textAlign = json.alignment

      if (json.effects) {
        if (json.effects.uppercase) htmlEl.style.textTransform = 'uppercase'
        if (json.effects.letterSpacing) htmlEl.style.letterSpacing = json.effects.letterSpacing
        if (json.effects.gradient) {
          htmlEl.style.background = 'linear-gradient(135deg, #14EAEA 0%, #F813BE 100%)'
          htmlEl.style.webkitBackgroundClip = 'text'
          ;(htmlEl.style as unknown as Record<string, string>).webkitTextFillColor = 'transparent'
          htmlEl.style.backgroundClip = 'text'
        } else if (json.color) {
          htmlEl.style.color = json.color
        }
        if (json.effects.glow) {
          htmlEl.style.textShadow = '0 0 10px rgba(20, 234, 234, 0.6), 0 0 20px rgba(20, 234, 234, 0.4), 0 0 40px rgba(20, 234, 234, 0.2)'
        }
        if (json.effects.highlight) {
          htmlEl.classList.add('editable-text-highlight')
        }
      } else if (json.color) {
        htmlEl.style.color = json.color
      }
    })
  }, [getJsonContent])

  useEffect(() => {
    const timer = setTimeout(applyStoredStyles, 100)
    return () => clearTimeout(timer)
  }, [applyStoredStyles])

  const updateImageOverlays = useCallback(() => {
    if (!editMode) { setImageOverlays([]); return }
    const imgEls = document.querySelectorAll('img[data-block], [data-type="image"][data-block], [data-type="background"][data-block]')
    const overlays: ImgOverlay[] = []
    imgEls.forEach(el => {
      if (el.closest('nav') || el.closest('[data-admin]') || el.closest('[data-editor-toolbar]')) return
      const htmlEl = el as HTMLElement
      const rect = htmlEl.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      overlays.push({ el: htmlEl, rect, blockKey: el.getAttribute('data-block')!, pageSl: el.getAttribute('data-page') || pageSlug })
    })
    setImageOverlays(overlays)
  }, [editMode, pageSlug])

  useEffect(() => {
    const cleanup = () => {
      listenersRef.current.forEach(({ el, type, handler }) => el.removeEventListener(type, handler))
      listenersRef.current = []
      document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        if (el.closest('[data-admin]') || el.closest('[data-editor-toolbar]')) return
        el.removeAttribute('contenteditable')
      })
      document.body.classList.remove('inline-edit-mode')
      originalContents.current.clear()
      cancelAnimationFrame(rafRef.current)
    }

    if (!editMode) { cleanup(); setImageOverlays([]); return cleanup }

    document.body.classList.add('inline-edit-mode')

    const textElements = document.querySelectorAll('[data-block]:not(img):not([data-type="image"]):not([data-type="background"])')
    textElements.forEach(el => {
      if (el.closest('nav') || el.closest('[data-admin]') || el.closest('[data-editor-toolbar]')) return
      el.setAttribute('contenteditable', 'true')
      originalContents.current.set(el, el.textContent || '')

      const clickHandler = (e: Event) => {
        e.stopPropagation()
        e.preventDefault()
        const htmlEl = el as HTMLElement
        const rect = htmlEl.getBoundingClientRect()
        const blockKey = el.getAttribute('data-block')!
        const page = el.getAttribute('data-page') || pageSlug
        const json = getJsonContent(blockKey) as TextProps | null
        selectElement({
          type: 'text', pageSlug: page, blockKey, rect, element: htmlEl,
          data: { text: htmlEl.textContent || '', fontSize: json?.fontSize || '', fontWeight: json?.fontWeight || '', color: json?.color || '', alignment: json?.alignment || '', effects: json?.effects || undefined },
        })
      }

      const blurHandler = async () => {
        const newText = (el as HTMLElement).textContent || ''
        const originalText = originalContents.current.get(el) || ''
        if (newText !== originalText) {
          const blockKey = el.getAttribute('data-block')!
          const page = el.getAttribute('data-page') || pageSlug
          const result = await saveBlock(page, blockKey, 'TEXT', newText)
          if (result.ok) {
            originalContents.current.set(el, newText)
            setShowSaveToast(true)
            setTimeout(() => setShowSaveToast(false), 2000)
            fetch('/api/clear-cache', { method: 'POST' }).catch(() => {})
          } else {
            console.error(`Auto-save failed for ${blockKey}:`, result.error)
          }
        }
      }

      el.addEventListener('click', clickHandler)
      el.addEventListener('blur', blurHandler)
      listenersRef.current.push({ el, type: 'click', handler: clickHandler as EventListener })
      listenersRef.current.push({ el, type: 'blur', handler: blurHandler as EventListener })
    })

    // Also make text elements WITHOUT data-block editable (ephemeral)
    document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main h5, main h6, main span, main li, main label').forEach(el => {
      if (el.closest('nav') || el.closest('[data-admin]') || el.closest('[data-editor-toolbar]')) return
      if (el.hasAttribute('data-block') || el.querySelector('[data-block]') || el.closest('[contenteditable="true"]')) return
      el.setAttribute('contenteditable', 'true')
    })

    // In edit mode, prevent all link/button navigation so text can be edited
    const preventNavigation = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-admin]') || target.closest('[data-editor-toolbar]') || target.closest('nav')) return
      const link = target.closest('a')
      if (link) { e.preventDefault(); e.stopPropagation() }
    }
    document.addEventListener('click', preventNavigation, true)

    updateImageOverlays()
    const onScrollResize = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(updateImageOverlays) }
    window.addEventListener('scroll', onScrollResize, { passive: true })
    window.addEventListener('resize', onScrollResize)
    return () => { cleanup(); document.removeEventListener('click', preventNavigation, true); window.removeEventListener('scroll', onScrollResize); window.removeEventListener('resize', onScrollResize) }
  }, [editMode, selectElement, saveBlock, pageSlug, getJsonContent, updateImageOverlays])

  const handleImageClick = useCallback((overlay: ImgOverlay) => {
    const { el, blockKey, pageSl } = overlay
    const rect = el.getBoundingClientRect()
    const isBg = el.getAttribute('data-type') === 'background'
    const json = getJsonContent(blockKey)
    const imgEl = el.tagName === 'IMG' ? el as HTMLImageElement : el.querySelector('img')

    if (isBg) {
      const bgJson = json as BackgroundProps | null
      selectElement({ type: 'background', pageSlug: pageSl, blockKey, rect, element: el, data: { src: imgEl?.src || bgJson?.src || '', objectPosition: bgJson?.objectPosition || 'center', overlayOpacity: bgJson?.overlayOpacity ?? 0.55, backgroundSize: bgJson?.backgroundSize || 'cover' } })
    } else {
      const imgJson = json as ImageProps | null
      selectElement({ type: 'image', pageSlug: pageSl, blockKey, rect, element: el, data: { src: imgEl?.src || imgJson?.src || '', objectPosition: imgJson?.objectPosition || 'center', zoom: imgJson?.zoom || 1 } })
    }
  }, [selectElement, getJsonContent])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <SaveToast show={showSaveToast} />
      {mounted && editMode && imageOverlays.length > 0 && createPortal(
        <div className="pointer-events-none fixed inset-0 z-[9990]">
          {imageOverlays.map((overlay, i) => {
            const isBgOverlay = overlay.el.getAttribute('data-type') === 'background'
            return (
              <div
                key={`${overlay.blockKey}-${i}`}
                className={`absolute group ${isBgOverlay ? 'pointer-events-none' : 'pointer-events-auto'}`}
                style={{ top: overlay.rect.top, left: overlay.rect.left, width: overlay.rect.width, height: overlay.rect.height }}
              >
                {!isBgOverlay && <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg pointer-events-none" />}
                <button
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleImageClick(overlay) }}
                  className={`pointer-events-auto absolute flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 shadow-lg transition-opacity duration-300 ${isBgOverlay ? 'top-3 right-3 px-3 py-1.5 opacity-70 hover:opacity-100' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 opacity-0 group-hover:opacity-100'}`}
                >
                  <Camera size={14} className="text-[#14EAEA]" />
                  <span className="font-urbanist text-xs font-semibold text-white/90">
                    {isBgOverlay ? 'Edit Background' : 'Edit Image'}
                  </span>
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </>
  )
}

/* ── Editor Overlay ──────────────────────────────────────── */
function EditorOverlay() {
  const { isAdmin, editMode, setEditMode, selectedElement, selectElement } = useEditor()

  useEffect(() => {
    if (!editMode) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (selectedElement) selectElement(null); else setEditMode(false) } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editMode, selectedElement, selectElement, setEditMode])

  useEffect(() => {
    if (!editMode || !selectedElement) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-editor-toolbar]') || target.closest('[data-block]') || target.closest('[contenteditable="true"]')) return
      selectElement(null)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [editMode, selectedElement, selectElement])

  if (!isAdmin) return null

  return (
    <>
      <button
        onClick={() => { setEditMode(!editMode); if (editMode) selectElement(null) }}
        className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full font-urbanist font-bold text-sm shadow-lg transition-all duration-300 ${editMode ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3]' : 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-white'}`}
      >
        {editMode ? <X size={16} /> : <Pencil size={16} />}
        {editMode ? 'Exit Edit Mode' : 'Edit Page'}
      </button>
      {editMode && selectedElement && <EditorToolbar />}
      {editMode && <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33] z-[9998]" />}
    </>
  )
}

/* ── Main Export ──────────────────────────────────────────── */
export default function VisualEditor({
  children, pageSlug, initialContent, initialJsonContent,
}: {
  children: ReactNode
  pageSlug: string
  initialContent?: Record<string, string>
  initialJsonContent?: Record<string, unknown>
}) {
  return (
    <EditorProvider pageSlug={pageSlug} initialContent={initialContent} initialJsonContent={initialJsonContent}>
      {children}
      <InlineEditScanner />
      <EditorOverlay />
    </EditorProvider>
  )
}
