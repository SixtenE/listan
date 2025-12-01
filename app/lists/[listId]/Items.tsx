'use client'

import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import ItemActions from './ItemActions'

export default function Page({
  preloadedList,
}: {
  preloadedList: Preloaded<typeof api.lists.getById>
}) {
  const list = usePreloadedQuery(preloadedList)
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {list.items.map((item) => (
        <li key={item._id} className="relative">
          <ItemActions />
          <Card className="group w-full border-none">
            <CardContent>
              <p className="text-sm font-normal">{item.content}</p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
