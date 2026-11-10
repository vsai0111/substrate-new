import Reveal from './Reveal'
import './SectionHeader.css'

/**
 * The repeating editorial header: index marker, label, and an optional
 * right-aligned note. Establishes the vertical rhythm of every section.
 */
export default function SectionHeader({ index, label, note, id }) {
  return (
    <Reveal className="sechead">
      <div className="sechead__marker">
        <span className="mono sechead__index">[ {index} ]</span>
        <h2 className="mono sechead__label" id={id}>
          {label}
        </h2>
      </div>
      {note && <p className="sechead__note">{note}</p>}
    </Reveal>
  )
}
