'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemCard from '@/components/ItemCard'

interface ItemsProps {
  preloadedList: Preloaded<typeof api.lists.getListById>
  clerkId: string
}

export default function Items({ preloadedList, clerkId }: ItemsProps) {
  const list = usePreloadedQuery(preloadedList)

  if (!list || !list._id) {
    return null
  }

  const listId = list._id

  if (list.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-2 text-2xl font-semibold">No items yet</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Add your first item to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {list.items.map((item) => (
        <ItemCard
          key={item._id}
          itemId={item._id}
          content={item.content}
          completed={item.completed}
          listId={listId}
          clerkId={clerkId}
        />
      ))}
    </ul>
  )
}
