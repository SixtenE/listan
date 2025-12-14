'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemCard from '@/components/ItemCard'

interface ItemsProps {
  preloadedList: Preloaded<typeof api.lists.getById>
  clerkId: string
}

export default function Page({ preloadedList, clerkId }: ItemsProps) {
  const list = usePreloadedQuery(preloadedList)

  if (!list || !list._id) {
    return null
  }

  const listId = list._id

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.items.map((item) => (
        <ItemCard
          key={item._id}
          itemId={item._id}
          content={item.content}
          listId={listId}
          clerkId={clerkId}
        />
      ))}
    </ul>
  )
}
