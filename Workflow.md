# PeerX 2.0 - Full Workflows & System Architecture
**Swipe. Match. Build. Ship.**

PeerX 2.0 is an end-to-end ecosystem designed for builders, developers, and creators to find teammates, learn through real-world projects, and build verifiable proof-of-work profiles. 

---

## 1. The Complete Loop (Core User Journey)
The platform is built on a continuous lifecycle of collaboration and growth:
**Onboard** -> **Discover** -> **Swipe** -> **Match** -> **Connect** -> **Build** -> **Ship** -> **Showcase** -> **Grow**

---

## 2. Detailed Workflows

### 2.1 Onboarding & Intent Capture
The onboarding flow is designed to seamlessly capture user goals to power the matching engine.
* **Primary Goal Selection:** Users choose their main objective: *Build a startup, Find teammates, Get hired, or Learn by building.*
* **Skill Tagging:** Users select their tech stack (e.g., React, Next.js, Node.js, TypeScript, Python, Tailwind, MongoDB).
* **Experience Level:** Self-assessment (Beginner, Intermediate, Advanced).
* **Availability:** Weekly time commitment (< 5 hrs, 5-10 hrs, 10-20 hrs, 20+ hrs).

### 2.2 Discovery & Match System
A Tinder-style swipe mechanism optimized for professional networking and project finding.
* **Card-Based Discovery:** Users swipe right (Like) or left (Pass) on profiles (People) and active initiatives (Projects).
* **Match Check Engine:** When mutual interest occurs (User A likes User B, and User B likes User A), the Match Engine triggers a `match:created` event.
* **Real-Time Notifications:** The WebSockets layer instantly pushes the match notification to both users, paving the way for immediate conversation.

### 2.3 Project & Workspace Collaboration
Projects have a defined lifecycle from idea to deployment.
* **Founder/Creator Flow:** A user posts an idea, defines required roles (e.g., Video Editor, Frontend Developer), sets time commitments, and publishes the project.
* **Application Process:** Interested builders request to join. The Founder reviews applicant profiles (analyzing their Builder Score and previous project completion rates) and clicks "Accept" or "Reject".
* **The Workspace:** Once accepted, the team enters a dedicated collaborative environment featuring:
    * **Tasks:** Kanban-style tracking (To Do, In Progress, Done).
    * **Chat:** Real-time messaging for the project team.
    * **Files:** Centralized storage for PRDs, designs, and schemas.
    * **Code Integration:** Direct GitHub repository links.
    * **AI Mentor:** A dedicated AI assistant integrated into the workspace to help debug code, optimize components, or explain concepts.

### 2.4 AI Learning & Building Ecosystem
An automated pathway that converts learning goals into tangible projects.
* **Goal Setting:** User defines what they want to learn (e.g., Full Stack Web Development) and their available time.
* **AI Roadmap Generation:** An LLM generates a personalized, multi-phase learning roadmap (Phase 1: Foundations, Phase 2: Frontend, etc.).
* **Track Conversion:** The roadmap is converted into an actionable "Build Track" with specific milestones.
* **Auto-Project Creation:** The system automatically spins up a real project based on the track and matches the user with peers pursuing similar goals.

---

## 3. The "Next-Level" Builder Profile
A dynamic, proof-based alternative to traditional resumes, reflecting real-world impact rather than just stated skills.
* **Builder Score:** A centralized metric (out of 100) aggregating:
    * *Reliability* (Deadlines met, commitment)
    * *Communication* (Responsiveness)
    * *Quality* (Peer reviews)
    * *Problem Solving*
* **Contribution Graph:** A GitHub-style heat map showing activity across tasks, commits, messages, and active days.
* **Skill Proof:** Progress bars indicating mastery based on *actual usage* in completed projects, not just self-attestation.
* **Collaboration DNA:** A radar chart mapping work style (Leadership, Reliability, Quality, Communication).
* **Network Visualization:** A node-based interactive graph showing the user's past collaborators and the strength of those connections.

---

## 4. Technical Architecture & System Design
The platform relies on a robust, decoupled full-stack architecture designed for real-time interactivity.

### Frontend (Web / Mobile)
* **Frameworks:** React, Next.js
* **Styling:** Tailwind CSS
* **State Management:** Zustand / Redux
* **Real-time:** Socket.io Client

### Backend Services (Microservices/Modules)
* **Runtime/Server:** Node.js, Express.js
* **Auth Service:** User authentication, role management.
* **User Service:** Profile data, stats calculation.
* **Matching Service:** The core algorithm handling swipes, mutual likes, and team matching.
* **Learning Service:** Interfaces with the AI to generate roadmaps and convert them to tasks.
* **Activity Service:** Tracks contributions, analytics, and handles the reputation system.

### Real-Time Layer
* **Tech:** Socket.io Server
* **Event Channels:** `workspace:message`, `task:update`, `user:joined`, `progress:update`, `notification:new`. Handles instant updates for chat, typing indicators, and matching.

### Database & External Services
* **Primary DB:** MongoDB (Collections: Users, Projects, Tasks, Workspaces, Activities, Messages).
* **AI Engine:** OpenAI API (Powers the Roadmap Generator and in-workspace AI Mentor).
* **File Storage:** Cloudinary / AWS S3 (Profile pictures, PRDs, design files).
* **Deployment:** Vercel, AWS.
* **Integrations:** GitHub API for tracking code commits and reflecting them on the contribution graph.
