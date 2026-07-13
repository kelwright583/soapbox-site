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
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <p className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>
          Check your email.
        </p>
        <p style={{ marginTop: '0.75rem', fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.45)' }}>
          A magic link has been sent to{' '}
          <strong style={{ fontWeight: 600, color: '#C07B2A' }}>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label htmlFor="login-email" className="admin-label">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="admin-input"
          placeholder="hello@intheabsence.co.za"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="admin-label">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <div style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)' }}>
          <p style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="admin-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div style={{ position: 'relative', margin: '0.5rem 0' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <span style={{ background: '#242424', padding: '0 0.75rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
            or
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={!email || loading}
        className="admin-btn-outline"
        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
      >
        Send Magic Link
      </button>
    </form>
  )
}
