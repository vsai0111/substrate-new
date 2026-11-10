import { Link } from 'react-router-dom'
import { brand, navLinks, socials } from '../data/site'
import { ArrowUpRight } from '../components/Icons'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <Link className="footer__wordmark" to="/">
            {brand.name}
          </Link>
          <p className="footer__descriptor">{brand.descriptor}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="mono footer__col-title">Index</h2>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link className="footer__link" to={`/${link.href}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="mono footer__col-title">Elsewhere</h2>
          <ul>
            {socials.map((s) => (
              <li key={s.label}>
                <a className="footer__link" href={s.href}>
                  {s.label}
                  <ArrowUpRight width="12" height="12" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--contact">
          <h2 className="mono footer__col-title">Contact</h2>
          <a className="footer__mail" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>
          <Link className="footer__link footer__demo" to="/book-a-demo">
            Book a demo
            <ArrowUpRight width="12" height="12" />
          </Link>
          <p className="mono footer__where">{brand.locations.join(' — ')}</p>
        </div>
      </div>

      <div className="shell footer__bar">
        <p className="mono">
          © {year} {brand.name}. Fictional studio, built as a static site.
        </p>
        <p className="mono footer__colophon">
          React · Vite · No trackers · {brand.locations[0]}
        </p>
        <button
          type="button"
          className="mono footer__top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </button>
      </div>
    </footer>
  )
}
