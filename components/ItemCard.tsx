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
        'group relative flex w-full items-start gap-2 md:w-auto',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          displayCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 hover:border-primary'
        }`}
        aria-label={
          displayCompleted ? 'Mark as incomplete' : 'Mark as complete'
        }
      >
        {displayCompleted && <Check className="h-3 w-3" />}
      </button>
      <div
        className={cn(
          'bg-muted group-hover:bg-muted/80 relative flex-1 rounded-xl px-6 py-4 transition-colors md:px-8 md:py-5',
          displayCompleted && 'opacity-60',
        )}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        <div className="absolute top-2 right-2">
          <ItemActions
            itemId={itemId}
            listId={listId}
            clerkId={clerkId}
            initialContent={content}
          />
        </div>
      </div>
    </li>
  )
}
