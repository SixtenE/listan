'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { ArrowRight } from 'lucide-react'

export function LandingContent() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-sm tracking-wider"
        >
          listan
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button
            asChild
            variant="ghost"
            className="font-mono text-xs tracking-wide"
          >
            <Link href="/sign-in">sign in</Link>
          </Button>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
              Shopping lists, simplified
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            The list that
            <br />
            <span className="text-muted-foreground">actually works</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground mx-auto mt-6 max-w-md font-mono text-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Create. Share. Complete. A minimal shopping list app built for
            clarity and collaboration. No clutter, just what you need.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button asChild className="group font-mono text-sm tracking-wide">
              <Link href="/lists">
                get started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="mt-20 grid gap-8 text-left sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="border-border border-t pt-4">
              <h3 className="font-mono text-xs tracking-widest uppercase">
                Simple
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                No bloat. Just lists and items. Add, check, done.
              </p>
            </div>
            <div className="border-border border-t pt-4">
              <h3 className="font-mono text-xs tracking-widest uppercase">
                Shared
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Share lists with anyone. Updates sync in real-time.
              </p>
            </div>
            <div className="border-border border-t pt-4">
              <h3 className="font-mono text-xs tracking-widest uppercase">
                Fast
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Instant updates. Works offline. Always ready.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
