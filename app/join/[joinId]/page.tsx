import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ joinId: string }>
}) {
  const { joinId } = await params

  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <main>
      <h1>You have been invited to join list {joinId}</h1>
    </main>
  )
}
