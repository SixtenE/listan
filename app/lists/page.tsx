import { api } from '@/convex/_generated/api'
import { auth } from '@clerk/nextjs/server'
import { preloadQuery } from 'convex/nextjs'
import { notFound, redirect } from 'next/navigation'
import { tryCatch } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowRight, Plus, User } from 'lucide-react'
import Link from 'next/link'

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
      <header>
        <div>
          <UserButton />
        </div>
      </header>
      <div className="flex items-center justify-between">
        <h1 className="text-5xl">mina listor</h1>

        <Button
          className="ml-auto"
          size="icon-lg"
          aria-label="Add list"
          title="Add list"
        >
          <Plus />
        </Button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-4">
        <li>
          <Link href="/lists/123">
            <Card>
              <CardHeader>
                <CardTitle>Eskader</CardTitle>
              </CardHeader>
              <CardContent>
                <ArrowRight className="ml-auto" />
              </CardContent>
            </Card>
          </Link>
        </li>
      </ul>
    </main>
  )
}
