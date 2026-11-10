import { useEffect, useState } from 'react'
import { brand, hero } from '../data/site'
import { ArrowDown } from '../components/Icons'
import './Hero.css'

export default function Hero() {
  // Mount flag drives the entrance so the first paint is the "before" state.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className={`hero ${ready ? 'is-in' : ''}`} id="top" aria-labelledby="hero-title">
      <div className="hero__field" aria-hidden="true">
        <span className="hero__rule hero__rule--1" />
        <span className="hero__rule hero__rule--2" />
        <span className="hero__rule hero__rule--3" />
        <span className="hero__orb" />
      </div>

      <div className="shell hero__inner">
        <p className="mono hero__eyebrow">
          <span className="hero__pip" aria-hidden="true" />
          {brand.descriptor} — {brand.locations.join(' / ')}
        </p>

        <h1 className="hero__title" id="hero-title">
          {hero.lines.map((line, i) => (
            <span className="line-mask" key={line} style={{ '--reveal-delay': `${120 + i * 90}ms` }}>
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero__body">
          <p className="hero__statement">{hero.statement}</p>

          <div className="hero__actions">
            <a className="btn" href="#work">
              <span>Selected work</span>
              <span className="btn__line" aria-hidden="true" />
            </a>
            <a className="btn btn--ghost" href="#terminal">
              <span>Open terminal</span>
              <span className="btn__line" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero__foot">
          <dl className="hero__meta">
            {hero.meta.map((m) => (
              <div className="hero__meta-item" key={m.k}>
                <dt className="mono">{m.k}</dt>
                <dd className="mono">{m.v}</dd>
              </div>
            ))}
          </dl>

          <a className="hero__scroll mono" href="#work">
            <ArrowDown width="14" height="14" />
            <span>Scroll</span>
          </a>
        </div>
      </div>
    </section>
  )
}
