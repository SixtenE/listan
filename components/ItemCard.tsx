'use client'

import { Card, CardContent } from '@/components/ui/card'
import ItemActions from '@/app/lists/[listId]/ItemActions'
import { Id } from '@/convex/_generated/dataModel'

interface ItemCardProps {
  itemId: Id<'items'>
  content: string
  listId: Id<'lists'>
  clerkId: string
}

export default function ItemCard({
  itemId,
  content,
  listId,
  clerkId,
}: ItemCardProps) {
  return (
    <li className="relative">
      <ItemActions
        itemId={itemId}
        listId={listId}
        clerkId={clerkId}
        initialContent={content}
      />
      <Card className="group w-full border-none">
        <CardContent>
          <p className="text-sm font-normal">{content}</p>
        </CardContent>
      </Card>
    </li>
  )
}
