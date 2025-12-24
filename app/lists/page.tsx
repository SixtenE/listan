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
    <div className="min-h-screen">
      {/* Subtle grid background */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]" />
      
      <main className="relative mx-auto max-w-2xl px-6 py-8">
        <Header clerkId={userId} />
        <Lists preloadedLists={data} clerkId={userId} />
      </main>
    </div>
  )
}
