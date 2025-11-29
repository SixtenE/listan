import { api } from '@/convex/_generated/api'
import { tryCatch } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Lists from './Lists'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import AddListDialog from '@/components/AddListDialog'

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const { data, error } = await tryCatch(
    preloadQuery(api.lists.get, { clerkId: userId }),
  )

  if (error) {
    notFound()
  }

  return (
    <main className="relative container mx-auto flex flex-col gap-4 px-4 pt-8">
      <header>
        <div className="flex justify-end gap-x-2">
          <Button variant="secondary" size="icon-lg" className="rounded-2xl">
            <UserButton />
          </Button>

          <AddListDialog />
        </div>
      </header>
      <Lists preloadedLists={data} />
    </main>
  )
}
