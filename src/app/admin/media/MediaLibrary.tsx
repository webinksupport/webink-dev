'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload,
  Search,
  Copy,
  Trash2,
  X,
  ImageIcon,
  Grid3X3,
  List,
  Check,
  Loader2,
  ExternalLink,
  Pencil,
  ChevronDown,
  FileImage,
  AlertCircle,
} from 'lucide-react'

interface MediaFile {
  id?: string
  name: string
  path: string
  size: number
  width?: number | null
  height?: number | null
  mimeType: string
  altText?: string | null
  modified: string
  source: 'uploads' | 'images'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ───────── Upload Progress Item ─────────
function UploadProgressItem({
  name,
  progress,
  error,
}: {
  name: string
  progress: number
  error?: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <FileImage className="w-4 h-4 text-white/40 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white/70 truncate">{name}</p>
        {error ? (
          <p className="text-red-400 text-xs">{error}</p>
        ) : (
          <div className="w-full bg-[#333] rounded-full h-1.5 mt-1">
            <div
              className="bg-[#14EAEA] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {progress === 100 && !error && (
        <Check className="w-4 h-4 text-[#14EAEA] shrink-0" />
      )}
    </div>
  )
}

// ───────── Detail Panel ─────────
function DetailPanel({
  file,
  onClose,
  onDelete,
  onUpdate,
  showToast,
}: {
  file: MediaFile
  onClose: () => void
  onDelete: (f: MediaFile) => void
  onUpdate: () => void
  showToast: (msg: string, type: 'success' | 'error') => void
}) {
  const [altText, setAltText] = useState(file.altText || '')
  const [filename, setFilename] = useState(file.name)
  const [editingName, setEditingName] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setAltText(file.altText || '')
    setFilename(file.name)
    setEditingName(false)
  }, [file])

  const handleSave = async () => {
    setSaving(true)
    try {
      const body: Record<string, string> = { filepath: file.path }
      if (altText !== (file.altText || '')) body.altText = altText
      if (editingName && filename !== file.name) body.newFilename = filename

      const res = await fetch('/api/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Save failed')
      showToast('Saved', 'success')
      setEditingName(false)
      onUpdate()
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(file.path)
    showToast('Copied to clipboard!', 'success')
  }

  const isUpload = file.source === 'uploads'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#111] md:rounded-2xl border-0 md:border border-white/10 max-w-3xl w-full h-full md:h-auto md:max-h-[90vh] overflow-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image preview */}
        <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center min-h-[200px] md:min-h-[300px] p-4 md:p-6 md:rounded-l-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.path}
            alt={file.altText || file.name}
            className="max-w-full max-h-[50vh] object-contain"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.style.display = 'none'
              img.parentElement?.insertAdjacentHTML('beforeend', '<div class="text-white/30 text-sm">Image not found</div>')
            }}
          />
        </div>

        {/* Info panel */}
        <div className="w-full md:w-80 p-5 space-y-4 border-t md:border-t-0 md:border-l border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Details</h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filename */}
          <div>
            <label className="text-white/40 text-xs font-bold uppercase tracking-wider block mb-1.5">
              Filename
            </label>
            {isUpload && editingName ? (
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] font-mono"
              />
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-white/70 text-sm truncate font-mono">
                  {file.name}
                </p>
                {isUpload && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white transition-colors shrink-0"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Alt text */}
          <div>
            <label className="text-white/40 text-xs font-bold uppercase tracking-wider block mb-1.5">
              Alt Text (SEO)
            </label>
            <textarea
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              rows={2}
              placeholder="Describe this image for accessibility and SEO..."
              className="w-full bg-[#0A0A0A] text-white text-sm border border-[#333] rounded-lg px-3 py-2 focus:outline-none focus:border-[#14EAEA] resize-none"
            />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                Size
              </p>
              <p className="text-white/70">{formatSize(file.size)}</p>
            </div>
            {file.width && file.height && (
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                  Dimensions
                </p>
                <p className="text-white/70">
                  {file.width} × {file.height}
                </p>
              </div>
            )}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                Type
              </p>
              <p className="text-white/70">{file.mimeType}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
                Date
              </p>
              <p className="text-white/70">{formatDate(file.modified)}</p>
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="text-white/40 text-xs font-bold uppercase tracking-wider block mb-1.5">
              URL
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-[#14EAEA] bg-[#0A0A0A] px-3 py-2 rounded-lg truncate border border-[#333]">
                {file.path}
              </code>
              <button
                onClick={copyUrl}
                className="p-2 rounded-lg hover:bg-[#14EAEA]/10 text-[#14EAEA] transition-colors shrink-0"
                title="Copy URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#14EAEA] text-[#0A0A0A] font-semibold rounded-lg text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={copyUrl}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-[#333] text-white/70 font-semibold rounded-lg text-sm hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Copy URL
            </button>

            {isUpload && (
              <button
                onClick={() => onDelete(file)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-500/10 text-red-400 font-semibold rounded-lg text-sm hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ───────── Main Media Library ─────────

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'date' | 'name' | 'size'>('date')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState<
    { name: string; progress: number; error?: string }[]
  >([])
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toastTimeout = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type })
      if (toastTimeout.current) clearTimeout(toastTimeout.current)
      toastTimeout.current = setTimeout(() => setToast(null), 3000)
    },
    []
  )

  const fetchMedia = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (sort) params.set('sort', sort)
      if (typeFilter !== 'all') params.set('type', typeFilter)
      const res = await fetch(`/api/media?${params}`)
      if (res.ok) {
        const data: MediaFile[] = await res.json()
        setFiles(data)
      }
    } catch {
      showToast('Failed to load media', 'error')
    } finally {
      setLoading(false)
    }
  }, [sort, typeFilter, showToast])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleUpload = async (fileList: FileList | File[]) => {
    const filesToUpload = Array.from(fileList)
    if (filesToUpload.length === 0) return

    const uploadItems = filesToUpload.map((f) => ({
      name: f.name,
      progress: 0,
    }))
    setUploads(uploadItems)

    const formData = new FormData()
    for (const file of filesToUpload) {
      formData.append('file', file)
    }

    // Simulate progress, then do actual upload
    const progressInterval = setInterval(() => {
      setUploads((prev) =>
        prev.map((u) =>
          u.progress < 80 ? { ...u, progress: u.progress + 10 } : u
        )
      )
    }, 200)

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (res.ok) {
        const data = await res.json()
        const results = data.results as {
          name: string
          success: boolean
          error?: string
        }[]
        setUploads(
          results.map((r) => ({
            name: r.name,
            progress: r.success ? 100 : 0,
            error: r.error,
          }))
        )
        const successCount = results.filter((r) => r.success).length
        if (successCount > 0) {
          showToast(
            `${successCount} file${successCount > 1 ? 's' : ''} uploaded`
          )
        }
        fetchMedia()
      } else {
        clearInterval(progressInterval)
        showToast('Upload failed', 'error')
        setUploads([])
      }
    } catch {
      clearInterval(progressInterval)
      showToast('Upload failed', 'error')
      setUploads([])
    }

    // Clear upload progress after 3s
    setTimeout(() => setUploads([]), 3000)
  }

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: [file.path] }),
      })
      if (res.ok) {
        showToast('File deleted')
        setSelectedFile(null)
        setSelectedPaths((prev) => {
          const next = new Set(prev)
          next.delete(file.path)
          return next
        })
        fetchMedia()
      } else {
        showToast('Failed to delete', 'error')
      }
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const handleBulkDelete = async () => {
    const deletable = Array.from(selectedPaths).filter((p) =>
      p.startsWith('/uploads/')
    )
    if (deletable.length === 0) {
      showToast('Can only delete uploaded files', 'error')
      return
    }
    if (
      !confirm(
        `Delete ${deletable.length} file${deletable.length > 1 ? 's' : ''}? This cannot be undone.`
      )
    )
      return

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: deletable }),
      })
      if (res.ok) {
        showToast(`${deletable.length} file${deletable.length > 1 ? 's' : ''} deleted`)
        setSelectedPaths(new Set())
        setSelectedFile(null)
        fetchMedia()
      }
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  const handleCheckbox = (
    file: MediaFile,
    index: number,
    shiftKey: boolean
  ) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev)
      if (shiftKey && lastSelectedIndex >= 0) {
        const start = Math.min(lastSelectedIndex, index)
        const end = Math.max(lastSelectedIndex, index)
        for (let i = start; i <= end; i++) {
          next.add(filtered[i].path)
        }
      } else if (next.has(file.path)) {
        next.delete(file.path)
      } else {
        next.add(file.path)
      }
      return next
    })
    setLastSelectedIndex(index)
  }

  // Filter by search (client-side for instant results)
  const filtered = files.filter(
    (f) =>
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.path.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 pl-10 pr-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
            />
          </div>

          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-[#1A1A1A] border border-white/10 text-white/70 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#14EAEA]/50"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as 'date' | 'name' | 'size')
              }
              className="appearance-none bg-[#1A1A1A] border border-white/10 text-white/70 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#14EAEA]/50"
            >
              <option value="date">Newest First</option>
              <option value="name">By Name</option>
              <option value="size">By Size</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/40 hover:text-white/70'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#14EAEA]/20 text-[#14EAEA]' : 'text-white/40 hover:text-white/70'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold rounded-lg text-sm hover:bg-white transition-colors whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files)
          }
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging
            ? 'border-[#14EAEA] bg-[#14EAEA]/5'
            : 'border-white/20 bg-[#1A1A1A]'
        }`}
      >
        <Upload className="w-8 h-8 text-white/30 mx-auto mb-3" />
        <p className="text-white/50 text-sm">
          Drop files here or click to upload
        </p>
        <p className="text-white/30 text-xs mt-1">
          JPG, PNG, GIF, WebP, SVG up to 10MB — multiple files supported
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUpload(e.target.files)
            }
            e.target.value = ''
          }}
          className="hidden"
        />
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 space-y-3">
          <p className="text-white/40 text-xs font-bold uppercase tracking-wider">
            Uploading
          </p>
          {uploads.map((u, i) => (
            <UploadProgressItem
              key={i}
              name={u.name}
              progress={u.progress}
              error={u.error}
            />
          ))}
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedPaths.size > 0 && (
        <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#14EAEA]/30 rounded-xl px-5 py-3">
          <span className="text-white/70 text-sm">
            {selectedPaths.size} selected
          </span>
          <button
            onClick={() => setSelectedPaths(new Set())}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Deselect all
          </button>
          <div className="flex-1" />
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-500/20 text-red-400 font-semibold rounded-lg text-sm hover:bg-red-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Selected
          </button>
        </div>
      )}

      {/* File count */}
      <p className="text-white/40 text-sm">
        {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
        {search && ` matching "${search}"`}
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#14EAEA] animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <ImageIcon className="w-12 h-12 mb-4" />
          <p className="text-lg">
            {search ? 'No files match your search' : 'No media files found'}
          </p>
        </div>
      )}

      {/* Grid view */}
      {!loading && filtered.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((file, index) => {
            const isSelected = selectedPaths.has(file.path)
            return (
              <div
                key={file.path}
                className={`group relative bg-[#1A1A1A] rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#14EAEA] ring-1 ring-[#14EAEA]/30'
                    : 'border-white/10 hover:border-[#14EAEA]/50'
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`absolute top-2 left-2 z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCheckbox(file, index, e.shiftKey)
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#14EAEA] border-[#14EAEA]'
                        : 'border-white/40 bg-black/40 hover:border-[#14EAEA]'
                    }`}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-[#0A0A0A]" />
                    )}
                  </button>
                </div>

                {/* Image */}
                <div
                  className="relative h-36 bg-[#111]"
                  onClick={() => setSelectedFile(file)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.path}
                    alt={file.altText || file.name}
                    className={`w-full h-full ${file.name.endsWith('.svg') ? 'object-contain p-4' : 'object-cover'}`}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />

                  {/* Hover overlay with filename + size */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-white/60 text-[10px]">
                      {formatSize(file.size)}
                      {file.width && file.height
                        ? ` • ${file.width}×${file.height}`
                        : ''}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-2.5">
                  <p className="text-xs text-white/60 truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {!loading && filtered.length > 0 && viewMode === 'list' && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                <th className="p-3 w-8" />
                <th className="p-3 w-12" />
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left hidden md:table-cell">Type</th>
                <th className="p-3 text-left hidden sm:table-cell">Size</th>
                <th className="p-3 text-left hidden lg:table-cell">Date</th>
                <th className="p-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, index) => {
                const isSelected = selectedPaths.has(file.path)
                return (
                  <tr
                    key={file.path}
                    className={`border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${isSelected ? 'bg-[#14EAEA]/5' : ''}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleCheckbox(file, index, e.shiftKey)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#14EAEA] border-[#14EAEA]'
                            : 'border-white/30 hover:border-[#14EAEA]'
                        }`}
                      >
                        {isSelected && (
                          <Check className="w-2.5 h-2.5 text-[#0A0A0A]" />
                        )}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="w-10 h-10 rounded bg-[#111] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.path}
                          alt={file.name}
                          className={`w-full h-full ${file.name.endsWith('.svg') ? 'object-contain p-1' : 'object-cover'}`}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-white/80 truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-white/30 text-xs truncate font-mono">
                        {file.path}
                      </p>
                    </td>
                    <td className="p-3 text-white/50 hidden md:table-cell">
                      {file.mimeType.split('/')[1]}
                    </td>
                    <td className="p-3 text-white/50 hidden sm:table-cell">
                      {formatSize(file.size)}
                    </td>
                    <td className="p-3 text-white/50 hidden lg:table-cell">
                      {formatDate(file.modified)}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(file.path)
                            showToast('Copied!')
                          }}
                          className="p-1.5 rounded hover:bg-[#14EAEA]/20 text-white/30 hover:text-[#14EAEA] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {file.source === 'uploads' && (
                          <button
                            onClick={() => handleDelete(file)}
                            className="p-1.5 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail panel */}
      {selectedFile && (
        <DetailPanel
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={handleDelete}
          onUpdate={() => {
            fetchMedia()
            setSelectedFile(null)
          }}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold shadow-lg animate-fade-in ${
            toast.type === 'success'
              ? 'bg-[#14EAEA] text-[#0A0A0A] shadow-[#14EAEA]/20'
              : 'bg-red-500 text-white shadow-red-500/20'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  )
}
