import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LandingContent } from './LandingContent'

export const metadata: Metadata = {
  title: 'listan - The shopping list that works',
  description: 'Simple, shared shopping lists. Collaborate with family and friends. Real-time sync across all devices.',
  keywords: ['shopping list', 'grocery list', 'shared list', 'collaboration'],
  openGraph: {
    title: 'listan - The shopping list that works',
    description: 'Simple, shared shopping lists. Collaborate with family and friends.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'listan - The shopping list that works',
    description: 'Simple, shared shopping lists. Collaborate with family and friends.',
  },
}

export default async function Page() {
  const { userId } = await auth()

  if (userId) {
    redirect('/lists')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      <Suspense fallback={<div className="h-screen w-full animate-pulse bg-muted" />}>
        <LandingContent />
      </Suspense>
    </main>
  )
}
