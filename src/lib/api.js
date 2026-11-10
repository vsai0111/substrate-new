/**
 * Thin fetch wrapper for the demo-request API.
 *
 * Requests are same-origin by default: Vite proxies /api in development and
 * CloudFront routes /api/* to the EC2 origin in production, so no base URL is
 * needed. VITE_API_BASE_URL remains available as an override for local work
 * against a remote API; CI never sets it.
 */
const BASE = import.meta.env.VITE_API_BASE_URL || ''

/** Carries the HTTP status and any per-field messages from the server. */
export class ApiError extends Error {
  constructor(message, { status = 0, fields = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

/**
 * Used when the response carries no JSON body of its own - a gateway error,
 * or a proxy answering for a process that is not running. Raw status codes
 * are not something to put in front of a visitor.
 */
function fallbackMessage(status) {
  if (status === 404) return 'That endpoint could not be found.'
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 502 && status <= 504)
    return 'The service is temporarily unavailable. Please try again in a moment.'
  if (status >= 500) return 'Something went wrong on our end. Please try again.'
  return 'Request failed. Please try again.'
}

async function request(path, { signal, method = 'GET', body } = {}) {
  let response

  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    // AbortError is a caller-initiated cancellation, not a failure.
    if (err.name === 'AbortError') throw err
    throw new ApiError('Could not reach the server. Check your connection and try again.')
  }

  // A proxy or crashed process can answer with HTML; never assume JSON.
  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new ApiError(payload?.error || fallbackMessage(response.status), {
      status: response.status,
      fields: payload?.fields || null,
    })
  }

  return payload
}

/** Most recent demo requests, newest first. */
export function fetchDemoRequests({ signal } = {}) {
  return request('/api/demo-requests', { signal }).then((res) => res?.data ?? [])
}

/** Submits one demo request and returns the stored record. */
export function submitDemoRequest(payload) {
  return request('/api/demo-requests', { method: 'POST', body: payload }).then(
    (res) => res?.data ?? null,
  )
}
