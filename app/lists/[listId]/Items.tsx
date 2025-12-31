'use client'

import { api } from '@/convex/_generated/api'
import { usePreloadedQuery, useMutation } from 'convex/react'
import ItemCard from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import ItemInput from './ItemInput'
import type { PreloadedList, ClerkIdProps } from '@/types'

interface ItemsProps extends ClerkIdProps {
  /** Preloaded query data for the list */
  preloadedList: PreloadedList
  /** The unique identifier of the list */
  listId: string
}

export default function Items({ preloadedList, clerkId, listId }: ItemsProps) {
  const list = usePreloadedQuery(preloadedList)
  const clearCompletedItems = useMutation(api.items.clearCompletedItems)
  const [isClearing, setIsClearing] = useState(false)

  if (!list || !list._id) {
    return null
  }

  const listIdValue = list._id
  const completedCount = list.items.filter((item) => item.completed).length
  const pendingCount = list.items.filter((item) => !item.completed).length

  const handleClearCompleted = async () => {
    setIsClearing(true)
    try {
      await clearCompletedItems({
        listId: listIdValue,
        clerkId,
      })
    } catch (error) {
      console.error('Failed to clear completed items:', error)
    } finally {
      setIsClearing(false)
    }
  }

  if (list.items.length === 0) {
    return (
      <div className="flex flex-col max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl italic text-foreground/80">
          {list.name}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Add your first item to get started.
        </p>
        <div className="mt-8">
          <ItemInput clerkId={clerkId} listId={listId} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
      {/* List header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl italic text-foreground/80">{list.name}</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
            <span>{pendingCount} pending</span>
            <span className="text-muted-foreground/30">•</span>
            <span>{completedCount} completed</span>
          </div>
        </div>
        <Button
          onClick={handleClearCompleted}
          disabled={isClearing || completedCount === 0}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          clear completed
        </Button>
      </div>

      {/* Item input */}
      <ItemInput clerkId={clerkId} listId={listId} />

      {/* Items list */}
      <ul className="flex flex-col gap-3">
        {list.items.map((item) => (
          <ItemCard
            key={item._id}
            itemId={item._id}
            content={item.content}
            completed={item.completed}
            listId={listIdValue}
            clerkId={clerkId}
          />
        ))}
      </ul>
    </div>
  )
}
