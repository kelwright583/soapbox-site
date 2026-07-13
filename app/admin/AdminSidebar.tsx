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
import { cn } from '@/lib/utils'

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

  const nav = (
    <div className="flex h-full flex-col">
      {/* Branding */}
      <div className="px-5 pb-6 pt-7">
        <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-[0.3em] text-amber">
          The Desk
        </span>
        <span className="font-display block text-base font-extrabold tracking-tight text-white">
          Soapbox Admin
        </span>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-2 border-t border-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors',
                active
                  ? 'bg-white/[0.07] text-amber'
                  : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80',
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-0.5 border-t border-white/[0.06] px-3 py-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60"
        >
          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.8} />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-white/30 transition-colors hover:bg-white/[0.04] hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[220px] shrink-0 border-r border-white/[0.06] bg-[#161616] lg:block">
        <div className="sticky top-0 h-screen">{nav}</div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-[#161616] px-4 py-3 lg:hidden">
        <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-amber">
          The Desk
        </span>
        <button onClick={() => setOpen(!open)} className="text-white/60">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[260px] bg-[#161616] lg:hidden">
            <div className="flex items-center justify-end px-4 py-3">
              <button onClick={() => setOpen(false)} className="text-white/60">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </div>
        </>
      )}
    </>
  )
}
