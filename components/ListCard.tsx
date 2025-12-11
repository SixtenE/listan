'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import ListActions from '@/app/lists/ListActions'
import { formatDistanceToNow } from 'date-fns'
import { Id } from '@/convex/_generated/dataModel'

interface ListCardProps {
  listId: Id<'lists'>
  name: string
  updatedAt: number
  clerkId: string
}

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
