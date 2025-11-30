import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { tryCatch } from '@/lib/utils'
import { preloadQuery } from 'convex/nextjs'
import { notFound } from 'next/navigation'
import Items from './Items'
import AddListDialog from '@/components/AddListDialog'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

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
    <main className="relative container mx-auto flex flex-col gap-4 px-4 pt-8">
      <header className="flex w-full items-center justify-between">
        <Button
          asChild
          variant="secondary"
          className="rounded-2xl"
          size="icon-lg"
        >
          <Link href="/lists">
            <ChevronLeft />
          </Link>
        </Button>

        <div className="flex items-center justify-end gap-x-2">
          <Button variant="secondary" size="icon-lg" className="rounded-2xl">
            <UserButton />
          </Button>

          <AddListDialog clerkId="1" />
        </div>
      </header>
      <Items preloadedList={data} />
    </main>
  )
}
