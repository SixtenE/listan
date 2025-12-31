'use client'

import { UserButton } from '@clerk/nextjs'
import AddListDialog from '@/components/AddListDialog'
import type { ClerkIdProps, NavigationProps } from '@/types'

interface HeaderClientProps extends ClerkIdProps, NavigationProps {
  /** Optional href for the back button */
  backHref?: string
}

/**
 * Client-side header component that handles interactive elements.
 * Separated from server component to optimize bundle size.
 */
export default function HeaderClient({
  clerkId,
  showBackButton = false,
  backHref = '/lists',
  showAddListButton = true,
}: HeaderClientProps) {
  return (
    <>
      {showAddListButton && <AddListDialog clerkId={clerkId} />}
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-8 w-8',
          },
        }}
      />
    </>
  )
}
