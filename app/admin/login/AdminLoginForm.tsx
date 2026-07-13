'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  async function handleMagicLink() {
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    })

    if (otpError) {
      setError(otpError.message)
      setLoading(false)
      return
    }

    setMagicSent(true)
    setLoading(false)
  }

  if (magicSent) {
    return (
      <div className="text-center py-4">
        <p className="font-display text-lg font-bold text-white">Check your email.</p>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          A magic link has been sent to{' '}
          <strong className="font-semibold text-amber">{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePasswordLogin} className="space-y-5">
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-white/[0.08] bg-ink px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber/60 focus:outline-none focus:ring-1 focus:ring-amber/20 transition-colors"
          placeholder="hello@intheabsence.co.za"
        />
      </div>
      <div>
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/[0.08] bg-ink px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-amber/60 focus:outline-none focus:ring-1 focus:ring-amber/20 transition-colors"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-amber px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-light disabled:opacity-40"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.06]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-ink-soft px-3 text-[10px] uppercase tracking-[0.2em] text-white/20">
            or
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={!email || loading}
        className="w-full rounded-lg border border-white/[0.08] px-4 py-3 text-sm font-medium text-white/40 transition-all hover:border-amber/30 hover:text-white/70 disabled:opacity-20"
      >
        Send Magic Link
      </button>
    </form>
  )
}
