'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as motion from 'motion/react-client'
import { Check, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const easeOut = [0.23, 1, 0.32, 1] as const

interface JoinContentProps {
  listId: string
  clerkId: string
}

export default function JoinContent({ listId, clerkId }: JoinContentProps) {
  const router = useRouter()
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const list = useQuery(api.lists.getListById, {
    listId: listId as Id<'lists'>,
  })

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
      setTimeout(() => {
        router.push(`/lists/${listId}`)
      }, 1200)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already a member')) {
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

  if (list === null) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="flex flex-col items-start"
        >
          <div className="border-border mb-6 flex size-12 items-center justify-center rounded-full border">
            <X className="text-muted-foreground size-5" />
          </div>
          <h1 className="font-display text-[40px] leading-[1.0] font-medium tracking-tight sm:text-5xl">
            List not found
          </h1>
          <p className="text-muted-foreground mt-5 max-w-md text-[15px] leading-relaxed">
            This invite link is invalid or the list has been deleted.
          </p>
          <Button asChild className="mt-8">
            <Link href="/lists">Go to your lists</Link>
          </Button>
        </motion.div>
      </Shell>
    )
  }

  if (list === undefined) {
    return (
      <Shell>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Loader2 className="text-muted-foreground size-5 animate-spin" />
        </motion.div>
      </Shell>
    )
  }

  if (success) {
    return (
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          className="flex flex-col items-start"
        >
          <div className="bg-foreground text-background mb-6 flex size-12 items-center justify-center rounded-full">
            <Check className="size-5" strokeWidth={3} />
          </div>
          <h1 className="font-display text-[40px] leading-[1.0] font-medium tracking-tight sm:text-5xl">
            Joined
          </h1>
          <p className="text-muted-foreground mt-5 text-[15px]">
            Redirecting to {list?.name}…
          </p>
        </motion.div>
      </Shell>
    )
  }

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="flex max-w-xl flex-col items-start"
      >
        <span className="text-muted-foreground text-[13px] tracking-wide uppercase">
          You’ve been invited
        </span>

        <h1 className="font-display mt-4 text-[44px] leading-[1.0] font-medium tracking-tight sm:text-6xl">
          Join “{list.name}”
        </h1>

        <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
          Accept this invitation to collaborate on this shopping list.
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground mt-4 text-[14px]"
          >
            {error}
          </motion.p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button onClick={handleJoin} disabled={isJoining} size="lg">
            {isJoining ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Joining…
              </>
            ) : (
              'Join list'
            )}
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/lists">Cancel</Link>
          </Button>
        </div>
      </motion.div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 md:px-12">
        <Link href="/lists" aria-label="listan">
          <Image src="/listan_logo.svg" alt="listan" width={88} height={40} priority />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start px-6 pt-16 pb-24 md:px-12 md:pt-24">
        {children}
      </main>
    </div>
  )
}
