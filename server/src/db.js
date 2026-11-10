import mysql from 'mysql2/promise'

/**
 * A single shared connection pool for the process. mysql2 queues queries when
 * every connection is busy, so this is the only pool the app needs.
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
  // Keep DATETIME/TIMESTAMP as strings; we normalise to ISO ourselves rather
  // than letting the driver apply the server's local timezone.
  dateStrings: true,
})

/** Verifies the database is reachable at boot so failures are loud, not lazy. */
export async function assertConnection() {
  const conn = await pool.getConnection()
  try {
    await conn.query('SELECT 1')
  } finally {
    conn.release()
  }
}
