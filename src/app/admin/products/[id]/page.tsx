import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductEditor from '../ProductEditor'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!product) notFound()

  // Serialize Prisma dates/decimals for client component
  const serialized = JSON.parse(JSON.stringify(product))

  return <ProductEditor product={serialized} />
}
