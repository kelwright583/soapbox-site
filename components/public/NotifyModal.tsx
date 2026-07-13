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
      <button
        onClick={() => setOpen(true)}
        className="btn-lift inline-block bg-amber px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-amber-light"
        style={{ borderRadius: 2 }}
      >
        Get the book
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          style={{ background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white p-10 shadow-2xl"
            style={{ borderRadius: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 text-muted transition-colors hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <p className="font-display text-2xl font-extrabold text-ink">You&apos;re on the list.</p>
                <p className="mt-3 text-sm text-muted">One email. When it&apos;s ready. Promise.</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-amber">
                  Be the first to know.
                </p>
                <h2 className="font-display mt-2 text-2xl font-extrabold text-ink">
                  The book is coming.
                </h2>
                <p className="mt-4 text-sm leading-[1.8] text-muted">
                  Drop your email. When the book is available, you&apos;ll hear about it. Once. That&apos;s it.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 border border-ink/10 bg-grey px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
                    style={{ borderRadius: 2 }}
                  />
                  <button
                    type="submit"
                    className="bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber"
                    style={{ borderRadius: 2 }}
                  >
                    Notify me
                  </button>
                </form>
                <p className="mt-4 text-[11px] text-muted">
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
