'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import { SignOutButton } from '@clerk/nextjs'
import { Preloaded, usePreloadedQuery } from 'convex/react'
import { DropdownMenuDialog } from './ItemActions'

export default function Page({
  preloadedList,
}: {
  preloadedList: Preloaded<typeof api.lists.getById>
}) {
  const { items } = usePreloadedQuery(preloadedList)

  return (
    <ul className="mx-auto w-full">
      <li key="clerk">
        <SignOutButton />
      </li>
      {items.map((item) => (
        <li key={item._id}>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>{item.content}</CardTitle>
              <DropdownMenuDialog />
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  )
}
