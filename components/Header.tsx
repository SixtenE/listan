import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import AddListDialog from '@/components/AddListDialog'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  clerkId: string
  showBackButton?: boolean
  backHref?: string
}

export default function Header({
  clerkId,
  showBackButton = false,
  backHref = '/lists',
}: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between">
      {showBackButton && (
        <Button
          asChild
          variant="secondary"
          className="rounded-2xl"
          size="icon-lg"
        >
          <Link href={backHref}>
            <ChevronLeft />
          </Link>
        </Button>
      )}

      <div className="ml-auto flex items-center justify-end gap-x-2">
        <Button variant="secondary" size="icon-lg" className="rounded-2xl">
          <UserButton />
        </Button>

        <AddListDialog clerkId={clerkId} />
      </div>
    </header>
  )
}
