import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Items from './Items'
import Header from '@/components/Header'
import { auth } from '@clerk/nextjs/server'

/**
 * Generate metadata for the list detail page.
 * Uses the list name from the preloaded query for dynamic metadata.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ listId: string }>
}): Promise<Metadata> {
  const { userId } = await auth()

  if (!userId) {
    return {
      title: 'List | listan',
    }
  }

  const { listId } = await params
  const { data: list } = await tryCatch(
    preloadQuery(api.lists.getListById, {
      listId: listId as Id<'lists'>,
    }),
  )

  if (!list) {
    return {
      title: 'List Not Found | listan',
    }
  }

  return {
    title: `${list.name} | listan`,
    description: `Shopping list: ${list.name}. ${list.items.length} items.`,
    openGraph: {
      title: `${list.name} | listan`,
      description: `Shopping list: ${list.name}`,
      type: 'website',
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { listId } = await params

  const { data, error } = await tryCatch(
    preloadQuery(api.lists.getListById, {
      listId: listId as Id<'lists'>,
    }),
  )

  if (error) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <Header
          clerkId={userId}
          showBackButton
          backHref="/lists"
          showAddListButton={false}
        />
        <div className="pb-20 mt-8">
          <Suspense fallback={<div className="max-w-2xl mx-auto h-32 animate-pulse rounded-xl bg-muted" />}>
            <Items preloadedList={data} clerkId={userId} listId={listId} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
