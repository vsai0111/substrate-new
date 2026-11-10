import SectionHeader from './SectionHeader'
import './RecentRequests.css'

/** "12 Feb 2026, 14:08" in the visitor's own locale and timezone. */
function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Live list of the latest demo requests, read from the API on mount and
 * refreshed by the form after a successful submission.
 */
export default function RecentRequests({ items, state, error, onRetry }) {
  return (
    <section className="section recent" id="recent-requests" aria-labelledby="recent-label">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Recently Submitted Users"
          note="Read straight from the database, newest first. Your own request appears here the moment it is stored."
          id="recent-label"
        />

        <div className="recent__body" aria-busy={state === 'loading'}>
          {state === 'loading' && <RecentSkeleton />}

          {state === 'error' && (
            <div className="recent__state recent__state--error" role="alert">
              <p className="recent__state-title">Could not load recent requests.</p>
              <p className="recent__state-note">{error}</p>
              <button type="button" className="btn recent__retry" onClick={onRetry}>
                <span>Try again</span>
                <span className="btn__line" aria-hidden="true" />
              </button>
            </div>
          )}

          {state === 'ready' && items.length === 0 && (
            <div className="recent__state">
              <p className="recent__state-title">No demo requests yet.</p>
              <p className="recent__state-note">
                Be the first — the form above writes straight to this list.
              </p>
            </div>
          )}

          {state === 'ready' && items.length > 0 && (
            <ol className="recent__list">
              {items.map((item, i) => (
                <li className="recent__item" key={`${item.email}-${item.submittedAt}-${i}`}>
                  <span className="mono recent__index">{String(i + 1).padStart(2, '0')}</span>

                  <div className="recent__identity">
                    <p className="recent__name">{item.name}</p>
                    <a className="recent__email" href={`mailto:${item.email}`}>
                      {item.email}
                    </a>
                  </div>

                  <p className="mono recent__company">
                    {item.company || <span className="recent__muted">—</span>}
                  </p>

                  <time className="mono recent__date" dateTime={item.submittedAt}>
                    {formatDate(item.submittedAt)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}

function RecentSkeleton() {
  return (
    <ol className="recent__list recent__list--loading">
      <li className="u-hidden">Loading recent demo requests…</li>
      {[0, 1, 2].map((i) => (
        <li className="recent__item recent__item--skeleton" key={i} aria-hidden="true">
          <span className="skeleton skeleton--index" />
          <div className="recent__identity">
            <span className="skeleton skeleton--name" />
            <span className="skeleton skeleton--email" />
          </div>
          <span className="skeleton skeleton--company" />
          <span className="skeleton skeleton--date" />
        </li>
      ))}
    </ol>
  )
}
