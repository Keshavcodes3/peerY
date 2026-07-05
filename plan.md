# PeerX 2.0 - Development Plan (5 Phases)

> Goal: Build PeerX from MVP to Production in 5 structured phases.

---

# 📊 Progress Snapshot — 2026-07-05

Legend: ✅ done · 🟡 partial · 🚧 not started

| Phase | Area | Status |
|-------|------|--------|
| **1** | Auth (register/login/me/logout/disable/delete, JWT) | ✅ (including Zod Validation) |
| **1** | User Profile CRUD | ✅ |
| **1** | Landing page | ✅ (Premium Light Theme Aesthetic) |
| **1** | Email verification / password reset / OAuth | 🚧 |
| **2** | Profile Discovery + match scoring (API) | ✅ (Updated: dynamic "All Users" and availability checks) |
| **2** | Swipe / Match engine (like, mutual, accept, reject, unmatch) — API | ✅ |
| **2** | Discover & Swipe UI (client) | ✅ Fully wired to live API (with debounced search, role, skills, availability, and experience filters + "All Users" tab) |
| **2** | Notifications (match/application) | ✅ Real-time Socket.io events with detailed descriptions and dashboard indicators |
| **3** | Projects CRUD (create/list/get/update/delete/archive) | ✅ |
| **3** | Applications (apply/accept/reject/withdraw) | ✅ |
| **3** | Members (roles, permissions, transfer ownership) | ✅ |
| **3** | Bookmarks / Invitations / Roles routes | ✅ (API & frontend pages fully implemented/wired with dual-tab saved projects & builders) |
| **3** | Workspace: Kanban, chat, files, GitHub | 🟡 Chat fully done, others 🚧 |
| **3** | Socket.io real-time layer | ✅ (Fully connected in UI with live messaging and connection interceptors) |
| **4** | AI roadmaps / mentor / smart matching | 🚧 |
| **5** | Builder reputation / analytics / deployment | 🚧 |

**Backend implemented modules:** Auth, Profile, Discover, Match, Projects, Sockets
(Projects = Project + Application + Member + Bookmarks + Invitations).
**Client implemented features:** Landing, Auth (login + 7-step onboarding), Discover (swipe deck, filters, builder profile), Projects feed, Network (matches & pending requests), Messages (real-time chat via socket.io), Bookmarks feed. All pages are fully wired to the live API.

> Actual stack note: the client is **Vite + React**, not Next.js as written below.
> Per-endpoint API contracts live in `peerY/Contexts/Docs/`.

---

# Phase 1 — Foundation & Authentication
**Duration:** Week 1-2

## Goal
Set up the project architecture, authentication, database, and user profiles.

## Frontend
- Setup Next.js
- Tailwind CSS
- shadcn/ui
- Dark/Light Theme
- Responsive Layout
- Landing Page
- Authentication Pages
  - Login
  - Register
  - Forgot Password

## Backend
- Express Server
- MongoDB Connection
- JWT Authentication
- Refresh Tokens
- Email Verification
- Password Reset
- Role Management

## Database
Collections:
- Users
- Sessions

## User Profile
- Profile Picture
- Bio
- Skills
- Tech Stack
- Experience Level
- Weekly Availability
- Goals
- Social Links

## APIs
- Register
- Login
- Logout
- Refresh Token
- Update Profile
- Get Profile

## Deliverable
✅ Fully working authentication system
✅ User profile setup
✅ Landing page

---

# Phase 2 — Discovery & Matching Engine
**Duration:** Week 3-4

## Goal
Build the Tinder-like discovery experience.

## Features

### Discovery Feed
- User Cards
- Project Cards
- Filters
- Search
- Skill Matching

### Swipe System
- Swipe Left
- Swipe Right
- Like Animation
- Undo Swipe

### Matching Engine
- Mutual Like Detection
- Match Creation
- Match History

### Notifications
- New Match
- Like Received

### Backend
- Match Service
- Recommendation Algorithm
- Interest Scoring

## Database
Collections
- Swipes
- Matches

## APIs
- Get Feed
- Swipe
- Create Match
- Match History

## Deliverable
✅ Complete swipe system
✅ Match engine
✅ Notification system

---

# Phase 3 — Projects & Collaboration Workspace
**Duration:** Week 5-7

## Goal
Allow users to create projects and collaborate.

## Project Module

### Create Project
- Title
- Description
- Roles Needed
- Skills Required
- Time Commitment
- Tags

### Applications
- Apply
- Accept
- Reject

### Workspace

#### Dashboard
- Overview
- Team Members
- Progress

#### Kanban Board
- Todo
- In Progress
- Review
- Done

#### Chat
- Real-time Messages
- Typing Indicator
- Emoji
- Attachments

#### Files
- Upload
- Download
- Preview

#### GitHub
- Repository Link
- Commit Activity

## Backend
- Workspace Service
- Task Service
- Chat Service
- Socket.io

## Database
Collections
- Projects
- Workspaces
- Tasks
- Messages
- Files

## Deliverable
✅ End-to-end collaboration workspace
✅ Live chat
✅ Kanban board

---

# Phase 4 — AI Learning Ecosystem
**Duration:** Week 8-9

## Goal
Transform PeerX into an AI-powered learning platform.

## AI Roadmaps

- Learning Goal Input
- AI Skill Analysis
- Personalized Roadmap
- Weekly Milestones

## Build Tracks

Automatically generate:

- Tasks
- Deadlines
- Resources
- Checkpoints

## AI Mentor

Inside every workspace:

- Explain Code
- Debug Errors
- Suggest Improvements
- Generate Components
- Review Pull Requests

## Smart Matching

Match users based on

- Goals
- Skill Level
- Availability
- Interests

## Backend
- OpenAI Integration
- AI Service
- Prompt Engine

## Deliverable
✅ AI Mentor
✅ AI-generated learning roadmap
✅ Auto-generated project tracks

---

# Phase 5 — Builder Reputation & Production Launch
**Duration:** Week 10-12

## Goal
Complete the ecosystem with reputation, analytics, and deployment.

## Builder Profile

### Builder Score
Based on

- Reliability
- Communication
- Quality
- Problem Solving

### Contribution Graph
Track

- Tasks
- Commits
- Messages
- Daily Activity

### Skill Proof
Automatic skill verification

### Collaboration DNA
Radar chart showing

- Leadership
- Communication
- Reliability
- Quality

### Network Graph
Visualize collaborators

## Analytics

- Dashboard
- Project Stats
- Match Stats
- Learning Progress
- Productivity Metrics

## Notifications

- Push Notifications
- Email Notifications
- In-App Notifications

## Deployment

- Vercel
- AWS
- Cloudinary
- MongoDB Atlas

## Performance

- Caching
- Lazy Loading
- Image Optimization
- Pagination
- Security Hardening

## Testing

- Unit Tests
- Integration Tests
- End-to-End Tests

## Deliverable

✅ Production-ready PeerX
✅ Builder Reputation System
✅ Analytics Dashboard
✅ Fully deployed platform

---

# Final Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Zustand
- Framer Motion
- Socket.io Client

## Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Socket.io
- OpenAI API

## Storage
- Cloudinary
- AWS S3

## Deployment
- Vercel
- Railway / AWS

## Integrations
- GitHub API
- OpenAI
- Email Service
- Push Notifications

---

# Final Product Flow

Landing Page
↓
Authentication
↓
Onboarding
↓
Profile Setup
↓
Discovery Feed
↓
Swipe
↓
Match
↓
Chat
↓
Workspace
↓
Build Project
↓
AI Mentor
↓
Ship Project
↓
Builder Score
↓
Portfolio
↓
Networking
↓
Career Growth

---

# End Goal

A production-ready platform where developers can:

- Discover teammates
- Match intelligently
- Build real-world projects
- Learn with AI
- Collaborate in real time
- Showcase proof of work
- Build a trusted developer reputation