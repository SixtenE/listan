'use client'

import { Card, CardContent } from '@/components/ui/card'
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
  return (
    <li className="relative">
      <ListActions clerkId={clerkId} listId={listId} />
      <Link href={`/lists/${listId}`}>
        <Card className="group w-full border-none">
          <CardContent>
            <p className="text-xl font-medium">{name}</p>
            <p className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(updatedAt), {
                addSuffix: true,
              })}
            </p>
          </CardContent>
        </Card>
      </Link>
    </li>
  )
}
