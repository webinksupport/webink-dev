// Smart Prompt Builder — constructs optimized image prompts based on topic, content idea, brand assets, and target model.

import { type AssetType, getModelById, isFlux2Model } from './social-model-registry'

export interface BrandAssetInput {
  url: string
  type: AssetType
  name: string
}

export interface BrandProfileInput {
  colors: string[]
  tone: string
  industry: string
  name: string
}

export interface PromptBuilderInput {
  topic: string
  contentIdea: string
  brandAssets: BrandAssetInput[]
  brandProfile: BrandProfileInput
  targetModel: string
  aspectRatio?: string
}

export interface BuiltPrompt {
  prompt: string
  referenceImageUrls: string[]
  suggestedAspectRatio: string
}

const ASSET_TYPE_INSTRUCTIONS: Record<AssetType, (index: number, topic: string) => string> = {
  character: (n, topic) =>
    `Include the character from reference image [${n}]. Maintain the character's exact appearance, colors, and design. The character should be engaging with the topic of ${topic}.`,
  logo: (n) =>
    `Include the brand logo from reference image [${n}] positioned in the top-right or bottom-right corner. The logo should be clearly visible but not the main focus.`,
  product: (n, topic) =>
    `Feature the product from reference image [${n}] prominently. Show it in use or in a context that relates to ${topic}.`,
  background: (n) =>
    `Use the background/environment from reference image [${n}] as the scene setting.`,
  style: (n) =>
    `Apply the visual style from reference image [${n}] to the overall image aesthetic.`,
}

function getAspectRatioForContent(aspectRatio?: string): string {
  if (aspectRatio) return aspectRatio
  return '4:5' // Default to Instagram portrait
}

function getSizeFromAspectRatio(aspectRatio: string): { width: number; height: number } {
  switch (aspectRatio) {
    case '4:5': return { width: 1080, height: 1350 }
    case '1:1': return { width: 1080, height: 1080 }
    case '9:16': return { width: 1080, height: 1920 }
    case '16:9': return { width: 1920, height: 1080 }
    case '3:4': return { width: 1080, height: 1440 }
    default: return { width: 1080, height: 1350 }
  }
}

export function buildPrompt(input: PromptBuilderInput): BuiltPrompt {
  const { topic, contentIdea, brandAssets, brandProfile, targetModel, aspectRatio } = input
  const model = getModelById(targetModel)
  const isFlux2 = model ? isFlux2Model(model.id) : false
  const suggestedAspectRatio = getAspectRatioForContent(aspectRatio)
  const { width, height } = getSizeFromAspectRatio(suggestedAspectRatio)

  // Collect reference URLs for models that support them
  const referenceImageUrls: string[] = []
  if (model?.supportsReferenceImages && brandAssets.length > 0) {
    const maxRefs = model.maxReferenceImages
    for (let i = 0; i < Math.min(brandAssets.length, maxRefs); i++) {
      referenceImageUrls.push(brandAssets[i].url)
    }
  }

  // Build the prompt parts
  const parts: string[] = []

  // 1. Main visual concept
  parts.push(`Create a ${width}x${height} social media image about: ${topic}.`)
  parts.push(`Visual concept: ${contentIdea}`)

  // 2. Brand asset references
  if (referenceImageUrls.length > 0) {
    for (let i = 0; i < referenceImageUrls.length; i++) {
      const asset = brandAssets[i]
      const instruction = ASSET_TYPE_INSTRUCTIONS[asset.type]
      if (instruction) {
        parts.push(instruction(i + 1, topic))
      }
    }
  }

  // 3. Brand colors
  if (brandProfile.colors.length > 0) {
    const colorStr = brandProfile.colors.join(', ')
    if (isFlux2) {
      parts.push(`Use brand colors: ${colorStr} as accent colors throughout the composition.`)
    } else {
      parts.push(`Incorporate brand colors (${colorStr}) as accent elements.`)
    }
  }

  // 4. Mood/style
  if (brandProfile.tone) {
    parts.push(`Mood: ${brandProfile.tone}, modern, high-end digital marketing aesthetic.`)
  }

  // 5. Brand name
  if (brandProfile.name) {
    parts.push(`This is for ${brandProfile.name}.`)
  }

  // 6. Composition guidance
  const ratioDesc = suggestedAspectRatio === '4:5' ? 'portrait (4:5)'
    : suggestedAspectRatio === '1:1' ? 'square (1:1)'
    : suggestedAspectRatio === '9:16' ? 'vertical story (9:16)'
    : suggestedAspectRatio === '16:9' ? 'landscape (16:9)'
    : suggestedAspectRatio
  parts.push(`Composition: ${ratioDesc} format. Clean, professional, social-media-ready.`)

  // If FLUX.2 with structured prompt support, output as JSON
  const prompt = isFlux2
    ? JSON.stringify({
        prompt: parts.join(' '),
        width,
        height,
        brand_colors: brandProfile.colors,
      })
    : parts.join(' ')

  return {
    prompt,
    referenceImageUrls,
    suggestedAspectRatio,
  }
}

export { getSizeFromAspectRatio }
