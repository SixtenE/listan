'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'

interface AddListDialogProps {
  /** The Clerk user ID of the current user */
  clerkId: string
}

/**
 * A dialog component that allows users to create a new list.
 * Provides a form with a text input for the list name.
 */
export default function AddListDialog({ clerkId }: AddListDialogProps) {
  const add = useMutation(api.lists.createList)
  const [open, setOpen] = useState(false)
  const [listName, setListName] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = listName.trim()

    if (!name) {
      return
    }

    await add({ name, clerkId })
    setListName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="rounded-2xl">
          <Plus className="stroke-3" />
          new list
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-none sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new list</DialogTitle>
            <DialogDescription>
              Enter a name for your new list. You can edit it later if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name"
                name="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                className="rounded-xl"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" className="rounded-xl" disabled={!listName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
