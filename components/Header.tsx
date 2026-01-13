import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import AddListDialog from '@/components/AddListDialog'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  clerkId: string
  showBackButton?: boolean
  backHref?: string
  showAddListButton?: boolean
}

export default function Header({
  clerkId,
  showBackButton = false,
  backHref = '/lists',
  showAddListButton = true,
}: HeaderProps) {
  return (
    <header className="flex w-full items-center justify-between py-6">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-3"
          >
            <Link href={backHref}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
          </Button>
        ) : (
          <Link href="/lists" className="font-mono text-lg font-medium tracking-tight">
            listan
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showAddListButton && <AddListDialog clerkId={clerkId} />}
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-8 w-8',
            },
          }}
        />
      </div>
    </header>
  )
}
