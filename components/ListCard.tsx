'use client'

import Link from 'next/link'
import ListActions from '@/app/lists/ListActions'
import { Id } from '@/convex/_generated/dataModel'
import { ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ListCardProps {
  listId: Id<'lists'>
  name: string
  updatedAt: number
  pendingCount: number
  completedCount: number
  memberCount: number
  clerkId: string
}

export default function ListCard({
  listId,
  name,
  updatedAt,
  pendingCount,
  completedCount,
  memberCount,
  clerkId,
}: ListCardProps) {
  const handleActionsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const total = pendingCount + completedCount
  const summary =
    total === 0
      ? 'No items yet'
      : pendingCount === 0
        ? `All ${total} done`
        : `${pendingCount} left${completedCount ? ` · ${completedCount} done` : ''}`

  const people =
    memberCount === 1
      ? 'Just you'
      : `Shared with ${memberCount - 1} ${memberCount - 1 === 1 ? 'other' : 'others'}`

  return (
    <Link
      href={`/lists/${listId}`}
      className="group border-border hover:border-foreground/30 relative flex flex-col rounded-xl border bg-background p-6 transition-colors duration-150 ease-out"
    >
      <div className="absolute top-4 right-4 z-10" onClick={handleActionsClick}>
        <ListActions clerkId={clerkId} listId={listId} />
      </div>

      <p className="text-muted-foreground text-[14px] leading-[1.43]">{people}</p>
      <h3 className="font-display mt-1.5 truncate pr-10 text-[24px] leading-[1.2] font-medium tracking-tight text-foreground">
        {name}
      </h3>
      <p className="text-muted-foreground mt-1.5 text-[14px] leading-[1.43]">{summary}</p>

      <div className="mt-8 flex items-end justify-between gap-3">
        <p className="text-muted-foreground text-[12px] leading-[1.33]">
          Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </p>
        <span
          aria-label="Open list"
          className="border-border group-hover:border-foreground/40 inline-flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-foreground transition-colors duration-150 ease-out"
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  )
}
