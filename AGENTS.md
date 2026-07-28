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

- **`src/main.tsx`** — entrypoint, renders `<RouterProvider router={router} />`
- **`src/router.tsx`** — Data Router API (`createBrowserRouter`). Defines all routes:
  - Public: `/login`, `/register`
  - Protected (wrapped in `ProtectedRoute` + `DashboardLayout`): `/dashboard`, `/transactions`, `/categories`, `/budgets`, `/reports`, `/settings`, `/profile`
  - `/` redirects to `/dashboard`
  - `*` renders `NotFoundPage` (404)
  - `AuthLayout` component wraps everything in `<AuthProvider>`
- **`src/pages/`** — `LoginPage`, `RegisterPage`, `DashboardPage`, `TransactionsPage`, `CategoriesPage`, `BudgetsPage`, `ReportsPage`, `SettingsPage`, `ProfilePage`, `NotFoundPage`
- **`src/api/axios.ts`** — Axios instance with `baseURL: <VITE_API_URL>/api`, 10s timeout. Request interceptor attaches `Authorization: Bearer <token>` from localStorage key `fintrack_token`. Response interceptor: normalizes errors to `{ message, status, code }`, on 401 clears localStorage + hard redirect.
- **`src/api/auth.service.ts`** — `authService.login()` / `.register()` POST to `/auth/login`, `/auth/register`. Expects `ApiResponse<AuthPayload>` wrapper, checks `success`, returns `data`.
- **`src/context/AuthContext.tsx`** — `AuthProvider` + `useAuth()` hook. Stores token/user in `localStorage` under keys `fintrack_token` / `fintrack_user`. `isLoading` guard prevents flash-of-redirect on mount. Validates JWT expiration on rehydration.
- **`src/components/ProtectedRoute.tsx`** — renders `<Outlet />` if authenticated, redirects to `/login` otherwise. Uses `useAuth()`.

## Quirks & conventions

- **Tailwind 4 via `@tailwindcss/vite`** — no `tailwind.config.ts`. The single CSS entry is `src/index.css` with just `@import "tailwindcss"`.
- **API base URL** comes from `import.meta.env.VITE_API_URL` (defaults to `http://localhost:3000`).
- **ESLint 10 flat config** — `eslint.config.js`. No `.eslintrc.*`. Ignores `dist/` via `globalIgnores`.
- **`tsconfig` uses project references** — `tsconfig.json` references `tsconfig.app.json` (src/) and `tsconfig.node.json` (vite.config.ts). `tsc -b` builds both.
- **`strict: true`** — enabled in `tsconfig.app.json`.
- **`verbatimModuleSyntax: true`** — type-only imports must use `import type { ... }`.
- **`erasableSyntaxOnly: true`** — no `enum`, `namespace`, or parameter properties.
- **TS 6** — TypeScript 6.x. Compatible with existing ESLint config but check for breaking changes on upgrade.
