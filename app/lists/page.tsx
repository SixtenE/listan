import { api } from '@/convex/_generated/api'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Lists from './Lists'
import { tryCatch } from '@/lib/utils'

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
    <main className="container mx-auto">
      <Lists preloadedLists={data} />
    </main>
  )
}
