'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  ExternalLink,
  FileText,
  Loader2,
  Globe,
  Filter,
} from 'lucide-react'

interface PageRoute {
  path: string
  title: string
}

// Routes that are core to the site and cannot be removed
const REQUIRED_ROUTES = new Set(['/', '/about', '/contact', '/services'])

export default function PageManager() {
  const [pages, setPages] = useState<PageRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'service' | 'admin' | 'other'>('all')

  useEffect(() => {
    fetch('/api/pages')
      .then((r) => r.json())
      .then((data: PageRoute[]) => setPages(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getPageType = (path: string): string => {
    if (path.startsWith('/admin')) return 'Admin'
    if (path.startsWith('/services')) return 'Service'
    if (path.startsWith('/auth')) return 'Auth'
    if (path.startsWith('/dashboard')) return 'Dashboard'
    if (path === '/') return 'Homepage'
    return 'Static'
  }

  const filtered = pages.filter((page) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !page.title.toLowerCase().includes(q) &&
        !page.path.toLowerCase().includes(q)
      )
        return false
    }

    if (filter === 'service') return page.path.startsWith('/services')
    if (filter === 'admin') return page.path.startsWith('/admin')
    if (filter === 'other')
      return (
        !page.path.startsWith('/services') &&
        !page.path.startsWith('/admin')
      )
    return true
  })

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
      <div className="mb-8">
        <p className="text-[#14EAEA] text-xs font-bold tracking-[3px] uppercase mb-2">
          Content
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Pages</h1>
        <p className="text-[#999] text-sm">
          All {pages.length} pages discovered in the application.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#14EAEA]/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#666]" />
          {(['all', 'service', 'admin', 'other'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-[#14EAEA]/20 text-[#14EAEA] border border-[#14EAEA]/30'
                  : 'text-[#666] hover:text-white border border-[#333] hover:border-[#555]'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[#666] text-sm mb-4">
        {filtered.length} page{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </p>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#333] rounded-2xl overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#333] text-[#666] text-xs uppercase tracking-wider">
                <th className="p-4 text-left">Page</th>
                <th className="p-4 text-left">URL</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => {
                const type = getPageType(page.path)
                const isRequired = REQUIRED_ROUTES.has(page.path)
                return (
                  <tr
                    key={page.path}
                    className="border-b border-[#222] hover:bg-[#1A1A1A]/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
                          {page.path.startsWith('/admin') ? (
                            <FileText className="w-4 h-4 text-[#F813BE]" />
                          ) : (
                            <Globe className="w-4 h-4 text-[#14EAEA]" />
                          )}
                        </div>
                        <span className="text-white font-medium">{page.title}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="text-[#14EAEA]/60 text-xs font-mono">
                        {page.path}
                      </code>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          type === 'Service'
                            ? 'bg-[#14EAEA]/10 text-[#14EAEA]'
                            : type === 'Admin'
                            ? 'bg-[#F813BE]/10 text-[#F813BE]'
                            : type === 'Homepage'
                            ? 'bg-[#B9FF33]/10 text-[#B9FF33]'
                            : 'bg-[#333] text-[#999]'
                        }`}
                      >
                        {type}
                      </span>
                      {isRequired && (
                        <span className="ml-2 text-[10px] text-[#666]">Required</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] border border-[#333] rounded-lg hover:border-[#14EAEA] hover:text-[#14EAEA] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Preview
                        </a>
                        {!page.path.startsWith('/admin') && !page.path.startsWith('/auth') && (
                          <Link
                            href={`/admin/content`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 rounded-lg hover:bg-[#14EAEA]/10 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            Edit Content
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-[#222]">
          {filtered.map((page) => {
            const type = getPageType(page.path)
            return (
              <div key={page.path} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{page.title}</p>
                    <code className="text-[#14EAEA]/60 text-xs font-mono">{page.path}</code>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      type === 'Service'
                        ? 'bg-[#14EAEA]/10 text-[#14EAEA]'
                        : type === 'Admin'
                        ? 'bg-[#F813BE]/10 text-[#F813BE]'
                        : 'bg-[#333] text-[#999]'
                    }`}
                  >
                    {type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] border border-[#333] rounded-lg hover:text-[#14EAEA] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview
                  </a>
                  {!page.path.startsWith('/admin') && !page.path.startsWith('/auth') && (
                    <Link
                      href="/admin/content"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#14EAEA] border border-[#14EAEA]/30 rounded-lg hover:bg-[#14EAEA]/10 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#555]">
            <Globe className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No pages match your filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
