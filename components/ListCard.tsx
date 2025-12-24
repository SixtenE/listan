'use client'

import Link from 'next/link'
import ListActions from '@/app/lists/ListActions'
import { formatDistanceToNow } from 'date-fns'
import { Id } from '@/convex/_generated/dataModel'
import { ArrowUpRight } from 'lucide-react'

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
  return (
    <li className="group relative">
      <Link 
        href={`/lists/${listId}`}
        className="hover:bg-muted/50 flex items-start justify-between py-4 transition-colors"
      >
        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-muted-foreground mt-1 font-mono text-xs">
            {formatDistanceToNow(new Date(updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <ArrowUpRight className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      <div className="absolute top-4 right-6">
        <ListActions clerkId={clerkId} listId={listId} />
      </div>
    </li>
  )
}
