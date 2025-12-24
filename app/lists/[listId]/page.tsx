import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Items from './Items'
import Header from '@/components/Header'
import { auth } from '@clerk/nextjs/server'

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
    <div className="min-h-screen">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]" />
      
      <main className="relative mx-auto max-w-2xl px-6 py-8">
        <Header
          clerkId={userId}
          showBackButton
          backHref="/lists"
          showAddListButton={false}
        />
        <div className="mt-8">
          <Items preloadedList={data} clerkId={userId} listId={listId} />
        </div>
      </main>
    </div>
  )
}
