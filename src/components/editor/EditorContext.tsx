'use client'
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export type ElementType = 'text' | 'image' | 'background'

export interface SaveResult {
  ok: boolean
  error?: string
}

export interface TextProps {
  text: string
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
}

export interface ImageProps {
  src: string
  objectPosition?: string
  zoom?: number
}

export interface BackgroundProps {
  src: string
  objectPosition?: string
  overlayOpacity?: number
  backgroundSize?: string
}

export interface SelectedElement {
  type: ElementType
  pageSlug: string
  blockKey: string
  rect: DOMRect
  element: HTMLElement
  data: TextProps | ImageProps | BackgroundProps
}

interface EditorContextType {
  isAdmin: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
  selectedElement: SelectedElement | null
  selectElement: (el: SelectedElement | null) => void
  saveBlock: (pageSlug: string, blockKey: string, blockType: string, value: string, jsonValue?: unknown) => Promise<SaveResult>
  saving: boolean
  pageSlug: string
  getContent: (blockKey: string) => string | undefined
  getJsonContent: (blockKey: string) => unknown | undefined
}

const EditorContext = createContext<EditorContextType>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
  selectedElement: null,
  selectElement: () => {},
  saveBlock: async () => ({ ok: false }),
  saving: false,
  pageSlug: '',
  getContent: () => undefined,
  getJsonContent: () => undefined,
})

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({
  children,
  pageSlug,
  initialContent,
  initialJsonContent,
}: {
  children: ReactNode
  pageSlug: string
  initialContent?: Record<string, string>
  initialJsonContent?: Record<string, unknown>
}) {
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  const [editMode, setEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<Record<string, string>>(initialContent || {})
  const [jsonContent, setJsonContent] = useState<Record<string, unknown>>(initialJsonContent || {})
  const [fetched, setFetched] = useState(!!initialContent)

  useEffect(() => {
    if (fetched) return
    setFetched(true)
    fetch(`/api/content/${encodeURIComponent(pageSlug)}`)
      .then(res => res.json())
      .then((blocks: Array<{ blockKey: string; value: string; jsonValue?: unknown }>) => {
        if (!Array.isArray(blocks)) return
        const textMap: Record<string, string> = {}
        const jsonMap: Record<string, unknown> = {}
        for (const block of blocks) {
          // Ensure value is always a plain string — never an object
          if (typeof block.value === 'string') {
            textMap[block.blockKey] = block.value
          } else if (block.value && typeof block.value === 'object') {
            const obj = block.value as Record<string, unknown>
            textMap[block.blockKey] = (typeof obj.text === 'string' ? obj.text : typeof obj.src === 'string' ? obj.src : '')
          } else {
            textMap[block.blockKey] = String(block.value ?? '')
          }
          if (block.jsonValue !== null && block.jsonValue !== undefined) {
            jsonMap[block.blockKey] = block.jsonValue
          }
        }
        setContent(textMap)
        setJsonContent(jsonMap)
      })
      .catch(() => {})
  }, [pageSlug, fetched])

  const getContent = useCallback((blockKey: string) => {
    return content[blockKey]
  }, [content])

  const getJsonContent = useCallback((blockKey: string) => {
    return jsonContent[blockKey]
  }, [jsonContent])

  const selectElement = useCallback((el: SelectedElement | null) => {
    setSelectedElement(el)
  }, [])

  const saveBlock = useCallback(async (
    slug: string,
    blockKey: string,
    blockType: string,
    value: string,
    jsonValue?: unknown,
  ): Promise<SaveResult> => {
    setSaving(true)
    try {
      if (typeof value !== 'string') {
        console.error(`saveBlock: value for ${blockKey} is not a string:`, value)
        return { ok: false, error: 'Value must be a string' }
      }

      const res = await fetch(`/api/content/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [{
            blockKey,
            blockType,
            value,
            ...(jsonValue !== undefined ? { jsonValue } : {}),
          }],
        }),
      })

      if (res.ok) {
        setContent(prev => ({ ...prev, [blockKey]: value }))
        if (jsonValue !== undefined) {
          setJsonContent(prev => ({ ...prev, [blockKey]: jsonValue }))
        }
        return { ok: true }
      } else {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error(`saveBlock failed for ${blockKey}:`, res.status, data)
        return { ok: false, error: data.error || `HTTP ${res.status}` }
      }
    } catch (err) {
      console.error(`saveBlock network error for ${blockKey}:`, err)
      return { ok: false, error: 'Network error' }
    } finally {
      setSaving(false)
    }
  }, [])

  return (
    <EditorContext.Provider value={{
      isAdmin,
      editMode,
      setEditMode,
      selectedElement,
      selectElement,
      saveBlock,
      saving,
      pageSlug,
      getContent,
      getJsonContent,
    }}>
      {children}
    </EditorContext.Provider>
  )
}
