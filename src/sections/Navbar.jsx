import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { brand, navLinks } from '../data/site'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { Close, MenuLines } from '../components/Icons'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const ids = useMemo(() => navLinks.map((l) => l.href.slice(1)), [])
  // Section highlighting only means anything on the page that has the sections.
  const active = useScrollSpy(isHome ? ids : [])

  // Hairline + backdrop only appear once the hero has started to leave.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  // Escape to dismiss, and keep tab focus inside the open panel.
  useEffect(() => {
    if (!open) return

    document.body.classList.add('is-locked')
    panelRef.current?.querySelector('a, button')?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return

      const items = panelRef.current?.querySelectorAll('a, button')
      if (!items?.length) return
      const first = items[0]
      const last = items[items.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('is-locked')
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // A resize past the breakpoint should not leave the overlay stranded.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 880px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner shell">
        <Link className="nav__brand" to="/" aria-label={`${brand.name} — home`}>
          <span className="nav__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="nav__wordmark">{brand.name}</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1)
              const className = `nav__link mono ${isActive ? 'is-active' : ''}`

              return (
                <li key={link.href}>
                  {isHome ? (
                    <a
                      className={className}
                      href={link.href}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="nav__link-text">{link.label}</span>
                    </a>
                  ) : (
                    <Link className={className} to={`/${link.href}`}>
                      <span className="nav__link-text">{link.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <Link
          className={`nav__cta mono ${pathname === '/book-a-demo' ? 'is-current' : ''}`}
          to="/book-a-demo"
          aria-current={pathname === '/book-a-demo' ? 'page' : undefined}
        >
          Book a demo
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close width="18" height="18" /> : <MenuLines width="18" height="18" />}
          <span className="u-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        className={`nav__panel ${open ? 'is-open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="nav__panel-list">
            {navLinks.map((link, i) => (
              <li key={link.href} style={{ '--i': i }}>
                {isHome ? (
                  <a href={link.href} onClick={close}>
                    <span className="mono nav__panel-index">0{i + 1}</span>
                    <span className="nav__panel-label">{link.label}</span>
                  </a>
                ) : (
                  <Link to={`/${link.href}`} onClick={close}>
                    <span className="mono nav__panel-index">0{i + 1}</span>
                    <span className="nav__panel-label">{link.label}</span>
                  </Link>
                )}
              </li>
            ))}

            <li className="nav__panel-cta" style={{ '--i': navLinks.length }}>
              <Link to="/book-a-demo" onClick={close}>
                <span className="mono nav__panel-index">
                  0{navLinks.length + 1}
                </span>
                <span className="nav__panel-label">Book a demo</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="nav__panel-foot">
          <a className="mono" href={`mailto:${brand.email}`} onClick={close}>
            {brand.email}
          </a>
          <span className="mono nav__panel-meta">
            {brand.locations.join(' / ')} — Est. {brand.founded}
          </span>
        </div>
      </div>
    </header>
  )
}
