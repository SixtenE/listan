'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { Plus } from 'lucide-react'
import { FormEvent } from 'react'

interface PageProps {
  clerkId: string
}

export default function Page({ clerkId }: PageProps) {
  const add = useMutation(api.lists.add)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    await add({ name, clerkId })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="rounded-2xl">
          <Plus className="stroke-3" />
          new list
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-transparent sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Name your list</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-3">
              <Input
                id="name-1"
                name="name"
                defaultValue=""
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" className="rounded-xl">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
