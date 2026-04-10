'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="font-urbanist font-black text-white text-3xl mb-4">
          Something went wrong
        </h2>
        <p className="font-urbanist text-white/50 mb-8">
          We hit an unexpected error. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          className="font-urbanist font-bold text-sm px-8 py-4 bg-[#14EAEA] text-[#0F0F0F] rounded-full hover:bg-white transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
