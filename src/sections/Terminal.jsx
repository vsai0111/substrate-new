import { useCallback, useEffect, useRef, useState } from 'react'
import { brand, capabilities, experiments, projects } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'
import SectionHeader from '../components/SectionHeader'
import './Terminal.css'

const PROMPT = 'visitor@substrate:~$'
const TYPE_MS = 9
// Boot lines live on their own negative id range so they never collide with
// the incrementing ids handed out to command output.
const BOOT_ID = -1

const BOOT = [
  { type: 'sys', text: 'substrate/origin — build 024.09' },
  { type: 'sys', text: 'runtime: browser · backend: none · storage: none' },
  { type: 'sys', text: 'session established · 0 cookies · 0 trackers' },
  { type: 'out', text: 'Welcome. This shell is the short version of the site.' },
  { type: 'hint', text: 'type `help` for available commands' },
]

/** Command implementations. Each returns an array of output lines. */
const COMMANDS = {
  help: {
    summary: 'list available commands',
    run: () => [
      { type: 'out', text: 'AVAILABLE COMMANDS' },
      ...Object.entries(COMMANDS).map(([name, cmd]) => ({
        type: 'kv',
        key: name,
        text: cmd.summary,
      })),
      { type: 'hint', text: '↑ ↓ history · tab completes · ctrl+l clears · esc exits the shell' },
    ],
  },
  about: {
    summary: 'who we are',
    run: () => [
      { type: 'out', text: `${brand.name} — ${brand.descriptor}` },
      { type: 'out', text: '' },
      {
        type: 'out',
        text: 'Eight people working between design, engineering and applied AI.',
      },
      {
        type: 'out',
        text: 'Independent since 2019. Studios in Bengaluru and Lisbon.',
      },
      { type: 'out', text: '' },
      { type: 'kv', key: 'focus', text: 'interfaces, systems, infrastructure' },
      { type: 'kv', key: 'model', text: 'small team, long engagements' },
    ],
  },
  work: {
    summary: 'selected projects',
    run: () => [
      { type: 'out', text: 'SELECTED WORK' },
      ...projects.map((p) => ({
        type: 'kv',
        key: `${p.id} ${p.name}`,
        text: `${p.category} · ${p.year}`,
      })),
      { type: 'hint', text: 'full case notes in the work section below' },
    ],
  },
  experiments: {
    summary: 'ongoing research threads',
    run: () => [
      { type: 'out', text: 'RESEARCH THREADS' },
      ...experiments.map((e) => ({ type: 'kv', key: e.index, text: e.word })),
    ],
  },
  capabilities: {
    summary: 'what we do',
    run: () =>
      capabilities.map((c) => ({ type: 'kv', key: c.id, text: c.name })),
  },
  contact: {
    summary: 'start a conversation',
    run: () => [
      { type: 'out', text: 'Currently open for Q3 engagements.' },
      { type: 'kv', key: 'email', text: brand.email },
      { type: 'kv', key: 'response', text: 'within two working days' },
      { type: 'hint', text: 'a short note about the problem is enough' },
    ],
  },
  whoami: {
    summary: 'identify the current session',
    run: () => [
      { type: 'out', text: 'visitor' },
      { type: 'hint', text: 'no account, no tracking, nothing stored' },
    ],
  },
  clear: { summary: 'clear the screen', run: () => [] },
}

const NAMES = Object.keys(COMMANDS)

export default function Terminal() {
  const [ref, isIn] = useReveal({ threshold: 0.3 })
  const reduced = useReducedMotion()

  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  // Refs, not state: flipping state here would re-run the boot effect and
  // tear down its own timers before the sequence finished typing.
  const bootStarted = useRef(false)
  const bootDone = useRef(false)
  const bootTimers = useRef([])
  const history = useRef([])
  const historyIndex = useRef(-1)
  const inputRef = useRef(null)
  const screenRef = useRef(null)
  const uid = useRef(0)

  const push = useCallback((entries) => {
    setLines((prev) => [
      ...prev,
      ...entries.map((e) => {
        uid.current += 1
        return { ...e, id: uid.current }
      }),
    ])
  }, [])

  /** Skip to the end of the boot sequence — called as soon as anyone types. */
  const finishBoot = useCallback(() => {
    if (bootDone.current) return
    bootDone.current = true
    bootTimers.current.forEach(clearTimeout)
    bootTimers.current = []

    setLines((prev) => {
      const next = [...prev]
      BOOT.forEach((line, i) => {
        const id = BOOT_ID - i
        const at = next.findIndex((l) => l.id === id)
        if (at >= 0) next[at] = { ...next[at], text: line.text }
        else next.splice(i, 0, { ...line, id })
      })
      return next
    })
  }, [])

  /* ---- Boot sequence: types itself out once the section is in view ---- */
  useEffect(() => {
    if (!isIn || bootStarted.current) return
    bootStarted.current = true

    if (reduced) {
      bootDone.current = true
      setLines(BOOT.map((line, i) => ({ ...line, id: BOOT_ID - i })))
      return
    }

    const timers = []
    let elapsed = 0

    BOOT.forEach((line, lineIndex) => {
      // Each boot line owns a stable id so its characters land in the right
      // row even if the visitor runs a command while it is still typing.
      const id = BOOT_ID - lineIndex
      const chars = line.text.length

      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { ...line, text: '', id }])
        }, elapsed),
      )

      for (let c = 1; c <= chars; c += 1) {
        timers.push(
          setTimeout(() => {
            setLines((prev) =>
              prev.map((l) => (l.id === id ? { ...l, text: line.text.slice(0, c) } : l)),
            )
          }, elapsed + c * TYPE_MS),
        )
      }

      elapsed += chars * TYPE_MS + (lineIndex === BOOT.length - 1 ? 0 : 140)
    })

    timers.push(
      setTimeout(() => {
        bootDone.current = true
      }, elapsed + 20),
    )

    bootTimers.current = timers

    return () => {
      timers.forEach(clearTimeout)
      // Interrupted mid-boot (StrictMode's double mount, or an unmount):
      // drop the half-typed lines and allow a clean replay.
      if (!bootDone.current) {
        bootStarted.current = false
        setLines([])
      }
    }
  }, [isIn, reduced])

  /* ---- Keep the newest line in view ---- */
  useEffect(() => {
    const el = screenRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const execute = useCallback(
    (raw) => {
      finishBoot()

      const input = raw.trim()
      push([{ type: 'in', text: input }])

      if (!input) return

      history.current = [input, ...history.current.filter((h) => h !== input)].slice(0, 40)
      historyIndex.current = -1

      const [name, ...args] = input.toLowerCase().split(/\s+/)

      if (name === 'clear') {
        setLines([])
        return
      }

      if (name === 'sudo') {
        push([{ type: 'err', text: 'visitor is not in the sudoers file. This incident is not being reported.' }])
        return
      }

      if (name === 'echo') {
        push([{ type: 'out', text: args.join(' ') || '' }])
        return
      }

      const command = COMMANDS[name]
      if (!command) {
        push([
          { type: 'err', text: `command not found: ${name}` },
          { type: 'hint', text: `try one of: ${NAMES.join(', ')}` },
        ])
        return
      }

      push(command.run())
    },
    [push, finishBoot],
  )

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      execute(value)
      setValue('')
      return
    }

    // Tab completes only when there is something new to complete to —
    // otherwise it must move focus onward, or the shell becomes a
    // keyboard trap. Escape is always an explicit way out.
    if (e.key === 'Tab' && !e.shiftKey) {
      const partial = value.trim().toLowerCase()
      const match = partial && NAMES.find((n) => n.startsWith(partial))
      if (match && match !== value) {
        e.preventDefault()
        setValue(match)
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      inputRef.current?.blur()
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.current.length) return
      historyIndex.current = Math.min(historyIndex.current + 1, history.current.length - 1)
      setValue(history.current[historyIndex.current])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      historyIndex.current -= 1
      if (historyIndex.current < 0) {
        historyIndex.current = -1
        setValue('')
      } else {
        setValue(history.current[historyIndex.current])
      }
      return
    }

    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <section className="section" id="terminal" ref={ref}>
      <div className="shell">
        <SectionHeader
          index="01"
          label="Interactive / origin.log"
          note="A working shell, not a screenshot. Everything below runs in your browser — no requests leave the page."
        />

        <div
          className={`term ${focused ? 'is-focused' : ''}`}
          onMouseDown={(e) => {
            // Let people select output text; only redirect stray clicks.
            if (window.getSelection()?.toString()) return
            if (e.target.tagName !== 'A') inputRef.current?.focus()
          }}
        >
          <div className="term__bar">
            <span className="term__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mono term__title">origin.log — substrate/shell</span>
            <span className="mono term__status">
              <span className="term__led" aria-hidden="true" />
              ready
            </span>
          </div>

          <div
            className="term__screen"
            ref={screenRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {lines.map((line) => (
              <Line key={line.id} line={line} />
            ))}

            <div className="term__inputline">
              <span className="term__prompt" aria-hidden="true">
                {PROMPT}
              </span>
              <span className="term__field">
                <span className="term__mirror" aria-hidden="true">
                  {value}
                  <span className={`term__caret ${focused ? 'is-live' : ''}`} />
                </span>
                <label className="u-hidden" htmlFor="term-input">
                  Terminal command input. Type help and press Enter for available commands.
                  Press Escape or Tab to leave the terminal.
                </label>
                <input
                  id="term-input"
                  ref={inputRef}
                  className="term__input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  enterKeyHint="send"
                />
              </span>
            </div>
          </div>
        </div>

        <ul className="term__chips" aria-label="Suggested commands">
          {['help', 'about', 'work', 'contact'].map((c) => (
            <li key={c}>
              <button
                type="button"
                className="mono term__chip"
                onClick={() => {
                  execute(c)
                  setValue('')
                  inputRef.current?.focus()
                }}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Line({ line }) {
  if (line.type === 'in') {
    return (
      <p className="term__line term__line--in">
        <span className="term__prompt">{PROMPT}</span>
        <span>{line.text}</span>
      </p>
    )
  }

  if (line.type === 'kv') {
    return (
      <p className="term__line term__line--kv">
        <span className="term__key">{line.key}</span>
        <span className="term__val">{line.text}</span>
      </p>
    )
  }

  return (
    <p className={`term__line term__line--${line.type}`}>
      {line.text || ' '}
    </p>
  )
}
