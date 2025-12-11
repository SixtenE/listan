import { api } from '@/convex/_generated/api'
import { tryCatch } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import Lists from './Lists'
import Header from '@/components/Header'

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
      <Header clerkId={userId} />
      <Lists preloadedLists={data} clerkId={userId} />
    </main>
  )
}
