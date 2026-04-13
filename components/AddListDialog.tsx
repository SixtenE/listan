'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Plus } from 'lucide-react'
import { FormEvent, useState } from 'react'

interface AddListDialogProps {
  clerkId: string
}

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
        <Button size="sm">
          <Plus className="size-4" />
          New list
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Create a new list</DialogTitle>
            <DialogDescription>
              Give it a name — you can share it with anyone later.
            </DialogDescription>
          </DialogHeader>
          <Input
            id="name"
            name="name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g. Weekend groceries"
            autoFocus
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!listName.trim()}>
              Create list
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
