'use client'

import { useEffect } from 'react'

export function ScrollRevealObserver() {
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

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale').forEach((el) =>
      observer.observe(el),
    )

    return () => observer.disconnect()
  }, [])

  return null
}
