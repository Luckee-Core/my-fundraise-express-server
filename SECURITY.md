# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

Email security reports to the maintainers via a [GitHub Security Advisory](https://github.com/Luckee-Core/my-fundraise-express-server/security/advisories/new) on this repository. Do not open public issues for undisclosed vulnerabilities.

Include steps to reproduce, impact assessment, and suggested fix if you have one.

## Scope and threat model

**My Fundraise Express Server** is designed for a **local-first, single-operator** deployment:

- The operator runs Express on their machine (or their own VPS) with **their** Supabase project.
- v1 has **no built-in user authentication**. All API routes are open to anyone who can reach the listen address.
- `SUPABASE_SERVICE_ROLE_KEY` grants **full database access** (bypasses RLS). Never expose it to browsers or commit it to git.
- AI routes (`/api/investor-extract`, `/api/pitch-deck-slide-studio`) send user content to Anthropic.

### Safe defaults (development)

- Express binds `127.0.0.1` unless `HOST` or Railway env is set.
- Pair with [my-fundraise-web](https://github.com/Luckee-Core/my-fundraise-web); browser calls Express via `NEXT_PUBLIC_SERVER_URL`.

### Production expectations

If you expose Express beyond localhost:

1. Restrict `CORS_ORIGINS` to your web app origin(s).
2. Use network isolation (private VPC, firewall) where possible.
3. Rotate Supabase service keys if compromised.
4. Review graphics TSX generation — AI output is executed in the browser preview on the web app.

### Out of scope

- Multi-tenant SaaS hardening
- Securities law compliance for investor outreach

## CORS

Default `cors()` is permissive. Set `CORS_ORIGINS` (comma-separated) when browsers call Express from a deployed web app. See `.env.example`.
