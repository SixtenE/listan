'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ListCard from '@/components/ListCard'

interface PageProps {
  preloadedLists: Preloaded<typeof api.lists.get>
  clerkId: string
}

export default function Page({ preloadedLists, clerkId }: PageProps) {
  const lists = usePreloadedQuery(preloadedLists)

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {lists.map((list) => (
        <ListCard
          key={list._id}
          listId={list._id}
          name={list.name}
          updatedAt={list.updatedAt}
          clerkId={clerkId}
        />
      ))}
    </ul>
  )
}
