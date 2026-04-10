'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Link as LinkIcon,
  Pencil,
} from 'lucide-react'

interface MenuItem {
  id?: string
  label: string
  url: string
  order: number
  children: MenuItem[]
}

interface PageRoute {
  path: string
  title: string
}

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [availablePages, setAvailablePages] = useState<PageRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Fetch menu and pages
  useEffect(() => {
    Promise.all([
      fetch('/api/menu/primary').then((r) => r.json()),
      fetch('/api/pages').then((r) => r.json()),
    ])
      .then(([menuData, pagesData]) => {
        const items: MenuItem[] = (menuData || []).map((item: MenuItem & { children?: MenuItem[] }) => ({
          label: item.label,
          url: item.url,
          order: item.order,
          children: (item.children || []).map((c: MenuItem) => ({
            label: c.label,
            url: c.url,
            order: c.order,
            children: [],
          })),
        }))
        setMenuItems(items)
        setAvailablePages(pagesData || [])
      })
      .catch(() => showToast('Failed to load menu data', 'error'))
      .finally(() => setLoading(false))
  }, [showToast])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/menu/primary', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: menuItems }),
      })
      if (!res.ok) throw new Error('Save failed')
      showToast('Menu saved successfully', 'success')
    } catch {
      showToast('Failed to save menu', 'error')
    } finally {
      setSaving(false)
    }
  }

  const addPage = (page: PageRoute) => {
    setMenuItems((prev) => [
      ...prev,
      { label: page.title, url: page.path, order: prev.length, children: [] },
    ])
  }

  const addCustomLink = () => {
    setMenuItems((prev) => [
      ...prev,
      { label: 'Custom Link', url: '/', order: prev.length, children: [] },
    ])
  }

  const removeItem = (index: number) => {
    setMenuItems((prev) => prev.filter((_, i) => i !== index))
  }

  const removeChild = (parentIndex: number, childIndex: number) => {
    setMenuItems((prev) =>
      prev.map((item, i) =>
        i === parentIndex
          ? { ...item, children: item.children.filter((_, ci) => ci !== childIndex) }
          : item
      )
    )
  }

  const updateItem = (index: number, field: 'label' | 'url', value: string) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const updateChild = (parentIndex: number, childIndex: number, field: 'label' | 'url', value: string) => {
    setMenuItems((prev) =>
      prev.map((item, pi) =>
        pi === parentIndex
          ? {
              ...item,
              children: item.children.map((child, ci) =>
                ci === childIndex ? { ...child, [field]: value } : child
              ),
            }
          : item
      )
    )
  }

  const indentItem = (index: number) => {
    if (index === 0) return
    const item = menuItems[index]
    const parentIndex = index - 1
    setMenuItems((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      next[parentIndex] = {
        ...next[parentIndex],
        children: [...next[parentIndex].children, { ...item, children: [] }],
      }
      return next
    })
    setExpandedItems((prev) => new Set(prev).add(parentIndex))
  }

  const moveItem = (from: number, to: number) => {
    if (from === to) return
    setMenuItems((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[#F813BE] text-xs font-bold tracking-[3px] uppercase mb-2">
            Content
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Menu Manager</h1>
          <p className="text-[#999] text-sm mt-1">
            Drag to reorder. Indent items to create dropdowns.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Menu
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Menu structure (right on desktop, first on mobile) */}
        <div className="order-2 lg:order-1">
          <div className="bg-[#0A0A0A] border border-[#333] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#333]">
              <h2 className="text-white font-bold text-sm">Menu Structure</h2>
              <span className="text-[#666] text-xs">{menuItems.length} items</span>
            </div>

            <div className="p-4 space-y-1 min-h-[200px]">
              {menuItems.length === 0 && (
                <div className="text-center py-12 text-[#555]">
                  <LinkIcon className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No menu items yet.</p>
                  <p className="text-xs mt-1">Add pages from the panel to get started.</p>
                </div>
              )}

              {menuItems.map((item, index) => {
                const isExpanded = expandedItems.has(index)
                const isEditing = editingId === `${index}`
                return (
                  <div key={`${item.url}-${index}`}>
                    {/* Parent item */}
                    <div
                      draggable
                      onDragStart={() => setDragIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex !== null) moveItem(dragIndex, index)
                        setDragIndex(null)
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all group ${
                        dragIndex === index
                          ? 'border-[#14EAEA] bg-[#14EAEA]/5'
                          : 'border-[#333] hover:border-[#555] bg-[#1A1A1A]'
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-[#555] cursor-grab shrink-0" />

                      {item.children.length > 0 && (
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="p-0.5 text-[#666] hover:text-white transition-colors shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}

                      {isEditing ? (
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => updateItem(index, 'label', e.target.value)}
                            className="flex-1 bg-[#0A0A0A] border border-[#333] rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#14EAEA] min-w-0"
                            placeholder="Label"
                          />
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => updateItem(index, 'url', e.target.value)}
                            className="flex-1 bg-[#0A0A0A] border border-[#333] rounded px-2 py-1 text-white/60 text-sm font-mono focus:outline-none focus:border-[#14EAEA] min-w-0"
                            placeholder="/path"
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-[#14EAEA] text-xs font-bold px-2 shrink-0"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-white text-sm font-medium truncate flex-1 min-w-0">
                            {item.label}
                          </span>
                          <span className="text-[#666] text-xs font-mono truncate hidden sm:block max-w-[180px]">
                            {item.url}
                          </span>
                        </>
                      )}

                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingId(isEditing ? null : `${index}`)}
                          className="p-1 rounded hover:bg-white/10 text-[#666] hover:text-[#14EAEA] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {index > 0 && (
                          <button
                            onClick={() => indentItem(index)}
                            className="p-1 rounded hover:bg-white/10 text-[#666] hover:text-[#F813BE] transition-colors"
                            title="Make sub-item"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 rounded hover:bg-red-500/20 text-[#666] hover:text-red-400 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    {isExpanded && item.children.length > 0 && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child, childIndex) => {
                          const childEditId = `${index}-${childIndex}`
                          const isChildEditing = editingId === childEditId
                          return (
                            <div
                              key={`${child.url}-${childIndex}`}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#222] hover:border-[#444] bg-[#111] group"
                            >
                              <div className="w-4 h-[1px] bg-[#333] shrink-0" />

                              {isChildEditing ? (
                                <div className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
                                  <input
                                    type="text"
                                    value={child.label}
                                    onChange={(e) => updateChild(index, childIndex, 'label', e.target.value)}
                                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-[#14EAEA] min-w-0"
                                  />
                                  <input
                                    type="text"
                                    value={child.url}
                                    onChange={(e) => updateChild(index, childIndex, 'url', e.target.value)}
                                    className="flex-1 bg-[#0A0A0A] border border-[#333] rounded px-2 py-1 text-white/60 text-sm font-mono focus:outline-none focus:border-[#14EAEA] min-w-0"
                                  />
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-[#14EAEA] text-xs font-bold px-2 shrink-0"
                                  >
                                    Done
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-white/70 text-sm truncate flex-1 min-w-0">
                                    {child.label}
                                  </span>
                                  <span className="text-[#555] text-xs font-mono truncate hidden sm:block max-w-[140px]">
                                    {child.url}
                                  </span>
                                </>
                              )}

                              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingId(isChildEditing ? null : childEditId)}
                                  className="p-1 rounded hover:bg-white/10 text-[#555] hover:text-[#14EAEA] transition-colors"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeChild(index, childIndex)}
                                  className="p-1 rounded hover:bg-red-500/20 text-[#555] hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Add custom link */}
            <div className="px-4 py-3 border-t border-[#333]">
              <button
                onClick={addCustomLink}
                className="flex items-center gap-2 text-sm text-[#14EAEA] hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Custom Link
              </button>
            </div>
          </div>
        </div>

        {/* Add to Menu panel (left on mobile) */}
        <div className="order-1 lg:order-2">
          <div className="bg-[#0A0A0A] border border-[#333] rounded-2xl overflow-hidden sticky top-24">
            <div className="px-5 py-4 border-b border-[#333]">
              <h2 className="text-white font-bold text-sm">Add to Menu</h2>
              <p className="text-[#666] text-xs mt-1">Click a page to add it</p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-0.5">
              {availablePages.map((page) => {
                const alreadyAdded = menuItems.some((m) => m.url === page.path)
                return (
                  <button
                    key={page.path}
                    onClick={() => !alreadyAdded && addPage(page)}
                    disabled={alreadyAdded}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      alreadyAdded
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-[#1A1A1A] cursor-pointer'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">
                        {page.title}
                      </p>
                      <p className="text-[#555] text-xs font-mono truncate">
                        {page.path}
                      </p>
                    </div>
                    {alreadyAdded ? (
                      <Check className="w-3.5 h-3.5 text-[#14EAEA] shrink-0" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#666] shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg ${
            toast.type === 'success'
              ? 'bg-[#14EAEA] text-[#0A0A0A]'
              : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
