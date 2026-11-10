/**
 * Server-side validation for a demo request.
 * The client validates too, for feedback — this is the copy that is trusted.
 */

const LIMITS = { fullName: 120, email: 254, company: 120, message: 2000 }

// Deliberately permissive: enough to reject obvious typos without rejecting
// valid-but-unusual addresses.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const clean = (value) => (typeof value === 'string' ? value.trim() : '')

export function validateDemoRequest(body) {
  const errors = {}

  const fullName = clean(body?.fullName)
  const email = clean(body?.email)
  const company = clean(body?.company)
  const message = clean(body?.message)

  if (!fullName) errors.fullName = 'Full name is required.'
  else if (fullName.length > LIMITS.fullName)
    errors.fullName = `Full name must be ${LIMITS.fullName} characters or fewer.`

  if (!email) errors.email = 'Email is required.'
  else if (email.length > LIMITS.email)
    errors.email = `Email must be ${LIMITS.email} characters or fewer.`
  else if (!EMAIL.test(email)) errors.email = 'Enter a valid email address.'

  if (company.length > LIMITS.company)
    errors.company = `Company must be ${LIMITS.company} characters or fewer.`

  if (message.length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    // Optional fields are stored as NULL rather than empty strings.
    value: { fullName, email, company: company || null, message: message || null },
  }
}
