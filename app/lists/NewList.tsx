'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex w-full justify-center">
      <Button className="rounded-full" size="lg">
        <Plus />
        new
      </Button>
    </div>
  )
}
