'use client'

import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState, FormEvent } from 'react'

interface ItemInputProps {
  clerkId: string
  listId: string
}

export default function ItemInput({ clerkId, listId }: ItemInputProps) {
  const addItem = useMutation(api.items.createItem)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedContent = content.trim()
    if (!trimmedContent || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await addItem({
        clerkId,
        listId: listId as Id<'lists'>,
        content: trimmedContent,
      })
      setContent('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border bg-muted/50 flex items-center gap-3 border px-4 py-3"
    >
      <Plus className="text-muted-foreground h-4 w-4 shrink-0" />
      <input
        type="text"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add an item..."
        className="bg-transparent placeholder:text-muted-foreground flex-1 text-sm outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
          }
        }}
      />
      <Button
        type="submit"
        size="sm"
        className="font-mono text-xs"
        disabled={!content.trim() || isSubmitting}
      >
        add
      </Button>
    </form>
  )
}
