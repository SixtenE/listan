'use client'

import { useState } from 'react'
import { Edit, LogOut, MoreVertical, Trash, Link2, Check, Share } from 'lucide-react'
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
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import type { ClerkIdProps } from '@/types'

interface ListActionsProps extends ClerkIdProps {
  /** The unique identifier of the list */
  listId: string
}

/**
 * A dropdown menu component that provides actions for a list.
 * Shows edit and delete options for owners, or leave option for members.
 */
export default function ListActions({ listId, clerkId }: ListActionsProps) {
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [listName, setListName] = useState('')
  const [copied, setCopied] = useState(false)

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

  const getShareLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/join/${listId}`
    }
    return ''
  }

  const handleCopyLink = async () => {
    const link = getShareLink()
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
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
            className="h-6 w-6"
            size="icon-sm"
            variant="ghost"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border w-32 border" align="end">
          {isOwner === undefined ? (
            <DropdownMenuGroup>
              <DropdownMenuItem disabled className="font-mono text-xs">
                Loading...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="font-mono text-xs"
                  onSelect={() => setShowShareDialog(true)}
                >
                  invite
                  <Link2 className="ml-auto h-3 w-3" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {isOwner ? (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="font-mono text-xs"
                    onSelect={handleOpenEditDialog}
                  >
                    edit
                    <Edit className="ml-auto h-3 w-3" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteDialog(true)}
                    className="text-destructive font-mono text-xs"
                  >
                    delete
                    <Trash className="stroke-destructive ml-auto h-3 w-3" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteDialog(true)}
                    className="text-destructive font-mono text-xs"
                  >
                    leave
                    <LogOut className="stroke-destructive ml-auto h-3 w-3" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to list</DialogTitle>
            <DialogDescription>
              Share this link to invite others to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-hidden">
            <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2">
              <code className="text-muted-foreground block w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 font-mono text-xs">
                {getShareLink()}
              </code>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="shrink-0 h-8"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  'Copy'
                )}
              </Button>
            </div>
            {typeof navigator !== 'undefined' && navigator.share && (
              <Button
                type="button"
                className="mt-3 w-full"
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: `Join "${list?.name}" on listan`,
                      text: 'You\'ve been invited to collaborate on a shopping list',
                      url: getShareLink(),
                    })
                  } catch (err) {
                    // User cancelled or share failed
                    console.log('Share cancelled or failed:', err)
                  }
                }}
              >
                <Share className="mr-2 h-3 w-3" />
                Share
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit list</DialogTitle>
              <DialogDescription>
                Update the name of this list.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <input
                name="name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="List name..."
                className="w-full rounded-lg border border-border/40 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-border focus:outline-none"
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

      {/* Delete/Leave Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
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
                    ? 'Are you sure? This action cannot be undone.'
                    : 'Are you sure you want to leave this list?'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="ghost" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
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
