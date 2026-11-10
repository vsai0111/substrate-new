import { about } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import './About.css'

export default function About() {
  const [titleRef, titleIn] = useReveal({ threshold: 0.35 })

  return (
    <section className="section about" id="about">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Studio"
          note="Independent since 2019. Two studios, one timezone overlap, no account managers."
        />

        <div className="about__grid">
          <h3 className={`about__title ${titleIn ? 'is-in' : ''}`} ref={titleRef}>
            {about.lines.map((line, i) => (
              <span className="line-mask" key={line} style={{ '--reveal-delay': `${i * 90}ms` }}>
                <span>{line}</span>
              </span>
            ))}
          </h3>

          <div className="about__body">
            {about.body.map((p, i) => (
              <Reveal as="p" key={p.slice(0, 24)} delay={i * 110} className="about__para">
                {p}
              </Reveal>
            ))}

            <Reveal className="about__pillars" delay={180}>
              <span className="mono about__pillars-label">Working across</span>
              <ul>
                {about.pillars.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <Reveal as="dl" className="about__stats">
          {about.stats.map((s) => (
            <div className="about__stat" key={s.k}>
              <dt className="about__stat-value">{s.v}</dt>
              <dd className="mono about__stat-key">{s.k}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
