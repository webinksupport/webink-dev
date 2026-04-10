export async function register() {
  // Auto-sync products to Stripe on server startup (production only)
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_RUNTIME === 'nodejs') {
    // Delay startup sync to let the server fully initialize
    setTimeout(async () => {
      try {
        const { syncProductsToStripe } = await import('@/lib/stripe-sync')
        console.log('[Startup] Running Stripe product sync...')
        const result = await syncProductsToStripe()
        console.log(
          `[Startup] Stripe sync complete: ${result.created} created, ${result.linked} linked, ${result.skipped} skipped`
        )
        if (result.errors.length > 0) {
          console.warn('[Startup] Stripe sync errors:', result.errors)
        }
      } catch (err) {
        // Non-fatal — Stripe may not be configured yet
        console.warn(
          '[Startup] Stripe auto-sync skipped:',
          err instanceof Error ? err.message : err
        )
      }
    }, 5000)
  }
}
