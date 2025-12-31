/**
 * Loading UI for the list detail page.
 * Shown while fetching list data and items from Convex.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <div className="pb-20 mt-8">
          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {/* List header skeleton */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Item input skeleton */}
            <div className="h-16 animate-pulse rounded-2xl border border-border/40 bg-card" />

            {/* Items list skeleton */}
            <ul className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <li
                  key={i}
                  className="h-16 animate-pulse rounded-xl border border-border/40 bg-card"
                />
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
