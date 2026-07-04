# 🚀 Codebase Scan: PeerX 2.0 (`peerY`)

This report provides a detailed scan and analysis of the **PeerX 2.0** (`peerY`) developer collaboration platform codebase.

---

## 📂 Codebase Directory Overview

The project is structured as a TypeScript monorepo containing a React frontend and an Express backend:

```text
peerY/
├── Client/                 # Vite + React + TypeScript + Redux Toolkit + Tailwind v4
│   ├── src/
│   │   ├── App/            # Global configs, Axios client setup, endpoints definitions
│   │   ├── Features/       # Modules grouped by feature (Auth, Dashboard, Discover, landing)
│   │   ├── components/     # Reusable/shared UI components (shadcn/ui, buttons, fields)
│   │   └── store/          # Redux toolkit store configuration
│   ├── package.json
│   └── tsconfig.json
├── Server/                 # Express + Mongoose + TypeScript
│   ├── Server.ts           # Server runner / DB connection bootstrap
│   ├── Src/
│   │   ├── App.ts          # Express application initialization and middleware routing
│   │   ├── Config/         # DB connection setup and environment settings
│   │   ├── Middlewares/    # Global error handlers, auth verification, etc.
│   │   ├── Sockets/        # Socket.io scaffolds (not fully wired into Server.ts yet)
│   │   └── Modules/        # Feature-driven API modules (Auth, Discover, Match, Projects)
│   │       └── [Module]/
│   │           ├── Controllers/
│   │           ├── Models/
│   │           ├── Routes/
│   │           └── Services/
│   ├── package.json
│   └── tsconfig.json
├── Contexts/               # Documentation folder containing the PRD and detailed API docs
│   ├── Docs/               # Per-module markdown files explaining API contracts
│   └── prd.md              # Product Requirements Document
├── README.md               # Welcome guide, features description, and setup instructions
├── Workflow.md             # Multi-phase user journey descriptions
├── plan.md                 # 5-phase execution plan and progress tracker
└── anurag.md               # Historical work log documenting past fixes
```

---

## 🛠 Technology Stack

### Frontend (Client)
*   **Core:** React 19 + Vite + TypeScript
*   **Styling:** Tailwind CSS v4 + Framer Motion (heavy micro-animations) + Lucide Icons
*   **UI Components:** shadcn/ui components customized inside `Client/src/components/ui/`
*   **State Management:** Redux Toolkit (currently contains `auth` slice in `auth.slice.ts`)
*   **HTTP Client:** Axios (configured in `Client/src/App/api.ts` to attach JWT `Bearer` tokens from `localStorage` and handle automatic `401` logouts)

### Backend (Server)
*   **Core:** Node.js + Express + TypeScript running with ESM module resolution
*   **Database:** MongoDB + Mongoose ORM
*   **Auth:** JWT-based stateless authentication (tokens received from `/auth/login` or `/auth/register` and sent via `Authorization: Bearer` headers)
*   **Validation:** Zod schemas (used mainly in `Projects` module schemas)

---

## 📊 Database Schemas & Models

Several MongoDB collections are mapped via Mongoose. Note the **intentional schema names/typos** that must not be altered, as highlighted in `CLAUDE.md`:

### 1. `Project` Model ([Project.model.ts](file:///d:/D%20drive/1/videos/movie/1.dev/Cohort%203.0/WEB%20DEV/cohort-3%20codes/New%20folder/peerY/Server/Src/Modules/Projects/Models/Project.model.ts))
*   **Fields:**
    *   `owner` (ObjectId → User)
    *   `title` (String, trimmed)
    *   `description` (String, trimmed)
    *   `banner` (String)
    *   `Stage` (Enum: `["IDEA", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIEVED"]`) **[Note: ARCHIEVED is misspelled]**
    *   `category` (String)
    *   `techStack` (Array of Strings)
    *   `visibility` (Enum: `["PUBLIC", "PRIVATE", "MEMBER ONLY"]`)
    *   `commitment` (String)
    *   `Requiremnts` (Array of `RequiremntSchema`) **[Note: Requiremnts and RequiremntSchema are misspelled]**
    *   `membersCount` (Number, default `1`)
    *   `applicationCount` (Number, default `0`)
    *   `bookMarksCount` (Number, default `0`)
    *   `views` (Number, default `0`)
    *   `isArchived` (Boolean, default `false`)
*   **Indexes:**
    *   Compound index on `{ stage: 1, category: 1, cratedAt: -1 }` **[Note: cratedAt is misspelled here]**
    *   Text search index on `{ title: "text", description: "text" }`
    *   Query index on `{ owner: 1, createdAt: -1 }`

### 2. `Member` Model
*   Contains role hierarchies (from `OWNER` to `VIEWER`). Manages transactional updates for ownership transfer.

### 3. Implemented Models
*   **`Bookmark.model.ts`**: Contains compound unique index `{ user, project }` to prevent duplicates.
*   **`Invitation.model.ts`**: Maps invitation status (`PENDING`, `ACCEPTED`, `REJECTED`, `WITHDRAWNED`) and specified role.

---

## 🔌 API Endpoints & Routes

The server routes are defined under `/api/v1/`:

| Base URL Prefix | Route Class | Status | Details |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth` | Authentication | ✅ Live | Registration, Login, Session Check (`/auth/me`), Logout (includes Zod validation schemas) |
| `/api/v1/profile` | Profiles | ✅ Live | Setup, CRUD, and updating builder profile fields |
| `/api/v1/discover/profile` | Discover Feed | ✅ Live | Computes matchmaking scores (interests, stack) and returns feed profiles |
| `/api/v1/match` | Matches | ✅ Live | Handles swipes (`like`, `pass`), mutual-likes, unmatch lifecycle |
| `/api/v1/project` | Projects | ✅ Live | Creation, listing, details, updates, deletes (with cascade cleanup), and archiving |
| `/api/v1/applications` | Applications | ✅ Live | Apply to join a project, accept/reject applicants |
| `/api/v1/project` | Members | ✅ Live | Team membership lists, role updates, transfer ownership |
| `/api/v1/project` / `/api/v1/bookmarks` | Bookmarks | ✅ Live | Bookmark projects, list user bookmarks (UI pending) |
| `/api/v1/project` / `/api/v1/invitations` | Invitations | ✅ Live | Invite users, accept/reject/withdraw invitations (UI pending) |
| `/api/v1/project` | Roles | 🚧 Stub | Empty `Role.routes.ts` file (roles managed inside member hierarchy) |

---

## 🖥 Client Feature Architecture

The Vite client uses a modern modular features layout:

1.  **`landing/`**
    *   Highly polished marketing/landing page with pricing cards, testimonials, FAQ accordion, and feature showcases utilizing rich Framer Motion animations.
2.  **`Auth/`**
    *   Handles registration, login, and the interactive **7-step onboarding wizard** (capturing skills, availability, bio, profiles, and social links).
    *   Includes `ProtectedRoute` to redirect unauthorized users.
3.  **`Dashboard/`**
    *   Authenticated dashboard displaying greeting cards, workspace shortcuts, active matches, and logout utility.
4.  **`Discover/`**
    *   **DiscoverPage:** Renders tinder-like matching cards fetching recommendations from `GET /discover/profile` with live connect triggers (`POST /match/like/:userId`).
    *   **BuilderProfilePage (`/discover/:id`):** Displays comprehensive user stats, DNA charts, and Github metrics. *Currently reads mock data* (`mockData.ts`) instead of the API.

---

## 📈 Implementation Gaps & Next Steps

According to the updated planning files, the remaining development objectives are:

### P0 Gaps (Critical Client-Backend Integration)
1.  **Wire BuilderProfilePage (`/discover/:id`):** Transition the profile page details from `mockData.ts` to API-driven profiles. This requires implementing a backend public profile retrieval endpoint (`GET /api/v1/profile/:profileId`).

### P1 Gaps (Real-time Socket Event Triggers)
2.  **Socket Event Emissions:** Call `sendNotificationToUser` inside module controller/service layers to emit socket updates during likes, mutual matches, project applications, and invitations.

### P2 Gaps (Client UI Expansion)
3.  **UI Pages for New Features:** Build pages and dashboards on the React frontend for managing bookmarks, project invitations, and project owner settings (edit/archive/delete).

### P3 Gaps (Collaboration Workspace)
4.  **Workspace Features:** Implement Kanban boards, group chat, and file storage.
