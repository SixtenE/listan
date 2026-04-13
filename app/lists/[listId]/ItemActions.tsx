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
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface ItemActionsProps {
  itemId: Id<'items'>
  listId: Id<'lists'>
  clerkId: string
  initialContent: string
}

export default function ItemActions({ itemId, listId, clerkId, initialContent }: ItemActionsProps) {
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
          <Button
            className="text-muted-foreground hover:text-foreground"
            size="icon-sm"
            variant="ghost"
            aria-label="Item actions"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[10rem]" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-[14px]"
              onSelect={() => setShowEditDialog(true)}
            >
              Edit
              <Edit className="ml-auto size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDelete}
              className="text-[14px]"
            >
              Delete
              <Trash className="ml-auto size-4" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Edit item</DialogTitle>
              <DialogDescription>Update the content of this item.</DialogDescription>
            </DialogHeader>
            <textarea
              name="content"
              value={itemContent}
              onChange={(e) => setItemContent(e.target.value)}
              placeholder="Item content"
              rows={3}
              className="placeholder:text-muted-foreground border-border focus-visible:border-foreground/40 w-full resize-none rounded-xl border bg-background px-4 py-3 text-[15px] outline-none transition-colors duration-150 ease-out"
              autoFocus
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
