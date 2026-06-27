# 012 – API docs catalog

My Fundraise Express exposes a machine-readable API catalog at `GET /api-docs.json`.

## Shape

```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "baseUrl": "http://localhost:3009",
    "responseEnvelope": "{ success: true, data } | { success: false, error: string }",
    "groups": [ … ]
  }
}
```

## Implementation

| File | Role |
|------|------|
| `src/services/api-docs/api-docs-catalog.ts` | Static catalog builder |
| `src/services/api-docs/router.ts` | Mounts `GET /api-docs.json` |
| `src/services/api-docs/routes/get-api-docs-json-handler.ts` | Handler |

## Web consumer

[my-fundraise-web](https://github.com/Luckee-Core/my-fundraise-web) `/docs/api` fetches the catalog directly from `{NEXT_PUBLIC_SERVER_URL}/api-docs.json`.

See [oss-api-docs-pattern.md](https://github.com/Luckee-Core/mentorai-server/blob/main/data/open-source/oss-api-docs-pattern.md).
