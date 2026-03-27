'use client'
import { useRef, useCallback } from 'react'
import Image, { type ImageProps } from 'next/image'
import { useEditor, type ImageProps as EditorImageProps } from './EditorContext'

interface EditableImageProps extends Omit<ImageProps, 'onClick'> {
  /** Page slug for content save (optional — falls back to context pageSlug) */
  pageSlug?: string
  blockKey: string
  /** Override object-position from CMS */
  cmsObjectPosition?: string
  /** Override zoom from CMS */
  cmsZoom?: number
  /** Override src from CMS */
  cmsSrc?: string
}

export default function EditableImage({
  pageSlug: explicitPageSlug,
  blockKey,
  cmsObjectPosition,
  cmsZoom,
  cmsSrc,
  src,
  style,
  className,
  ...rest
}: EditableImageProps) {
  const { editMode, selectElement, pageSlug: contextPageSlug, getContent, getJsonContent } = useEditor()
  const imgRef = useRef<HTMLImageElement>(null)

  const pageSlug = explicitPageSlug || contextPageSlug

  // Resolve from DB content if available
  const dbValue = getContent(blockKey)
  const dbJson = getJsonContent(blockKey) as { src?: string; objectPosition?: string; zoom?: number } | undefined

  const resolvedSrc = cmsSrc || dbJson?.src || dbValue || src
  const resolvedPosition = cmsObjectPosition || dbJson?.objectPosition || (style?.objectPosition as string) || 'center'
  const resolvedZoom = cmsZoom || dbJson?.zoom || 1

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return
    e.stopPropagation()

    const el = imgRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const imageData: EditorImageProps = {
      src: typeof resolvedSrc === 'string' ? resolvedSrc : '',
      objectPosition: resolvedPosition,
      zoom: resolvedZoom,
    }

    selectElement({
      type: 'image',
      pageSlug,
      blockKey,
      rect,
      element: el,
      data: imageData,
    })
  }, [editMode, selectElement, pageSlug, blockKey, resolvedSrc, resolvedPosition, resolvedZoom])

  const editModeStyles = editMode
    ? { cursor: 'pointer' as const }
    : {}

  return (
    <Image
      {...rest}
      ref={imgRef}
      src={resolvedSrc}
      className={`${className || ''} ${editMode ? 'editable-image-active' : ''}`}
      style={{
        ...style,
        ...editModeStyles,
        objectPosition: resolvedPosition,
        transform: resolvedZoom !== 1 ? `scale(${resolvedZoom})` : undefined,
      }}
      onClick={handleClick}
      data-editable="image"
      data-block-key={blockKey}
    />
  )
}
