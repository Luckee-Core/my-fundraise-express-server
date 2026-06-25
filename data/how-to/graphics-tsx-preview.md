# Graphics — TSX preview and persistence

Operator workflow for standalone fundraise graphics in **my-fundraise-web** + **my-fundraise-express-server**.

## Data model

- Table: `image_graphics` (`docs/sql/003_image_graphics.sql`)
- TSX draft: `metadata.studioDraft.tsx` (JSONB)
- Optional generation: `metadata.generationStatus`, `metadata.creativeBrief`

## HTTP (Express)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/data/graphics` | List graphics |
| POST | `/api/data/graphics` | Create row |
| GET | `/api/data/graphics/:id` | Get one |
| PATCH | `/api/data/graphics/:id` | Update title/canvas/metadata |
| PATCH | `/api/data/graphics/:id/studio-draft` | Save TSX draft |
| DELETE | `/api/data/graphics/:id` | Delete |
| POST | `/api/data/graphics/:id/generate-tsx` | Queue Cursor TSX generation (202) |

## Browser preview (no server)

1. Operator edits TSX in graphics studio editor column
2. Babel compiles TSX in-browser (`compile-image-studio-tsx.ts`)
3. Preview iframe loads `srcDoc` built by `build-tsx-react-preview-src-doc.ts`
4. **Download PNG** runs `html2canvas` on `#root` inside the iframe

See my-fundraise-web `.cursor/architecture/020-graphics-tsx-preview.md` and `src/utils/image-creation-studio/README.md`.

## Env (optional AI generation)

- `CURSOR_API_KEY`, `CURSOR_TARGET_REPO` — background TSX generation via Cursor agent
