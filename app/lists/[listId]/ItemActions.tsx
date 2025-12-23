'use client'

import { useState, useEffect } from 'react'
import { Edit, MoreVertical, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface ItemActionsProps {
  itemId: Id<'items'>
  listId: Id<'lists'>
  clerkId: string
  initialContent: string
}

export default function ItemActions({
  itemId,
  listId,
  clerkId,
  initialContent,
}: ItemActionsProps) {
  // listId is kept for future use (e.g., for permission checks)
  void listId

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [itemContent, setItemContent] = useState(initialContent)

  const editItem = useMutation(api.items.updateItem)
  const deleteItem = useMutation(api.items.deleteItem)

  useEffect(() => {
    setItemContent(initialContent)
  }, [initialContent])

  useEffect(() => {
    if (!showEditDialog) {
      setItemContent(initialContent)
    }
  }, [showEditDialog, initialContent])

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newContent = formData.get('content') as string

    if (newContent.trim() && newContent !== initialContent) {
      await editItem({
        itemId,
        content: newContent.trim(),
        clerkId,
      })
    }
    setShowEditDialog(false)
  }

  async function handleDelete() {
    try {
      await deleteItem({
        itemId,
        clerkId,
      })
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-lg" size="icon-sm" variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 rounded-xl" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="rounded-lg"
              onSelect={() => setShowEditDialog(true)}
            >
              Edit
              <Edit className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDelete}
              className="text-destructive rounded-lg"
            >
              Delete
              <Trash className="stroke-destructive ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-background border-none sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Update the content of this item.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-3">
                <Textarea
                  name="content"
                  value={itemContent}
                  onChange={(e) => setItemContent(e.target.value)}
                  placeholder="Edit your item..."
                  className="resize-none rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-xl">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-xl">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
