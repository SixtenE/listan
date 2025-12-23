'use client'

import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:relative md:z-auto md:px-0 md:pb-0">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-4xl gap-2 rounded-2xl bg-background p-4 shadow-lg ring-1 ring-border md:rounded-xl md:shadow-none md:ring-0"
      >
        <div className="relative flex-1">
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add an item..."
            className="min-h-[60px] max-h-[120px] resize-none rounded-xl pr-12"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
              }
            }}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-[60px] w-[60px] shrink-0 rounded-xl"
          disabled={!content.trim() || isSubmitting}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
