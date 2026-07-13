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
  Plus,
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

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #C07B2A, #a86a24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(192,123,42,0.3)',
          }}>
            <PenTool style={{ width: 17, height: 17, color: '#fff' }} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif" }}>
              The Desk
            </div>
            <div style={{ fontSize: 11.5, color: '#999', lineHeight: 1.3 }}>Your creative space</div>
          </div>
        </div>

        {/* Write button */}
        <Link
          href="/admin/opinions/new"
          onClick={() => setOpen(false)}
          className="admin-btn-primary"
          style={{ width: '100%', padding: '12px 16px', textDecoration: 'none', fontSize: 14 }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Write Something New
        </Link>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 24px', borderTop: '1px solid #e5e5e5' }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 14px' }}>
        <div style={{ padding: '0 14px', marginBottom: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#ccc' }}>
          Manage
        </div>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`admin-nav-link ${isActive(href) ? 'admin-nav-link-active' : ''}`}
          >
            <Icon style={{ width: 18, height: 18 }} strokeWidth={isActive(href) ? 2 : 1.6} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #e5e5e5', padding: '12px 14px' }}>
        <Link href="/" target="_blank" className="admin-nav-link" style={{ color: '#bbb' }}>
          <ExternalLink style={{ width: 16, height: 16 }} strokeWidth={1.6} />
          View Live Site
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px',
            borderRadius: 10, width: '100%', fontSize: 14, fontWeight: 500,
            background: 'none', border: 'none', color: '#bbb', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'color 0.15s',
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
      <aside className="admin-sidebar">{content}</aside>

      {/* Mobile top bar */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #C07B2A, #a86a24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PenTool style={{ width: 13, height: 13, color: '#fff' }} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', fontFamily: "'Playfair Display', Georgia, serif" }}>
            The Desk
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 6 }}
        >
          {open ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="admin-overlay" onClick={() => setOpen(false)} />
          <div className="admin-drawer">{content}</div>
        </>
      )}
    </>
  )
}
