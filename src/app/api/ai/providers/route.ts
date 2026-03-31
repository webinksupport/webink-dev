import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encryptApiKey, testProviderConnection, isClaudeSubscriptionToken } from "@/lib/ai/service"
import type { AiProviderSlug } from "@/generated/prisma/client"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role: string }).role !== "ADMIN") return null
  return session
}

// GET: List all providers for admin user
export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id

  const providers = await prisma.aiProvider.findMany({
    where: { userId },
    select: {
      id: true,
      slug: true,
      authMethod: true,
      oauthEmail: true,
      tokenExpiresAt: true,
      isConnected: true,
      isDefault: true,
      models: true,
      modelsRefreshed: true,
      rateLimit: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ providers })
}

// POST: Add/update a provider with API key
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { slug, apiKey, isDefault } = await req.json()

  if (!slug || !apiKey) {
    return NextResponse.json({ error: "Provider slug and API key required" }, { status: 400 })
  }

  const validSlugs: AiProviderSlug[] = ["OPENAI", "ANTHROPIC", "GOOGLE", "PERPLEXITY", "STABILITY"]
  if (!validSlugs.includes(slug)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  // Handle "keep-existing" for set-default-only updates
  if (apiKey === "keep-existing") {
    if (isDefault) {
      await prisma.aiProvider.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
      await prisma.aiProvider.updateMany({
        where: { userId, slug },
        data: { isDefault: true },
      })
    }
    return NextResponse.json({ success: true })
  }

  // Test connection
  const test = await testProviderConnection(apiKey, slug)
  if (!test.success) {
    return NextResponse.json({ error: `Connection failed: ${test.error}` }, { status: 400 })
  }

  const encrypted = encryptApiKey(apiKey)

  if (isDefault) {
    await prisma.aiProvider.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }

  const authMethod = (slug === "ANTHROPIC" && isClaudeSubscriptionToken(apiKey))
    ? "subscription"
    : "api_key"

  const provider = await prisma.aiProvider.upsert({
    where: { userId_slug: { userId, slug } },
    update: {
      apiKey: encrypted,
      authMethod,
      isConnected: true,
      isDefault: isDefault || false,
    },
    create: {
      userId,
      slug,
      apiKey: encrypted,
      authMethod,
      isConnected: true,
      isDefault: isDefault || false,
    },
  })

  return NextResponse.json({
    provider: {
      id: provider.id,
      slug: provider.slug,
      authMethod: provider.authMethod,
      isConnected: provider.isConnected,
      isDefault: provider.isDefault,
    },
  })
}

// DELETE: Disconnect a provider
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { slug } = await req.json()

  await prisma.aiProvider.deleteMany({
    where: { userId, slug },
  })

  return NextResponse.json({ success: true })
}
