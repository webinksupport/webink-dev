'use client'
import { useRef, useCallback, type ReactNode, type ElementType } from 'react'
import { useEditor, type TextProps } from './EditorContext'

interface EditableTextProps {
  /** The tag to render (h1, h2, p, span, etc.) */
  as?: ElementType
  /** Page slug for content save */
  pageSlug: string
  /** Block key for content save */
  blockKey: string
  /** Current text value */
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
  pageSlug,
  blockKey,
  value,
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
  const { editMode, selectElement } = useEditor()
  const ref = useRef<HTMLElement>(null)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()

    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const textData: TextProps = {
      text: value || defaultValue,
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
  }, [editMode, selectElement, pageSlug, blockKey, value, defaultValue, fontSize, fontWeight, color, alignment])

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
      {children ?? (value || defaultValue)}
    </Tag>
  )
}
