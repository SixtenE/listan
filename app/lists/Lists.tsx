'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ListCard from '@/components/ListCard'
import * as motion from 'motion/react-client'

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
        <h2 className="mb-4 font-serif text-2xl italic text-foreground/80">
          No lists yet
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Get started by creating a new list. You can organize your items
          and share lists with others.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-2xl italic text-foreground/80">
          Your Lists
        </h2>
        <span className="text-muted-foreground text-sm">
          {lists.length} {lists.length === 1 ? 'list' : 'lists'}
        </span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {lists.map((list, index) => (
          <motion.div
            key={list._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ListCard
              listId={list._id}
              name={list.name}
              updatedAt={list.updatedAt}
              clerkId={clerkId}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
