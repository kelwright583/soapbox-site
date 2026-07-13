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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(26,26,26,0.08)' : '1px solid transparent',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase' as const,
                color: 'rgba(26,26,26,0.44)',
              }}
            >
              In the Absence of
            </span>
            <span
              className="font-display"
              style={{
                display: 'block',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1a1a1a',
                lineHeight: 1.1,
              }}
            >
              A Soapbox
            </span>
          </Link>

          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link-anim ${pathname === href ? 'active' : ''}`}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: pathname === href ? '#C07B2A' : '#1a1a1a',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  paddingBottom: 2,
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden"
            aria-label="Open navigation"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <Menu style={{ width: 24, height: 24, color: '#1a1a1a' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 64,
              padding: '0 24px',
              borderBottom: '1px solid rgba(26,26,26,0.08)',
            }}
          >
            <Link href="/" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(26,26,26,0.44)',
                }}
              >
                In the Absence of
              </span>
              <span
                className="font-display"
                style={{ display: 'block', fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.1 }}
              >
                A Soapbox
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <X style={{ width: 24, height: 24, color: '#1a1a1a' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="font-display"
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: pathname === href ? '#C07B2A' : '#1a1a1a',
                  textDecoration: 'none',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(26,26,26,0.06)',
                  transition: 'color 0.15s',
                }}
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
