# anurag.md — Work Log

A running log of everything done in this repo (`peerY`) after cloning it.
Newest work is summarized at the top of each section. Date: 2026-07-01/02.

Repo: cloned from `https://github.com/Keshavcodes3/peerY.git`
Stack: `Client/` = Vite + React + TypeScript + Redux Toolkit + Tailwind v4 + Framer Motion · `Server/` = Express + TypeScript + MongoDB + JWT

---

## TL;DR — what changed

1. **Scanned** the whole project and every markdown file.
2. **Documented the codebase** — filled 6 empty doc stubs and corrected the roadmaps to match what's actually built.
3. **Wrote `next.md`** — an orientation + prioritized "what to work on next" backlog.
4. **Built a working authenticated session** (P0) — token persistence, axios interceptors, session restore, route guards, and the missing `/dashboard` page.
5. **Fixed the broken build** — `npm run build` went from **67 TypeScript errors → 0**; `vite build` now succeeds.

---

## 1. Project & documentation scan

- Mapped the repo: `Client/` (React/Vite) + `Server/` (Express) + `Contexts/Docs/` (API docs) + planning docs (`plan.md`, `Workflow.md`, `README.md`).
- Deep-scanned both `Client` and `Server` to inventory what is **actually implemented** vs planned.

**Backend modules implemented:** Auth, Profile, Discover, Match, Projects (Project + Application + Member).
**Client features implemented:** Landing, Auth (login + 7-step onboarding), Discover (swipe deck, filters, builder profile) — running on **mock data**.

---

## 2. Markdown docs updated to match real progress

### Filled 6 empty doc stubs (`Contexts/`)
Written directly from the source code — routes, models, enums, validation, business rules:

| File | What it documents |
|------|-------------------|
| `Contexts/Docs/discover.md` | `GET /discover/profile` — skill/tech-stack match scoring (skills ×3, techstack ×2, Rank S/A +1.5, top 20) |
| `Contexts/Docs/match.md` | 6 Match routes + `match` model, mutual-like auto-accept, lifecycle, notification events |
| `Contexts/Docs/project.md` | 4 Project routes + full `Project` model (requirements, counters, indexes) |
| `Contexts/Docs/member.md` | 6 Member routes + `Member` model, role hierarchy (OWNER→VIEWER) + permission matrix, transactional ownership transfer |
| `Contexts/Docs/bookmark.md` | Marked **🚧 planned** — the route file is empty; documented the intended contract |
| `Contexts/prd.md` | Full PRD with an honest ✅/🟡/🚧 feature-status matrix, data-model summary, known gaps |

`auth.md`, `application.md`, `profile.md` were already accurate and left untouched.

### Corrected the roadmaps
- **`README.md`** — both progress checklists fixed: **Discover + Match are done** (were missing); **Invitations demoted from ✅ to 🚧** (its route file is an empty stub); added the "client UI runs on mock data" caveat.
- **`plan.md`** — added a **Progress Snapshot** table at the top mapping each phase item to ✅/🟡/🚧.

### Key accuracy corrections captured in the docs
- Client is **Vite + React**, not Next.js as the older plan/workflow docs claim.
- `Bookmark.routes.ts`, `Invitation.routes.ts`, `Role.routes.ts` are **empty stubs**.
- Socket.io is **scaffolded but not wired**; notifications are persisted fire-and-forget (not real-time).
- Intentional non-standard schema names exist and should not be "fixed": `Requiremnts`, `Stage`, `Bio`, `avaliabilty`, enum `ARCHIEVED`.

---

## 3. `next.md` created

Added `next.md` at the repo root as an orientation doc for future work:
- Dev commands, architecture, and conventions (including the non-standard names to leave alone).
- A prioritized **"what to work on next"** backlog (P0 → P3).

---

## 4. P0 — Working authenticated session (client)

**Problem found:** the server returns the JWT in the response body *and* sets a non-httpOnly cookie, but (a) the client never stored the token, and (b) the cross-origin cookie (`:5173`→`:3000`) doesn't attach to axios XHR under `SameSite=Lax`. So login "worked" but the session never persisted, and both Login/Register navigated to a non-existent `/dashboard` (→ 404). `verifyAuth` already accepts `Authorization: Bearer`, so the fix is a stored Bearer token.

**Changes:**

| File | Change |
|------|--------|
| `Client/src/App/api.ts` | Added `tokenStore` (localStorage). Request interceptor attaches `Authorization: Bearer <token>`. Response interceptor clears the token on `401`. `baseURL` now reads `VITE_API_URL` with a localhost fallback. |
| `Client/src/Features/Auth/Redux/auth.slice.ts` | Added `isInitialized` state + `setInitialized` reducer (so guards can wait for session restore). |
| `Client/src/Features/Auth/Hooks/useAuth.ts` | Store/clear the token on login/register/logout. New `initializeAuth()` calls `getMe()` on boot to restore the session. Reads server error shape (`error` or `message`). |
| `Client/src/Features/Auth/Components/ProtectedRoute.tsx` | **New.** Shows a loader until `isInitialized`, then renders the route or redirects to `/login` (preserving the target location). |
| `Client/src/Features/Dashboard/Pages/Dashboard.tsx` | **New.** The missing `/dashboard` page — greets the authed user, quick links, logout. Dark/zinc + Framer Motion styling to match the app. |
| `Client/src/App.tsx` | Runs `initializeAuth()` once on mount. `/dashboard`, `/discover`, `/discover/:id` are now wrapped in `ProtectedRoute`. |

**Verified:** dev server boots (~800 ms, `HTTP 200`); all new/edited files are type-clean.

**How the session works now:** login/register → token saved to localStorage → attached as `Bearer` on every request → on refresh, `initializeAuth()` calls `/auth/me` to restore the user → protected routes wait for that, then allow or redirect to `/login`.

---

## 5. Fixed the broken production build

`npm run build` (`tsc -b && vite build`) was **already failing before any of our work**, on **67 pre-existing TypeScript errors** (strict `noUnusedLocals`/`noUnusedParameters`, a missing `@/*` path alias, and Framer Motion v12 type changes). None were from our new code.

**Fixes applied:**
- Configured the **`@/*` path alias** properly in `tsconfig.app.json` (`paths`) and `vite.config.ts` (resolve alias) for shadcn imports. (Removed a deprecated `baseUrl` a helper had added.)
- Removed **unused imports/vars** across ~20 files (stray `React` defaults, unused lucide icons, dead locals).
- Removed **superseded/dead code** that strict lint flagged:
  - `EcosystemSection.tsx` — 3 old animation components (`AIMentorAnimation`, `PeerMatchingAnimation`, `ProjectsAnimation`) that were replaced by bespoke inline cards.
  - `ProblemSection.tsx` — the old `TRANSFORMATIONS` data + unused `useInView`/`containerRef` (section now uses `StickyWorkspace`).
  - `BuilderCard.tsx` — unused `STAGE_COLORS`.
  - `Register.tsx` — an unwired `back()` handler (see "Notes" below).
- Fixed **Framer Motion typing** (`type: "spring" as const`), a couple of `import type` cases, and removed an invalid `shadow` animation prop in `BuilderProfilePage.tsx`.

No `@ts-ignore`, no `any`, no weakening of `tsconfig`.

**Result:**
- `npx tsc -b --noEmit` → **0 errors**
- `vite build` → **✓ built** (463 modules). Only a non-fatal "chunk > 500 kB" perf warning remains.

---

## Notes / things to be aware of

- **Removed but maybe wanted:** `Register.tsx` had a `back()` function for the onboarding wizard that was never wired to a button, so strict lint flagged it and it was removed. Re-add + connect it to a Back button if that navigation is desired.
- The Discover/Match UI still uses **mock data** (`Client/src/Features/Discover/data/mockData.ts`) — not yet calling the live APIs.
- Server `logout` doesn't `clearCookie`; email verification / password reset / OAuth backends are not implemented.

---

## 6. Wired Discover to the live backend (client)

Replaced the hardcoded profiles on the Discover page with real API data now that
auth works.

**Finding:** `DiscoverPage.tsx` rendered its **own inline hardcoded 3-profile array** —
the `SwipeDeck` / `useSwipeDeck` / `data/mockData.ts` components were orphaned (never
rendered by the page). So the wiring target was `DiscoverPage` itself.

**Changes:**

| File | Change |
|------|--------|
| `Client/src/Features/Discover/types/discover.types.ts` | **New.** `DiscoverProfile` (mirrors the server aggregation projection), `DiscoverResponse`, `LikeResult`. |
| `Client/src/Features/Discover/services/discover.service.ts` | **New.** `getRecommendedProfiles()` → `GET /discover/profile`; `likeUser(authId)` → `POST /match/like/:userId` (reads `mutual` from HTTP 200 vs 201). |
| `Client/src/Features/Discover/hooks/useDiscover.ts` | **New.** Fetches profiles on mount; exposes `isLoading`/`error`/`likingId`/`refetch`; `like()` optimistically removes the liked profile and reports mutual-match. |
| `Client/src/App/api.ts` | Added `ENDPOINT.discover.profiles`. |
| `Client/src/Features/Discover/Pages/DiscoverPage.tsx` | Removed hardcoded array; now uses `useDiscover`. Added loading / error / empty states, a refresh button, and an action banner ("It's a match!" / "Request sent" / error). Cards map server fields (matchScore→pts badge, Rank badge, experience as subtitle, techstack/skills pills, Bio) and the connect (heart) button calls the like API. |

**Important server contract note:** the like endpoint target `:userId` is the profile's
**`authId`** (the owning user id), not the profile `_id`. The like button uses `authId`;
"View Profile" navigates by profile `_id`.

**Verified:** `tsc -b` → 0 errors · `vite build` → ✓ built · dev server boots and serves HTTP 200.

**Still on mock data:** `BuilderProfilePage` (`/discover/:id`) still reads `data/mockData.ts`.

---