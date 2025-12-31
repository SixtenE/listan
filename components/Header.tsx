import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HeaderClient from './HeaderClient'
import type { ClerkIdProps, NavigationProps } from '@/types'

interface HeaderProps extends ClerkIdProps, NavigationProps {
  /** Optional href for the back button */
  backHref?: string
}

/**
 * Server Component header that handles navigation structure.
 * Delegates client-side interactivity to HeaderClient component.
 * This separation optimizes bundle size by keeping server components lightweight.
 */
export default function Header({
  clerkId,
  showBackButton = false,
  backHref = '/lists',
  showAddListButton = true,
}: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between py-6">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-3"
          >
            <Link href={backHref} prefetch>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
        ) : (
          <Link
            href="/lists"
            className="font-mono text-lg font-medium tracking-tight"
            prefetch
          >
            listan
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <HeaderClient
          clerkId={clerkId}
          showAddListButton={showAddListButton}
        />
      </div>
    </header>
  )
}
