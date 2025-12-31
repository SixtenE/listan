import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * Server Component for landing page navigation.
 * Extracted from LandingContent to reduce client bundle size.
 */
export function LandingNav() {
  return (
    <nav className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link href="/" className="font-mono text-lg font-medium tracking-tight" prefetch>
        listan
      </Link>
      <div className="flex items-center gap-4 text-sm md:gap-6">
        <Link
          href="/sign-in"
          className="text-muted-foreground hover:text-foreground transition-colors"
          prefetch
        >
          Sign in
        </Link>
        <Link
          href="/lists"
          className="text-foreground transition-opacity hover:opacity-70"
          prefetch
        >
          Get started <ArrowRight className="ml-1 inline-block h-3 w-3" />
        </Link>
      </div>
    </nav>
  )
}
