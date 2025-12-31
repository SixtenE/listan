'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Error boundary for the list detail page.
 * Handles errors that occur during data fetching or rendering.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    console.error('List detail page error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="mb-4 font-serif text-2xl italic text-foreground/80">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          {error.message || 'An unexpected error occurred while loading this list.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default" size="sm">
            Try again
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/lists">Back to lists</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
