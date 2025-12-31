import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import JoinContent from './JoinContent'

export const metadata: Metadata = {
  title: 'Join List | listan',
  description: 'Accept an invitation to collaborate on a shopping list.',
  robots: {
    index: false, // Don't index join links
    follow: false,
  },
}

/**
 * Join page that uses preloaded queries for better performance.
 * Preloads list data on the server to avoid client-side loading states.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ joinId: string }>
}) {
  const { joinId } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect(`/sign-in?redirect_url=/join/${joinId}`)
  }

  // Preload list data on the server
  const { data: preloadedList, error } = await tryCatch(
    preloadQuery(api.lists.getListById, {
      listId: joinId as Id<'lists'>,
    }),
  )

  // If list doesn't exist, show not found (handled by JoinContent)
  if (error || !preloadedList) {
    // Still render JoinContent to show proper error UI
  }

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-32 w-64 animate-pulse rounded-xl bg-muted" /></div>}>
      <JoinContent 
        listId={joinId} 
        clerkId={userId} 
        preloadedList={preloadedList}
      />
    </Suspense>
  )
}
