import { prisma } from './prisma'

/**
 * Get a single setting value. Checks DB first, falls back to process.env.
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    const row = await prisma.setting.findUnique({ where: { key } })
    if (row?.value) return row.value
  } catch {
    // DB not available — fall through to env
  }
  return process.env[key] ?? null
}

/**
 * Get multiple settings at once. Returns a record keyed by setting name.
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}

  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: keys } },
    })
    for (const row of rows) {
      if (row.value) result[row.key] = row.value
    }
  } catch {
    // DB not available
  }

  // Fill missing from env
  for (const key of keys) {
    if (!result[key] && process.env[key]) {
      result[key] = process.env[key]!
    }
  }

  return result
}
