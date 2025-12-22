'use client'

import { useState, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

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
import { Field, FieldGroup } from '@/components/ui/field'
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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

  async function handleDeleteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await deleteItem({
        itemId,
        clerkId,
      })
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-lg"
            size="icon-sm"
            variant="ghost"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="border-none bg-transparent sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit</DialogTitle>
              <DialogDescription>
                Update the content of this item.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="pb-3">
              <Field>
                <Textarea
                  name="content"
                  value={itemContent}
                  onChange={(e) => setItemContent(e.target.value)}
                  placeholder="Edit your item..."
                  className="resize-none rounded-xl"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
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
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="border-none bg-transparent sm:max-w-[425px]">
          <form onSubmit={handleDeleteSubmit}>
            <DialogHeader>
              <DialogTitle>Delete item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="rounded-xl">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                className="rounded-xl"
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
