'use client'

import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemCard from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { useState } from 'react'

interface ItemsProps {
  preloadedList: Preloaded<typeof api.lists.getListById>
  clerkId: string
}

export default function Items({ preloadedList, clerkId }: ItemsProps) {
  const list = usePreloadedQuery(preloadedList)
  const clearCompletedItems = useMutation(api.items.clearCompletedItems)
  const [isClearing, setIsClearing] = useState(false)

  if (!list || !list._id) {
    return null
  }

  const listId = list._id
  const completedCount = list.items.filter((item) => item.completed).length

  const handleClearCompleted = async () => {
    setIsClearing(true)
    try {
      await clearCompletedItems({
        listId,
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="mb-2 text-2xl font-semibold">No items yet</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          Add your first item to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {completedCount > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleClearCompleted}
            disabled={isClearing}
            variant="secondary"
            className="rounded-xl border-0 bg-muted/60 hover:bg-muted/80"
          >
            Clear all completed ({completedCount})
          </Button>
        </div>
      )}
      <ul className="flex flex-col gap-2 md:flex-row md:flex-wrap">
        {list.items.map((item) => (
          <ItemCard
            key={item._id}
            itemId={item._id}
            content={item.content}
            completed={item.completed}
            listId={listId}
            clerkId={clerkId}
            className="md:min-w-[280px] md:flex-[1_1_280px]"
          />
        ))}
      </ul>
    </div>
  )
}
