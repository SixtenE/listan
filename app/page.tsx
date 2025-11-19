import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return (
    <main className="bg-background min-h-screen">
      <Header />
      <Hero />
    </main>
  )
}
