'use client'

import { Textarea } from '@/components/ui/textarea'
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
    <div className="fixed right-0 bottom-24 left-0 z-50 px-4 pb-4 md:relative md:z-auto md:px-0 md:pb-0">
      <form
        onSubmit={handleSubmit}
        className="bg-background mx-auto w-full max-w-4xl rounded-2xl p-4 shadow-lg md:rounded-xl md:shadow-none"
      >
        <div className="relative">
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add an item..."
            className="max-h-[200px] min-h-[100px] resize-none rounded-xl pr-12"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
            disabled={!content.trim() || isSubmitting}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
