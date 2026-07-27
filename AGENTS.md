# FinTrack Front — AGENTS.md

## Commands

| Command | Effect |
|---|---|
| `npm run dev` | Vite dev server on **port 5173** (strict — fails if taken) |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint 10 flat config on all files |
| `npm run preview` | Serve production build locally |

No test, format, storybook, or CI scripts exist.

## Architecture

**Vite 8 + React 19 + TypeScript 6 + Tailwind 4** SPA. No meta-framework.

- **`src/main.tsx`** — entrypoint, renders `<App />`
- **`src/App.tsx`** — currently a placeholder (`"✅ Tailwind v4 funcionando"`). No router wired yet. No AuthProvider wrapping.
- **`src/pages/`** — empty. Login, register, dashboard, etc. not yet created.
- **`src/api/axios.ts`** — Axios instance with `baseURL: <VITE_API_URL>/api`, 10s timeout. Request interceptor attaches `Authorization: Bearer <token>` from localStorage key `taskflow_token`. Response interceptor: on 401, clears localStorage + hard redirect (`window.location.href = "/login"`).
- **`src/api/auth.service.ts`** — `authService.login()` / `.register()` POST to `/auth/login`, `/auth/register`. Expects `ApiResponse<AuthPayload>` wrapper, checks `success`, returns `data`.
- **`src/context/AuthContext.tsx`** — `AuthProvider` + `useAuth()` hook. Stores token/user in `localStorage` under keys `taskflow_token` / `taskflow_user`. `isLoading` guard prevents flash-of-redirect on mount.
- **`src/components/ProtectedRoute.tsx`** — renders `<Outlet />` if authenticated, redirects to `/login` otherwise. Uses `useAuth()`.

## Quirks & conventions

- **`"taskflow"` localStorage keys** — `taskflow_token` / `taskflow_user` are copy-paste remnants. Do not rename without coordinating with the backend or updating all consumers.
- **`App.css` is orphaned** — exists on disk but is never imported. Safe to delete.
- **`.env` is tracked in git** — not in `.gitignore`. No `.env.example` exists.
- **`tsconfig` uses project references** — `tsconfig.json` references `tsconfig.app.json` (src/) and `tsconfig.node.json` (vite.config.ts). `tsc -b` builds both.
- **`verbatimModuleSyntax: true`** — type-only imports must use `import type { ... }`.
- **`erasableSyntaxOnly: true`** — no `enum`, `namespace`, or parameter properties.
- **TS 6** — TypeScript 6.x. Compatible with existing ESLint config but check for breaking changes on upgrade.
- **Tailwind 4 via `@tailwindcss/vite`** — no `tailwind.config.ts`. The single CSS entry is `src/index.css` with just `@import "tailwindcss";`.
- **API base URL** comes from `import.meta.env.VITE_API_URL` (defaults to `http://localhost:3000`).
- **ESLint 10 flat config** — `eslint.config.js`. No `.eslintrc.*`. Ignores `dist/` via `globalIgnores`.
