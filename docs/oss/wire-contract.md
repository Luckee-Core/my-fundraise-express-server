# Wire contract — My Fundraise (web + Express)

Paired repos:

| Role | Repo | Default port |
|------|------|--------------|
| Web (Next.js) | [my-fundraise-web](https://github.com/Luckee-Core/my-fundraise-web) | 3000 |
| API (Express) | [my-fundraise-express-server](https://github.com/Luckee-Core/my-fundraise-express-server) | 3009 |

Governance template: [mentorai-server oss-web-express-wire-contract.md §10](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/oss-web-express-wire-contract.md).

## Proxy pattern

**Lead Studio direct URL** — browser calls `{NEXT_PUBLIC_SERVER_URL}/api/...` directly. No Next.js rewrites. Set `CORS_ORIGINS` on Express for production.

## Environment — web

| Variable | Client-visible? | Required | Purpose |
|----------|-----------------|----------|---------|
| `NEXT_PUBLIC_SERVER_URL` | Yes | Rec (dev default `http://localhost:3009`) | Express base URL |
| `NEXT_PUBLIC_API_URL` | Yes | No | Legacy fallback for Express URL in production |
| `NEXT_PUBLIC_DEV_USER_ID` | Yes | For AI features | User id sent to investor-extract and slide studio |

## Environment — Express

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 3009) | Listen port |
| `SUPABASE_URL` | Yes | Database |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side Supabase client |
| `ANTHROPIC_API_KEY` | For AI | Investor extract + slide studio |
| `CORS_ORIGINS` | Deploy | Comma-separated browser origins |
| `CURSOR_API_KEY` | Optional | Graphics TSX generation |
| `CURSOR_TARGET_REPO` | Optional | Cursor agent target repo |

## JSON envelopes

| Context | Shape |
|---------|-------|
| `/api/data/*` success | `{ success: true, data }` |
| `/api/data/*` error | `{ success: false, error: string }` |
| `GET /api/health` | `{ status, message, timestamp, environment }` (no success wrapper) |
| `GET /api-docs.json` | `{ success: true, data: ApiDocsCatalog }` |

## HTTP routing

### Browser → Express (primary)

```text
{NEXT_PUBLIC_SERVER_URL}/api/data/investors
{NEXT_PUBLIC_SERVER_URL}/api/data/graphics
{NEXT_PUBLIC_SERVER_URL}/api/investor-extract
{NEXT_PUBLIC_SERVER_URL}/api/pitch-deck-slide-studio
{NEXT_PUBLIC_SERVER_URL}/api/business-context
{NEXT_PUBLIC_SERVER_URL}/api-docs.json
```

### Entity mounts (`/api/data`)

| Path | Entity |
|------|--------|
| `/api/data/investors` | Investors |
| `/api/data/investor-contacts` | Investor contacts |
| `/api/data/graphics` | Image graphics + studio |
| `/api/data/pitch-decks` | Pitch decks |
| `/api/data/pitch-deck-slides` | Slides |
| `/api/data/pitch-deck-intro-slide-graphics` | Intro slide graphics |
| `/api/data/business-context-sections` | Context sections |
| `/api/data/business-facts` | Business facts |

## Layout exception

HTTP handlers live in `src/data/{entity}/routes/` rather than `src/services/{feature}/routes/`. Documented in ADR 009.

## Auth (OSS default)

None v1. Bind Express to localhost for trusted local dev; use `CORS_ORIGINS` + network isolation for production.
