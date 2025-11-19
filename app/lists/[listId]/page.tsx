import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'
import Items from './Items'
import { Textarea } from '@/components/ui/textarea'

export default async function Page({
  params,
}: {
  params: Promise<{ listId: string }>
}) {
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
    <main className="container mx-auto">
      <Items preloadedList={data} />
      <Textarea placeholder="Type your message here." />
    </main>
  )
}
