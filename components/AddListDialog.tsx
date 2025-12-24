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
        <Button variant="ghost" size="sm" className="font-mono text-xs tracking-wide">
          <Plus className="mr-1 h-3 w-3" />
          new list
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-background max-w-md border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-medium tracking-tight">
              Create new list
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Enter a name for your new list.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <input
              id="name"
              name="name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List name..."
              className="border-border bg-transparent placeholder:text-muted-foreground w-full border-b py-2 font-mono text-sm outline-none transition-colors focus:border-foreground"
              autoFocus
            />
          </div>
          <DialogFooter className="mt-6">
            <Button 
              type="submit" 
              size="sm"
              className="font-mono text-xs tracking-wide" 
              disabled={!listName.trim()}
            >
              create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
