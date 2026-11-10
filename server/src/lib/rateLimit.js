/**
 * Minimal fixed-window rate limiter, in memory.
 *
 * Only responses that succeed are counted. A visitor who mistypes their email
 * five times is not a threat and must not be locked out; validation failures
 * never reach the database, so there is nothing to protect against there.
 * What this does limit is the rate of actual writes from one address.
 *
 * It is per process, so it does not survive a restart or coordinate across
 * instances — if this ever runs behind more than one node, move the counter
 * to Redis.
 */
export function rateLimit({ windowMs = 60_000, max = 5, countFailures = false } = {}) {
  const hits = new Map()

  // Drop expired buckets periodically so the map cannot grow without bound.
  const sweep = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key)
  }, windowMs)
  sweep.unref?.()

  return (req, res, next) => {
    const key = req.ip
    const now = Date.now()
    let entry = hits.get(key)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs }
      hits.set(key, entry)
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      res.set('Retry-After', String(retryAfter))
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.',
      })
    }

    entry.count += 1

    // Refund the slot if the request never resulted in a write.
    if (!countFailures) {
      res.on('finish', () => {
        if (res.statusCode >= 400 && entry.count > 0) entry.count -= 1
      })
    }

    return next()
  }
}
