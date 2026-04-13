import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { LandingContent } from './LandingContent'

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return <LandingContent />

}
