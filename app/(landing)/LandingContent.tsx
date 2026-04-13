'use client'

import Link from 'next/link'
import Image from 'next/image'
import * as motion from 'motion/react-client'

const easeOut = [0.23, 1, 0.32, 1] as const
const rounded =
  "font-['SF_Pro_Rounded',ui-rounded,-apple-system,system-ui,sans-serif]"

export function LandingContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="listan" className="flex items-center">
          <Image
            src="/listan_logo.svg"
            alt="listan"
            width={77}
            height={35}
            priority
          />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/sign-in"
            className="text-[15px] text-black transition-opacity duration-150 ease-out hover:opacity-60"
          >
            Sign in
          </Link>
          <PillLink href="/lists" tone="black">
            Get started
          </PillLink>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start px-6 pt-20 pb-24 text-left md:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className={`${rounded} text-[44px] leading-[1.0] font-medium tracking-tight text-black sm:text-6xl md:text-7xl`}
        >
          a shopping list
          <br />
          you will actually use
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: easeOut }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-500"
        >
          Simple, shared, and designed to stay out of your way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: easeOut }}
          className="mt-10 flex items-center gap-3"
        >
          <PillLink href="/lists" tone="black" size="lg">
            Get started
          </PillLink>
          <PillLink href="/sign-in" tone="gray" size="lg">
            Sign in
          </PillLink>
        </motion.div>

        <section className="mt-28 grid w-full gap-4 sm:mt-32 md:grid-cols-2">
          <FeatureCard
            index={0}
            title="Real-time sync"
            description="Updates instantly across every device. Add an item on your phone, see it on your desktop."
          />
          <FeatureCard
            index={1}
            title="Shared lists"
            description="Collaborate with family and friends. Send an invite link and start shopping together."
          />
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-10 text-center">
        <p className="text-sm text-neutral-500">Designed &amp; built by Sixten</p>
      </footer>
    </div>
  )
}

function PillLink({
  href,
  tone,
  size = 'md',
  children,
}: {
  href: string
  tone: 'black' | 'gray'
  size?: 'md' | 'lg'
  children: React.ReactNode
}) {
  const base =
    'inline-flex items-center justify-center rounded-full text-[15px] font-medium transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] will-change-transform'
  const tones = {
    black: 'bg-black text-white hover:bg-neutral-800',
    gray:
      'border border-neutral-200 bg-neutral-200 text-neutral-800 hover:bg-neutral-300 hover:border-neutral-300',
  }
  const sizes = {
    md: 'h-10 px-6',
    lg: 'h-11 px-6',
  }
  return (
    <Link href={href} className={`${base} ${tones[tone]} ${sizes[size]}`}>
      {children}
    </Link>
  )
}

function FeatureCard({
  index,
  title,
  description,
}: {
  index: number
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOut }}
      className="rounded-xl border border-neutral-200 bg-white p-8 text-left"
    >
      <h3
        className={`${rounded} text-[22px] leading-tight font-medium tracking-tight text-black`}
      >
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">{description}</p>
    </motion.div>
  )
}
