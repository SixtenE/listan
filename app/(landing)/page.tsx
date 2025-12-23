import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { LandingContent } from './LandingContent'

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <LandingContent />
    </main>
  )
}
