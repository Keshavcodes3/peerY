<div align="center">

# 🚀 peerY

### **Build Together. Learn Together. Grow Together.**

*A premium developer matching & collaboration platform where builders discover teammates, collaborate on real projects, and ship products together.*

---

<p align="center">
Built with ❤️ using React · TypeScript · Node.js · Express · MongoDB · Socket.io
</p>

</div>

---

# 👋 Welcome to peerY

peerY is the platform I wish existed when I started programming.

Not another social network.

Not another project board.

Not another AI wrapper.

A place where developers can actually **discover, connect, collaborate, and build together.**

---

# 🌍 What is peerY?

peerY is a full-stack developer ecosystem built to help developers at every stage of their journey.

Whether you're:

- 🌱 Looking for your first open-source project
- 🚀 Building a startup and need a co-founder
- 🤝 Searching for teammates with complementary skills
- 💼 Applying to collaborative projects to grow your portfolio
- 🏆 Shipping real products with a team

peerY helps you do it all from one platform.

---

# ✨ Features

## 🧭 Smart Discover Feed

Find developers who match your vibe, skills, and tech stack.

- AI-weighted match scoring (skills ×3, techstack ×2, Rank bonus)
- Smart exclusions — already liked/matched profiles are hidden automatically
- Multi-dimensional filters: Role, Tech Stack, Skills, Availability, Experience
- Real-time like → instant mutual match detection

---

## 🤝 Matching & Connection Requests

- Like a builder to send a connection request
- Mutual like → **instant match** (both users notified)
- Accept, reject, or unmatch at any time
- Real-time Socket.io notifications for match events

---

## 💬 Real-Time Persistent Messaging

- Messages saved to MongoDB before broadcast — no data loss on reconnect
- Socket.io with polling fallback (works behind firewalls/proxies)
- Full conversation history per match loaded on selection
- Duplicate-message protection on the client

---

## 📂 Projects & Team Organization

- **Project CRUD**: Create, Update, Archive, and Delete projects
- **Role-based Requirements**: Define custom roles with skills and openings
- **Auto-Owner Registration**: Creator auto-added as OWNER member
- **Application System**: Apply with cover letter, portfolio, GitHub, and resume links
- **Application Review Workspace**: Accept or reject applicants directly

---

## 🛠️ Collaborative Project Workspace

- **Kanban Board**: Task management (To Do → In Progress → Review → Done), priority tags, assignees
- **Member Management**: Promote/demote contributors, kick members, transfer ownership
- **Application Review**: Inspect cover letters, GitHub, resumes; accept or reject

---

## 📋 My Applications

- Track all submitted project applications in one place
- Filter by status: All / Pending / Accepted / Rejected / Withdrawn
- Withdraw pending applications with one click
- View full application details: cover letter, links, tech stack

---

## 🔔 Invitations

- Project owners can invite any builder directly
- Pending invitations shown in the **Network → Invitations** tab
- Accept to join the project's team immediately
- Decline with one click

---

## 🌐 Network

- **Matches tab**: All accepted mutual matches + Message & Unmatch actions
- **Requests tab**: Incoming pending connection requests with Accept/Decline
- **Invitations tab**: Project invitations to join as a team member

---

## 🔖 Bookmarks

- Save interesting projects for later
- Remove bookmarks with one click
- "View Project" navigates directly to the project workspace

---

## ⚙️ Profile Settings

- Edit bio, tech stack, skills, college, social handles
- Toggle availability status
- Account controls: disable or delete account securely

---

# 🏗 Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Redux Toolkit** (auth state)
- **Framer Motion** (animations)
- **React Router v7**
- **Axios** (with JWT interceptors)
- **Socket.io-client**
- **lucide-react** (icons)

### Backend
- **Node.js** + **Express 5**
- **TypeScript** (tsx runner)
- **MongoDB** + **Mongoose**
- **JWT** (bearer token auth)
- **Zod** (request validation)
- **Socket.io 4**
- **Helmet** + **express-rate-limit** (security)
- **bcryptjs** (password hashing)

---

# 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### Clone & Install

```bash
git clone https://github.com/Keshavcodes3/peerY.git

# Install Server deps
cd Server && npm install

# Install Client deps
cd ../Client && npm install
```

### Environment Setup

**Server/.env**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

**Client/.env**
```env
VITE_API_URL=http://localhost:3000
```

### Run in Development

```bash
# Terminal 1 — Server (hot reload via tsx)
cd Server && npm run dev

# Terminal 2 — Client (Vite HMR)
cd Client && npm run dev
```

App runs at: `http://localhost:5173`  
API runs at: `http://localhost:3000`

---

# 🛣 Roadmap

### ✅ Completed

- Auth (Register / Login / Logout / JWT session restore)
- Developer Profiles (CRUD)
- Discover Feed (skill/tech-stack match scoring, live API)
- Profile Filters (role, skills, tech stack, experience, availability)
- Swipe Matching (like / mutual-match / accept / reject / unmatch)
- Real-Time Chat (Socket.io, persistent message history)
- Projects CRUD (create, update, archive, delete)
- Project Applications (apply, review, accept, reject, withdraw)
- Team Members (roles, permissions, kick, ownership transfer)
- Project Workspace (Kanban board, member management, application review)
- Bookmarks (add, remove, view)
- Invitations (send, accept, reject, withdraw)
- My Applications page (full status tracking with withdraw)
- Network page (Matches + Requests + Invitations tabs)
- CORS hardening (preflight, dynamic origin, helmet config)
- Security (Helmet, rate limiting, httpOnly cookies)
- Production build passing (0 TS errors, 523 modules)

### 🚧 Planned

- AI Mentor chat
- AI-powered project discovery & recommendations
- Workspace real-time chat channels
- Activity feed & notification center
- AI Learning Roadmaps

---

# 🎯 Vision

I want peerY to become **the place where developers grow together.**

Where beginners find mentors.

Where solo developers find teammates.

Where ideas become products.

Where strangers become co-founders.

Because the next great startup might just begin with one developer saying:

> **"Want to build this together?"**

---

<div align="center">

### **Building the platform I wish existed when I started.**

**— Keshav**

</div>