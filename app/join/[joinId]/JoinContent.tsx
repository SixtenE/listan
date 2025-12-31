'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { usePreloadedQuery, useQuery, useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as motion from 'motion/react-client'
import { Check, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { PreloadedList, ClerkIdProps } from '@/types'

interface JoinContentProps extends ClerkIdProps {
  /** The unique identifier of the list to join */
  listId: string
  /** Preloaded list data (optional, falls back to useQuery if not provided) */
  preloadedList?: PreloadedList | null
}

/**
 * Client Component for joining a list.
 * Uses preloaded query data when available for instant rendering,
 * falls back to useQuery if preload failed or wasn't available.
 */
export default function JoinContent({ 
  listId, 
  clerkId,
  preloadedList 
}: JoinContentProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Use preloaded query if available, otherwise fall back to regular query
  // Always call hooks unconditionally (React rules)
  const preloadedData = preloadedList ? usePreloadedQuery(preloadedList) : null
  // Always call useQuery with proper args (required by React hooks rules)
  // When preloadedList exists, we'll ignore the query result
  const queriedData = useQuery(
    api.lists.getListById,
    { listId: listId as Id<'lists'> }
  )
  
  // Prefer preloaded data, fall back to query result
  const list = preloadedData ?? queriedData

  const joinList = useMutation(api.lists.joinList)

  const handleJoin = async () => {
    setIsJoining(true)
    setError(null)

    try {
      await joinList({
        listId: listId as Id<'lists'>,
        clerkId,
      })
      setSuccess(true)
      // Redirect to the list after a short delay
      setTimeout(() => {
        router.push(`/lists/${listId}`)
      }, 1500)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already a member')) {
          // User is already a member, redirect to the list
          router.push(`/lists/${listId}`)
          return
        }
        setError(err.message)
      } else {
        setError('Failed to join list')
      }
    } finally {
      setIsJoining(false)
    }
  }

  // List not found
  if (list === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="border-border mx-auto mb-6 flex h-12 w-12 items-center justify-center border">
            <X className="text-muted-foreground h-6 w-6" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">List not found</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            This invite link is invalid or the list has been deleted.
          </p>
          <Button asChild className="mt-6 font-mono text-xs" size="sm">
            <Link href="/lists" prefetch>go to your lists</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  // Loading state (only shown if not using preloaded query)
  if (list === undefined && !preloadedList) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="text-muted-foreground mx-auto h-6 w-6 animate-spin" />
          <p className="text-muted-foreground mt-4 font-mono text-xs">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="bg-foreground text-background mx-auto mb-6 flex h-12 w-12 items-center justify-center">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight">Joined!</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Redirecting to {list.name}...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/lists"
          className="font-mono text-sm tracking-wider transition-opacity hover:opacity-70"
          prefetch
        >
          listan
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center"
        >
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            You&apos;ve been invited
          </span>

          <h1 className="mt-4 text-3xl font-medium tracking-tight">
            Join &ldquo;{list.name}&rdquo;
          </h1>

          <p className="text-muted-foreground mt-4 font-mono text-sm">
            Accept this invitation to collaborate on this shopping list.
          </p>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 font-mono text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={handleJoin}
              disabled={isJoining}
              className="font-mono text-sm"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  joining...
                </>
              ) : (
                'join list'
              )}
            </Button>
            <Button
              asChild
              variant="ghost"
              className="font-mono text-sm"
            >
              <Link href="/lists" prefetch>cancel</Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

