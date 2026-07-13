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
  PenTool,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opinions', label: 'Opinions', icon: FileText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
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

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href))

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#C07B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenTool style={{ width: 16, height: 16, color: '#fff' }} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>The Desk</div>
            <div style={{ fontSize: 11, color: '#999', lineHeight: 1.2 }}>Soapbox Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ padding: '0 12px', marginBottom: 4, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#bbb' }}>
            Content
          </div>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  color: active ? '#C07B2A' : '#666',
                  background: active ? 'rgba(192, 123, 42, 0.08)' : 'transparent',
                  transition: 'all 0.12s ease',
                  marginBottom: 2,
                }}
              >
                <Icon style={{ width: 18, height: 18 }} strokeWidth={active ? 2 : 1.6} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #eee', padding: 12 }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            color: '#999',
            transition: 'color 0.12s',
          }}
        >
          <ExternalLink style={{ width: 16, height: 16 }} strokeWidth={1.6} />
          View Live Site
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 8,
            width: '100%',
            fontSize: 13,
            fontWeight: 500,
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            transition: 'color 0.12s',
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} strokeWidth={1.6} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #e8e8e6',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
        className="hidden lg:block"
      >
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: '#fff',
          borderBottom: '1px solid #e8e8e6',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#C07B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PenTool style={{ width: 14, height: 14, color: '#fff' }} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>The Desk</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4 }}
        >
          {open ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>

      {/* Mobile slide-out */}
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="lg:hidden"
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.3)' }}
          />
          <div
            className="lg:hidden"
            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, width: 280, background: '#fff', boxShadow: '4px 0 24px rgba(0,0,0,0.08)' }}
          >
            {sidebar}
          </div>
        </>
      )}
    </>
  )
}
