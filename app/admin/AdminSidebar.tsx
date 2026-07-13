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
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opinions', label: 'Opinions', icon: FileText },
  { href: '/admin/photos', label: 'Photos', icon: ImageIcon },
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

  const nav = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-6 py-6">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.25em] text-amber">
          The Desk
        </span>
        <span className="font-display block text-sm font-bold text-white">
          Soapbox Admin
        </span>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-amber/10 text-amber'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-ink lg:block">
        {nav}
      </aside>

      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-ink px-4 py-3 lg:hidden">
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-amber">
          The Desk
        </span>
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-ink lg:hidden">
          <div className="flex items-center justify-end px-4 py-3">
            <button onClick={() => setOpen(false)} className="text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          {nav}
        </div>
      )}
    </>
  )
}
