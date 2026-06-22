# AGENTS.md — Alfaenu Frontend (Soenu)

## Stack

- **Next.js 16** (App Router, webpack), **React 19**, **TypeScript**, **Tailwind CSS v4**
- **shadcn/ui** (new-york style, RSC enabled) — `@/components/ui`, icon library lucide-react
- **State**: Zustand (persist) + TanStack React Query
- **API**: Axios → `NEXT_PUBLIC_API_URL` env var (fallback `http://127.0.0.1:8000/api/`), auth via `js-cookie` (Bearer token)
- **Auth middleware**: `src/proxy.ts` — protects all routes except `/signin`, `/signup`, `/forgot-password`, `/api/*`, static assets
- **Feature modules** live in `src/features/` (20 domains: caixa, client, contract, course, dashboard, service, user, etc.)

## Codebase conventions

- **Language**: Portuguese (comments, variables, feature names, types)
- **Route groups**: `(company)/(admin)`, `(company)/(client)`, `(full-width-pages)/(auth)`, `(full-width-pages)/(error-pages)`, `(full-width-pages)/pos`
- **Import alias**: `@/` → `./src/`
- **CSS**: Tailwind v4 via PostCSS (`@tailwindcss/postcss`), globals in `src/app/globals.css`
- **SVGs**: imported as React components via `@svgr/webpack` (configured in `next.config.ts`)

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Unit tests (Vitest) | `npm test` |
| Unit tests (single-run) | `npm run test:run` |
| Unit tests with coverage | `npm run test:coverage` |
| E2E tests (Playwright) | `npx playwright test` |

## Testing

- **Vitest**: environment `jsdom`, globals enabled, setup in `vitest.setup.ts` (mocks `react-toastify`). Test files match `src/**/*.{test,spec}.{ts,tsx}`.
- **Playwright**: tests in `tests/`, CI via `.github/workflows/playwright.yml`. No dev server auto-start configured.
- **Run single test file**: `npx vitest run src/path/to/file.test.tsx`

## Environment

- **`NEXT_PUBLIC_API_URL`** defines the API base URL (used in `src/services/api.ts`)
- `.env.local` — local dev overrides, gitignored
- `.env.production` — production build config, committed
- `.env.example` — template with placeholder values

## Docker

- `Dockerfile`: `node:20-alpine`, `npm install --production`, exposes port 3000
