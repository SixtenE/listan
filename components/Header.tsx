import { UserButton } from '@clerk/nextjs'
import AddListDialog from '@/components/AddListDialog'
import Link from 'next/link'
import Image from 'next/image'
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
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[15px] transition-opacity duration-150 ease-out hover:opacity-80"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        ) : (
          <Link href="/" aria-label="listan" className="inline-flex items-center">
            <Image
              src="/listan_logo.svg"
              alt="listan"
              width={88}
              height={40}
              priority
            />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showAddListButton && <AddListDialog clerkId={clerkId} />}
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'size-9',
            },
          }}
        />
      </div>
    </header>
  )
}
