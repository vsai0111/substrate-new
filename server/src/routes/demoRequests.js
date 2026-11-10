import { Router } from 'express'
import { pool } from '../db.js'
import { validateDemoRequest } from '../lib/validate.js'
import { rateLimit } from '../lib/rateLimit.js'

export const demoRequests = Router()

const RECENT_LIMIT = 8

/** MySQL DATETIME string -> ISO 8601 UTC, so the client can format it. */
const toIso = (value) => new Date(`${String(value).replace(' ', 'T')}Z`).toISOString()

/**
 * GET /api/demo-requests
 * The most recent submissions, newest first.
 *
 * Only the fields the page renders are selected — the row id and the free-text
 * message are never sent to the browser.
 */
demoRequests.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT full_name, email, company, created_at
         FROM demo_requests
        ORDER BY created_at DESC, id DESC
        LIMIT ?`,
      [RECENT_LIMIT],
    )

    res.json({
      data: rows.map((row) => ({
        name: row.full_name,
        email: row.email,
        company: row.company,
        submittedAt: toIso(row.created_at),
      })),
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/demo-requests
 * Stores one demo request and echoes back the stored row.
 */
demoRequests.post('/', rateLimit({ windowMs: 60_000, max: 5 }), async (req, res, next) => {
  try {
    const { valid, errors, value } = validateDemoRequest(req.body)

    if (!valid) {
      return res.status(400).json({
        error: 'Please correct the highlighted fields.',
        fields: errors,
      })
    }

    const [result] = await pool.execute(
      `INSERT INTO demo_requests (full_name, email, company, message)
       VALUES (?, ?, ?, ?)`,
      [value.fullName, value.email, value.company, value.message],
    )

    const [rows] = await pool.execute(
      `SELECT full_name, email, company, created_at FROM demo_requests WHERE id = ?`,
      [result.insertId],
    )

    const row = rows[0]
    res.status(201).json({
      data: {
        name: row.full_name,
        email: row.email,
        company: row.company,
        submittedAt: toIso(row.created_at),
      },
    })
  } catch (err) {
    next(err)
  }
})
