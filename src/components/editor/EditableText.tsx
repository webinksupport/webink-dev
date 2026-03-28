'use client'
import { useRef, useCallback, type ReactNode, type ElementType } from 'react'
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
  const { editMode, selectElement, pageSlug: contextPageSlug, getContent } = useEditor()
  const ref = useRef<HTMLElement>(null)

  const pageSlug = explicitPageSlug || contextPageSlug
  // Resolve value: DB content > explicit prop > defaultValue (DB wins after saves)
  const dbValue = getContent(blockKey)
  const resolvedValue = dbValue !== undefined ? dbValue : (explicitValue !== undefined ? explicitValue : defaultValue)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const textData: TextProps = {
      text: resolvedValue,
      fontSize: fontSize || '',
      fontWeight: fontWeight || '',
      color: color || '',
      alignment: alignment || '',
    }

    selectElement({
      type: 'text',
      pageSlug,
      blockKey,
      rect,
      element: el,
      data: textData,
    })
  }, [editMode, selectElement, pageSlug, blockKey, resolvedValue, fontSize, fontWeight, color, alignment])

  // Use inline styles for edit mode to avoid Tailwind JIT compilation issues with arbitrary values
  const editStyle: React.CSSProperties = editMode
    ? { cursor: 'pointer', position: 'relative', ...style }
    : { ...style }

  const editModeClass = editMode ? 'editable-text-active' : ''

  if (dangerouslySetInnerHTML) {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={`${className} ${editModeClass}`}
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
      className={`${className} ${editModeClass}`}
      style={editStyle}
      onClick={handleClick}
      data-editable="text"
      data-block-key={blockKey}
    >
      {children ?? resolvedValue}
    </Tag>
  )
}
