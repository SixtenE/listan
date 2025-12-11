'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemCard from '@/components/ItemCard'

export default function Page({
  preloadedList,
}: {
  preloadedList: Preloaded<typeof api.lists.getById>
}) {
  const list = usePreloadedQuery(preloadedList)
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.items.map((item) => (
        <ItemCard key={item._id} itemId={item._id} content={item.content} />
      ))}
    </ul>
  )
}
