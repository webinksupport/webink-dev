'use client'
import { type ReactNode, useEffect } from 'react'
import { EditorProvider, useEditor } from './EditorContext'
import { EditorToolbar } from './EditorToolbar'
import { Pencil, X } from 'lucide-react'

function EditorOverlay() {
  const { isAdmin, editMode, setEditMode, selectedElement, selectElement } = useEditor()

  // Close toolbar on Escape
  useEffect(() => {
    if (!editMode) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedElement) {
          selectElement(null)
        } else {
          setEditMode(false)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editMode, selectedElement, selectElement, setEditMode])

  // Click outside to deselect
  useEffect(() => {
    if (!editMode || !selectedElement) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-editor-toolbar]') || target.closest('[data-editable]')) return
      selectElement(null)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [editMode, selectedElement, selectElement])

  if (!isAdmin) return null

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => {
          setEditMode(!editMode)
          if (editMode) selectElement(null)
        }}
        className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-full font-urbanist font-bold text-sm shadow-lg transition-all duration-300 ${
          editMode
            ? 'bg-[#F813BE] text-white hover:bg-[#d10fa3]'
            : 'bg-[#14EAEA] text-[#0A0A0A] hover:bg-white'
        }`}
      >
        {editMode ? <X size={16} /> : <Pencil size={16} />}
        {editMode ? 'Exit Edit Mode' : 'Edit Page'}
      </button>

      {/* Toolbar */}
      {editMode && selectedElement && <EditorToolbar />}

      {/* Edit mode indicator */}
      {editMode && (
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#14EAEA] via-[#F813BE] to-[#B9FF33] z-[9998]" />
      )}
    </>
  )
}

export default function VisualEditor({ children, pageSlug }: { children: ReactNode; pageSlug: string }) {
  return (
    <EditorProvider pageSlug={pageSlug}>
      {children}
      <EditorOverlay />
    </EditorProvider>
  )
}
