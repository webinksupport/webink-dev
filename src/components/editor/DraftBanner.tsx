'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { AlertCircle } from 'lucide-react'

export default function DraftBanner({ pageSlug }: { pageSlug: string }) {
  const { data: session } = useSession()
  const [isDraft, setIsDraft] = useState(false)

  const isAdmin = session?.user && (session.user as { role?: string }).role === 'ADMIN'

  useEffect(() => {
    if (!isAdmin) return
    fetch(`/api/admin/pages/status?slug=${encodeURIComponent(pageSlug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === 'DRAFT') setIsDraft(true)
      })
      .catch(() => {})
  }, [pageSlug, isAdmin])

  if (!isAdmin || !isDraft) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[#F813BE] text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4" />
      This page is in Draft mode — only visible to admins
    </div>
  )
}
