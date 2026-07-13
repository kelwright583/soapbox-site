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
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

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
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
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
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <p className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
          Check your email
        </p>
        <p style={{ marginTop: 10, fontSize: 14, color: '#888', lineHeight: 1.6 }}>
          A magic link has been sent to{' '}
          <strong style={{ color: '#C07B2A' }}>{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label htmlFor="email" className="admin-label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="admin-input"
          placeholder="hello@intheabsence.co.za"
        />
      </div>
      <div>
        <label htmlFor="password" className="admin-label">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca' }}>
          <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="admin-btn-primary" style={{ width: '100%', padding: 12 }}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div style={{ position: 'relative', margin: '4px 0' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', borderTop: '1px solid #e5e5e5' }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <span style={{ background: '#fff', padding: '0 12px', fontSize: 12, color: '#bbb' }}>or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleMagicLink}
        disabled={!email || loading}
        className="admin-btn-secondary"
        style={{ width: '100%', padding: 12 }}
      >
        Send Magic Link
      </button>
    </form>
  )
}
