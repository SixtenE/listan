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
    preloadQuery(api.lists.getById, {
      listId: listId as Id<'lists'>,
    }),
  )

  if (error) {
    notFound()
  }

  return (
    <main className="relative container mx-auto flex flex-col gap-4 px-4 pt-8">
      <Header clerkId={userId} showBackButton backHref="/lists" />
      <Items preloadedList={data} clerkId={userId} />
      <ItemInput clerkId={userId} listId={listId} />
    </main>
  )
}
