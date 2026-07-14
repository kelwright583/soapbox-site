'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollRevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )

    // Small delay to ensure DOM is settled after navigation
    const timeout = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale').forEach((el) => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el)
        }
      })
    }, 50)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
