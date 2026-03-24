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
