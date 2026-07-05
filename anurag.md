# anurag.md — Work Log

A running log of everything done in this repo (`peerY`) after cloning it.

Repo: `https://github.com/Keshavcodes3/peerY.git`  
Stack: `Client/` = Vite + React + TypeScript + Redux Toolkit + Tailwind v4 + Framer Motion  
       `Server/` = Express 5 + TypeScript (tsx) + MongoDB + JWT + Socket.io

---

## TL;DR — what changed (all sessions)

1. **Scanned** the whole project and every markdown file.
2. **Documented the codebase** — filled 6 empty doc stubs and corrected the roadmaps.
3. **Built a working authenticated session** — token persistence, session restore, route guards, dashboard.
4. **Fixed the broken build** — resolved 67 pre-existing TypeScript errors.
5. **Closed core backend gaps** — Bookmarks, Invitations, Project CRUD extensions, Helmet, rate-limit, Socket.io.
6. **Wired Discover & Profiles to live API** — live feed, filters, public profile page.
7. **Wired Dashboard, Network, and Workspace UIs** — premium light theme, tabbed views.
8. **Fixed CORS + errors** — preflight, dynamic origin, Helmet config, CastError handler, secure cookies.
9. **Built all missing client-side UI** — My Applications, Invitations tab, Network Message button, Bookmarks navigation.
10. **Updated all MD files** — README, features.md, Design.md, anurag.md all reflect current state.

---

## 1. Project & documentation scan

- Mapped the repo: `Client/` (React/Vite) + `Server/` (Express) + `Contexts/Docs/` (API docs) + planning docs.
- Deep-scanned both `Client` and `Server` to inventory what is **actually implemented** vs planned.

**Backend modules implemented:** Auth, Profile, Discover, Match, Projects (Project + Application + Member + Bookmark + Invitation).  
**Client features implemented at start:** Landing, Auth (login + 7-step onboarding), Discover — running on **mock data**.

---

## 2. Markdown docs updated (session 1)

### Filled 6 empty doc stubs (`Contexts/`)

| File | What it documents |
|------|-------------------|
| `Contexts/Docs/discover.md` | `GET /discover/profile` — skill/tech-stack match scoring (skills ×3, techstack ×2, Rank S/A +1.5, top 20) |
| `Contexts/Docs/match.md` | 6 Match routes + `match` model, mutual-like auto-accept, lifecycle, notification events |
| `Contexts/Docs/project.md` | 4 Project routes + full `Project` model (requirements, counters, indexes) |
| `Contexts/Docs/member.md` | 6 Member routes + `Member` model, role hierarchy (OWNER→VIEWER) + permission matrix, transactional ownership transfer |
| `Contexts/Docs/bookmark.md` | Bookmark routes, compound unique index, bookMarksCount management |
| `Contexts/prd.md` | Full PRD with ✅/🟡/🚧 feature-status matrix, data-model summary, known gaps |

---

## 3. P0 — Working authenticated session (client)

**Problem:** Server returned JWT in body + set a non-httpOnly cookie, but the client never stored the token. Cross-origin cookie (`5173→3000`) didn't attach under `SameSite=Lax`. Login "worked" but session never persisted.

**Changes:**

| File | Change |
|------|--------|
| `Client/src/App/api.ts` | `tokenStore` (localStorage). Interceptors: attach `Bearer` on request, clear on `401`. `baseURL` from `VITE_API_URL`. |
| `Client/src/Features/Auth/Redux/auth.slice.ts` | Added `isInitialized` state + `setInitialized` reducer. |
| `Client/src/Features/Auth/Hooks/useAuth.ts` | Store/clear token on login/register/logout. `initializeAuth()` calls `/auth/me` on boot. |
| `Client/src/Features/Auth/Components/ProtectedRoute.tsx` | **New.** Shows loader until `isInitialized`, then renders or redirects to `/login`. |
| `Client/src/Features/Dashboard/Pages/Dashboard.tsx` | **New.** Premium light-theme dashboard with tabs, quick nav, network counters. |
| `Client/src/App.tsx` | Runs `initializeAuth()` on mount. All app routes wrapped in `ProtectedRoute`. |

---

## 4. Fixed the broken production build

`npm run build` was failing on **67 pre-existing TypeScript errors**.

**Fixes:**
- Configured `@/*` path alias in `tsconfig.app.json` + `vite.config.ts`
- Removed unused imports/vars across ~20 files
- Fixed Framer Motion typing (`type: "spring" as const`)
- Removed dead code: `AIMentorAnimation`, `PeerMatchingAnimation`, `ProjectsAnimation`, `TRANSFORMATIONS`, `STAGE_COLORS`, unwired `back()` handler

**Result:** `tsc -b` → 0 errors · `vite build` → ✓ built (463 modules)

---

## 5. Closed core backend gaps & security hardening

| Area | Implementation Details |
|---|---|
| **Bookmarks** | Compound unique index `{ user, project }`. Full repo, service, controller, routes. Manages `project.bookMarksCount`. |
| **Invitations** | Zod validation, `canInviteMembers` permission check, status tracking, transactional Member creation on accept (`joinedBy: "INVITATION"`). |
| **Project Ext.** | Added update, cascade delete (Applications + Members + Bookmarks), and archive routes/services. |
| **Security** | `helmet` headers + `express-rate-limit` (global + auth limits). |
| **Socket.io** | Token-based auth middleware, presence tracking, `sendNotificationToUser` scaffold. |
| **Zod Auth** | `registerSchema` + `loginSchema` applied in `auth.controller.ts`. |

---

## 6. Wired Discover & Public Profiles to live API

**Discover:**
- Replaced hardcoded profile array with `useDiscover` hook calling `GET /discover/profile`
- Added client-side filters: role, tech-stack tags, skills tags, availability, experience range
- Like button calls `POST /match/like/:authId` (uses `authId`, not `_id`)

**BuilderProfilePage:**
- Swapped `mockBuilders` with live `GET /api/v1/profile/:profileId`
- Data mapping with fallbacks for missing fields

**Socket Notifications:**
- `createNotification.ts` wired `sendNotificationToUser` for likes, applications, rejections, invites

---

## 7. Dashboard & Workspace UI

- Premium light-theme Dashboard (`bg-zinc-50/50`, glass cards, animated badges)
- Tabs: Overview / Workspaces / Invitations / Bookmarks
- Interactive invitation Accept/Decline directly from inbox tab
- `GET /api/v1/project/memberships` endpoint added
- `dashboard.service.ts` created for all REST calls

---

## 8. CORS + Error fixes (2026-07-04)

### `Server/Src/app.ts`
- CORS moved **before** Helmet and rate-limiter
- Dynamic origin callback (allows `!origin` for Postman/mobile)
- Explicit preflight `App.options('*', cors(corsOptions))`
- Explicit `methods` + `allowedHeaders`
- `crossOriginResourcePolicy: cross-origin` in Helmet (was blocking API responses)
- `express.urlencoded()` added (was missing entirely)
- Rate limit raised from 150 → 500 req/15min (dev-friendly)
- `/health` endpoint added

### `Server/Src/Middlewares/error.middleware.ts`
- Added `CastError` handler → 400 with field name (invalid ObjectId in URL params)
- Duplicate key → 409 Conflict with field name
- `process.env.MODE` → `process.env.NODE_ENV` (correct env var)

### `Server/Src/Modules/Auth/Controllers/auth.controller.ts`
- Cookies now have `httpOnly: true`, `sameSite: lax`, `maxAge: 7d`, `secure: production-only`
- `logoutUser` now calls `res.clearCookie()` with matching options

### `Server/Src/Modules/Projects/Routes/Member.routes.ts`
- Fixed route ordering: `leave` static route declared **before** `/:memberId` wildcard (was causing route collision)

---

## 9. Client-side UI for all features (2026-07-04)

### New: My Applications page (`/my-applications`)
- `GET /api/v1/applications/me` — all submitted applications
- Filter pills: All / Pending / Accepted / Rejected / Withdrawn
- Expandable cards: cover letter, portfolio/GitHub/resume links, tech stack
- Withdraw (pending only) → `PATCH /api/v1/applications/:id/withdraw`
- View Project → `/project/:id/workspace`
- Added to sidebar nav with `ClipboardList` icon

### New: Invitations tab in NetworkPage
- `GET /api/v1/invitations/me` — pending invitations only
- Accept → `PATCH /api/v1/invitations/:id/accept`
- Decline → `PATCH /api/v1/invitations/:id/reject`
- Cards show: project name, stage, role offered, inviter, date

### Fixed: Network → Message button on matches
- Each match card now has a **Message** button → navigates to `/messages`

### Fixed: Bookmarks "View Project"
- Was a dead `<span>` — now wired to `navigate(/project/${id}/workspace)`

### Build verification
- `npm run build` → ✅ 523 modules, 0 TypeScript errors

---

## 10. All MD files updated (2026-07-04)

| File | What changed |
|------|-------------|
| `README.md` | Complete rewrite: accurate features, correct tech stack, Getting Started with env setup, updated roadmap (all completed features marked ✅) |
| `features.md` | Complete rewrite: all 11 feature areas with backend routes AND frontend pages, client route table |
| `Design.md` | Updated to include app interior design system (in-app pages) alongside landing page spec |
| `anurag.md` | This file — updated with all sessions through 2026-07-04 |

---

## Current project state (as of 2026-07-04)

### ✅ Fully implemented & working
- Auth (register, login, logout, session restore, secure cookies)
- Developer Profiles (create, read, update, delete, public view)
- Discover Feed (live API, match scoring, all filters)
- Matching (like, mutual-match, accept, reject, unmatch)
- Real-Time Messaging (Socket.io, persistent history)
- Projects CRUD (create, update, archive, delete with cascade)
- Project Applications (apply, review, accept, reject, withdraw)
- Team Members (list, add, remove, role-change, leave, transfer-owner)
- Project Workspace (Kanban, members panel, applications review)
- Bookmarks (add, remove, list, navigate)
- Invitations (send, accept, reject, withdraw, inbox UI)
- My Applications page (full tracking, withdraw)
- Network page (Matches + Requests + Invitations tabs)
- CORS + security hardening
- Production build (0 TypeScript errors, 523 modules)

### 🚧 Planned
- AI Mentor chat
- AI-powered project/developer recommendations
- Workspace real-time team chat
- Activity feed & notification center
- AI Learning Roadmaps

---

## Notes & things to be aware of

- **Intentional non-standard schema names:** `Requiremnts`, `Stage`, `Bio`, `avaliabilty`, enum `ARCHIEVED` — do NOT "fix" these without a database migration.
- **Like endpoint target:** `POST /match/like/:authId` — the `:userId` param is the profile's `authId` (not the profile `_id`). Like button uses `profile.authId`; "View Profile" navigates by `profile._id`.
- **Socket rooms:** Keyed by sorted user ID pair `[uid1, uid2].sort().join('-')`. Both server and client must use the same room key logic.
- The `leave` route in `Member.routes.ts` is correctly ordered before `/:memberId` — keep it that way.
