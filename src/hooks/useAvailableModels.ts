'use client'

import { useState, useEffect } from 'react'

export interface ImageModel {
  id: string
  provider: string
  label: string
  desc: string
  cost: string
  supportsReference?: boolean
  maxReferenceImages?: number
  supportsStructuredPrompts?: boolean
  referenceImageMode?: string | null
}

export interface TextModel {
  id: string
  provider: string
  label: string
  desc: string
}

export interface ProviderGroup {
  provider: string
  label: string
  models: ImageModel[]
}

export interface TextProviderGroup {
  provider: string
  label: string
  models: TextModel[]
}

interface AvailableModels {
  imageProviders: ProviderGroup[]
  textProviders: TextProviderGroup[]
  hasAnyImageKey: boolean
  hasAnyTextKey: boolean
  loading: boolean
}

export function useAvailableModels(): AvailableModels {
  const [data, setData] = useState<Omit<AvailableModels, 'loading'>>({
    imageProviders: [],
    textProviders: [],
    hasAnyImageKey: false,
    hasAnyTextKey: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/social/available-models')
      .then((res) => res.json())
      .then((json) => {
        setData({
          imageProviders: json.imageProviders || [],
          textProviders: json.textProviders || [],
          hasAnyImageKey: json.hasAnyImageKey ?? false,
          hasAnyTextKey: json.hasAnyTextKey ?? false,
        })
      })
      .catch(() => {
        // Use empty defaults
      })
      .finally(() => setLoading(false))
  }, [])

  return { ...data, loading }
}
