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
    preloadQuery(api.lists.getListsByUser, { clerkId: userId }),
  )

  if (error) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <Header clerkId={userId} />
        <div className="pb-20">
          <Lists preloadedLists={data} clerkId={userId} />
        </div>
      </main>
    </div>
  )
}
