import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return (
    <main className="container mx-auto flex h-screen max-w-lg items-center justify-center px-8">
      <div className="flex flex-col">
        <h1 className="text-7xl">🍌listan</h1>
        <p className="text-muted-foreground text-3xl font-medium">
          a better shopping list
        </p>
        <div className="mt-8">
          <Button asChild className="rounded-full p-6 font-bold">
            <Link href="/lists">Get started</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
