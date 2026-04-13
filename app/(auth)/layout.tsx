import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" aria-label="listan">
          <Image src="/listan_logo.svg" alt="listan" width={88} height={40} priority />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-start px-6 pt-10 pb-24 md:px-12 md:pt-16">
        {children}
      </main>
    </div>
  )
}
