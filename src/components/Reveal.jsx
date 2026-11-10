import { useReveal } from '../hooks/useReveal'

/**
 * Wraps children in a scroll-triggered fade/rise.
 * `as` keeps the semantic element (li, p, dl) instead of adding a div.
 */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
  const [ref, isIn] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`reveal ${isIn ? 'is-in' : ''} ${className}`.trim()}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
