import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Items from './Items'
import Header from '@/components/Header'
import ItemInput from './ItemInput'
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
    <main className="flex h-screen flex-col">
      <div className="container mx-auto px-4 pt-4">
        <Header clerkId={userId} showBackButton backHref="/lists" />
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-4">
          <Items preloadedList={data} clerkId={userId} />
        </div>
      </div>
      <ItemInput clerkId={userId} listId={listId} />
    </main>
  )
}
