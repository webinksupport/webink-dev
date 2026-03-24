import { NextResponse } from 'next/server'
import { getAllAppRoutes } from '@/lib/pages'

export async function GET() {
  const routes = getAllAppRoutes()
  return NextResponse.json(routes)
}
