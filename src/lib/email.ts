import { createTransport } from 'nodemailer'
import { getSettings } from './settings'

async function getTransporter() {
  const s = await getSettings(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD'])
  return createTransport({
    host: s.SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(s.SMTP_PORT || process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: s.SMTP_USERNAME || process.env.SMTP_USER,
      pass: s.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
  })
}

async function getFromAddress(): Promise<string> {
  const s = await getSettings(['EMAIL_FROM_NAME', 'EMAIL_FROM_ADDRESS'])
  const name = s.EMAIL_FROM_NAME || 'Webink Solutions'
  const address = s.EMAIL_FROM_ADDRESS || process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@webink.solutions'
  return `"${name}" <${address}>`
}

async function getNotificationRecipients(): Promise<string[]> {
  const s = await getSettings(['NOTIFICATION_EMAILS'])
  const raw = s.NOTIFICATION_EMAILS || 'sean@webink.solutions'
  return raw.split(',').map((e: string) => e.trim()).filter(Boolean)
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#14EAEA;font-size:28px;margin:0;">Webink Solutions</h1>
    </div>
    <div style="background:#1A1A1A;border-radius:16px;padding:32px;border:1px solid #333;">
      ${content}
    </div>
    <p style="color:#666;font-size:12px;text-align:center;margin-top:24px;">
      Webink Solutions · Sarasota, FL · <a href="https://dev.webink.solutions" style="color:#14EAEA;text-decoration:none;">dev.webink.solutions</a>
    </p>
  </div>
</body>
</html>`
}

// ─── Purchase Confirmation (to customer) ─────────────────────────────

interface PurchaseEmailOptions {
  to: string
  customerName: string
  productName: string
  variantName: string
  amount: number // cents
  isSubscription: boolean
}

export async function sendPurchaseConfirmation(opts: PurchaseEmailOptions) {
  const { to, customerName, productName, variantName, amount, isSubscription } = opts
  const from = await getFromAddress()
  const transporter = await getTransporter()
  const billingType = isSubscription ? 'subscription' : 'one-time purchase'

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Thank you, ${customerName}!</h2>
      <p style="color:#999;font-size:14px;margin:0 0 24px;">Your ${billingType} has been confirmed.</p>
      
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Order Details</p>
        <p style="color:#fff;font-size:16px;font-weight:bold;margin:0 0 4px;">${productName} — ${variantName}</p>
        <p style="color:#14EAEA;font-size:20px;font-weight:bold;margin:0;">${formatCents(amount)}</p>
      </div>

      <p style="color:#999;font-size:14px;margin:0 0 24px;">
        ${isSubscription 
          ? 'Your subscription is now active. You can manage it anytime from your dashboard.' 
          : 'Your purchase is complete. Check your dashboard for details.'}
      </p>

      <a href="https://dev.webink.solutions/dashboard" 
         style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        View Dashboard
      </a>
  `)

  const text = `Thank you, ${customerName}! Your ${billingType} for ${productName} — ${variantName} (${formatCents(amount)}) has been confirmed. Visit your dashboard: https://dev.webink.solutions/dashboard`

  await transporter.sendMail({ from, to, subject: `Order Confirmed — ${productName}`, text, html })
}

// ─── Admin Notification: New Order/Subscription ──────────────────────

interface AdminOrderNotificationOptions {
  customerName: string
  customerEmail: string
  productName: string
  variantName: string
  amount: number // cents
  isSubscription: boolean
}

export async function sendAdminOrderNotification(opts: AdminOrderNotificationOptions) {
  const { customerName, customerEmail, productName, variantName, amount, isSubscription } = opts
  const recipients = await getNotificationRecipients()
  if (recipients.length === 0) return

  const from = await getFromAddress()
  const transporter = await getTransporter()
  const type = isSubscription ? 'New Subscription' : 'New Order'

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">📦 ${type}</h2>
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:16px;">
        <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Details</p>
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Product:</strong> ${productName} — ${variantName}</p>
        <p style="color:#14EAEA;font-size:20px;font-weight:bold;margin:0;">${formatCents(amount)}</p>
      </div>
      <a href="https://dev.webink.solutions/admin/orders" 
         style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        View in Admin
      </a>
  `)

  const text = `${type}: ${customerName} (${customerEmail}) — ${productName} — ${variantName} — ${formatCents(amount)}`

  for (const to of recipients) {
    try {
      await transporter.sendMail({ from, to, subject: `${type}: ${customerName} — ${productName}`, text, html })
    } catch (err) {
      console.error(`[email] Failed to send admin notification to ${to}:`, err)
    }
  }
}

// ─── Cancellation Email (to customer) ────────────────────────────────

interface CancellationEmailOptions {
  to: string
  customerName: string
  productName: string
  variantName: string
  periodEndDate: Date | null
}

export async function sendCancellationEmail(opts: CancellationEmailOptions) {
  const { to, customerName, productName, variantName, periodEndDate } = opts
  const from = await getFromAddress()
  const transporter = await getTransporter()
  const endDate = periodEndDate ? periodEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'end of your billing period'

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Subscription Cancelled</h2>
      <p style="color:#999;font-size:14px;margin:0 0 24px;">Hi ${customerName},</p>
      
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#fff;font-size:16px;font-weight:bold;margin:0 0 4px;">${productName} — ${variantName}</p>
        <p style="color:#999;font-size:14px;margin:0;">Your subscription has been cancelled.</p>
      </div>

      <p style="color:#999;font-size:14px;margin:0 0 24px;">
        Your service will remain active until <strong style="color:#fff;">${endDate}</strong>. 
        After that date, you will no longer be charged.
      </p>

      <p style="color:#999;font-size:14px;margin:0 0 24px;">
        Changed your mind? You can reactivate anytime from your dashboard before your current period ends.
      </p>

      <a href="https://dev.webink.solutions/dashboard/subscriptions" 
         style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        Manage Subscriptions
      </a>
  `)

  const text = `Hi ${customerName}, your ${productName} (${variantName}) subscription has been cancelled. It will remain active until ${endDate}. Manage subscriptions: https://dev.webink.solutions/dashboard/subscriptions`

  await transporter.sendMail({ from, to, subject: `Subscription Cancelled — ${productName}`, text, html })
}

// ─── Admin Cancellation Notification ─────────────────────────────────

interface AdminCancellationOptions {
  customerName: string
  customerEmail: string
  productName: string
  variantName: string
  cancelledBy: 'admin' | 'customer' | 'stripe'
}

export async function sendAdminCancellationNotification(opts: AdminCancellationOptions) {
  const { customerName, customerEmail, productName, variantName, cancelledBy } = opts
  const recipients = await getNotificationRecipients()
  if (recipients.length === 0) return

  const from = await getFromAddress()
  const transporter = await getTransporter()

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">🚫 Subscription Cancelled</h2>
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:16px;">
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Product:</strong> ${productName} — ${variantName}</p>
        <p style="color:#999;font-size:14px;margin:0;">Cancelled by: ${cancelledBy}</p>
      </div>
      <a href="https://dev.webink.solutions/admin/subscriptions" 
         style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        View Subscriptions
      </a>
  `)

  const text = `Subscription cancelled: ${customerName} (${customerEmail}) — ${productName} — ${variantName} — by ${cancelledBy}`

  for (const to of recipients) {
    try {
      await transporter.sendMail({ from, to, subject: `Subscription Cancelled: ${customerName} — ${productName}`, text, html })
    } catch (err) {
      console.error(`[email] Failed to send cancellation notification to ${to}:`, err)
    }
  }
}

// ─── Payment Failed Email (to customer) ──────────────────────────────

interface PaymentFailedEmailOptions {
  to: string
  customerName: string
  productName: string
  amount: number // cents
  failureReason?: string
}

export async function sendPaymentFailedEmail(opts: PaymentFailedEmailOptions) {
  const { to, customerName, productName, amount, failureReason } = opts
  const from = await getFromAddress()
  const transporter = await getTransporter()

  const reasonText = failureReason ? ` (${failureReason.replace(/_/g, ' ')})` : ''

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">⚠️ Payment Failed</h2>
      <p style="color:#999;font-size:14px;margin:0 0 24px;">Hi ${customerName},</p>
      
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#fff;font-size:16px;font-weight:bold;margin:0 0 4px;">${productName}</p>
        <p style="color:red;font-size:14px;margin:0;">Payment of ${formatCents(amount)} failed${reasonText}</p>
      </div>

      <p style="color:#999;font-size:14px;margin:0 0 24px;">
        Please update your payment method to avoid service interruption. 
        Your subscription will remain active while we retry payment.
      </p>

      <a href="https://dev.webink.solutions/dashboard/subscriptions" 
         style="display:inline-block;background:#F813BE;color:#fff;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        Update Payment Method
      </a>
  `)

  const text = `Hi ${customerName}, your payment of ${formatCents(amount)} for ${productName} failed${reasonText}. Please update your payment method: https://dev.webink.solutions/dashboard/subscriptions`

  await transporter.sendMail({ from, to, subject: `Payment Failed — ${productName}`, text, html })
}

// ─── Admin Payment Failed Notification ───────────────────────────────

interface AdminPaymentFailedOptions {
  customerName: string
  customerEmail: string
  productName: string
  amount: number // cents
  failureReason?: string
}

export async function sendAdminPaymentFailedNotification(opts: AdminPaymentFailedOptions) {
  const { customerName, customerEmail, productName, amount, failureReason } = opts
  const recipients = await getNotificationRecipients()
  if (recipients.length === 0) return

  const from = await getFromAddress()
  const transporter = await getTransporter()
  const reasonText = failureReason ? ` (${failureReason.replace(/_/g, ' ')})` : ''

  const html = emailWrapper(`
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">⚠️ Payment Failed</h2>
      <div style="background:#0F0F0F;border-radius:12px;padding:20px;margin-bottom:16px;">
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p style="color:#fff;font-size:16px;margin:0 0 4px;"><strong>Product:</strong> ${productName}</p>
        <p style="color:red;font-size:14px;margin:0;">Failed: ${formatCents(amount)}${reasonText}</p>
      </div>
      <a href="https://dev.webink.solutions/admin/subscriptions" 
         style="display:inline-block;background:#14EAEA;color:#0A0A0A;font-weight:bold;padding:14px 28px;border-radius:100px;text-decoration:none;font-size:14px;">
        View Subscriptions
      </a>
  `)

  const text = `Payment failed: ${customerName} (${customerEmail}) — ${productName} — ${formatCents(amount)}${reasonText}`

  for (const to of recipients) {
    try {
      await transporter.sendMail({ from, to, subject: `Payment Failed: ${customerName} — ${productName}`, text, html })
    } catch (err) {
      console.error(`[email] Failed to send payment failed notification to ${to}:`, err)
    }
  }
}
