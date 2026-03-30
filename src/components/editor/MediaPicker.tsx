'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Upload } from 'lucide-react'

const INITIAL_RENDER_COUNT = 30

interface MediaFile {
  name: string
  path: string
  source: string
  size: number
  width?: number
  height?: number
}

interface MediaPickerProps {
  onSelect: (src: string) => void
  onClose: () => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ACCEPTED_EXT = '.jpg,.jpeg,.png,.webp'

export default function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media?type=images&sort=date')
      if (res.ok) {
        const data = await res.json()
        setFiles(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMedia() }, [loadMedia])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleUpload = useCallback(async (fileList: FileList | File[]) => {
    const validFiles = Array.from(fileList).filter(f => ACCEPTED_TYPES.includes(f.type))
    if (validFiles.length === 0) {
      setUploadError('Only JPG, PNG, and WebP files are supported.')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadError('')

    const formData = new FormData()
    validFiles.forEach(f => formData.append('file', f))

    try {
      const xhr = new XMLHttpRequest()
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        })
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(xhr.statusText || 'Upload failed'))
        })
        xhr.addEventListener('error', () => reject(new Error('Upload failed')))
        xhr.open('POST', '/api/media/upload')
        xhr.send(formData)
      })

      // Reload the media library so new images appear immediately
      setLoading(true)
      await loadMedia()
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [loadMedia])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  const [showAll, setShowAll] = useState(false)

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.path.toLowerCase().includes(search.toLowerCase())
  )
  const visibleFiles = showAll || search ? filtered : filtered.slice(0, INITIAL_RENDER_COUNT)
  const hasMore = !showAll && !search && filtered.length > INITIAL_RENDER_COUNT

  const modal = (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onWheel={(e) => e.stopPropagation()}
      data-editor-toolbar
      data-lenis-prevent
    >
      <div className="bg-[#0F0F0F] rounded-2xl shadow-2xl border border-white/10 w-[90vw] max-w-4xl max-h-[80vh] flex flex-col" style={{ isolation: 'isolate' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-urbanist font-bold text-white text-lg">Media Library</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="px-6 pt-4 pb-2">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 ${
              dragOver
                ? 'border-[#14EAEA] bg-[#14EAEA]/10'
                : 'border-white/15 hover:border-white/30'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-1">
                <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#14EAEA] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="font-urbanist text-xs text-white/50">
                  Uploading... {uploadProgress}%
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Upload size={16} className="text-white/30" />
                <span className="font-urbanist text-sm text-white/40">
                  Drag & drop images here or
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-urbanist font-bold text-sm text-[#14EAEA] hover:text-white transition-colors"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_EXT}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleUpload(e.target.files)
                      e.target.value = ''
                    }
                  }}
                />
              </div>
            )}
          </div>
          {uploadError && (
            <p className="font-urbanist text-xs text-red-400 mt-1.5">{uploadError}</p>
          )}
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 font-urbanist text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
              autoFocus
            />
          </div>
        </div>

        {/* Grid */}
        <div
          className="flex-1 overflow-y-auto p-6"
          onWheel={(e) => e.stopPropagation()}
          data-lenis-prevent
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="font-urbanist text-white/40">Loading media...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <span className="font-urbanist text-white/40">No images found</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {visibleFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => onSelect(file.path)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#14EAEA] transition-all duration-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.path}
                      alt={file.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="absolute bottom-1 left-1 right-1 font-urbanist text-[10px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {file.name}
                    </span>
                  </button>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAll(true)}
                    className="font-urbanist font-bold text-sm text-[#14EAEA] hover:text-white transition-colors px-6 py-2 border border-[#14EAEA]/30 rounded-full hover:border-[#14EAEA] duration-200"
                  >
                    Load all {filtered.length} images
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
          <span className="font-urbanist text-xs text-white/30">
            {filtered.length} image{filtered.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            className="font-urbanist font-bold text-xs text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
