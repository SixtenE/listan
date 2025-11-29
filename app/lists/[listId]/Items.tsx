'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { MoreVertical } from 'lucide-react'
import Link from 'next/link'
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
              <p className="text-sm font-normal">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam
                dignissimos laboriosam quibusdam perspiciatis! Laudantium nihil
                error pariatur veniam quisquam consequuntur ullam officia optio,
                asperiores repellendus? Magni doloribus est in dolores.
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
