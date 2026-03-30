import { prisma } from '@/lib/prisma'

/** Ensure a stored value is a plain string — not a serialized style object */
function safeStringValue(val: unknown): string {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') {
    // If it's a style object (color, fontSize, etc.), extract the text if present
    const obj = val as Record<string, unknown>
    if ('text' in obj && typeof obj.text === 'string') return obj.text
    if ('src' in obj && typeof obj.src === 'string') return obj.src
    // Last resort: return empty string rather than crash React with an object
    return ''
  }
  return String(val ?? '')
}

export async function getPageContent(pageSlug: string): Promise<Record<string, string>> {
  try {
    const blocks = await prisma.pageContent.findMany({
      where: { pageSlug },
    })

    const content: Record<string, string> = {}
    for (const block of blocks) {
      content[block.blockKey] = safeStringValue(block.value)
    }
    return content
  } catch {
    // DB unavailable (e.g., during build without local DB) — return empty
    // Pages will use their hardcoded fallback values
    return {}
  }
}

export async function getPageJsonContent(pageSlug: string): Promise<Record<string, unknown>> {
  try {
    const blocks = await prisma.pageContent.findMany({
      where: { pageSlug },
    })

    const content: Record<string, unknown> = {}
    for (const block of blocks) {
      if (block.jsonValue !== null && block.jsonValue !== undefined) {
        content[block.blockKey] = block.jsonValue
      } else {
        content[block.blockKey] = block.value
      }
    }
    return content
  } catch {
    return {}
  }
}
