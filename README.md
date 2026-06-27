# My Fundraise Express Server

Express API for the My Fundraise CRM: investors, graphics (`image_graphics`), pitch decks, and business context.

Open-source pair with [my-fundraise-web](https://github.com/Luckee-Core/my-fundraise-web). Governance: [mentorai-server `data/open-source/`](https://github.com/Luckee-Core/mentorai-server/tree/main/data/open-source).

## TL;DR

```bash
git clone https://github.com/Luckee-Core/my-fundraise-express-server.git
cd my-fundraise-express-server
npm install
cp .env.example .env
# Apply docs/sql/001 → 011 in Supabase (see below)
npm run dev
```

Server listens on **port 3009** by default. Pair with [my-fundraise-web](https://github.com/Luckee-Core/my-fundraise-web) on port **3000**.

## Supabase SQL (run in order)

Apply in your Supabase SQL editor:

| File | Purpose |
|------|---------|
| `001_investors_pitch_decks.sql` | Core investors + pitch decks |
| `002_investor_profile_extract_ledgers.sql` | AI extract ledgers |
| `003_image_graphics.sql` | Graphics table |
| `004_pitch_deck_slide_studio.sql` | Slide studio |
| `005_image_graphics_canvas_columns.sql` | Canvas columns |
| `006_business_context.sql` | Business context sections + facts |
| `007_pitch_deck_slides_freeform.sql` | Freeform slide TSX |
| `008_seed_deck_e_pitch_deck.sql` | Optional demo seed |
| `009_drop_pitch_decks_user_fk.sql` | Drop user FK |
| `010_seed_deck_e_on_prem_graphics.sql` | Optional demo graphics seed |
| `011_drop_image_graphics_user_fk.sql` | Drop user FK |

## Environment

```env
PORT=3009
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NODE_ENV=development

# Production CORS (comma-separated origins when browsers call Express directly)
# CORS_ORIGINS=http://localhost:3000,https://your-web-app.vercel.app

# Optional graphics TSX generation:
CURSOR_API_KEY=
CURSOR_TARGET_REPO=
```

## Health check

```bash
curl http://localhost:3009/api/health
```

```json
{
  "status": "ok",
  "message": "My Fundraise Express Server is running",
  "timestamp": "2026-06-27T12:00:00.000Z",
  "environment": "development"
}
```

## API

| Mount | Purpose |
|-------|---------|
| `GET /api/health` | Health check |
| `GET /api-docs.json` | API documentation catalog |
| `/api/data/investors` | Investor CRUD |
| `/api/data/investor-contacts` | Contact CRUD |
| `/api/data/graphics` | Graphics CRUD + studio-draft + generate-tsx |
| `/api/data/pitch-decks` | Pitch deck CRUD + versions |
| `/api/data/pitch-deck-slides` | Slide upsert |
| `/api/data/pitch-deck-intro-slide-graphics` | Intro slide graphics |
| `/api/data/business-context-sections` | Context sections |
| `/api/data/business-facts` | Business facts |
| `/api/investor-extract` | AI firm profile + contact extraction |
| `/api/pitch-deck-slide-studio` | Per-slide AI coach chat |
| `/api/business-context` | Business context orchestration |

See [`data/how-to/graphics-tsx-preview.md`](data/how-to/graphics-tsx-preview.md) for the graphics TSX → preview pipeline.

## Threat model

- **Local-first v1** — no built-in authentication; all routes open to anyone who can reach the listen address.
- `SUPABASE_SERVICE_ROLE_KEY` grants full DB access — never expose to browsers.
- AI routes send user content to Anthropic.
- Default `cors()` is permissive; set `CORS_ORIGINS` when deploying web + API on different hosts.
- See [SECURITY.md](./SECURITY.md).

## Wire contract

[docs/oss/wire-contract.md](./docs/oss/wire-contract.md)

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`**.

- CRUD in `src/data/{table}/`
- HTTP handlers in `src/data/{entity}/routes/` (documented exception — ADR 009)
- Business logic in `src/services/{feature}/`
- No `src/domains/`
