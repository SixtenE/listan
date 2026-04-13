"use client";

import { useState } from "react";
import {
  Edit,
  LogOut,
  MoreVertical,
  Trash,
  Link2,
  Check,
  Share,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ListActionsProps {
  /** The unique identifier of the list */
  listId: string;
  /** The Clerk user ID of the current user */
  clerkId: string;
}

/**
 * A dropdown menu component that provides actions for a list.
 * Shows edit and delete options for owners, or leave option for members.
 */
export default function ListActions({ listId, clerkId }: ListActionsProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [listName, setListName] = useState("");
  const [copied, setCopied] = useState(false);

  const isOwner = useQuery(api.lists.isListOwner, {
    listId: listId as Id<"lists">,
    clerkId,
  });

  const list = useQuery(api.lists.getListById, {
    listId: listId as Id<"lists">,
  });

  const renameList = useMutation(api.lists.renameList);
  const deleteList = useMutation(api.lists.deleteList);
  const leaveList = useMutation(api.lists.leaveList);

  const handleOpenEditDialog = () => {
    setListName(list?.name ?? "");
    setShowEditDialog(true);
  };

  const handleCloseEditDialog = (open: boolean) => {
    setShowEditDialog(open);
    if (!open) {
      setListName(list?.name ?? "");
    }
  };

  const getShareLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/join/${listId}`;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const link = getShareLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  async function handleEdit() {
    if (listName.trim() && listName !== list?.name) {
      await renameList({
        listId: listId as Id<"lists">,
        newName: listName.trim(),
        clerkId,
      });
    }
    setShowEditDialog(false);
  }

  async function handleDelete() {
    // Don't proceed if ownership status is still loading
    if (isOwner === undefined) {
      return;
    }

    try {
      if (isOwner) {
        await deleteList({
          listId: listId as Id<"lists">,
          clerkId,
        });
      } else {
        await leaveList({
          listId: listId as Id<"lists">,
          clerkId,
        });
      }
      setShowDeleteDialog(false);
      router.push("/lists");
    } catch (error) {
      console.error("Failed to delete/leave list:", error);
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
            aria-label="List actions"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[10rem]" align="end">
          {isOwner === undefined ?
            <DropdownMenuGroup>
              <DropdownMenuItem disabled className="text-[14px]">
                Loading...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          : <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-[14px]"
                  onSelect={() => setShowShareDialog(true)}
                >
                  Invite
                  <Link2 className="ml-auto size-4" />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {isOwner ?
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="text-[14px]"
                    onSelect={handleOpenEditDialog}
                  >
                    Edit
                    <Edit className="ml-auto size-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteDialog(true)}
                    className="text-[14px]"
                  >
                    Delete
                    <Trash className="ml-auto size-4" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              : <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => setShowDeleteDialog(true)}
                    className="text-[14px]"
                  >
                    Leave
                    <LogOut className="ml-auto size-4" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              }
            </>
          }
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
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-background py-1.5 pr-1.5 pl-5">
              <code className="text-muted-foreground block w-0 flex-1 truncate font-mono text-[13px]">
                {getShareLink()}
              </code>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="shrink-0"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Copied
                  </>
                ) : (
                  "Copy"
                )}
              </Button>
            </div>
            {typeof navigator !== "undefined" && navigator.share && (
              <Button
                type="button"
                className="w-full"
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: `Join "${list?.name}" on listan`,
                      text: "You've been invited to collaborate on a shopping list",
                      url: getShareLink(),
                    });
                  } catch (err) {
                    console.log("Share cancelled or failed:", err);
                  }
                }}
              >
                <Share className="size-4" />
                Share
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={handleCloseEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit list</DialogTitle>
            <DialogDescription>Update the name of this list.</DialogDescription>
          </DialogHeader>
          <Input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="List name"
            autoFocus
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete/Leave Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isOwner === undefined ?
                "Loading..."
              : isOwner ?
                "Delete list"
              : "Leave list"}
            </DialogTitle>
            <DialogDescription>
              {isOwner === undefined ?
                "Please wait..."
              : isOwner ?
                "Are you sure? This action cannot be undone."
              : "Are you sure you want to leave this list?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isOwner === undefined}
              onClick={handleDelete}
            >
              {isOwner === undefined ?
                "Loading..."
              : isOwner ?
                "Delete"
              : "Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
