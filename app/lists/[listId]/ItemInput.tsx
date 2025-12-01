'use client'

import { Textarea } from '@/components/ui/textarea'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'

interface PageProps {
  clerkId: string
  listId: string
}

export default function Page({ clerkId, listId }: PageProps) {
  const addItem = useMutation(api.items.add)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const content = formData.get('content') as string

    await addItem({
      clerkId,
      listId: listId as Id<'lists'>,
      content,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full sm:w-xl">
      <Textarea name="content" placeholder="New item..." />
      <Button type="submit" className="mt-2">
        Add Item
      </Button>
    </form>
  )
}
