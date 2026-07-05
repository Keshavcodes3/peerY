# Bookmark API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> **Status:** ✅ **Implemented (backend API) — client UI pending.**
> Fully functional routes, models, repositories, and services are wired.
> The Project model automatically increments/decrements `bookMarksCount` on bookmark addition/removal.

---

# Purpose

Bookmarks let a user save projects to revisit them.

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `POST` | `/project/:projectId/bookmark` | ✅ | Bookmark a project |
| `DELETE` | `/project/:projectId/bookmark` | ✅ | Remove a bookmark |
| `GET` | `/bookmarks/me` | ✅ | List the authenticated user's bookmarks |

---

# Model — `Bookmark` collection

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `user` | `ObjectId` (ref `User`) | — | Owner of the bookmark (required, indexed) |
| `project` | `ObjectId` (ref `Project`) | — | Bookmarked project (required, indexed) |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- Unique compound: `{ user: 1, project: 1 }` — prevents duplicate bookmarks.

---

# Behaviour

- Creating a bookmark increments `project.bookMarksCount`.
- Removing a bookmark decrements `project.bookMarksCount` (never drops below 0).
- A user cannot bookmark the same project twice (enforced by the unique index).
- `GET /bookmarks/me` is paginated and populates basic project fields
  (title, banner, category, Stage, techStack).

---

# Related

- Projects: [project.md](./project.md) (`bookMarksCount` field)
- Invitations: [invitation.routes.ts](file:///d:/D%20drive/1/videos/movie/1.dev/Cohort%203.0/WEB%20DEV/cohort-3 codes/New%20folder/peerY/Server/Src/Modules/Projects/Routes/Invitation.routes.ts) (API implemented)

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only visible in development mode"
}
```
