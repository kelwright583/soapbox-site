'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opinions', label: 'Opinions', icon: FileText },
  { href: '/admin/media', label: 'Media', icon: ImageIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.75rem',
    borderRadius: '0.5rem',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
    color: active ? '#C07B2A' : 'rgba(255,255,255,0.45)',
  })

  const nav = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Branding */}
      <div style={{ padding: '1.5rem 1.25rem 1.25rem' }}>
        <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#C07B2A', marginBottom: '0.125rem' }}>
          The Desk
        </span>
        <span className="font-display" style={{ display: 'block', fontSize: '15px', fontWeight: 800, color: '#fff' }}>
          Soapbox Admin
        </span>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 1rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={linkStyle(active)}
            >
              <Icon style={{ width: 18, height: 18 }} strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '0.75rem' }}>
        <Link
          href="/"
          target="_blank"
          style={{ ...linkStyle(false), color: 'rgba(255,255,255,0.25)' }}
        >
          <ExternalLink style={{ width: 18, height: 18 }} strokeWidth={1.8} />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '13px',
            fontWeight: 500,
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            transition: 'color 0.15s',
          }}
        >
          <LogOut style={{ width: 18, height: 18 }} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block"
        style={{ width: '220px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', background: '#161616' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh' }}>{nav}</div>
      </aside>

      {/* Mobile header */}
      <div
        className="lg:hidden"
        style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#161616', padding: '0.75rem 1rem' }}
      >
        <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#C07B2A' }}>
          The Desk
        </span>
        <button onClick={() => setOpen(!open)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
          {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="lg:hidden"
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />
          <div
            className="lg:hidden"
            style={{ position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50, width: '260px', background: '#161616' }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1rem' }}>
              <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            {nav}
          </div>
        </>
      )}
    </>
  )
}
