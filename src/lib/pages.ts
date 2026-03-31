import fs from 'fs'
import path from 'path'

export interface PageRoute {
  path: string
  title: string
}

function titleFromPath(routePath: string): string {
  if (routePath === '/') return 'Home'
  const segments = routePath.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getAllAppRoutes(): PageRoute[] {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const routes: PageRoute[] = []

  function scan(dir: string, routePrefix: string) {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }

    // Check if this directory has a page.tsx
    const hasPage = entries.some(
      (e) => e.isFile() && (e.name === 'page.tsx' || e.name === 'page.ts')
    )
    if (hasPage) {
      routes.push({
        path: routePrefix || '/',
        title: titleFromPath(routePrefix || '/'),
      })
    }

    // Recurse into subdirectories (skip special Next.js dirs)
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      // Skip route groups, api routes, and special dirs
      if (entry.name.startsWith('(') || entry.name.startsWith('[') || entry.name === 'api' || entry.name === 'auth') continue
      scan(path.join(dir, entry.name), `${routePrefix}/${entry.name}`)
    }
  }

  scan(appDir, '')
  return routes.sort((a, b) => a.path.localeCompare(b.path))
}
