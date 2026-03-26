import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// All known setting keys and whether they are secrets
const SETTING_DEFS: Record<string, { isSecret: boolean }> = {
  // Payments
  STRIPE_TEST_MODE: { isSecret: false },
  STRIPE_TEST_PUBLISHABLE_KEY: { isSecret: false },
  STRIPE_TEST_SECRET_KEY: { isSecret: true },
  STRIPE_PUBLISHABLE_KEY: { isSecret: false },
  STRIPE_SECRET_KEY: { isSecret: true },
  STRIPE_WEBHOOK_SECRET: { isSecret: true },
  // AI
  ANTHROPIC_API_KEY: { isSecret: true },
  OPENAI_API_KEY: { isSecret: true },
  GOOGLE_GEMINI_API_KEY: { isSecret: true },
  GROK_API_KEY: { isSecret: true },
  TOGETHER_AI_API_KEY: { isSecret: true },
  // Email
  RESEND_API_KEY: { isSecret: true },
  POSTMARK_API_KEY: { isSecret: true },
  SMTP_HOST: { isSecret: false },
  SMTP_PORT: { isSecret: false },
  SMTP_USERNAME: { isSecret: false },
  SMTP_PASSWORD: { isSecret: true },
  EMAIL_FROM_NAME: { isSecret: false },
  EMAIL_FROM_ADDRESS: { isSecret: false },
  NOTIFICATION_EMAILS: { isSecret: false },
  // Analytics
  GA4_MEASUREMENT_ID: { isSecret: false },
  FACEBOOK_PIXEL_ID: { isSecret: false },
  GTM_ID: { isSecret: false },
  // SEO
  SEARCHATLAS_API_KEY: { isSecret: true },
  GOOGLE_SEARCH_CONSOLE_VERIFICATION: { isSecret: false },
  GOOGLE_PLACES_API_KEY: { isSecret: true },
  // Social
  META_SYSTEM_USER_TOKEN: { isSecret: true },
  GOOGLE_ADS_CUSTOMER_ID: { isSecret: false },
  LINKEDIN_API_KEY: { isSecret: true },
  // Accounting
  QBO_CLIENT_ID: { isSecret: false },
  QBO_CLIENT_SECRET: { isSecret: true },
  QBO_REALM_ID: { isSecret: false },
  QBO_ENVIRONMENT: { isSecret: false },
  // CRM
  TWILIO_ACCOUNT_SID: { isSecret: false },
  TWILIO_AUTH_TOKEN: { isSecret: true },
  TWILIO_PHONE_NUMBER: { isSecret: false },
}

function maskValue(value: string): string {
  if (value.length <= 4) return '••••'
  return '••••••••' + value.slice(-4)
}

async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }
  return session
}

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await prisma.setting.findMany()
  const settings: Record<string, { value: string; isSecret: boolean; isSet: boolean }> = {}

  // Initialize all known keys
  for (const [key, def] of Object.entries(SETTING_DEFS)) {
    settings[key] = { value: '', isSecret: def.isSecret, isSet: false }
  }

  // Fill from DB
  for (const row of rows) {
    if (settings[row.key] !== undefined) {
      settings[row.key] = {
        value: row.isSecret ? maskValue(row.value) : row.value,
        isSecret: row.isSecret,
        isSet: true,
      }
    }
  }

  // Also check env vars for anything set at the env level but not in DB
  for (const [key, def] of Object.entries(SETTING_DEFS)) {
    if (!settings[key].isSet && process.env[key]) {
      settings[key] = {
        value: def.isSecret ? maskValue(process.env[key]!) : process.env[key]!,
        isSecret: def.isSecret,
        isSet: true,
      }
    }
  }

  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { key, value } = body as { key: string; value: string }

  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'key and value are required' }, { status: 400 })
  }

  const def = SETTING_DEFS[key]
  if (!def) {
    return NextResponse.json({ error: 'Unknown setting key' }, { status: 400 })
  }

  await prisma.setting.upsert({
    where: { key },
    update: { value, isSecret: def.isSecret },
    create: { key, value, isSecret: def.isSecret },
  })

  return NextResponse.json({ success: true })
}
