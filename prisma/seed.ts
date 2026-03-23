import { PrismaClient, ProductType, BillingInterval } from '../src/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter }) as PrismaClient

interface VariantSeed {
  name: string
  priceMonthly?: number
  priceAnnual?: number
  priceOneTime?: number
  salePrice?: number
  billingInterval: BillingInterval
  contactOnly?: boolean
  sortOrder: number
}

interface ProductSeed {
  name: string
  slug: string
  description: string
  category: string
  type: ProductType
  sortOrder: number
  variants: VariantSeed[]
}

// All prices in CENTS
const products: ProductSeed[] = [
  {
    name: 'Managed Web Hosting',
    slug: 'managed-web-hosting',
    description: 'Fully managed web hosting with SSL, daily backups, uptime monitoring, and priority support. Choose monthly or annual billing.',
    category: 'hosting',
    type: 'SUBSCRIPTION',
    sortOrder: 1,
    variants: [
      { name: 'Starter', priceMonthly: 3100, priceAnnual: 33500, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Basic', priceMonthly: 3900, priceAnnual: 42100, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Standard', priceMonthly: 5900, priceAnnual: 63700, billingInterval: 'MONTHLY', sortOrder: 3 },
      { name: 'Pro', priceMonthly: 6100, priceAnnual: 65900, billingInterval: 'MONTHLY', sortOrder: 4 },
      { name: 'Advanced', priceMonthly: 6900, priceAnnual: 74500, billingInterval: 'MONTHLY', sortOrder: 5 },
      { name: 'Premium', priceMonthly: 8900, priceAnnual: 96100, billingInterval: 'MONTHLY', sortOrder: 6 },
    ],
  },
  {
    name: 'Additional Hosted Site',
    slug: 'additional-hosted-site',
    description: 'Add-on hosting for an additional website under your existing hosting plan.',
    category: 'hosting',
    type: 'SUBSCRIPTION',
    sortOrder: 2,
    variants: [
      { name: 'Additional Site', priceMonthly: 1500, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
  {
    name: 'Fully Managed SEO',
    slug: 'fully-managed-seo',
    description: 'Comprehensive SEO management including keyword research, on-page optimization, link building, and monthly reporting.',
    category: 'seo',
    type: 'SUBSCRIPTION',
    sortOrder: 3,
    variants: [
      { name: 'Basic', priceMonthly: 110300, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 149300, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 199300, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },
  {
    name: 'SEO Primer',
    slug: 'seo-primer',
    description: 'One-time SEO audit and optimization setup to establish your search foundation.',
    category: 'seo',
    type: 'ONE_TIME',
    sortOrder: 4,
    variants: [
      { name: 'SEO Primer', priceOneTime: 65300, salePrice: 55300, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },
  {
    name: 'Local SEO',
    slug: 'local-seo',
    description: 'Targeted local search optimization for businesses serving Sarasota, Tampa, and Bradenton markets.',
    category: 'seo',
    type: 'SUBSCRIPTION',
    sortOrder: 5,
    variants: [
      { name: 'Basic', priceMonthly: 110300, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 160300, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 210300, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },
  {
    name: 'Local SEO 3-Month BOOST',
    slug: 'local-seo-3-month-boost',
    description: 'Accelerated 3-month local SEO campaign for rapid visibility gains.',
    category: 'seo',
    type: 'SUBSCRIPTION',
    sortOrder: 6,
    variants: [
      { name: 'Basic', priceMonthly: 110300, salePrice: 99300, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 160300, salePrice: 144300, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 199300, salePrice: 189300, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },
  {
    name: 'Social Media Marketing',
    slug: 'social-media-marketing',
    description: 'Full-service social media management including content creation, scheduling, engagement, and analytics.',
    category: 'social',
    type: 'SUBSCRIPTION',
    sortOrder: 7,
    variants: [
      { name: 'Entry', priceMonthly: 49300, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Basic', priceMonthly: 61300, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Standard', priceMonthly: 73300, billingInterval: 'MONTHLY', sortOrder: 3 },
      { name: 'Pro', priceMonthly: 79300, billingInterval: 'MONTHLY', sortOrder: 4 },
      { name: 'Advanced', priceMonthly: 91300, billingInterval: 'MONTHLY', sortOrder: 5 },
      { name: 'Premium', priceMonthly: 99300, billingInterval: 'MONTHLY', sortOrder: 6 },
      { name: 'Elite', priceMonthly: 103300, billingInterval: 'MONTHLY', sortOrder: 7 },
      { name: 'Ultimate', priceMonthly: 111300, billingInterval: 'MONTHLY', sortOrder: 8 },
      { name: 'Enterprise', priceMonthly: 123300, billingInterval: 'MONTHLY', sortOrder: 9 },
    ],
  },
  {
    name: 'Short Form Video Marketing',
    slug: 'short-form-video-marketing',
    description: 'Professional short-form video content creation for TikTok, Instagram Reels, and YouTube Shorts.',
    category: 'video',
    type: 'SUBSCRIPTION',
    sortOrder: 8,
    variants: [
      { name: 'Basic', priceMonthly: 16000, billingInterval: 'MONTHLY', sortOrder: 1 },
      { name: 'Pro', priceMonthly: 32000, billingInterval: 'MONTHLY', sortOrder: 2 },
      { name: 'Ultimate', priceMonthly: 48000, billingInterval: 'MONTHLY', sortOrder: 3 },
    ],
  },
  {
    name: 'Paid Advertising (PPC)',
    slug: 'paid-advertising-ppc',
    description: 'Custom pay-per-click advertising campaigns across Google Ads, Meta, and other platforms. Contact us for a custom quote.',
    category: 'advertising',
    type: 'SUBSCRIPTION',
    sortOrder: 9,
    variants: [
      { name: 'Custom', contactOnly: true, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
  {
    name: 'Google Business Profile Optimization',
    slug: 'google-business-profile-optimization',
    description: 'One-time Google Business Profile setup and optimization for maximum local search visibility.',
    category: 'other',
    type: 'ONE_TIME',
    sortOrder: 10,
    variants: [
      { name: 'Standard', priceOneTime: 20000, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },
  {
    name: 'Google Local Service Ads Management',
    slug: 'google-lsa-management',
    description: 'Monthly management of Google Local Service Ads to generate qualified leads.',
    category: 'advertising',
    type: 'SUBSCRIPTION',
    sortOrder: 11,
    variants: [
      { name: 'Standard', priceMonthly: 25000, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
  {
    name: 'RapidSSL DV Certificate',
    slug: 'rapidssl-dv-certificate',
    description: 'Domain-validated SSL certificate for secure website connections.',
    category: 'other',
    type: 'ONE_TIME',
    sortOrder: 12,
    variants: [
      { name: 'Annual', priceOneTime: 2500, billingInterval: 'ONE_TIME', sortOrder: 1 },
    ],
  },
  {
    name: 'InkTree Page',
    slug: 'inktree-page',
    description: 'Custom link-in-bio page for social media profiles.',
    category: 'other',
    type: 'SUBSCRIPTION',
    sortOrder: 13,
    variants: [
      { name: 'Standard', priceMonthly: 500, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
  {
    name: 'Custom Social Media Package',
    slug: 'custom-social-media-package',
    description: 'Tailored social media marketing package built to your specific needs. Contact us for a custom quote.',
    category: 'social',
    type: 'SUBSCRIPTION',
    sortOrder: 14,
    variants: [
      { name: 'Custom', contactOnly: true, billingInterval: 'MONTHLY', sortOrder: 1 },
    ],
  },
]

async function main() {
  console.log('Seeding products...')

  for (const product of products) {
    const { variants, ...productData } = product

    const created = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
      },
      create: {
        ...productData,
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            priceMonthly: v.priceMonthly ?? null,
            priceAnnual: v.priceAnnual ?? null,
            priceOneTime: v.priceOneTime ?? null,
            salePrice: v.salePrice ?? null,
            billingInterval: v.billingInterval,
            contactOnly: v.contactOnly ?? false,
            sortOrder: v.sortOrder,
          })),
        },
      },
    })

    console.log(`  ✓ ${created.name} (${variants.length} variant${variants.length > 1 ? 's' : ''})`)
  }

  console.log('\nSeeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
