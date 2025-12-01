'use client'

import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import Link from 'next/link'
import ListActions from './ListActions'

interface PageProps {
  preloadedLists: Preloaded<typeof api.lists.get>
  clerkId: string
}

export default function Page({ preloadedLists, clerkId }: PageProps) {
  const lists = usePreloadedQuery(preloadedLists)

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {lists.map((list) => (
        <li key={list._id} className="relative">
          <ListActions clerkId={clerkId} listId={list._id} />
          <Link href={`/lists/${list._id}`}>
            <Card className="group w-full border-none">
              <CardContent>
                <p className="text-xl font-medium">{list.name}</p>
                <p className="text-muted-foreground font-mono text-xs">
                  Updated 3 days ago
                </p>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
