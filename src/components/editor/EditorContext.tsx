'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
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
}

const EditorContext = createContext<EditorContextType>({
  isAdmin: false,
  editMode: false,
  setEditMode: () => {},
  selectedElement: null,
  selectElement: () => {},
  saveBlock: async () => false,
  saving: false,
})

export function useEditor() {
  return useContext(EditorContext)
}

export function EditorProvider({ children, pageSlug }: { children: ReactNode; pageSlug: string }) {
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  const [editMode, setEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [saving, setSaving] = useState(false)

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
      return res.ok
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  // Suppress unused var — pageSlug is available for future use
  void pageSlug

  return (
    <EditorContext.Provider value={{
      isAdmin,
      editMode,
      setEditMode,
      selectedElement,
      selectElement,
      saveBlock,
      saving,
    }}>
      {children}
    </EditorContext.Provider>
  )
}
