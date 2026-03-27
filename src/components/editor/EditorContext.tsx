'use client'
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export type ElementType = 'text' | 'image'

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

export interface SelectedElement {
  type: ElementType
  pageSlug: string
  blockKey: string
  rect: DOMRect
  element: HTMLElement
  data: TextProps | ImageProps
}

interface EditorContextType {
  isAdmin: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
  selectedElement: SelectedElement | null
  selectElement: (el: SelectedElement | null) => void
  saveBlock: (pageSlug: string, blockKey: string, blockType: string, value: string, jsonValue?: unknown) => Promise<boolean>
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
  saveBlock: async () => false,
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

  // Fetch content from API if not provided via SSR
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
          textMap[block.blockKey] = block.value
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
  ): Promise<boolean> => {
    setSaving(true)
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        credentials: 'include',
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
        // Update local content cache so the page reflects changes immediately
        setContent(prev => ({ ...prev, [blockKey]: value }))
        if (jsonValue !== undefined) {
          setJsonContent(prev => ({ ...prev, [blockKey]: jsonValue }))
        }
      }
      return res.ok
    } catch {
      return false
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
