# 009 – Entity routers in `src/data/`

My Fundraise Express places **HTTP handlers** alongside CRUD in `src/data/{entity}/routes/` rather than in `src/services/{feature}/routes/`.

## Layout

```text
src/data/
  router.ts                    # Aggregates /api/data/*
  investors/
    list.ts                    # CRUD
    routes/
      list-handler.ts          # GET handler
      create-handler.ts
  ...
src/services/
  investor-extract/            # Non-CRUD feature routers
  pitch-deck-slide-studio/
  business-context/
```

## Why

This repo bootstrapped from an early data-router pattern where entity HTTP lived next to Supabase CRUD. Business orchestration (`processX`) still belongs in `src/services/` when shared across handlers.

## Wire contract

Documented in [docs/oss/wire-contract.md](../../docs/oss/wire-contract.md) and mentorai-server `oss-express-backend-benchmark.md` exception row.

## New work

- CRUD + entity HTTP: `src/data/{table}/`
- Cross-entity orchestration: `src/services/{feature}/`
- Never add `src/domains/`
