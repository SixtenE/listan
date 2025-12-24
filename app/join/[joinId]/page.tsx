import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import JoinContent from './JoinContent'

export default async function Page({
  params,
}: {
  params: Promise<{ joinId: string }>
}) {
  const { joinId } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect(`/sign-in?redirect_url=/join/${joinId}`)
  }

  return <JoinContent listId={joinId} clerkId={userId} />
}
