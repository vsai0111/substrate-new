# SUBSTRATE — Technology & Product Studio

A marketing site for a fictional technology and product studio, built with
**React + Vite + JavaScript**, plus a small **Express + MySQL** API.

```
/                 static  - the studio site
/book-a-demo      dynamic - form + live list, via /api -> Express -> MySQL
```

> Substrate is an invented brand. All copy, project names, statistics and social links
> are fictional placeholder content.

## Purpose of this repo

This repository contains **only the application code**. It intentionally has no
Dockerfiles, CI/CD pipelines, web server configs, service files or infrastructure code.

If you are learning DevOps, that is your job: take this app and get it running
somewhere real, from scratch. See [`docs/DEVOPS-CHALLENGE.md`](docs/DEVOPS-CHALLENGE.md)
for what the app needs and some suggested goals.

## Architecture

```
Browser ──> Frontend (static files built by Vite)
   |
   └── /api/*  ──>  Express API (:4000)  ──>  MySQL
```

- The frontend calls `/api` on its **own origin**. There is no API base URL to configure.
- In development, Vite proxies `/api` to `http://127.0.0.1:4000`.
- In production, **something else must do that**: a reverse proxy has to forward `/api`
  to the Node process and serve `index.html` for unknown paths.
- `vite.config.js` uses `base: '/'`, so a refresh on `/book-a-demo` will 404 unless the
  host falls back to `index.html`.

Full API contract and database schema: [`docs/BOOK-A-DEMO.md`](docs/BOOK-A-DEMO.md).

## Prerequisites

- Node.js 20.19+ (developed on Node 24)
- MySQL 8 (or compatible)

## Run locally

### 1. Install dependencies

```bash
npm install                  # frontend
npm install --prefix server  # API
```

### 2. Set up the database

Create a database and a user (adjust names and password):

```sql
CREATE DATABASE substrate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'substrate_app'@'localhost' IDENTIFIED BY 'change-me';
GRANT SELECT, INSERT, CREATE ON substrate_db.* TO 'substrate_app'@'localhost';
```

### 3. Configure and migrate

```bash
cp server/.env.example server/.env   # then fill in DB_PASSWORD
npm run migrate                      # creates the table, idempotent
```

### 4. Start both processes

```bash
npm run dev:api    # API on :4000
npm run dev        # site on http://localhost:5173
```

The marketing pages work without the API; only `/book-a-demo` needs it.

## Build the frontend

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ on http://localhost:4173
```

Notes that matter when you deploy:

- Asset filenames in `dist/assets/` are content-hashed, so they can be cached for a long
  time. `index.html` is not hashed and should not be cached aggressively.
- `public/` is copied to the root of `dist/` untouched.
- No environment variables are read by the frontend at build or run time.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve `dist/` on :4173 |
| `npm run dev:api` | API with auto-reload on :4000 |
| `npm run start:api` | API, production mode |
| `npm run migrate` | Create the `demo_requests` table |
| `npm run install:all` | Install frontend and API dependencies |

## Project structure

```
server/                       Express + MySQL API (its own package.json)
├── src/index.js              App, CORS, health check, error handler
├── src/db.js                 mysql2 connection pool
├── src/migrate.js            Applies schema.sql to the existing database
├── src/schema.sql            demo_requests table
├── src/routes/demoRequests.js  GET + POST /api/demo-requests
└── src/lib/                  validate.js, rateLimit.js

src/
├── main.jsx                  React root; BrowserRouter + global stylesheets
├── App.jsx                   Routes, shared Navbar/Footer, scroll manager
├── pages/                    Home, BookDemo, NotFound
├── lib/api.js                fetch wrapper for /api
├── data/site.js              All copy and content in one place
├── hooks/                    useReveal, useReducedMotion, useScrollSpy
├── components/               RecentRequests, ScrollManager, Reveal, Marquee, ...
├── sections/                 Navbar, Hero, Terminal, Projects, About, ... Footer
└── styles/                   tokens.css, base.css
```

Component CSS lives next to the component it styles and uses a component-prefixed class
convention (`hero__title`, `project__panel`), so no scoping tooling is required.

## Design notes

- **Palette** — monochrome, with one signal green reserved for the terminal section.
- **Type** — system font stacks only (no webfonts, no network requests).
- **Motion** — transform/opacity only; every animation has a `prefers-reduced-motion` path.
- **Terminal** — a frontend-only interactive shell (`help`, `about`, `work`, `contact`, ...).
- **Accessibility** — semantic landmarks, skip link, visible focus rings, focus-trapped
  mobile menu, AA contrast.
