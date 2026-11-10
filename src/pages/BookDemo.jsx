import { useCallback, useEffect, useRef, useState } from 'react'
import { brand } from '../data/site'
import { ApiError, fetchDemoRequests, submitDemoRequest } from '../lib/api'
import SectionHeader from '../components/SectionHeader'
import Reveal from '../components/Reveal'
import RecentRequests from '../components/RecentRequests'
import './BookDemo.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const EMPTY = { fullName: '', email: '', company: '', message: '' }

const EXPECTATIONS = [
  { k: 'Length', v: '45 minutes, screen shared' },
  { k: 'With', v: 'The people who do the work' },
  { k: 'Reply', v: 'Within two working days' },
  { k: 'Cost', v: 'Nothing, no pitch deck' },
]

/** Mirrors the server's rules so the field errors match what it would return. */
function validate(values) {
  const errors = {}
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.'
  else if (values.fullName.trim().length > 120)
    errors.fullName = 'Full name must be 120 characters or fewer.'

  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address.'

  if (values.company.trim().length > 120)
    errors.company = 'Company must be 120 characters or fewer.'
  if (values.message.trim().length > 2000)
    errors.message = 'Message must be 2000 characters or fewer.'

  return errors
}

export default function BookDemo() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [formError, setFormError] = useState('')

  const [recent, setRecent] = useState([])
  const [recentState, setRecentState] = useState('loading') // loading | ready | error
  const [recentError, setRecentError] = useState('')

  const formRef = useRef(null)
  const statusRef = useRef(null)

  /* ---- Recently submitted -------------------------------------------- */
  const loadRecent = useCallback(async (signal) => {
    setRecentState('loading')
    setRecentError('')
    try {
      const data = await fetchDemoRequests({ signal })
      setRecent(data)
      setRecentState('ready')
    } catch (err) {
      if (err.name === 'AbortError') return
      setRecentError(err.message || 'Could not load recent requests.')
      setRecentState('error')
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadRecent(controller.signal)
    return () => controller.abort()
  }, [loadRecent])

  /* ---- Form ----------------------------------------------------------- */
  const onChange = (field) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [field]: value }))
    // Clear a field's error as soon as the visitor edits it, but do not
    // introduce new errors mid-typing.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  const onBlur = (field) => () => {
    const fieldErrors = validate(values)
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (status === 'submitting') return // guards double submits

    const nextErrors = validate(values)
    const invalid = Object.keys(nextErrors).filter((k) => nextErrors[k])

    if (invalid.length) {
      setErrors(nextErrors)
      setStatus('idle')
      setFormError('')
      formRef.current?.querySelector(`[name="${invalid[0]}"]`)?.focus()
      return
    }

    setStatus('submitting')
    setFormError('')

    try {
      await submitDemoRequest({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        company: values.company.trim(),
        message: values.message.trim(),
      })

      setValues(EMPTY) // reset only once the server has stored it
      setErrors({})
      setStatus('success')
      loadRecent() // reflect the new row without a page reload
    } catch (err) {
      setStatus('error')
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields)
        formRef.current?.querySelector(`[name="${Object.keys(err.fields)[0]}"]`)?.focus()
      }
      setFormError(err.message || 'Could not send your request. Please try again.')
    }
  }

  // Move focus to the outcome message so it is not missed after submitting.
  useEffect(() => {
    if (status === 'success' || status === 'error') statusRef.current?.focus()
  }, [status])

  const submitting = status === 'submitting'

  return (
    <>
      <section className="demo-hero" aria-labelledby="demo-title">
        <div className="shell demo-hero__inner">
          <Reveal className="demo-hero__eyebrow">
            <span className="mono">
              <span className="demo-hero__pip" aria-hidden="true" />
              Book a demo — {brand.locations.join(' / ')}
            </span>
          </Reveal>

          <Reveal as="h1" className="demo-hero__title" id="demo-title" delay={80}>
            Book a demo
          </Reveal>

          <Reveal as="p" className="demo-hero__lede" delay={140}>
            Bring a problem, not a brief. We will walk through how we have solved something
            like it before, show the working software, and tell you honestly if we are the
            wrong studio for it.
          </Reveal>

          <Reveal as="dl" className="demo-hero__meta" delay={200}>
            {EXPECTATIONS.map((item) => (
              <div className="demo-hero__meta-item" key={item.k}>
                <dt className="mono">{item.k}</dt>
                <dd className="mono">{item.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section demo-form-section" aria-labelledby="demo-form-label">
        <div className="shell">
          <SectionHeader
            index="01"
            label="Request a session"
            note="Two required fields. We reply from a real inbox, and only about this request."
            id="demo-form-label"
          />

          <div className="demo-layout">
            <form className="demo-form" ref={formRef} onSubmit={onSubmit} noValidate>
              <Field
                name="fullName"
                label="Full name"
                required
                value={values.fullName}
                error={errors.fullName}
                onChange={onChange('fullName')}
                onBlur={onBlur('fullName')}
                autoComplete="name"
                disabled={submitting}
              />

              <Field
                name="email"
                label="Email"
                type="email"
                required
                value={values.email}
                error={errors.email}
                onChange={onChange('email')}
                onBlur={onBlur('email')}
                autoComplete="email"
                disabled={submitting}
              />

              <Field
                name="company"
                label="Company"
                optional
                value={values.company}
                error={errors.company}
                onChange={onChange('company')}
                onBlur={onBlur('company')}
                autoComplete="organization"
                disabled={submitting}
              />

              <Field
                name="message"
                label="Message"
                optional
                as="textarea"
                rows={5}
                hint="What are you building, and what is in the way?"
                value={values.message}
                error={errors.message}
                onChange={onChange('message')}
                onBlur={onBlur('message')}
                disabled={submitting}
              />

              <div className="demo-form__actions">
                <button type="submit" className="btn demo-form__submit" disabled={submitting}>
                  <span>
                    {submitting ? 'Sending' : 'Request a demo'}
                    {submitting && <Spinner />}
                  </span>
                  <span className="btn__line" aria-hidden="true" />
                </button>

                <p className="mono demo-form__privacy">
                  Stored to answer your request. Nothing else.
                </p>
              </div>

              {/* One live region for both outcomes, focusable so submitting
                  by keyboard lands the user on the result. */}
              <div
                className="demo-form__status"
                ref={statusRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
              >
                {status === 'success' && (
                  <p className="demo-form__message demo-form__message--ok">
                    <span className="mono">Received</span>
                    Thanks — your request is in. We will be in touch within two working days,
                    and it is listed below.
                  </p>
                )}
                {status === 'error' && formError && (
                  <p className="demo-form__message demo-form__message--bad">
                    <span className="mono">Not sent</span>
                    {formError}
                  </p>
                )}
              </div>
            </form>

            <aside className="demo-aside">
              <h2 className="mono demo-aside__title">Prefer email?</h2>
              <a className="demo-aside__mail" href={`mailto:${brand.email}`}>
                {brand.email}
              </a>
              <p className="demo-aside__note">
                A paragraph about the problem is plenty. We read every one, and we answer
                the ones we cannot help with too.
              </p>

              <h2 className="mono demo-aside__title demo-aside__title--spaced">
                What we will ask
              </h2>
              <ol className="demo-aside__list">
                <li>What breaks today, and for whom.</li>
                <li>What you have already tried.</li>
                <li>What shipping looks like in three months.</li>
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <RecentRequests
        items={recent}
        state={recentState}
        error={recentError}
        onRetry={() => loadRecent()}
      />
    </>
  )
}

/* -------------------------------------------------------------------- */

function Field({
  name,
  label,
  as = 'input',
  type = 'text',
  required = false,
  optional = false,
  hint,
  error,
  ...rest
}) {
  const Tag = as
  const errorId = `${name}-error`
  const hintId = `${name}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="mono field__label" htmlFor={name}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="field__optional">Optional</span>}
        {required && <span className="u-hidden">(required)</span>}
      </label>

      <Tag
        id={name}
        name={name}
        className="field__input"
        type={as === 'input' ? type : undefined}
        required={required || undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        {...rest}
      />

      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {error && (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <span className="spinner" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}
