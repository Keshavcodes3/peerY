# peerY — Product Requirements Document (PRD)

**Tagline:** *Swipe. Match. Build. Ship.*
**Status:** Living document · Last updated 2026-07-01

---

## 1. Overview

peerY is an AI-powered developer ecosystem where builders discover teammates,
find projects, learn, and ship products together. It combines a Tinder-style
discovery/matching layer with project collaboration workspaces and (planned)
AI-assisted learning.

This PRD tracks scope and, importantly, **what is actually built today** versus
what is planned. For per-endpoint contracts, see the `Docs/` folder.

---

## 2. Goals

- Give developers **direction** (what to build / learn next).
- Help solo developers **find teammates** who complement their skills.
- Provide a single place to **discover → match → build → ship**.
- Turn a profile into **proof of work**, not just a résumé (planned).

## 3. Non-Goals (for now)

- Being a general social network / feed.
- Native mobile apps (web-first).
- Payments / monetization.

---

## 4. Personas

| Persona | Need |
|---------|------|
| **Beginner** | Direction, mentorship, first real project |
| **Builder / Indie hacker** | Teammates for an idea, momentum |
| **Job seeker** | Portfolio and proof of collaboration |
| **Founder** | Reliable contributors with the right skills |

---

## 5. Core User Journey

```
Onboard → Discover → Swipe → Match → Connect → Build → Ship → Showcase → Grow
```

---

## 6. Feature Scope & Current Status

Legend: ✅ done · 🟡 partial · 🚧 planned / stubbed

### 6.1 Authentication & Profile
- ✅ Register, Login, Get current user, Logout, Disable account, Delete account (JWT via cookie or Bearer).
- ✅ Profile CRUD (skills, tech stack, experience, bio, socials, rank, counters).
- 🚧 Email verification, password reset, OAuth (Google/GitHub) — UI buttons exist on client, no backend integration.
- 📄 Docs: [auth.md](./Docs/auth.md), [profile.md](./Docs/profile.md)

### 6.2 Discovery
- ✅ Profile discovery feed with skill/tech-stack match scoring (backend).
- 🟡 Client discovery UI (swipe deck, filters, builder profile pages) — fully built but running on **mock data**, not yet wired to the API.
- 🚧 Project discovery feed, server-side filters, pagination.
- 📄 Docs: [discover.md](./Docs/discover.md)

### 6.3 Matching
- ✅ Like / auto-match on mutual, accept, reject, unmatch, list matches, list pending (backend).
- ✅ Notifications on like/match/unmatch (persisted, fire-and-forget).
- 🚧 Real-time match delivery (Socket.io scaffolded, not wired).
- 📄 Docs: [match.md](./Docs/match.md)

### 6.4 Projects & Collaboration
- ✅ Create project, list my projects, list/filter projects, get project by ID.
- ✅ Applications: apply, list mine, list for project (owner), get one, accept (transactional → creates member), reject, withdraw.
- ✅ Members: list, get, update role, remove, leave, transfer ownership (transactional), role hierarchy + permissions.
- 🟡 Update/delete/archive project (API completed ✅, client UI pending 🚧).
- 🟡 Bookmarks & Invitations (API completed ✅, client UI pending 🚧, roles stubbed).
- 🚧 Kanban tasks, chat, files, GitHub integration (Workspace collaboration).
- 📄 Docs: [project.md](./Docs/project.md), [application.md](./Docs/application.md), [member.md](./Docs/member.md), [bookmark.md](./Docs/bookmark.md), [invitation.md](./Docs/invitation.md)

### 6.5 AI Learning Ecosystem
- 🚧 AI roadmaps, build tracks, in-workspace AI Mentor, smart matching — planned (no implementation yet).

### 6.6 Builder Reputation & Analytics
- 🟡 Profile reserves fields for it (`Rank`, `totalContribution`, `totalProject`, `Achievements`, follower/following counts).
- 🚧 Builder score, contribution graph, skill proof, collaboration DNA, network graph — planned.

### 6.7 Real-Time Layer
- 🟡 Socket.io initialized, wired, and JWT authenticated on the server ✅; real-time event triggers in service layers and client UI integration are pending 🚧.

---

## 7. Technical Architecture

**Frontend (Client):** React + TypeScript, Vite, Tailwind CSS v4, Redux Toolkit,
Framer Motion, React Router v7, shadcn/ui, lucide-react. Axios base URL
`http://localhost:3000/` with credentials.

**Backend (Server):** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT,
Zod (Projects module validation), bcrypt, morgan, cookie-parser, CORS. API
versioned under `/api/v1`. MongoDB transactions used for accept-application and
transfer-ownership.

**Planned:** Socket.io real-time, OpenAI integration, Cloudinary / AWS S3 storage,
GitHub API, deployment on Vercel + AWS/Railway.

> Note: earlier planning docs mention Next.js; the actual client is **Vite + React**.

---

## 8. Data Model Summary

| Collection | Purpose | Status |
|------------|---------|--------|
| `user` | Auth identity | ✅ |
| `profile` | Public developer profile | ✅ |
| `match` | Likes / mutual matches | ✅ |
| `Project` | Projects + requirements + counters | ✅ |
| `Application` | Join requests | ✅ |
| `Member` | Project membership + roles/permissions | ✅ |
| `Bookmark` | Saved projects | ✅ (API Done, client UI pending) |
| `Invitation` | Direct invites | ✅ (API Done, client UI pending) |
| Notifications | Match/application events | 🟡 persisted, real-time Sockets ready |

---

## 9. Known Gaps / Risks

- **Client not fully wired to backend** — discovery feed is live, but `BuilderProfilePage.tsx` detail view uses mock data and needs a public profile retrieval endpoint.
- **Socket event triggers missing in services** — the server is wired, but controllers/services do not emit socket notifications to users on updates.
- **Client UI missing for new features** — bookmarks, invitations, and project update/archive/delete lack client-side pages.
- Enum typo carried in code: project stage `ARCHIEVED`.

---

## 10. Next Milestones

1. **Wire client `BuilderProfilePage` to live APIs**: Create a backend endpoint `GET /api/v1/profile/:profileId` and wire the React frontend.
2. **Hook Socket.io events into modules**: Emit events via `sendNotificationToUser` during likes, mutual matches, applications, and invitations.
3. **Build Frontend UI for Bookmarks, Invitations, and Project Settings**.
4. **Project workspace**: Kanban tasks, chat, files.
5. **Begin AI layer** (roadmaps + workspace mentor).

---

## 11. Reference Docs

- Roadmap & phases: [`../../plan.md`](../../plan.md)
- Architecture & workflows: [`../../Workflow.md`](../../Workflow.md)
- API docs: [`Docs/`](./Docs)
