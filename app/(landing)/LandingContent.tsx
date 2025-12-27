'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { RefreshCcw, Users, ArrowRight } from 'lucide-react'

export function LandingContent() {
  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="font-mono text-lg font-medium tracking-tight">
          listan
        </Link>
        <div className="flex items-center gap-4 text-sm md:gap-6">
          <Link
            href="/sign-in"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/lists"
            className="text-foreground transition-opacity hover:opacity-70"
          >
            Get started <ArrowRight className="ml-1 inline-block h-3 w-3" />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 pt-16 pb-20 md:px-12 md:pt-24">
        <div className="mx-auto max-w-5xl">
          {/* Hero Header */}
          <div className="mb-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="mx-auto font-sans text-4xl leading-[1.1] font-medium tracking-tight sm:text-6xl md:text-7xl">
                a shopping list
              </h1>
              <p className="text-muted-foreground mt-4 font-serif text-2xl italic sm:text-4xl">
                you will actually use
              </p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground mx-auto mt-8 max-w-lg text-lg leading-relaxed"
            >
              I built listan because I needed a shopping list that just works.
              Simple, shared, and designed to stay out of your way.
            </motion.p>
          </div>

          {/* Sections */}
          <div className="space-y-24">
            {/* Features Section */}
            <section>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-foreground/80 mb-8 font-serif text-2xl italic"
              >
                Features
              </motion.h2>
              <div className="grid gap-6 md:grid-cols-2">
                <FeatureCard
                  title="Real-time Sync"
                  subtitle="Connectivity"
                  icon={<RefreshCcw className="h-5 w-5" />}
                  description="Updates instantly across all your devices. Add an item on your phone, see it on your desktop."
                  delay={0.1}
                />
                <FeatureCard
                  title="Shared Lists"
                  subtitle="Collaboration"
                  icon={<Users className="h-5 w-5" />}
                  description="Collaborate with family and friends. Send an invite link and start shopping together."
                  delay={0.2}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 text-center md:px-12">
        <p className="text-muted-foreground font-serif text-sm italic">
          Designed & built by Sixten
        </p>
      </footer>
    </div>
  )
}

function FeatureCard({
  title,
  subtitle,
  icon,
  description,
  delay,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group border-border/40 from-card to-secondary hover:border-border flex flex-col rounded-2xl border bg-linear-to-bl p-6 transition-colors sm:p-8"
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h3 className="text-foreground font-medium">{title}</h3>
          <p className="text-muted-foreground mt-1 text-xs">{subtitle}</p>
        </div>
        <div className="bg-secondary text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      <p className="text-muted-foreground/80 mt-auto text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
