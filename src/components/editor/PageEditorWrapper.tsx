'use client'
import { type ReactNode } from 'react'
import VisualEditor from './VisualEditor'

interface PageEditorWrapperProps {
  pageSlug: string
  children: ReactNode
}

export default function PageEditorWrapper({ pageSlug, children }: PageEditorWrapperProps) {
  return (
    <VisualEditor pageSlug={pageSlug}>
      {children}
    </VisualEditor>
  )
}
