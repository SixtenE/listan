'use client'

import ItemActions from '@/app/lists/[listId]/ItemActions'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Check } from 'lucide-react'
import { useState, useEffect, useRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ItemCardProps extends React.ComponentPropsWithoutRef<'li'> {
  itemId: Id<'items'>
  content: string
  completed: boolean
  listId: Id<'lists'>
  clerkId: string
}

const ItemCard = forwardRef<HTMLLIElement, ItemCardProps>(function ItemCard(
  { itemId, content, completed, listId, clerkId, className, ...props },
  ref,
) {
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

  const handleToggle = async (e: React.MouseEvent) => {
    // Prevent drag from starting when clicking the checkbox
    e.stopPropagation()

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
      ref={ref}
      className={cn(
        'group relative flex w-full items-start gap-4 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-border',
        displayCompleted && 'bg-secondary/30 border-transparent hover:border-border/40',
        className,
      )}
      {...props}
    >
      <button
        type="button"
        onClick={handleToggle}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={cn(
          'relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all touch-none',
          displayCompleted
            ? 'border-foreground bg-foreground text-background'
            : 'border-muted-foreground/30 hover:border-foreground',
        )}
        aria-label={displayCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {displayCompleted && <Check className="h-3 w-3" />}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm leading-relaxed transition-opacity break-words',
            displayCompleted ? 'text-muted-foreground line-through opacity-60' : 'text-foreground',
          )}
        >
          {content}
        </p>
      </div>
      <div
        className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100 touch-none"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <ItemActions itemId={itemId} listId={listId} clerkId={clerkId} initialContent={content} />
      </div>
    </li>
  )
})

export default ItemCard
