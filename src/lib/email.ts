import { createTransport } from 'nodemailer'

function getTransporter() {
  return createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

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
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'hello@webink.solutions'

  const transporter = getTransporter()

  const subject = `Order Confirmed — ${productName}`
  const billingType = isSubscription ? 'subscription' : 'one-time purchase'

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0F0F0F;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#14EAEA;font-size:28px;margin:0;">Webink Solutions</h1>
    </div>
    <div style="background:#1A1A1A;border-radius:16px;padding:32px;border:1px solid #333;">
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
    </div>
    <p style="color:#666;font-size:12px;text-align:center;margin-top:24px;">
      Webink Solutions · Sarasota, FL · <a href="https://dev.webink.solutions" style="color:#14EAEA;text-decoration:none;">dev.webink.solutions</a>
    </p>
  </div>
</body>
</html>`

  const text = `Thank you, ${customerName}! Your ${billingType} for ${productName} — ${variantName} (${formatCents(amount)}) has been confirmed. Visit your dashboard: https://dev.webink.solutions/dashboard`

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  })
}
