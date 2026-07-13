'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function NotifyModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await fetch('/api/revalidate', { method: 'GET' }) // placeholder
      setSubmitted(true)
    } catch {
      // silently fail for now
    }
  }

  return (
    <>
      {/* Trigger button — used via data attribute pattern or direct import */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
      >
        Get the book
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-muted hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-4 text-center">
                <p className="font-display text-xl font-bold text-ink">You&apos;re on the list.</p>
                <p className="mt-2 text-sm text-muted">One email. When it&apos;s ready. Promise.</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
                  Be the first to know.
                </p>
                <h2 className="font-display mt-1 text-2xl font-bold text-ink">
                  The book is coming.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Drop your email. When the book is available, you&apos;ll hear about it. Once. That&apos;s it.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 rounded-lg border border-border bg-grey px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-amber px-5 py-3 text-sm font-semibold text-white hover:bg-amber-light"
                  >
                    Notify me
                  </button>
                </form>
                <p className="mt-3 text-[11px] text-muted">
                  No newsletters. No nonsense. One email. Promise.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
