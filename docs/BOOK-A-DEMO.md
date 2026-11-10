# Book a Demo — architecture and setup

The site is no longer purely static. `/book-a-demo` writes to and reads from MySQL
through a small Express API. This document covers everything that feature adds.

```
Homepage CTA
     |
     v
/book-a-demo  ──GET  /api/demo-requests──>  Express  ──SELECT──>  MySQL
     |                                                              |
     └────────POST /api/demo-requests────>  Express  ──INSERT──>  demo_requests
                                                                    |
                        Recently Submitted Users  <──refetch────────┘
```

The frontend calls `/api` on its **own origin**. Vite proxies it in development.
In production a reverse proxy must do the same, so there is no API base URL to
configure and no CORS in production.

---

## 1. What was added

| Path | Purpose |
| --- | --- |
| `src/pages/BookDemo.jsx` + `.css` | The page: heading, description, form |
| `src/pages/Home.jsx` | The previous homepage sections, unchanged |
| `src/pages/NotFound.jsx` + `.css` | 404 for unknown client-side routes |
| `src/components/RecentRequests.jsx` + `.css` | The live list, with all four states |
| `src/components/ScrollManager.jsx` | Scroll to top / to `#hash` on route change |
| `src/lib/api.js` | `fetch` wrapper, typed errors, human error copy |
| `server/` | Express + mysql2 API |

React Router was added because the project had no routing at all; the original
brief said to introduce it only if genuinely necessary, and a dedicated page is.

## 2. Database

You need a database and a least-privilege user before running the migration, for example `substrate_db` and `substrate_app`. See the README for the SQL. Nothing in this repo creates the user. 
pm run migrate` only creates the **table**,
and fails with a clear message if the database is missing or the password is wrong.

```sql
CREATE TABLE IF NOT EXISTS demo_requests (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  full_name   VARCHAR(120)    NOT NULL,
  email       VARCHAR(254)    NOT NULL,
  company     VARCHAR(120)        NULL,
  message     TEXT                NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_demo_requests_created_at (created_at DESC)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
```

`substrate_app` needs only `SELECT, INSERT` on `substrate_db.demo_requests`, plus
`CREATE` if you want it to run the migration itself.

## 3. Running it locally

```bash
# 1. API configuration
cp server/.env.example server/.env      # then fill in DB_PASSWORD

# 2. Dependencies
npm install            # frontend
npm install --prefix server            # API

# 3. Create the table (idempotent)
npm run migrate --prefix server

# 4. Two processes
npm run dev --prefix server            # API  on :4000
npm run dev                            # site on :5173, proxying /api to :4000
```

## 4. API

Base path `/api`. JSON in, JSON out.

### `GET /api/demo-requests`

Returns the 8 most recent requests, newest first.

```json
{ "data": [
  { "name": "Ada Lovelace",
    "email": "ada@example.com",
    "company": "Analytical Engines",
    "submittedAt": "2026-08-29T20:00:11.000Z" }
] }
```

The row `id` and the free-text `message` are deliberately **not** selected — the
page does not render them, so they never reach the browser.

### `POST /api/demo-requests`

```json
{ "fullName": "Ada Lovelace", "email": "ada@example.com",
  "company": "Analytical Engines", "message": "..." }
```

`fullName` and `email` are required; `company` and `message` are optional and are
stored as `NULL` when blank.

| Status | Meaning |
| --- | --- |
| `201` | Stored. Returns the row in the shape above. |
| `400` | Validation failed. `{ error, fields: { email: "..." } }` — the page maps `fields` onto the inputs. |
| `429` | More than 5 **successful** writes from one IP in a minute. Carries `Retry-After`. |
| `500` | Logged server-side; the client gets an opaque message, never SQL. |

### `GET /api/health`

`{ "status": "ok", "database": "up" }`, or `503` when the pool cannot reach MySQL.
Useful as a load-balancer or monitoring check.

## 5. Security notes

- **Every query is parameterised.** No string interpolation reaches SQL.
- **Validation is server-side and authoritative.** The client validates too, but
  only for feedback; the server re-checks and is the copy that is trusted.
- **Rate limiting counts successful writes only.** A visitor who mistypes their
  email five times is not an attacker and must not be locked out — and failed
  validation never touches the database, so there is nothing to protect there.
- **Errors are opaque to the client.** Driver messages and SQL are logged, not returned.
- **Body cap of 16 kB**, plus per-field length limits mirrored in the column widths.
- **Credentials come from the environment.** `server/.env` is git-ignored; in\n  production, inject them through your platform's secret mechanism.

> **Privacy note.** The page publicly displays the name, email and company of
> everyone who submits, because that is what was specified. Real submitter email
> addresses on a public page are worth a second thought — masking to
> `a••@example.com`, or dropping the column, is a one-line change in
> `server/src/routes/demoRequests.js`.

## 6. Deployment requirements

This repo does not include deployment config. What the host must provide:

- Serve the built `dist/` and fall back to `index.html` for unknown paths. `vite.config.js` uses `base: '/'`, so a refresh on `/book-a-demo` otherwise returns 404.
- Proxy `/api/` to the Node process (default port 4000).
- Run the API as a long-lived process with the `DB_*` environment variables set.
- Run `npm run migrate --prefix server` once the database is reachable.


## 7. Where the CTAs point

| Location | Before | After |
| --- | --- | --- |
| Navbar (desktop) | "Start a project" → `#contact` | "Book a demo" → `/book-a-demo` |
| Navbar (mobile menu) | — | "Book a demo" added as item 05 |
| Closing CTA section | mailto only | "Book a demo" button added, mailto kept as the secondary path |
| Footer, Contact column | mailto only | "Book a demo" link added |

The existing primary CTA was repointed rather than duplicated. The closing section
and footer gained a link because otherwise neither offered a route to the page.




