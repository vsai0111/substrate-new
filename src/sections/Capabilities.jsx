import { capabilities } from '../data/site'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import './Capabilities.css'

export default function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Capabilities"
          note="We work end to end, but we are happiest where design and infrastructure have to agree with each other."
        />

        <ul className="cap__list">
          {capabilities.map((cap, i) => (
            <Reveal as="li" key={cap.id} delay={i * 50} className="cap__item">
              <span className="mono cap__id">{cap.id}</span>
              <h3 className="cap__name">{cap.name}</h3>
              <p className="cap__note">{cap.note}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
