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
    <header className="border-border flex w-full items-center justify-between border-b pb-4">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-mono text-xs tracking-wide"
          >
            <Link href={backHref}>
              <ArrowLeft className="mr-1 h-3 w-3" />
              back
            </Link>
          </Button>
        ) : (
          <Link 
            href="/lists" 
            className="font-mono text-sm tracking-wider transition-opacity hover:opacity-70"
          >
            listan
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showAddListButton && <AddListDialog clerkId={clerkId} />}
        <div className="border-border flex h-8 w-8 items-center justify-center rounded-full border">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'h-6 w-6',
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
