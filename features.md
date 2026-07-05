# peerY — Complete Feature Guide

**Last updated: 2026-07-04**

A comprehensive reference for every implemented feature across the peerY platform — backend API routes, frontend pages, and how they connect.

---

## 🧭 1. Discover Feed & Recommendation Engine

The Discover page matches builders with ideal teammates using a weighted scoring algorithm.

### Backend
- `GET /api/v1/discover/profile` — Returns ranked profiles excluding already-interacted users
- **Match Score Formula:** `(shared skills × 3) + (shared techstack × 2) + Rank bonus (S=1.5, A=1)`
- Smart exclusions via MongoDB `$nin` using `authId` of previously liked/matched users
- Graceful fallback: returns unscored general profiles when the viewer has no profile

### Frontend — `/discover`
- Live feed from API (no mock data)
- Filter sidebar: Role, Tech Stack tags, Skills tags, Availability toggle, Experience slider
- Like button → `POST /api/v1/match/like/:authId`
- Instant "It's a Match!" banner on mutual match
- Empty/error/loading states
- View Profile → `/discover/:profileId`

---

## 🤝 2. Matching & Connections

Mutual-approval connection system preventing unsolicited requests.

### Backend
- `POST /api/v1/match/like/:userId` — Send like; auto-accepts on mutual
- `PUT /api/v1/match/:matchId/accept` — Accept pending request
- `DELETE /api/v1/match/:matchId/reject` — Reject request
- `DELETE /api/v1/match/:matchId/unmatch` — Unmatch accepted connection
- `GET /api/v1/match/` — All accepted matches
- `GET /api/v1/match/pending` — Incoming pending requests

### Frontend — `/network`
- **Matches tab**: List of all accepted connections with Message + Unmatch buttons
- **Requests tab**: Incoming pending requests with Accept + Decline buttons
- Real-time toast notifications for actions

---

## 💬 3. Real-Time Persistent Messaging

### Backend
- `GET /api/v1/messages/:matchId` — Fetch message history for a match
- Socket.io server on port 3000 with `polling` + `websocket` transports
- JWT auth middleware on socket handshake
- Messages persisted to MongoDB before broadcast
- Rooms keyed by sorted user ID pairs

### Frontend — `/messages`
- Sidebar listing all matches (conversations)
- Click a match → load message history
- Socket connection with automatic polling fallback
- Send message → optimistic UI + socket emit
- Duplicate message filtering (by `_id` + timestamp)

---

## 📂 4. Projects & Team Organization

### Backend
- `POST /api/v1/project/create` — Create project (auto-creates OWNER membership)
- `GET /api/v1/project/myProjects` — My owned projects
- `GET /api/v1/project/memberships` — Projects I'm a member of
- `GET /api/v1/project/` — Browse all projects (with pagination + filters)
- `GET /api/v1/project/:projectId` — Single project details
- `PUT /api/v1/project/:projectId` — Update project
- `DELETE /api/v1/project/:projectId` — Delete project (cascades Applications, Members, Bookmarks)
- `PATCH /api/v1/project/:projectId/archive` — Archive project

### Frontend — `/projects`
Three tabs:
- **My Projects**: Owned projects with Edit/Archive/Delete/Workspace actions
- **Member Of**: Projects where user is an active member
- **Explore**: Browse all public projects; apply, bookmark, view

---

## 📋 5. Applications

### Backend
- `POST /api/v1/project/:projectId/apply` — Apply to a project
- `GET /api/v1/applications/me` — My submitted applications
- `GET /api/v1/project/:projectId/applications` — Review applications (owner only)
- `GET /api/v1/applications/:applicationId` — Single application details
- `PATCH /api/v1/applications/:applicationId/accept` — Accept applicant (→ creates Member)
- `PATCH /api/v1/applications/:applicationId/reject` — Reject applicant
- `PATCH /api/v1/applications/:applicationId/withdraw` — Withdraw own application

### Frontend — `/my-applications`
- Filter pills: All / Pending / Accepted / Rejected / Withdrawn
- Expandable cards: cover letter, portfolio, GitHub, resume links, tech stack
- Withdraw button for pending applications
- View Project → `/project/:id/workspace`

---

## 👥 6. Team Members

### Backend
- `GET /api/v1/project/:projectId/members` — List all members
- `GET /api/v1/project/:projectId/members/:memberId` — Single member
- `PATCH /api/v1/project/:projectId/members/:memberId/role` — Update role (admin+)
- `DELETE /api/v1/project/:projectId/members/:memberId` — Remove member (admin+)
- `DELETE /api/v1/project/:projectId/members/leave` — Leave project
- `PATCH /api/v1/project/:projectId/transfer-owner` — Transfer ownership

**Role hierarchy:** OWNER → ADMIN → CONTRIBUTOR → VIEWER

**Note:** The `leave` route is correctly declared before `/:memberId` in the router to prevent route collision.

### Frontend — Project Workspace (Members panel)
- Member list with role badges
- Kick / Role-change (owner/admin only)
- Leave project button
- Transfer Ownership modal

---

## 🔔 7. Invitations

### Backend
- `POST /api/v1/project/:projectId/invite` — Send invitation (checks `canInviteMembers` permission)
- `GET /api/v1/invitations/me` — My pending invitations
- `GET /api/v1/project/:projectId/invitations` — Project invitations (owner)
- `PATCH /api/v1/invitations/:invitationId/accept` — Accept → creates Member with `joinedBy: "INVITATION"`
- `PATCH /api/v1/invitations/:invitationId/reject` — Reject invitation
- `PATCH /api/v1/invitations/:invitationId/withdraw` — Withdraw sent invitation

### Frontend — `/network` (Invitations tab)
- Pending invitations list showing project name, stage, role, sender, date
- **Accept & Join** button
- **Decline** button
- Live count badge on tab

---

## 🔖 8. Bookmarks

### Backend
- `POST /api/v1/project/:projectId/bookmark` — Bookmark a project
- `DELETE /api/v1/project/:projectId/bookmark` — Remove bookmark
- `GET /api/v1/bookmarks/me` — My bookmarked projects

### Frontend — `/bookmarks`
- Grid of bookmarked projects with tech stack tags, stage badge, commitment
- Remove bookmark button
- "View Project" → `/project/:id/workspace`

---

## 🛠️ 9. Project Workspace

Protected workspace per project; accessible only to verified active members.

### Frontend — `/project/:projectId/workspace`
- **Overview tab**: Project details, member list, tech stack, requirements
- **Kanban tab**: Task board (To Do / In Progress / Review / Done), priority tags, drag states
- **Members tab**: Manage members, roles, kick, transfer ownership
- **Applications tab** (owner only): Review submitted applications; accept/reject

---

## 👤 10. Auth & Profile

### Backend
- `POST /api/v1/auth/register` — Register (returns JWT + sets httpOnly cookie)
- `POST /api/v1/auth/login` — Login (same)
- `GET /api/v1/auth/me` — Session restore (Bearer token)
- `POST /api/v1/auth/logout` — Logout (clears cookie)
- `DELETE /api/v1/auth/delete` — Delete account
- `PUT /api/v1/auth/disable` — Disable account

- `POST /api/v1/profile` — Create profile
- `GET /api/v1/profile/me` — My profile
- `GET /api/v1/profile/:profileId` — Public profile + projects
- `PUT /api/v1/profile` — Update profile
- `DELETE /api/v1/profile` — Delete profile

### Frontend
- **`/register`**: 7-step onboarding wizard
- **`/login`**: Email + password login
- **`/profile`**: Edit bio, tech stack, skills, socials, availability
- Session restored on page load via `initializeAuth()` → `GET /auth/me`
- JWT stored in `localStorage`, attached as `Bearer` on all requests

---

## 🔒 11. Security & CORS

- **CORS**: Dynamic origin callback, preflight `OPTIONS *` handler, explicit `methods` + `allowedHeaders`
- **Helmet**: `crossOriginResourcePolicy: cross-origin`, `crossOriginOpenerPolicy: unsafe-none`
- **Rate Limiting**: 500 req/15min global, 30 req/15min auth routes
- **Cookies**: `httpOnly: true`, `sameSite: lax`, `secure` in production, 7-day `maxAge`
- **Error Handler**: Handles CastError (invalid ObjectId → 400), ValidationError, Duplicate Key (409), JWT errors

---

## 🗺️ Client Routes

| Path | Page | Protected |
|------|------|-----------|
| `/` | Landing Page | No |
| `/register` | Registration (7-step) | No |
| `/login` | Login | No |
| `/dashboard` | Dashboard | ✅ |
| `/discover` | Discover Feed | ✅ |
| `/discover/:id` | Builder Profile | ✅ |
| `/projects` | Projects (mine/member/explore) | ✅ |
| `/my-applications` | My Applications | ✅ |
| `/project/:id/workspace` | Project Workspace | ✅ |
| `/network` | Network (matches/requests/invitations) | ✅ |
| `/messages` | Real-time Messages | ✅ |
| `/bookmarks` | Saved Projects | ✅ |
| `/profile` | Profile Settings | ✅ |
