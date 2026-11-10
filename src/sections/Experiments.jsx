import { useState } from 'react'
import { experiments } from '../data/site'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import './Experiments.css'

export default function Experiments() {
  const [active, setActive] = useState(0)
  const current = experiments[active]

  return (
    <section className="section experiments" id="experiments">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Experiments"
          note="Threads we keep pulling on between engagements. Some become tools, most become opinions."
        />
      </div>

      <Reveal className="experiments__ticker">
        <Marquee
          items={['AI', 'Systems', 'Code', 'Design', 'Automation', 'Prototypes', 'Research']}
          speed={46}
        />
      </Reveal>

      <div className="shell">
        <div className="experiments__body">
          <ul className="experiments__list">
            {experiments.map((item, i) => (
              <Reveal as="li" key={item.word} delay={i * 55} className="experiments__item">
                <button
                  type="button"
                  className={`experiments__word ${active === i ? 'is-active' : ''}`}
                  aria-pressed={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="mono experiments__index">{item.index}</span>
                  <span className="experiments__label" data-text={item.word}>
                    {item.word}
                  </span>
                </button>

                {/* Narrow screens read the note in place; the sticky panel
                    would otherwise sit far below the word being tapped. */}
                <div className={`experiments__inline ${active === i ? 'is-active' : ''}`}>
                  <p>{item.note}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <aside className="experiments__panel" aria-live="polite">
            <div className="experiments__panel-sticky">
              <span className="mono experiments__panel-index">{current.index}</span>
              <p className="experiments__panel-note">{current.note}</p>
              <span className="mono experiments__panel-count">
                {String(active + 1).padStart(2, '0')} / {String(experiments.length).padStart(2, '0')}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
