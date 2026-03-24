import { prisma } from '@/lib/prisma'

export async function getPageContent(pageSlug: string): Promise<Record<string, string>> {
  const blocks = await prisma.pageContent.findMany({
    where: { pageSlug },
  })

  const content: Record<string, string> = {}
  for (const block of blocks) {
    content[block.blockKey] = block.value
  }
  return content
}
