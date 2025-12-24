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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="font-mono text-muted-foreground text-xs tracking-widest uppercase">
          No lists yet
        </span>
        <h2 className="mt-4 text-2xl font-medium tracking-tight">
          Create your first list
        </h2>
        <p className="text-muted-foreground mt-2 max-w-sm font-mono text-sm">
          Get started by creating a new list. You can organize your items
          and share lists with others.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-muted-foreground text-xs tracking-widest uppercase">
          Your lists
        </span>
        <span className="font-mono text-muted-foreground text-xs">
          {lists.length} {lists.length === 1 ? 'list' : 'lists'}
        </span>
      </div>
      <ul className="divide-y-0">
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
    </div>
  )
}
