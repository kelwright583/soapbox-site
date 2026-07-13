'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/revalidate', { method: 'GET' }) // placeholder for newsletter API
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="font-display text-xl font-bold text-ink">You&apos;re on the list.</p>
        <p className="mt-2 text-sm text-muted">One email when it&apos;s available. Promise.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-amber focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-amber px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-light disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Tell me when it\u2019s ready'}
      </button>
    </form>
  )
}
