'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as motion from 'motion/react-client'

const floatingBananas = [
  {
    top: '15%',
    left: '10%',
    size: 'text-4xl',
    opacity: 0.2,
    blur: 'blur-[1px]',
    duration: 6,
    delay: 0,
  },
  {
    top: '25%',
    right: '15%',
    size: 'text-2xl',
    opacity: 0.15,
    blur: 'blur-[0.5px]',
    duration: 8,
    delay: 1,
  },
  {
    bottom: '20%',
    left: '20%',
    size: 'text-3xl',
    opacity: 0.1,
    blur: 'blur-[1px]',
    duration: 7,
    delay: 0.5,
  },
  {
    bottom: '30%',
    right: '10%',
    size: 'text-5xl',
    opacity: 0.15,
    blur: 'blur-[1px]',
    duration: 9,
    delay: 2,
  },
]

export function LandingContent() {
  return (
    <>
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent dark:from-amber-900/20" />

      {/* Floating banana decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {floatingBananas.map((banana, i) => (
          <motion.span
            key={i}
            className={`absolute ${banana.size} ${banana.blur}`}
            style={{
              top: banana.top,
              bottom: banana.bottom,
              left: banana.left,
              right: banana.right,
              opacity: banana.opacity,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: banana.duration,
              ease: 'easeInOut',
              repeat: Infinity,
              delay: banana.delay,
            }}
          >
            🍌
          </motion.span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="mb-6 text-8xl sm:text-9xl"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          🍌
        </motion.div>

        <motion.h1
          className="text-5xl font-bold tracking-tight sm:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          listan
        </motion.h1>

        <motion.p
          className="text-muted-foreground mt-4 max-w-md text-lg sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The shopping list that works.
          <br />
          <span className="text-muted-foreground/70 font-bold">
            Simple. Shared. Done.
          </span>
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-base font-semibold"
          >
            <Link href="/lists">Get started</Link>
          </Button>
        </motion.div>

        <motion.p
          className="text-muted-foreground/60 mt-16 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Sixten 2025
        </motion.p>
      </div>
    </>
  )
}
