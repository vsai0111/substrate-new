import './Marquee.css'

/**
 * Seamless ticker. The track is duplicated once and translated by exactly
 * -50%, so the loop has no visible seam. Purely decorative: the duplicate
 * is hidden from assistive tech and motion is disabled on request.
 */
export default function Marquee({ items, speed = 42, reverse = false }) {
  const group = (hidden) => (
    <span className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <i className="marquee__sep" aria-hidden="true">
            /
          </i>
        </span>
      ))}
    </span>
  )

  return (
    <div className="marquee" data-reverse={reverse ? 'true' : undefined}>
      <div className="marquee__track" style={{ '--speed': `${speed}s` }}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}
