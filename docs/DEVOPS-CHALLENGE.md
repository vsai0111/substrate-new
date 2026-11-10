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

## Your task

Deploy the **frontend to S3** and the **backend and database to EC2**.

The frontend calls `/api` on its own domain, and there is no setting for a separate API
URL. If you serve the site straight from an S3 website endpoint, `/api` requests go to S3
and fail. Put **CloudFront** in front of both, so everything runs under one domain and no
code changes are needed.

```
Browser ──> CloudFront
              ├── /api/*  ──> EC2 (nginx :80 ──> Node API :4000 ──> MySQL :3306, local only)
              └── /*      ──> S3 bucket (dist/)
```

### Phase 1: EC2 (backend and database)

1. Launch an Ubuntu EC2 instance. The security group allows SSH (22) from your own IP
   only, and HTTP (80) for CloudFront.
2. Install Node 20+ (via `nvm` or NodeSource), MySQL 8 and nginx.
3. Secure MySQL. Create `substrate_db` and the `substrate_app` user (see the README for
   the SQL). MySQL must stay on `127.0.0.1` only.
4. Clone the repo, run `npm ci --omit=dev` in `server/`, set the `DB_*` environment
   variables, then run `npm run migrate`.
5. Run the API as a service so it survives reboots (systemd or pm2).
6. Set up nginx so `/api/` proxies to `127.0.0.1:4000`.
7. Test: `curl http://<ec2-public-dns>/api/health` should return
   `{"status":"ok","database":"up"}`.

### Phase 2: S3 (frontend)

1. Run `npm ci && npm run build` locally or in CI. This produces `dist/`.
2. Create a private S3 bucket (Block Public Access stays on).
3. Upload `dist/`. Hashed files in `assets/` get long cache headers. `index.html` gets
   `no-cache`.

### Phase 3: CloudFront (connects the two)

1. Origin 1: the S3 bucket, using Origin Access Control (OAC). Default behavior `/*`.
   Default root object: `index.html`.
2. Origin 2: the EC2 public DNS name over HTTP. Behavior `/api/*` with:
   - all HTTP methods allowed
   - the `CachingDisabled` cache policy
   - the `AllViewerExceptHostHeader` origin request policy
3. Custom error responses: map 403 and 404 to `/index.html` with status 200, so a refresh
   on `/book-a-demo` still works.
4. Tighten the EC2 security group so port 80 accepts only the CloudFront managed prefix
   list.
5. Test the CloudFront URL: the home page loads, `/book-a-demo` submits the form and the
   list updates, and a refresh doesn't 404.

## Rules of thumb

- Never commit real credentials. `.env` files are already git-ignored.
- Keep MySQL off the public internet.
- Write down what you did as you go, so someone else can repeat it.
