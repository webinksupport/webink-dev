import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role: string }).role !== "ADMIN") return null
  return session
}

// DELETE: Remove a specific provider by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const provider = await prisma.aiProvider.findFirst({
    where: { id: params.id, userId },
  })

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }

  await prisma.aiProvider.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

// PATCH: Update provider (set default, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const body = await req.json()

  const provider = await prisma.aiProvider.findFirst({
    where: { id: params.id, userId },
  })

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 })
  }

  if (body.isDefault) {
    await prisma.aiProvider.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })
  }

  const updated = await prisma.aiProvider.update({
    where: { id: params.id },
    data: {
      ...(typeof body.isDefault === "boolean" ? { isDefault: body.isDefault } : {}),
      ...(typeof body.rateLimit === "number" ? { rateLimit: body.rateLimit } : {}),
    },
  })

  return NextResponse.json({ provider: updated })
}
