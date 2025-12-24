'use client'

import ItemActions from '@/app/lists/[listId]/ItemActions'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ItemCardProps {
  itemId: Id<'items'>
  content: string
  completed: boolean
  listId: Id<'lists'>
  clerkId: string
  className?: string
}

export default function ItemCard({
  itemId,
  content,
  completed,
  listId,
  clerkId,
  className,
}: ItemCardProps) {
  const toggleCompleted = useMutation(api.items.toggleItemCompleted)
  const [optimisticCompleted, setOptimisticCompleted] = useState(completed)
  const isPendingRef = useRef(false)

  // Sync optimistic state with prop when it changes from server
  // Only sync if we're not currently in a pending optimistic update
  useEffect(() => {
    if (!isPendingRef.current) {
      setOptimisticCompleted(completed)
    }
  }, [completed])

  const handleToggle = async () => {
    const newCompleted = !optimisticCompleted

    // Optimistic update - update UI immediately
    isPendingRef.current = true
    setOptimisticCompleted(newCompleted)

    try {
      await toggleCompleted({
        itemId,
        completed: newCompleted,
        clerkId,
      })
    } catch (error) {
      // Revert on error
      setOptimisticCompleted(!newCompleted)
      console.error('Failed to toggle item:', error)
    } finally {
      // Reset pending flag after a short delay to allow server update to sync
      setTimeout(() => {
        isPendingRef.current = false
      }, 100)
    }
  }

  const displayCompleted = optimisticCompleted

  return (
    <li
      className={cn(
        'group relative flex w-full items-start gap-3 py-3',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'border-border mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-all',
          displayCompleted
            ? 'border-foreground bg-foreground text-background'
            : 'hover:border-foreground/50'
        )}
        aria-label={
          displayCompleted ? 'Mark as incomplete' : 'Mark as complete'
        }
      >
        {displayCompleted && <Check className="h-2.5 w-2.5" />}
      </button>
      <div className="flex-1">
        <p className={cn(
          'text-sm leading-relaxed transition-opacity',
          displayCompleted && 'text-muted-foreground line-through opacity-60'
        )}>
          {content}
        </p>
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <ItemActions
          itemId={itemId}
          listId={listId}
          clerkId={clerkId}
          initialContent={content}
        />
      </div>
    </li>
  )
}
