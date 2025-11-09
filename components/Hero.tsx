'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="px-6 pt-20 pb-16 md:pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-3xl leading-tight font-bold text-balance md:text-6xl">
          Collaborative shopping lists that actually work
        </h1>

        <p className="text-md text-muted-foreground mx-auto mb-8 max-w-2xl text-balance md:text-xl">
          Keep your household or group shopping organized. Share lists in
          real-time, track who&apos;s buying what, and never forget an item
          again.
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/lists">Start for free</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
