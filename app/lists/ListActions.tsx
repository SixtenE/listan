'use client'

import { useState } from 'react'
import { Edit, LogOut, MoreVertical, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface ListActionsProps {
  /** The unique identifier of the list */
  listId: string
  /** The Clerk user ID of the current user */
  clerkId: string
}

/**
 * A dropdown menu component that provides actions for a list.
 * Shows edit and delete options for owners, or leave option for members.
 */
export default function ListActions({ listId, clerkId }: ListActionsProps) {
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [listName, setListName] = useState('')

  const isOwner = useQuery(api.lists.isListOwner, {
    listId: listId as Id<'lists'>,
    clerkId,
  })

  const list = useQuery(api.lists.getListById, {
    listId: listId as Id<'lists'>,
  })

  const renameList = useMutation(api.lists.renameList)
  const deleteList = useMutation(api.lists.deleteList)
  const leaveList = useMutation(api.lists.leaveList)

  const handleOpenEditDialog = () => {
    setListName(list?.name ?? '')
    setShowEditDialog(true)
  }

  const handleCloseEditDialog = (open: boolean) => {
    setShowEditDialog(open)
    if (!open) {
      setListName(list?.name ?? '')
    }
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newName = formData.get('name') as string

    if (newName.trim() && newName !== list?.name) {
      await renameList({
        listId: listId as Id<'lists'>,
        newName: newName.trim(),
        clerkId,
      })
    }
    setShowEditDialog(false)
  }

  async function handleDeleteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Don't proceed if ownership status is still loading
    if (isOwner === undefined) {
      return
    }

    try {
      if (isOwner) {
        await deleteList({
          listId: listId as Id<'lists'>,
          clerkId,
        })
      } else {
        await leaveList({
          listId: listId as Id<'lists'>,
          clerkId,
        })
      }
      setShowDeleteDialog(false)
      router.push('/lists')
    } catch (error) {
      console.error('Failed to delete/leave list:', error)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            className="absolute top-2 right-2 rounded-lg"
            size="icon-sm"
            variant="ghost"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 rounded-xl" align="end">
          {isOwner === undefined ? (
            <DropdownMenuGroup>
              <DropdownMenuItem disabled className="rounded-lg">
                Loading...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : isOwner ? (
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="rounded-lg"
                onSelect={handleOpenEditDialog}
              >
                Edit
                <Edit className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="text-destructive rounded-lg"
              >
                Delete
                <Trash className="stroke-destructive ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                className="text-destructive rounded-lg"
              >
                Leave
                <LogOut className="stroke-destructive ml-auto h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="border-none bg-transparent sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit list</DialogTitle>
              <DialogDescription>
                Update the name of this list. Changes will be saved immediately.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="pb-3">
              <Field>
                <Textarea
                  name="name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Edit your list..."
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
              <DialogTitle>
                {isOwner === undefined
                  ? 'Loading...'
                  : isOwner
                    ? 'Delete list'
                    : 'Leave list'}
              </DialogTitle>
              <DialogDescription>
                {isOwner === undefined
                  ? 'Please wait...'
                  : isOwner
                    ? 'Are you sure you want to delete this list? This action cannot be undone.'
                    : 'Are you sure you want to leave this list? You will no longer have access to it.'}
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
                disabled={isOwner === undefined}
              >
                {isOwner === undefined
                  ? 'Loading...'
                  : isOwner
                    ? 'Delete'
                    : 'Leave'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
