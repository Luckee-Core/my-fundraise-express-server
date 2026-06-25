# my-fundraise-express-server

Express API for the my-fundraise CRM: investors, graphics (`image_graphics`), and pitch decks.

## Quick start

```bash
npm install
cp .env.example .env
# Apply docs/sql/*.sql in Supabase (001 → 004 in order)
npm run dev
```

Server listens on **port 3009** by default.

## Environment

```env
PORT=3009
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
# Optional graphics TSX generation:
CURSOR_API_KEY=
CURSOR_TARGET_REPO=
```

## API

| Mount | Purpose |
|-------|---------|
| `GET /api/health` | Health check |
| `/api/data/investors` | Investor CRUD |
| `/api/data/investor-contacts` | Contact CRUD |
| `/api/data/graphics` | Graphics CRUD + studio-draft + generate-tsx |
| `/api/data/pitch-decks` | Pitch deck CRUD + versions |
| `/api/data/pitch-deck-slides` | Slide upsert |
| `/api/investor-extract` | AI firm profile + contact extraction |
| `/api/pitch-deck-slide-studio` | Per-slide AI coach chat |

See `data/how-to/graphics-tsx-preview.md` for the graphics TSX → preview pipeline.

## Architecture

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`**.

- CRUD in `src/data/{table}/`
- HTTP + business logic in `src/services/{feature}/`
- No `src/domains/`
