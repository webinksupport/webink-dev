import Stripe from 'stripe'
import { getSetting } from './settings'

let _stripe: Stripe | null = null

export async function getStripeAsync(): Promise<Stripe> {
  if (!_stripe) {
    const secretKey = await getSetting('STRIPE_SECRET_KEY')
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables or database')
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
