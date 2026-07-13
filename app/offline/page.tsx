export const metadata = { title: 'Offline' }

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        You appear to be offline.
      </h1>
      <p className="font-display mt-3 text-lg italic text-muted">
        Still. The thoughts persist.
      </p>
      <a href="/" className="mt-8 text-sm font-semibold text-amber hover:text-amber-light">
        Try going home &rarr;
      </a>
    </div>
  )
}
