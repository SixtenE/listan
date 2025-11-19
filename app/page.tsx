import { Button } from '@/components/ui/button'
import { auth } from '@clerk/nextjs/server'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return (
    <main className="container mx-auto">
      <header className="flex items-center justify-between p-8">
        <h1 className="text-muted-foreground text-2xl font-bold">
          <span className="text-primary text-5xl">Listan</span>
          <p>a smarter shopping list</p>
        </h1>
        <Button className="h-12 w-36 rounded-full" asChild>
          <Link href="/sign-in">
            Continue
            <ArrowRight />
          </Link>
        </Button>
      </header>
      <section className="flex justify-center pt-8">
        <div className="text-[10rem]">🍌</div>
      </section>
    </main>
  )
}
