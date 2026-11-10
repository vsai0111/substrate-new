# DevOps challenge

This repo has the application only. Everything needed to run it in production is for
you to build.

## What the app needs

| Component | Requirement |
| --- | --- |
| Frontend | `npm ci && npm run build` produces static files in `dist/` |
| API | Node.js 20.19+, started with `npm start --prefix server`, listens on `PORT` (default 4000) |
| Database | MySQL 8, a database, and a user with `SELECT, INSERT` (plus `CREATE` for the migration) |
| Routing | `/api/*` goes to the API; every other unknown path serves `index.html` |
| Config | API reads `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `CORS_ORIGINS` from the environment (see `server/.env.example`) |
| Health | `GET /api/health` returns 200 when the API can reach MySQL, 503 otherwise |
| Proxy | The API trusts `X-Forwarded-For` for rate limiting, so it expects to sit behind a proxy |

## Suggested goals

Pick a path, or do several in order.

1. **Run it on a VM** (for example AWS EC2): install Node and MySQL, run the API as a
   service, and put a reverse proxy in front of it.
2. **Containerise it**: write Dockerfiles for the frontend and API, and a compose file
   with MySQL. Keep secrets out of the images.
3. **Automate it**: add a CI pipeline (lint/build on PRs) and a deploy pipeline
   (on push to `main`).
4. **Add HTTPS and a domain.**
5. **Make it reproducible**: provision infrastructure with Terraform, CDK or similar.
6. **Add observability**: logs, health checks, alerts.

## Rules of thumb

- Never commit real credentials. `.env` files are already git-ignored.
- Keep MySQL off the public internet.
- Write down what you did as you go, so someone else can repeat it.
