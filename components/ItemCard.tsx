'use client'

import { Card, CardContent } from '@/components/ui/card'
import ItemActions from '@/app/lists/[listId]/ItemActions'

interface ItemCardProps {
  itemId: string
  content: string
}

export default function ItemCard({ itemId, content }: ItemCardProps) {
  // itemId is kept for future use when ItemActions is fully implemented
  void itemId
  return (
    <li className="relative">
      <ItemActions />
      <Card className="group w-full border-none">
        <CardContent>
          <p className="text-sm font-normal">{content}</p>
        </CardContent>
      </Card>
    </li>
  )
}
