import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter }) as PrismaClient

async function main() {
  const products = await prisma.product.findMany({
    include: { variants: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })

  for (const p of products) {
    const varSummary = p.variants.map((v) => {
      const price = v.priceMonthly
        ? `$${(v.priceMonthly / 100).toFixed(2)}/mo`
        : v.priceAnnual
          ? `$${(v.priceAnnual / 100).toFixed(2)}/yr`
          : v.priceOneTime
            ? `$${(v.priceOneTime / 100).toFixed(2)} once`
            : v.contactOnly
              ? 'Contact'
              : 'N/A'
      const sale = v.salePrice ? ` (sale: $${(v.salePrice / 100).toFixed(2)})` : ''
      const setup = v.setupFee ? ` +$${(v.setupFee / 100).toFixed(2)} setup` : ''
      return `  - ${v.name}: ${price}${sale}${setup}`
    })

    console.log(`${p.sortOrder}. ${p.name} [${p.type}] ${p.status} (${p.variants.length} variants)`)
    varSummary.forEach((s) => console.log(s))
  }

  const totalProducts = await prisma.product.count()
  const totalVariants = await prisma.productVariant.count()
  console.log(`\nTotal: ${totalProducts} products, ${totalVariants} variants`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
