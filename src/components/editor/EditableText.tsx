'use client'
import { useRef, useCallback, useMemo, type ReactNode, type ElementType } from 'react'
import { useEditor, type TextProps } from './EditorContext'

interface EditableTextProps {
  /** The tag to render (h1, h2, p, span, etc.) */
  as?: ElementType
  /** Page slug for content save (optional — falls back to context pageSlug) */
  pageSlug?: string
  /** Block key for content save */
  blockKey: string
  /** Current text value (explicit override) */
  value?: string
  /** Fallback if no CMS value */
  defaultValue: string
  /** Additional className */
  className?: string
  /** Style overrides */
  style?: React.CSSProperties
  /** Render children normally when not in edit mode */
  children?: ReactNode
  /** Current font size (for toolbar display) */
  fontSize?: string
  /** Current font weight */
  fontWeight?: string
  /** Current text color */
  color?: string
  /** Current alignment */
  alignment?: string
  /** Dangerously set inner HTML (for rich text) */
  dangerouslySetInnerHTML?: { __html: string }
}

export default function EditableText({
  as: Tag = 'p',
  pageSlug: explicitPageSlug,
  blockKey,
  value: explicitValue,
  defaultValue,
  className = '',
  style,
  children,
  fontSize,
  fontWeight,
  color,
  alignment,
  dangerouslySetInnerHTML,
}: EditableTextProps) {
  const { editMode, selectElement, pageSlug: contextPageSlug, getContent, getJsonContent } = useEditor()
  const ref = useRef<HTMLElement>(null)

  const pageSlug = explicitPageSlug || contextPageSlug
  // Resolve value: DB content > explicit prop > defaultValue (DB wins after saves)
  const dbValue = getContent(blockKey)
  const resolvedValue = dbValue !== undefined ? dbValue : (explicitValue !== undefined ? explicitValue : defaultValue)

  // Resolve saved styles from JSON content
  const dbJson = getJsonContent(blockKey) as {
    fontSize?: string
    fontWeight?: string
    color?: string
    alignment?: string
    effects?: {
      highlight?: boolean
      gradient?: boolean
      glow?: boolean
      uppercase?: boolean
      letterSpacing?: string
    }
  } | undefined

  const resolvedFontSize = dbJson?.fontSize || fontSize
  const resolvedFontWeight = dbJson?.fontWeight || fontWeight
  const resolvedColor = dbJson?.color || color
  const resolvedAlignment = dbJson?.alignment || alignment
  const effects = dbJson?.effects

  // Build applied styles from saved properties + effects
  const appliedStyle = useMemo((): React.CSSProperties => {
    const s: React.CSSProperties = { ...style }

    if (resolvedFontSize) s.fontSize = resolvedFontSize
    if (resolvedFontWeight) s.fontWeight = resolvedFontWeight
    if (resolvedColor && !effects?.gradient) s.color = resolvedColor
    if (resolvedAlignment) s.textAlign = resolvedAlignment as React.CSSProperties['textAlign']

    if (effects) {
      if (effects.uppercase) s.textTransform = 'uppercase'
      if (effects.letterSpacing) s.letterSpacing = effects.letterSpacing
      if (effects.gradient) {
        s.background = 'linear-gradient(135deg, #14EAEA 0%, #F813BE 100%)'
        s.WebkitBackgroundClip = 'text'
        s.WebkitTextFillColor = 'transparent'
        s.backgroundClip = 'text'
      }
      if (effects.glow) {
        s.textShadow = '0 0 10px rgba(20, 234, 234, 0.6), 0 0 20px rgba(20, 234, 234, 0.4), 0 0 40px rgba(20, 234, 234, 0.2)'
      }
    }

    return s
  }, [style, resolvedFontSize, resolvedFontWeight, resolvedColor, resolvedAlignment, effects])

  // Build className with highlight effect
  const appliedClassName = useMemo(() => {
    let cls = className
    if (effects?.highlight) {
      cls += ' editable-text-highlight'
    }
    return cls
  }, [className, effects])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const textData: TextProps = {
      text: resolvedValue,
      fontSize: resolvedFontSize || '',
      fontWeight: resolvedFontWeight || '',
      color: resolvedColor || '',
      alignment: resolvedAlignment || '',
      effects: effects || undefined,
    }

    selectElement({
      type: 'text',
      pageSlug,
      blockKey,
      rect,
      element: el,
      data: textData,
    })
  }, [editMode, selectElement, pageSlug, blockKey, resolvedValue, resolvedFontSize, resolvedFontWeight, resolvedColor, resolvedAlignment, effects])

  // Use inline styles for edit mode to avoid Tailwind JIT compilation issues with arbitrary values
  const editStyle: React.CSSProperties = editMode
    ? { cursor: 'pointer', position: 'relative', ...appliedStyle }
    : { ...appliedStyle }

  const editModeClass = editMode ? 'editable-text-active' : ''

  if (dangerouslySetInnerHTML) {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={`${appliedClassName} ${editModeClass}`}
        style={editStyle}
        onClick={handleClick}
        data-editable="text"
        data-block-key={blockKey}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    )
  }

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`${appliedClassName} ${editModeClass}`}
      style={editStyle}
      onClick={handleClick}
      data-editable="text"
      data-block-key={blockKey}
    >
      {children ?? resolvedValue}
    </Tag>
  )
}
