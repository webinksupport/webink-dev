'use client'

import { useState, useRef } from 'react'
import {
  Upload, Download, X, Loader2, CheckCircle, AlertCircle,
  FileSpreadsheet
} from 'lucide-react'

interface ParsedRow {
  date: string
  time: string
  platform: string
  caption: string
  hashtags: string
  mediaPath: string
  status: string
  error?: string
}

interface Props {
  onClose: () => void
  onImported: () => void
}

const CSV_TEMPLATE = `date,time,platform,caption,hashtags,mediaPath,status
2026-04-01,09:00,instagram,Your caption here,#webdesign #agency,,SCHEDULED
2026-04-02,14:00,facebook,Another great post,#digitalmarketing,,DRAFT`

export default function BulkImport({ onClose, onImported }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'social-posts-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function parseCSV(text: string): ParsedRow[] {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())

    return lines.slice(1).map((line) => {
      // Simple CSV parse (handles basic cases)
      const values: string[] = []
      let current = ''
      let inQuotes = false
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const row: Record<string, string> = {}
      headers.forEach((h, i) => {
        row[h] = values[i] || ''
      })

      return validateRow({
        date: row.date || '',
        time: row.time || '',
        platform: row.platform || '',
        caption: row.caption || '',
        hashtags: row.hashtags || '',
        mediaPath: row.mediapath || row.mediaPath || '',
        status: row.status || 'DRAFT',
      })
    })
  }

  function validateRow(row: ParsedRow): ParsedRow {
    const validPlatforms = ['instagram', 'facebook', 'linkedin']
    const validStatuses = ['DRAFT', 'SCHEDULED']

    if (!row.caption.trim()) {
      return { ...row, error: 'Caption is required' }
    }
    if (!validPlatforms.includes(row.platform.toLowerCase())) {
      return { ...row, error: 'Invalid platform (use instagram, facebook, or linkedin)' }
    }
    const status = row.status.toUpperCase()
    if (!validStatuses.includes(status)) {
      return { ...row, error: 'Status must be DRAFT or SCHEDULED' }
    }
    if (row.date) {
      const dateStr = `${row.date}T${row.time || '09:00'}:00`
      const parsed = new Date(dateStr)
      if (isNaN(parsed.getTime())) {
        return { ...row, error: 'Invalid date format' }
      }
      if (parsed < new Date()) {
        return { ...row, error: 'Date must be in the future' }
      }
    } else if (status === 'SCHEDULED') {
      return { ...row, error: 'Date required for SCHEDULED posts' }
    }

    return row
  }

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      setRows(parsed)
      setStep(2)
    }
    reader.readAsText(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.name.endsWith('.csv')) handleFile(file)
  }

  async function importRows() {
    const validRows = rows.filter((r) => !r.error)
    if (validRows.length === 0) return

    setImporting(true)
    try {
      const res = await fetch('/api/social/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: validRows }),
      })
      const data = await res.json()
      setResult(data)
      setStep(3)
      if (data.imported > 0) onImported()
    } catch {
      setResult({ imported: 0, skipped: rows.length, errors: ['Import request failed'] })
      setStep(3)
    }
    setImporting(false)
  }

  const validCount = rows.filter((r) => !r.error).length
  const invalidCount = rows.filter((r) => r.error).length

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#141414] border border-[#333] rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#14EAEA]" />
            <h2 className="text-white font-semibold">Import Posts from CSV</h2>
          </div>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#222]">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= s ? 'bg-[#14EAEA] text-[#0A0A0A]' : 'bg-[#333] text-[#666]'
                }`}
              >
                {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : s}
              </div>
              <span className={`text-xs ${step >= s ? 'text-white' : 'text-[#555]'}`}>
                {s === 1 ? 'Upload' : s === 2 ? 'Preview' : 'Results'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-[#333]" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-5">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-[#14EAEA] px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV Template
              </button>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl py-16 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-[#14EAEA] bg-[#14EAEA]/5'
                    : 'border-[#333] hover:border-[#555]'
                }`}
              >
                <Upload className="w-8 h-8 text-[#555]" />
                <p className="text-[#999] text-sm">
                  Drag & drop your CSV file here, or click to browse
                </p>
                <p className="text-[#555] text-xs">Accepts .csv files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">{validCount} valid</span>
                {invalidCount > 0 && <span className="text-red-400">{invalidCount} invalid</span>}
                <span className="text-[#555]">{rows.length} total rows</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#333]">
                      <th className="text-left text-[#666] py-2 px-2 font-medium">#</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Date</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Time</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Platform</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Caption</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Status</th>
                      <th className="text-left text-[#666] py-2 px-2 font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#1A1A1A] ${
                          row.error ? 'bg-red-500/5' : 'bg-green-500/5'
                        }`}
                      >
                        <td className="py-2 px-2 text-[#555]">{i + 1}</td>
                        <td className="py-2 px-2 text-white">{row.date}</td>
                        <td className="py-2 px-2 text-white">{row.time}</td>
                        <td className="py-2 px-2 text-white capitalize">{row.platform}</td>
                        <td className="py-2 px-2 text-white max-w-[200px] truncate">{row.caption}</td>
                        <td className="py-2 px-2 text-white">{row.status}</td>
                        <td className="py-2 px-2 text-red-400">{row.error || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="text-center py-8 space-y-4">
              {result.imported > 0 ? (
                <CheckCircle className="w-12 h-12 mx-auto text-green-400" />
              ) : (
                <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
              )}
              <h3 className="text-white text-lg font-medium">
                {result.imported > 0 ? 'Import Complete!' : 'Import Failed'}
              </h3>
              <div className="flex justify-center gap-6 text-sm">
                <span className="text-green-400">{result.imported} imported</span>
                <span className="text-red-400">{result.skipped} skipped</span>
              </div>
              {result.errors.length > 0 && (
                <div className="text-left bg-[#1A1A1A] rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-[#666] text-xs mb-2">Errors:</p>
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-red-400 text-xs">{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#222]">
          <button
            onClick={step === 1 ? onClose : () => setStep((step - 1) as 1 | 2)}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] text-[#999] rounded-lg text-sm transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step === 2 && (
            <button
              onClick={importRows}
              disabled={importing || validCount === 0}
              className="flex items-center gap-2 bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Import {validCount} Posts
            </button>
          )}
          {step === 3 && (
            <button
              onClick={onClose}
              className="bg-[#F813BE] hover:bg-[#d10fa0] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
