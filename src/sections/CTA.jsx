import { Link } from 'react-router-dom'
import { brand } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import Reveal from '../components/Reveal'
import { ArrowUpRight } from '../components/Icons'
import './CTA.css'

const LINES = ['Building something', 'that does not', 'exist yet?']

export default function CTA() {
  const [ref, isIn] = useReveal({ threshold: 0.3 })

  return (
    <section className="section cta" id="contact" aria-labelledby="cta-title">
      <div className="cta__glow" aria-hidden="true" />

      <div className="shell cta__inner">
        <Reveal className="cta__eyebrow">
          <span className="mono">
            <span className="cta__pip" aria-hidden="true" />
            Open for Q3 — two slots
          </span>
        </Reveal>

        <h2 className={`cta__title ${isIn ? 'is-in' : ''}`} id="cta-title" ref={ref}>
          {LINES.map((line, i) => (
            <span className="line-mask" key={line} style={{ '--reveal-delay': `${i * 90}ms` }}>
              <span>{line}</span>
            </span>
          ))}
        </h2>

        <Reveal className="cta__actions" delay={200}>
          <div className="cta__primary">
            <Link className="btn cta__book" to="/book-a-demo">
              <span>Book a demo</span>
              <span className="btn__line" aria-hidden="true" />
            </Link>

            <a className="cta__mail" href={`mailto:${brand.email}`}>
              <span className="cta__mail-text">{brand.email}</span>
              <ArrowUpRight width="20" height="20" />
            </a>
          </div>

          <p className="cta__note">
            Tell us what is broken, what you are building, or what you are not sure about yet.
            We reply within two working days.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
