# PeerY — Full System Architecture & Implementation Documentation

Welcome to the comprehensive documentation of **PeerY** (formerly PeerX) — an AI-powered developer collaboration platform designed to match builders, create workspaces, and ship real-world projects.

This document serves as the absolute source of truth for every major and minor technical detail, architecture design, schema layout, API contract, and visual token in this codebase.

---

## Table of Contents
1. [System Overview & Flow](#1-system-overview--flow)
2. [Technology Stack](#2-technology-stack)
3. [Monorepo Directory Structure](#3-monorepo-directory-structure)
4. [Database Architecture & Schemas](#4-database-architecture--schemas)
5. [REST API Endpoint Registry](#5-rest-api-endpoint-registry)
6. [Real-time Events (Socket.io) Architecture](#6-real-time-events-socketio-architecture)
7. [Frontend Routing & State Management](#7-frontend-routing--state-management)
8. [UI/UX & Design Token Specification](#8-uiux--design-token-specification)
9. [System Quirks, Typo Safeguards & Gotchas](#9-system-quirks-typo-safeguards--gotchas)

---

## 1. System Overview & Flow

PeerY allows developers to swipe profiles, connect with potential co-founders, form project teams, apply to project pipelines, and collaborate inside dedicated workspaces.

### Core User Journey
```
Landing Page ──> JWT Auth Register/Login ──> Onboarding (Profile Setup)
                                                      │
 ┌────────────────────────────────────────────────────┴──────────────────────────────────────────────────────┐
 ▼                                                    ▼                                                      ▼
Discover (Swipe/Tab Feed)                    Projects Board (Explore)                               Dashboard (Metrics)
 │                                                    │                                                      │
 ├─> Like User (Connection Req)                       ├─> View Project Pipeline                              ├─> Track Submissions
 │                                                    │                                                      │
 ├─> Mutual Match (Unlock Chat)                       ├─> Apply to Role (Cover Letter)                       ├─> Accept/Decline invites
 │                                                    │                                                      │
 └─> Connect Interceptor (Modal)                      └─> Direct Invite to Build                             └─> Saved Items (Dual-Tab)
                                                              │
                                                              ▼
                                                 Collaborative Workspace
                                             (Kanban Board + Team Controls)
```

---

## 2. Technology Stack

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js (v5.0.0-alpha.x)
* **Language:** TypeScript
* **Database Driver:** Mongoose (MongoDB)
* **Real-time Communications:** Socket.io
* **Security:** Helmet, Express Rate Limiters, CORS, and HTTP-only Cookie configurations.
* **Validation:** Zod schemas.

### Frontend
* **Language:** TypeScript
* **UI Library:** React (Vite environment)
* **CSS & Styling:** Tailwind CSS v4, custom Vanilla CSS elements (grid meshes, backdrop blurs).
* **State Management:** Redux Toolkit (RTK) + Axios interceptors.
* **Transitions:** Framer Motion (spring physics animations).
* **Icons:** Lucide React.

---

## 3. Monorepo Directory Structure

```
peerY/
├── Client/                      # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── App/                 # Global Client Setup (api client, layouts)
│   │   ├── components/ui/       # Shared UI components (buttons, input wraps)
│   │   ├── Features/            # Feature-scoped modules
│   │   │   ├── Auth/            # Register, Login, ProfileSettings, Onboarding
│   │   │   ├── Bookmarks/       # Bookmarked Projects & Builders tab panels
│   │   │   ├── Dashboard/       # User Overview, Rank widget, applications
│   │   │   ├── Discover/        # Swipe deck, All Users tab, Profile checks
│   │   │   ├── landing/         # Marketing landing sections, floating nav
│   │   │   ├── Messages/        # Socket chat log view, search sidebar
│   │   │   ├── Network/         # Connected matches list, pending invites inbox
│   │   │   └── Projects/        # Create/Edit modals, Kanban Workspaces
│   │   └── App.tsx              # Main routing definition entrypoint
│   └── package.json
│
├── Server/                      # Backend Service (Express + MongoDB)
│   ├── Src/
│   │   ├── App.ts               # Core express configuration (CORS, Rate limits)
│   │   ├── Server.ts            # Entry node: binds sockets & HTTP port
│   │   ├── Middlewares/         # Auth verify, error handles, activity loggers
│   │   ├── Sockets/             # Sockets gateway, online user map, chat handlers
│   │   ├── Utils/               # Global classes (ApiError, AsyncHandlers)
│   │   └── Modules/             # Feature-scoped modules
│   │       ├── Auth/            # login/register/profile setup controllers
│   │       ├── Discover/        # recommendation generator & filter scoring
│   │       ├── Match/           # swipe matching logic, mutual connection registers
│   │       └── Projects/        # Project CRUD, Member records, Applications
│   ├── tsconfig.json
│   └── package.json
│
└── Contexts/                    # Project requirement files, schema models & APIs
```

---

## 4. Database Architecture & Schemas

MongoDB schemas contain specific intentional properties. **DO NOT MODIFY** case styling, pluralizations, or spelling discrepancies (e.g. `avaliabilty`).

### 1. `users` Collection
Stores core authentication and credentials data.
```typescript
{
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true }
}
```

### 2. `profiles` Collection
Maintains user-facing identity, stack details, weekly availability, and reputation scoring.
```typescript
{
  authId: { type: Schema.Types.ObjectId, ref: "user", required: true, unique: true },
  name: { type: String, required: true, unique: true, lowercase: true },
  avatar: { type: String, default: "" },
  skills: { type: [String], lowercase: true, default: [""] },
  socials: { type: [String], lowercase: true, default: [""] },
  Bio: { type: String, default: "Let's cook", minLength: 5, maxLength: 300 },
  college: { type: String, lowercase: true, default: "" },
  experience: { type: String, required: true, enum: ["beginner", "intermediate", "god"] },
  techstack: { type: [String], lowercase: true, default: [""] },
  avaliabilty: { type: Boolean, default: true }, // Note the intentional spelling
  intent: { type: String, index: true },
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  totalContribution: { type: Number, default: 0 },
  totalProject: { type: Number, default: 0 },
  Achievements: { type: [String], default: ["Starter"] },
  Rank: { type: String, default: "B" }
}
```

### 3. `matches` Collection
Stores likes and mutual connection statuses.
```typescript
{
  userOne: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userTwo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  accepted: { type: Boolean, default: false },
  status: { type: String, default: "ACTIVE", enum: ["ACTIVE", "UNMATCHED"] },
  matchedAt: { type: Date }
}
```

### 4. `messages` Collection
Saves direct chat logs linked to a mutual match.
```typescript
{
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true }
}
```

### 5. `projects` Collection
Holds team collaboration, description, and status tags.
```typescript
{
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  Requiremnts: { type: [String], default: [] }, // Note the intentional spelling
  Stage: { type: String, required: true, enum: ["Idea", "Prototype", "Scaling", "Production"] },
  commitment: { type: String, default: "Part-time" },
  techStack: { type: [String], default: [] },
  status: { type: String, default: "ACTIVE", enum: ["ACTIVE", "ARCHIEVED", "DELETED"] }, // Note spelling
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  views: { type: Number, default: 0 },
  bookMarksCount: { type: Number, default: 0 },
  membersCount: { type: Number, default: 1 },
  applicationCount: { type: Number, default: 0 }
}
```

### 6. `members` Collection
Binds users to collaborative workspaces with granular operation permissions.
```typescript
{
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  role: { type: String, required: true, enum: ["OWNER", "ADMIN", "MAINTAINER", "MEMBER", "VIEWER"] },
  permissions: {
    canInviteMembers: { type: Boolean, default: false },
    canRemoveMembers: { type: Boolean, default: false },
    canEditProject: { type: Boolean, default: false },
    canManageApplications: { type: Boolean, default: false },
    canTransferOwnership: { type: Boolean, default: false },
    canManageTasks: { type: Boolean, default: true },
    canManageRepository: { type: Boolean, default: false }
  },
  status: { type: String, default: "ACTIVE", enum: ["ACTIVE", "SUSPENDED"] },
  joinedBy: { type: String, enum: ["CREATOR", "INVITATION", "APPLICATION", "OWNER"], required: true }
}
```

### 7. `applications` Collection
Stores requests submitted by candidates to join projects.
```typescript
{
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  applicant: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "PENDING", enum: ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"] },
  resume: { type: String, default: "" },
  githubLink: { type: String, default: "" },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rejectionReason: { type: String },
  rejectedAt: { type: Date },
  withdrawnAt: { type: Date }
}
```

### 8. `bookmarks` Collection
Keeps track of saved items.
```typescript
{
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true }
}
```

### 9. `invitations` Collection
Manages direct developer invites from project owners.
```typescript
{
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  invitedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, default: "MEMBER", enum: ["ADMIN", "MAINTAINER", "MEMBER", "VIEWER"] },
  message: { type: String, default: "" },
  status: { type: String, default: "PENDING", enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"] }
}
```

---

## 5. REST API Endpoint Registry

All APIs are versioned under `/api/v1`.

### 🔐 Authentication Module (`/api/v1/auth`)
* `POST /register`: Registers user. Checks register schema. Logs in automatically.
* `POST /login`: Validates password. Emits HTTP-only session cookie.
* `POST /logout`: Clears session token.
* `GET /me`: Fetches session context and credentials mapping.
* `DELETE /account`: Permanently deletes user and associated profile records.

### 👤 Profile Module (`/api/v1/profile`)
* `POST /`: Initial onboarding setup (creation validation requires a minimum bio/experience profile).
* `GET /me`: Retrieves the active profile context of the logged-in user.
* `GET /:profileId`: Public profile viewer details (used inside cards and profile page views).
* `PUT /me`: Edits bios, stack, college, availability, and intent keys.

### 🔍 Discover Module (`/api/v1/discover`)
* `GET /profile`: Generates matching feed. If query contains `tab=All Users` or `tab=all`, skips interacted filters. Accepts `search` parameter for string matches on name, bio, skills, or stack.

### 🤝 Match & Swipe Module (`/api/v1/match`)
* `POST /like/:userId`: Sends match connection request. If target user already swiped back, instantly flags a mutual match.
* `GET /`: Lists all accepted mutual connection matches.
* `GET /pending`: Lists pending incoming match requests.
* `PUT /:matchId/accept`: Explicitly accepts match requests.
* `DELETE /:matchId/reject`: Rejects match requests.
* `DELETE /:matchId/unmatch`: Breaks an active connection.

### 📁 Projects Module (`/api/v1/project`)
* `POST /`: Creates a project. Owner is automatically mapped as the first active member.
* `GET /`: Lists all active projects in the system.
* `GET /:projectId`: Fetches complete project specifications.
* `PUT /:projectId`: Modifies project details. Requires owner/admin permissions.
* `DELETE /:projectId`: Cleans up project, members, applications, and bookmarks.
* `POST /:projectId/bookmark`: Bookmarks a project.
* `DELETE /:projectId/bookmark`: Removes a project bookmark.

### 📄 Project Applications Module (`/api/v1/application`)
* `POST /`: Submits application to join a project.
* `GET /me`: Lists all applications submitted by the logged-in user (displayed on Dashboard).
* `GET /project/:projectId`: Lists incoming applications to a project.
* `PUT /:applicationId/accept`: Project owner accepts application. Creates a member record.
* `PUT /:applicationId/reject`: Replaces application status with `REJECTED`.
* `PUT /:applicationId/withdraw`: Candidate retracts application.

### ✉️ Invitations Module (`/api/v1/invitation`)
* `POST /`: Sends a project invitation to a builder.
* `GET /me`: Lists incoming invitations for the logged-in user (displayed in Network page).
* `PUT /:invitationId/accept`: Accepts invite, adds builder to the project workspace.
* `PUT /:invitationId/reject`: Declines invite, flags status as `REJECTED`.

---

## 6. Real-time Events (Socket.io) Architecture

The Socket.io system connects persistently at the application layout root (`AppLayout.tsx`) and handles live presence tracking, toast updates, and instant text delivery.

### 👥 Presence Mapping
An in-memory map on the server associates user IDs with their active socket connection strings:
```typescript
const onlineUsers = new Map<string, string>(); // Maps userId -> socketId
```

### 📡 Event Reference

#### Client-Emitted Events:
* `join:match` (Payload: `matchId`): Instructs backend socket to join the room associated with the chat.
* `direct:message` (Payload: `{ matchId, text }`): Sends a new chat message.

#### Server-Emitted Events:
* `notification:received` (Payload: `{ title, message, type }`): Delivers real-time toasts across the app.
* `direct:message` (Payload: `{ _id, matchId, sender, text, createdAt }`): Dispatches new chat messages to all listeners in the socket room.

---

## 7. Frontend Routing & State Management

### Route Map (React Router)
* `/`: Marketing Landing Page.
* `/login` / `/register`: Authentication entry points.
* Protected Views (housed inside `<AppLayout />` sidebar framework):
  * `/dashboard`: Summary ledger, ranks, submissions, and pending network requests.
  * `/discover`: Swipe cards, filter panel, All Users query view.
  * `/discover/:id`: Public profile viewer details.
  * `/projects`: Active projects workspace feed, CRUD triggers.
  * `/my-applications`: Application tracker ledger.
  * `/project/:projectId/workspace`: Member portal (Kanban tasks, team permission control).
  * `/bookmarks`: Saved projects & saved builders dual-tabs navigation.
  * `/network`: Connection list and pending invites.
  * `/messages`: Sidebar with match filter search, active conversation window.
  * `/profile`: Profile Settings.

### Client State
* **Auth Slice (RTK):** Stores logged-in user credentials (`user: { _id, username, email }`), loading tokens, and session flags.
* **Axios Interceptor (`App/api.ts`):** Attaches `Authorization: Bearer <token>` to headers and configures `withCredentials: true` for HTTP cookie transport.
* **LocalStorage Policies:**
  * `token`: Active JWT auth token.
  * `peerY_bookmarked_profiles`: Serialized JSON array of saved builder profiles.

---

## 8. UI/UX & Design Token Specification

### Color Tokens
* **Primary Blue:** `#2563eb` (`bg-blue-600` / `text-blue-600`)
* **Neutral Dark:** `#09090b` (`text-zinc-950`)
* **Neutral Gray:** `#71717a` (`text-zinc-500`)
* **Neutral Light:** `#a1a1aa` (`text-zinc-400`)
* **Harmonized Highlight Accents:**
  * AI Learning (Blue): `#2563eb` (`bg-blue-50`, `border-blue-100`)
  * Connecting (Emerald): `#059669` (`bg-emerald-50`, `border-emerald-100`)
  * Building (Violet): `#7c3aed` (`bg-violet-50`, `border-violet-100`)
  * Contributing (Amber): `#d97706` (`bg-amber-50`, `border-amber-100`)
  * Growth (Indigo): `#4f46e5` (`bg-indigo-50`, `border-indigo-100`)

### Spring Physics (Framer Motion)
```typescript
const springTransition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8
};
```
*Used in navbar transitions, sidebars, toast popups, and modal scaling.*

---

## 9. System Quirks, Typo Safeguards & Gotchas

To prevent runtime errors, keep in mind these system details:

1. **Schema Spelling Typos:** Mongoose schemas enforce specific typos. Ensure you use the exact properties below:
   * **Project Model:** `Requiremnts` (missing "e"), `status` enum option `ARCHIEVED` (extra "E").
   * **Profile Model:** `avaliabilty` (missing "a").
2. **ESM Imports:** The backend uses ESM. All files imported inside `Server` **MUST** include the `.js` extension (e.g. `import authModel from "./auth.model.js"`).
3. **CORS Options / Express 5:** Express 5 path matching behaves strictly with path-to-regexp v8. Wildcards MUST be declared as `*path` or named variables. Direct wildcard CORS controls are active to prevent preflight OPTIONS failures.
4. **Member Hook Arity:** The Mongoose pre-save hook in `Member.model.ts` uses an async signature without a `next()` callback to avoid arity errors during project creation.
5. **MongoDB Connections:** Atlas connection queries are configured to connect using direct node cluster endpoints. This bypasses DNS query errors that can occur in local virtualized environments.
