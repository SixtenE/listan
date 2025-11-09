'use client'

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-primary h-6 w-6" />
          <span className="text-xl font-bold">Listan</span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="hover:text-primary text-sm transition"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-primary text-sm transition"
          >
            How it works
          </Link>
          <Link href="#" className="hover:text-primary text-sm transition">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm">Get started</Button>
        </div>
      </div>
    </header>
  )
}
