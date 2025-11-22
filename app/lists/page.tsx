import { api } from '@/convex/_generated/api'
import { tryCatch } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Lists from './Lists'

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
    <main className="container mx-auto flex flex-col gap-4 px-4 pt-8">
      <ul className="grid grid-cols-1 sm:grid-cols-4">
        <Lists preloadedLists={data} />
      </ul>
    </main>
  )
}
