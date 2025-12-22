'use client'

import ItemActions from '@/app/lists/[listId]/ItemActions'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface ItemCardProps {
  itemId: Id<'items'>
  content: string
  completed: boolean
  listId: Id<'lists'>
  clerkId: string
}

export default function ItemCard({
  itemId,
  content,
  completed,
  listId,
  clerkId,
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
    <li className="group relative flex items-start gap-2">
      <button
        type="button"
        onClick={handleToggle}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
          displayCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30 hover:border-primary'
        }`}
        aria-label={displayCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {displayCompleted && <Check className="h-3 w-3" />}
      </button>
      <div
        className={`bg-muted group-hover:bg-muted/80 flex-1 rounded-xl px-4 py-3 transition-colors ${
          displayCompleted ? 'opacity-60' : ''
        }`}
      >
        <p
          className={`text-sm leading-relaxed ${
            displayCompleted ? 'line-through' : ''
          }`}
        >
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
