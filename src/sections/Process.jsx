import { process } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import './Process.css'

export default function Process() {
  const [ref, isIn] = useReveal({ threshold: 0.2 })

  return (
    <section className="section process" id="process">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Process"
          note="Six moves, repeated until the thing works. Deploy sits inside the process, not after it."
        />

        <ol className={`process__track ${isIn ? 'is-in' : ''}`} ref={ref}>
          {process.map((step, i) => (
            <li className="process__step" key={step.id} style={{ '--i': i }}>
              <span className="process__node" aria-hidden="true" />
              <span className="mono process__id">{step.id}</span>
              <h3 className="process__name">{step.name}</h3>
              <p className="process__note">{step.note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
