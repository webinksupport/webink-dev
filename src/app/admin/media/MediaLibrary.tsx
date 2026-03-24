'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Upload, Search, Copy, Trash2, X, ImageIcon } from 'lucide-react'

interface MediaFile {
  name: string
  path: string
  size: number
  modified: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toastTimeout = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((message: string) => {
    setToast(message)
    if (toastTimeout.current) clearTimeout(toastTimeout.current)
    toastTimeout.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media')
      if (res.ok) {
        const data: MediaFile[] = await res.json()
        setFiles(data)
      }
    } catch {
      showToast('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        showToast('File uploaded successfully')
        fetchMedia()
      } else {
        const data = await res.json()
        showToast(data.error || 'Upload failed')
      }
    } catch {
      showToast('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return

    try {
      const filename = file.path.split('/').pop()
      const res = await fetch(`/api/media/${filename}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('File deleted')
        setSelectedFile(null)
        fetchMedia()
      } else {
        showToast('Failed to delete file')
      }
    } catch {
      showToast('Failed to delete file')
    }
  }

  const copyPath = (filePath: string) => {
    navigator.clipboard.writeText(filePath)
    showToast('Copied to clipboard!')
  }

  const isUpload = (file: MediaFile) => file.path.startsWith('/uploads/')

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.path.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
            />
          </div>
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
          const file = e.dataTransfer.files[0]
          if (file) handleUpload(file)
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragging
            ? 'border-[#14EAEA] bg-[#14EAEA]/5'
            : 'border-white/20 bg-[#1A1A1A]'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-[#14EAEA] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <p className="text-white/50 text-sm">
              Drag & drop files here or click to upload
            </p>
            <p className="text-white/30 text-xs mt-1">
              JPG, PNG, GIF, WebP, SVG up to 10MB
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
            e.target.value = ''
          }}
          className="hidden"
        />
      </div>

      {/* File Count */}
      <p className="text-white/40 text-sm">
        {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
        {search && ` matching "${search}"`}
      </p>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#14EAEA] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-white/30">
          <ImageIcon className="w-12 h-12 mb-4" />
          <p className="text-lg">
            {search ? 'No files match your search' : 'No media files found'}
          </p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((file) => (
            <div
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className="group bg-[#1A1A1A] rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#14EAEA]/50 transition-colors"
            >
              <div className="relative h-40 bg-[#111]">
                {file.name.endsWith('.svg') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={file.path}
                    alt={file.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <Image
                    src={file.path}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
              </div>
              <div className="p-3 space-y-1">
                <p
                  className="text-sm text-white/70 truncate"
                  title={file.name}
                >
                  {file.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    {formatSize(file.size)}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPath(file.path)
                      }}
                      className="p-1 rounded hover:bg-[#14EAEA]/20 text-white/40 hover:text-[#14EAEA] transition-colors"
                      title="Copy path"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {isUpload(file) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(file)
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel / Lightbox */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-[#1A1A1A] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold truncate pr-4">
                {selectedFile.name}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-[#111] flex items-center justify-center min-h-[300px]">
              {selectedFile.name.endsWith('.svg') ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedFile.path}
                  alt={selectedFile.name}
                  className="max-w-full max-h-[50vh] object-contain p-4"
                />
              ) : (
                <Image
                  src={selectedFile.path}
                  alt={selectedFile.name}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[50vh] object-contain"
                />
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Path
                  </p>
                  <p className="text-white/70 break-all">{selectedFile.path}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Size
                  </p>
                  <p className="text-white/70">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Modified
                  </p>
                  <p className="text-white/70">
                    {new Date(selectedFile.modified).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                    Location
                  </p>
                  <p className="text-white/70">
                    {isUpload(selectedFile) ? 'Uploads' : 'Images'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => copyPath(selectedFile.path)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#14EAEA] text-[#0A0A0A] font-semibold rounded-lg text-sm hover:bg-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Path
                </button>
                {isUpload(selectedFile) && (
                  <button
                    onClick={() => handleDelete(selectedFile)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 font-semibold rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 bg-[#14EAEA] text-[#0A0A0A] font-semibold rounded-full text-sm shadow-lg shadow-[#14EAEA]/20 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
