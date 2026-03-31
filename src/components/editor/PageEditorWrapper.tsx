'use client'
import { type ReactNode } from 'react'
import VisualEditor from './VisualEditor'
import DraftBanner from './DraftBanner'

interface PageEditorWrapperProps {
  pageSlug: string
  children: ReactNode
  initialContent?: Record<string, string>
  initialJsonContent?: Record<string, unknown>
}

export default function PageEditorWrapper({ pageSlug, children, initialContent, initialJsonContent }: PageEditorWrapperProps) {
  return (
    <VisualEditor pageSlug={pageSlug} initialContent={initialContent} initialJsonContent={initialJsonContent}>
      <DraftBanner pageSlug={pageSlug} />
      {children}
    </VisualEditor>
  )
}
