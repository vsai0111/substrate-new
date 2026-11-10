import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Browsers restore scroll position on history navigation but know nothing
 * about client-side route changes, so we handle both cases here:
 * a hash scrolls to that section, anything else starts at the top.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
