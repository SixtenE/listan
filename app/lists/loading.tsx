/**
 * Loading UI for the lists page.
 * Shown while fetching user's lists from Convex.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <div className="pb-20">
          <div className="mt-12">
            <div className="mb-8 flex items-center justify-between">
              <div className="h-7 w-32 animate-pulse rounded bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl border border-border/40 bg-card"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
