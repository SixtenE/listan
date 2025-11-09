'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { SignOutButton } from '@clerk/nextjs'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import Link from 'next/link'

export default function Page({
  preloadedLists,
}: {
  preloadedLists: Preloaded<typeof api.lists.get>
}) {
  const lists = usePreloadedQuery(preloadedLists)

  return (
    <ul className="mx-auto w-full">
      <li key="clerk">
        <SignOutButton />
      </li>
      {lists.map((list) => (
        <li key={list._id}>
          <Link href={`/lists/${list._id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
