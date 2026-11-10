import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import mysql from 'mysql2/promise'

/**
 * Applies schema.sql to an existing database. Idempotent — run it as often
 * as you like.
 *
 * It deliberately does NOT create the database or any users: substrate_app is
 * a least-privilege account scoped to substrate_db, and provisioning is a
 * separate, deliberate act performed by an administrator.
 */
const here = dirname(fileURLToPath(import.meta.url))
const dbName = process.env.DB_NAME

if (!dbName) {
  console.error('[migrate] DB_NAME is not set. Copy server/.env.example to server/.env first.')
  process.exit(1)
}

let conn
try {
  conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName,
    // The schema file is a trusted local artefact, not user input.
    multipleStatements: true,
  })
} catch (err) {
  if (err.code === 'ER_BAD_DB_ERROR') {
    console.error(
      `[migrate] database \`${dbName}\` does not exist. Create it as an administrator first:\n` +
        `          CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    )
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error(`[migrate] access denied for '${process.env.DB_USER}'. Check DB_PASSWORD in server/.env.`)
  } else {
    console.error('[migrate] could not connect:', err.message)
  }
  process.exit(1)
}

try {
  const sql = await readFile(join(here, 'schema.sql'), 'utf8')
  await conn.query(sql)

  const [tables] = await conn.query('SHOW TABLES LIKE ?', ['demo_requests'])
  if (!tables.length) {
    console.error('[migrate] finished, but demo_requests is missing')
    process.exitCode = 1
  } else {
    const [[{ rows_count }]] = await conn.query('SELECT COUNT(*) AS rows_count FROM demo_requests')
    console.log(`[migrate] ok - \`${dbName}\`.demo_requests is ready (${rows_count} row(s))`)
  }
} catch (err) {
  console.error('[migrate] failed:', err.message)
  process.exitCode = 1
} finally {
  await conn.end()
}
