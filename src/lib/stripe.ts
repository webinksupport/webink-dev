import Stripe from 'stripe'
import { getSetting } from './settings'

let _stripe: Stripe | null = null
let _lastTestMode: string | null = null

export async function getStripeAsync(): Promise<Stripe> {
  const testMode = await getSetting('STRIPE_TEST_MODE')
  const isTestMode = testMode === 'true'

  // Reset cached client if test mode changed
  if (_stripe && _lastTestMode !== null && _lastTestMode !== (testMode ?? 'false')) {
    _stripe = null
  }
  _lastTestMode = testMode ?? 'false'

  if (!_stripe) {
    const keyName = isTestMode ? 'STRIPE_TEST_SECRET_KEY' : 'STRIPE_SECRET_KEY'
    const secretKey = await getSetting(keyName)
    if (!secretKey) {
      const modeLabel = isTestMode ? 'Test' : 'Live'
      throw new Error(`Stripe ${modeLabel} Secret Key is not configured. Please add it in Settings > Integrations.`)
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return _stripe
}

/**
 * Reset cached Stripe instance (e.g. after key rotation via admin UI).
 */
export function resetStripeClient() {
  _stripe = null
}

// Synchronous fallback for existing code — uses env var directly
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop)
  },
})
