import { prisma } from '@/lib/prisma'

export async function getPageContent(pageSlug: string): Promise<Record<string, string>> {
  try {
    const blocks = await prisma.pageContent.findMany({
      where: { pageSlug },
    })

    const content: Record<string, string> = {}
    for (const block of blocks) {
      content[block.blockKey] = block.value
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
