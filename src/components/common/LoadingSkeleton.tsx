'use client';

/**
 * Loading skeleton components for assessment and results pages
 */

export function AssessmentSkeleton() {
  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-64 rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-96 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-20 rounded-md bg-muted animate-pulse" />
        </div>

        {/* Accordion skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="border rounded-xl shadow-card bg-card overflow-hidden"
            >
              <div className="px-4 md:px-6 py-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted animate-pulse" />
                  <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="h-12 w-48 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-6">
          <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />

          {/* Content skeleton */}
          <div className="space-y-8">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                  <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
                </div>
                <div className="space-y-4">
                  {[1, 2].map((card) => (
                    <div
                      key={card}
                      className="border rounded-xl shadow-card bg-card p-6"
                    >
                      <div className="space-y-3">
                        <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                        <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                        <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
            <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="border rounded-xl shadow-card bg-card p-6"
              >
                <div className="space-y-3">
                  <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-4/5 rounded-md bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((card) => (
        <div key={card} className="border rounded-xl shadow-card bg-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
              <div className="flex gap-2">
                <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />
                <div className="h-9 w-16 rounded-md bg-muted animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-full rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-full rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
