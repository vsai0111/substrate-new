/**
 * Hand-rolled inline SVG icons — cheaper than pulling an icon package in
 * for four glyphs, and they inherit currentColor for free.
 * All are decorative; labelling lives on the interactive parent.
 */

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'square',
  'aria-hidden': 'true',
  focusable: 'false',
}

export function ArrowUpRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.75 4.5h5.75v5.75" />
    </svg>
  )
}

export function ArrowDown(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 2.5v11" />
      <path d="M3.5 9.25 8 13.75l4.5-4.5" />
    </svg>
  )
}

export function Plus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

export function MenuLines(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 5h12M2 11h12" />
    </svg>
  )
}

export function Close(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
    </svg>
  )
}
