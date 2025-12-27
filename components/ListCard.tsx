'use client'

import Link from 'next/link'
import ListActions from '@/app/lists/ListActions'
import { formatDistanceToNow } from 'date-fns'
import { Id } from '@/convex/_generated/dataModel'

interface ListCardProps {
  /** The unique identifier of the list */
  listId: Id<'lists'>
  /** The display name of the list */
  name: string
  /** Timestamp of when the list was last updated (in milliseconds) */
  updatedAt: number
  /** The Clerk user ID of the current user */
  clerkId: string
}

/**
 * A card component that displays a list with its name, last updated time,
 * and actions menu. Clicking the card navigates to the list detail page.
 */
export default function ListCard({
  listId,
  name,
  updatedAt,
  clerkId,
}: ListCardProps) {
  const handleActionsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Link
      href={`/lists/${listId}`}
      className="group border-border/40 from-card to-secondary hover:border-border relative flex flex-col rounded-2xl border bg-linear-to-bl p-6 transition-colors sm:p-8"
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h3 className="font-medium text-foreground">
            {name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">Shopping List</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Actions Menu */}
          <div className="relative z-10" onClick={handleActionsClick}>
            <ListActions clerkId={clerkId} listId={listId} />
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </p>
      </div>
    </Link>
  )
}
