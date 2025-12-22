'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ListCard from '@/components/ListCard'

interface ListsProps {
  /** Preloaded query data for the user's lists */
  preloadedLists: Preloaded<typeof api.lists.getListsByUser>
  /** The Clerk user ID of the current user */
  clerkId: string
}

/**
 * A component that displays a grid of list cards for the current user.
 * Uses preloaded query data for optimal performance.
 * Shows an empty state when no lists exist.
 */
export default function Lists({ preloadedLists, clerkId }: ListsProps) {
  const lists = usePreloadedQuery(preloadedLists)

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-2 text-2xl font-semibold">No lists yet</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Get started by creating your first list. You can organize your items
          and share lists with others.
        </p>
      </div>
    )
  }

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
