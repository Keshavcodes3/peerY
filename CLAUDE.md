# CLAUDE.md — peerY

Guidance for working in this repo. **Swipe. Match. Build. Ship.** — an AI-powered
developer collaboration platform. Monorepo: `Client/` (Vite + React) and
`Server/` (Express + MongoDB).

> Full contracts: `Contexts/Docs/`. System specs: `docs.md`. Roadmap: `../plan.md`. PRD: `Contexts/prd.md`.
> Status is tracked honestly there with ✅ / 🟡 / 🚧.

---

## Commands

```bash
# Server (Express + tsx watch) — from Server/
npm run dev            # starts on :3000, needs .env (MONGO_URI, JWT_SECRET, CLIENT_URL)

# Client (Vite) — from Client/
npm run dev            # starts on :5173
npm run build          # tsc -b && vite build
npm run lint           # eslint
```

There are **no tests** yet (`npm test` is a placeholder). Verify by running both apps.

---

## Architecture

**Server** — versioned REST under `/api/v1`, modular by feature in `Server/Src/Modules/`:
- Each module: `Routes/ → Controllers/ → Services/ → Models/` (+ `Validation/` with Zod in Projects).
- Auth via `verifyAuth` middleware (JWT from cookie `token` or `Bearer`), errors via `globalErrorHandler`.
- Implemented modules: **Auth, Profile, Discover, Match, Projects** (Project + Application + Member).
- Mongo transactions used in `acceptApplication` and `transferOwnership`.

**Client** — `Client/src/Features/{Auth,Discover,landing}/` with `Pages/ Components/ Hooks/ services/ Redux/`.
- Redux Toolkit (`store/index.ts`, only an `auth` slice so far), axios in `App/api.ts` (baseURL `http://localhost:3000/`, `withCredentials`).
- Heavy Framer Motion; Tailwind v4; shadcn/ui in `components/ui/`.

---

## Conventions (match existing code)

- Server folders/files are **PascalCase** (`Modules/Projects/Controllers/...`); ESM imports use `.js` extensions.
- Some schema field names are non-standard and intentional — don't "fix" silently: `Requiremnts`, `Stage`, `Bio`, `avaliabilty`, and the enum value `ARCHIEVED`.
- Never trust client-provided user IDs — always derive identity from `req.user` (JWT).
- Success shape: `{ success, message, data }`. Error shape: `{ success:false, error, stack? }`.
- New API surface → add a matching doc in `Contexts/Docs/` (follow the style of `auth.md`).

---

## What to work on next (priority order)

### P0 — Make the app actually run end-to-end
1. ✅ **DONE — Auth persistence + `/dashboard`.** Token stored in localStorage,
   axios interceptor attaches `Bearer`, `getMe()` bootstrap on refresh, `ProtectedRoute`
   guards, and the `/dashboard` page now exist in light-theme grid aesthetic.
2. ✅ **DONE — Discover wired to the API.** `DiscoverPage` now loads `GET /discover/profile`
   via `useDiscover` (`Features/Discover/hooks/useDiscover.ts` + `services/discover.service.ts`)
   with active filters, custom search query logic, local status tracking, and the connect button calls `POST /match/like/:userId`.
   `BuilderProfilePage` (`/discover/:id`) is fully wired to `GET /api/v1/profile/:profileId` and pulls live data and projects.
   The old `SwipeDeck`/`useSwipeDeck`/`mockData` deck is orphaned (DiscoverPage never used it).
3. ✅ **DONE — Network & Connection Fixes.** Fixed MongoDB SRV address resolution crashes and Axios double-slash preflight CORS errors.

### P1 — Close backend gaps that block features
4. ✅ **DONE — Bookmarks.** Full model, repository, service, controllers, routes, and `project.bookMarksCount` counters implemented.
5. ✅ **DONE — Invitations.** Direct invite creates a `Member` with `joinedBy: "INVITATION"`. Fully implemented route/service/controller/validation.
6. ✅ **DONE — Project update/delete/archive.** Fully implemented. Delete cleans up all related Applications, Members, and Bookmarks.
7. ✅ **DONE — Zod validation on Auth register/login.** Registered in controllers using `registerSchema` and `loginSchema`.

### P2 — Real-time & security
8. ✅ **DONE — Socket.io.** Wired `initSocket(server)` into `Server.ts`, handling JWT auth, presence online user tracking, and notification delivery helpers.
9. ✅ **DONE — Security hardening.** Helmet and Express rate limiters wired into `App.ts`. (Skip ESM-incompatible `xss-clean`.)
10. ✅ **DONE — Client-side UI & Routing.** Built full My Applications tracker page, Invitations inbox tab in Network, Message button on Match cards, Bookmarks navigation, and real-time Socket.io Chat UI.
11. ✅ **DONE — Express 5 Wildcard CORS.** Fixed OPTIONS preflight crashes caused by path-to-regexp v8 named wildcard changes.
12. ✅ **DONE — Live Alerts & Interceptors.** Added real-time notification bell buttons on Discover/Dashboard. Created a connection-check interceptor and Connection Required modal to block direct chat with unmatched users.
13. ✅ **DONE — Profile Bookmarks.** Built client-side LocalStorage profile bookmarks and a tabs layout on BookmarksPage to browse both saved projects and builders.
14. ✅ **DONE — All Users Tab.** Created an "All Users" tab on DiscoverPage, and updated the backend discover endpoint to bypass liked/matched exclusions if requesting all users.

### P3 — Product depth
15. **Workspace**: Kanban tasks, chat, files (multer is installed), GitHub links.
13. **AI layer**: roadmaps + in-workspace mentor (planned; no provider wired yet —
    when adding, read the Claude API skill first and default to the latest Claude models).
14. **Builder reputation**: profile already reserves `Rank`, `totalContribution`,
    `totalProject`, `Achievements`, follower/following counts.

---

## Known gotchas

- Client stack is **Vite + React** despite `plan.md`/`Workflow.md` saying Next.js.
- Notifications are persisted and emitted in real-time over Socket.io connections.
- `Role.routes.ts` is also an empty stub; roles today are a fixed hierarchy in the Member model.
- MongoDB connection uses a direct-IP nodes string in `.env` to bypass local DNS query failures.
- Express 5 wildcard parameter matches require named parameters, e.g., `/` followed by `{*path}`.
- Both Server and Client compile cleanly with zero TypeScript errors.

