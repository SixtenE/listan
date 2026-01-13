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
          <Button className="h-6 w-6" size="icon-sm" variant="ghost">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border w-32 border" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="font-mono text-xs"
              onSelect={() => setShowEditDialog(true)}
            >
              edit
              <Edit className="ml-auto h-3 w-3" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleDelete}
              className="text-destructive font-mono text-xs"
            >
              delete
              <Trash className="stroke-destructive ml-auto h-3 w-3" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit item</DialogTitle>
              <DialogDescription>Update the content of this item.</DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <textarea
                name="content"
                value={itemContent}
                onChange={(e) => setItemContent(e.target.value)}
                placeholder="Item content..."
                rows={3}
                className="w-full resize-none rounded-lg border border-border/40 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-border focus:outline-none"
                autoFocus
              />
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" size="sm">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
