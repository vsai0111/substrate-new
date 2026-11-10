import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="notfound" aria-labelledby="notfound-title">
      <div className="shell notfound__inner">
        <p className="mono notfound__code">404 — no such path</p>
        <h1 className="notfound__title" id="notfound-title">
          This page is not part of the system.
        </h1>
        <p className="notfound__note">
          The link may be out of date, or the page was never built. Everything that does
          exist is one level up.
        </p>
        <div className="notfound__actions">
          <Link className="btn" to="/">
            <span>Back to the studio</span>
            <span className="btn__line" aria-hidden="true" />
          </Link>
          <Link className="btn btn--ghost" to="/book-a-demo">
            <span>Book a demo</span>
            <span className="btn__line" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
