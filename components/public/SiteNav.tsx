'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/book', label: 'The Book' },
  { href: '/opinions', label: 'Unsolicited Opinions' },
  { href: '/correspondence', label: 'Correspondence' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4">
          <Link href="/" className="group">
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              In the Absence of
            </span>
            <span className="font-display block text-lg font-extrabold leading-tight tracking-tight text-ink">
              A Soapbox
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-amber ${
                  pathname === href ? 'text-amber' : 'text-ink'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6 text-ink" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/" onClick={() => setOpen(false)}>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                In the Absence of
              </span>
              <span className="font-display block text-lg font-extrabold leading-tight text-ink">
                A Soapbox
              </span>
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close navigation">
              <X className="h-6 w-6 text-ink" />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 pt-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`font-display text-2xl font-bold ${
                  pathname === href ? 'text-amber' : 'text-ink'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
