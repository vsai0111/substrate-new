import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently occupying the upper band of the
 * viewport. Uses a single IntersectionObserver across all targets.
 */
export function useScrollSpy(ids) {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!targets.length) return

    const visible = new Map()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        })

        let best = ''
        let bestRatio = 0
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        })
        setActive(bestRatio > 0 ? best : '')
      },
      { threshold: [0, 0.25, 0.5, 0.75], rootMargin: '-20% 0px -55% 0px' },
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [ids])

  return active
}
