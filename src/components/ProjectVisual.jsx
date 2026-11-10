import './ProjectVisual.css'

/**
 * Generative-looking SVG placeholders, one geometry per project.
 * Pure vector: nothing to download, nothing to lazy-load, and the page
 * still renders correctly with no network at all.
 */

function Orbit() {
  return (
    <svg viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      <g className="pv__stroke">
        <ellipse cx="160" cy="110" rx="118" ry="46" />
        <ellipse cx="160" cy="110" rx="118" ry="46" transform="rotate(60 160 110)" />
        <ellipse cx="160" cy="110" rx="118" ry="46" transform="rotate(-60 160 110)" />
      </g>
      <circle className="pv__fill" cx="160" cy="110" r="9" />
      <circle className="pv__dot" cx="278" cy="110" r="3.5" />
      <circle className="pv__dot" cx="101" cy="8" r="3.5" />
    </svg>
  )
}

function Grid() {
  const cells = []
  for (let r = 0; r < 6; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      const on = (r * 9 + c) % 7 === 0 || (r + c) % 5 === 0
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={16 + c * 32}
          y={20 + r * 30}
          width="26"
          height="24"
          className={on ? 'pv__fill' : 'pv__stroke'}
        />,
      )
    }
  }
  return (
    <svg viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      {cells}
    </svg>
  )
}

function Flow() {
  return (
    <svg viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      <g className="pv__stroke">
        <path d="M20 40h80v140h100V60h100" />
        <path d="M20 110h140v70h140" />
        <path d="M20 180h40V80h240" />
      </g>
      {[
        [100, 40],
        [200, 180],
        [160, 110],
        [60, 180],
        [300, 60],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} className="pv__fill" x={x - 4} y={y - 4} width="8" height="8" />
      ))}
    </svg>
  )
}

function Terrain() {
  const rows = Array.from({ length: 11 }, (_, i) => {
    const y = 30 + i * 16
    const amp = 14 - Math.abs(i - 5) * 2
    const d = Array.from({ length: 17 }, (_, j) => {
      const x = 12 + j * 18.5
      const off = Math.sin((j + i * 1.4) * 0.7) * amp
      return `${j === 0 ? 'M' : 'L'}${x} ${y + off}`
    }).join(' ')
    return <path key={i} d={d} className="pv__stroke" />
  })
  return (
    <svg viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      {rows}
    </svg>
  )
}

function Pulse() {
  const bars = Array.from({ length: 34 }, (_, i) => {
    const h = 8 + Math.abs(Math.sin(i * 0.55)) * 88 + (i % 4) * 6
    return (
      <rect
        key={i}
        x={12 + i * 9}
        y={110 - h / 2}
        width="3"
        height={h}
        className={i % 6 === 0 ? 'pv__fill' : 'pv__stroke-fill'}
      />
    )
  })
  return (
    <svg viewBox="0 0 320 220" role="presentation" aria-hidden="true">
      <line className="pv__stroke" x1="12" y1="110" x2="308" y2="110" />
      {bars}
    </svg>
  )
}

const VARIANTS = { orbit: Orbit, grid: Grid, flow: Flow, terrain: Terrain, pulse: Pulse }

export default function ProjectVisual({ variant = 'orbit' }) {
  const Shape = VARIANTS[variant] || Orbit
  return (
    <div className={`pv pv--${variant}`}>
      <Shape />
    </div>
  )
}
