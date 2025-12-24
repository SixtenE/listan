'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemCard from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import ItemInput from './ItemInput'

interface ItemsProps {
  preloadedList: Preloaded<typeof api.lists.getListById>
  clerkId: string
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
      <div className="flex flex-col">
        <h2 className="text-2xl font-medium tracking-tight">
          {list.name}
        </h2>
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          Add your first item to get started.
        </p>
        <div className="mt-6">
          <ItemInput clerkId={clerkId} listId={listId} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* List header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight">{list.name}</h1>
        <div className="text-muted-foreground mt-1 flex items-center gap-4 font-mono text-xs">
          <span>{pendingCount} pending</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{completedCount} completed</span>
        </div>
      </div>

      {/* Item input */}
      <ItemInput clerkId={clerkId} listId={listId} />

      {/* Clear completed button */}
      {completedCount > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleClearCompleted}
            disabled={isClearing}
            variant="ghost"
            size="sm"
            className="font-mono text-xs tracking-wide"
          >
            clear completed ({completedCount})
          </Button>
        </div>
      )}

      {/* Items list */}
      <ul>
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
