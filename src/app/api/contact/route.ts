import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, service, budget, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Log for now — email sending will be configured when Resend/Postmark keys are added
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      service,
      budget,
      message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Send email notification via Resend or Postmark when keys are configured
    // const resendKey = await getSetting('RESEND_API_KEY')
    // if (resendKey) { ... }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
