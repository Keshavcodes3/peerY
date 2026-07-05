# Project API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Project endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `POST` | `/project/create` | ✅ | Create a new project (requester becomes owner) |
| `GET` | `/project/myProjects` | ✅ | List projects owned by the authenticated user |
| `GET` | `/project` | ✅ | List projects (paginated, filterable) |
| `GET` | `/project/:projectId` | ✅ | Get a single project by ID |
| `PUT` | `/project/:projectId` | ✅ | Update a project (owner only) |
| `DELETE` | `/project/:projectId` | ✅ | Delete a project (owner only; cascade deletes applications, members, bookmarks) |
| `PATCH` | `/project/:projectId/archive` | ✅ | Archive a project (owner only) |

> **Status:** ✅ Implemented (backend API). Client UI integration pending.
> Related modules: [applications](./application.md), [members](./member.md), [bookmarks](./bookmark.md), [invitations](./invitation.md).

---

# Project Model Overview

A Project is the central collaboration unit on PeerY. It holds metadata, the
roles/requirements a team is hiring for, and rolling counters for members,
applications, bookmarks, and views.

## Schema — `Project` collection

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `owner` | `ObjectId` (ref `User`) | — | Creator/owner (required, indexed) |
| `title` | `String` | — | Required, lowercase, max 50 |
| `description` | `String` | — | Required, lowercase, max 500 |
| `banner` | `String` | — | Banner image URL |
| `Stage` | `enum` | — | `IDEA` \| `ACTIVE` \| `PAUSED` \| `COMPLETED` \| `ARCHIEVED` (required) |
| `category` | `String` | — | Required, indexed |
| `techStack` | `String[]` | — | Required, indexed, each max 20 chars |
| `visibility` | `enum` | `PUBLIC` | `PUBLIC` \| `PRIVATE` \| `MEMBER ONLY` |
| `commitment` | `String` | — | Expected time commitment |
| `Requiremnts` | `Requirement[]` | `[]` | Open roles the team is hiring for |
| `membersCount` | `Number` | `1` | Incremented as members join |
| `applicationCount` | `Number` | `0` | Incremented per application |
| `bookMarksCount` | `Number` | `0` | Incremented per bookmark |
| `views` | `Number` | `0` | View counter |
| `isArchived` | `Boolean` | `false` | Indexed |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

### Requirement sub-document

| Field | Type | Rules |
|-------|------|-------|
| `title` | `String` | Required, max 60 |
| `description` | `String` | Required, max 500 |
| `role` | `String` | Required, 8–20 chars |
| `skills` | `String[]` | Lowercase, trimmed |
| `openings` | `Number` | Required, min 1, default 1 |

**Indexes**

- `{ Stage: 1, category: 1, createdAt: -1 }` — feed/filter queries.
- Text index: `{ title: "text", description: "text" }` — search.
- `{ owner: 1, createdAt: -1 }` — owner's projects.

---

# 1. Create Project

```
POST /api/v1/project/create
```

## Description

Creates a new project owned by the authenticated user. `owner` is derived from
the JWT — never from the request body.

## Request Body

```json
{
  "title": "devspark",
  "description": "A real-time collaboration platform for student builders.",
  "banner": "https://cdn.example.com/banner.png",
  "Stage": "IDEA",
  "category": "web",
  "techStack": ["React", "Node.js", "MongoDB"],
  "visibility": "PUBLIC",
  "commitment": "10-20 hrs / week",
  "Requiremnts": [
    {
      "title": "Frontend Developer",
      "description": "Build the discovery UI with React + Tailwind.",
      "role": "frontend developer",
      "skills": ["react", "tailwind"],
      "openings": 2
    }
  ]
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `title` | ✅ | Max 50 chars |
| `description` | ✅ | Max 500 chars |
| `Stage` | ✅ | One of the Stage enum values |
| `category` | ✅ | Free text |
| `techStack` | ✅ | Array of strings (each max 20) |
| `visibility` | ❌ | Defaults to `PUBLIC` |
| `banner`, `commitment` | ❌ | Optional |
| `Requiremnts` | ❌ | Array of role requirements |

## Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "_id": "64e2b3...",
      "owner": "64d3c4...",
      "title": "devspark",
      "Stage": "IDEA",
      "visibility": "PUBLIC",
      "membersCount": 1,
      "applicationCount": 0
    }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 201 | Project created |
| 400 | Validation failed |
| 401 | Not authenticated |

## Business Rules

- Owner is always the authenticated user.
- Creator is counted as the first member (`membersCount` starts at 1).
- On acceptance of applications, a corresponding `Member` document is created (see [member.md](./member.md)).

---

# 2. Get My Projects

```
GET /api/v1/project/myProjects
```

## Description

Returns all projects owned by the authenticated user.

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Your projects fetched successfully",
  "data": {
    "projects": [
      {
        "_id": "64e2b3...",
        "title": "devspark",
        "Stage": "ACTIVE",
        "category": "web",
        "membersCount": 3,
        "applicationCount": 12
      }
    ]
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Projects returned |
| 401 | Not authenticated |

---

# 3. List Projects

```
GET /api/v1/project
```

## Description

Returns a paginated list of projects. Supports filtering and sorting for the
discovery feed.

## Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |
| `category` | `string` | — | Filter by category |
| `stage` | `string` | — | Filter by Stage enum |
| `techstack` | `string` | — | Filter by tech stack |
| `visibility` | `string` | — | Filter by visibility |
| `sort` | `string` | — | Sort order |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": {
    "projects": [ { "_id": "64e2b3...", "title": "devspark", "Stage": "ACTIVE" } ],
    "pagination": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Projects returned |
| 401 | Not authenticated |

---

# 4. Get Project by ID

```
GET /api/v1/project/:projectId
```

## Description

Returns full details for a single project.

## Path Parameters

| Param | Type | Required |
|-------|------|----------|
| `projectId` | `ObjectId` | ✅ |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Project fetched successfully",
  "data": {
    "project": {
      "_id": "64e2b3...",
      "owner": "64d3c4...",
      "title": "devspark",
      "description": "A real-time collaboration platform...",
      "Stage": "ACTIVE",
      "category": "web",
      "techStack": ["React", "Node.js"],
      "visibility": "PUBLIC",
      "Requiremnts": [ { "role": "frontend developer", "openings": 2 } ],
      "membersCount": 3,
      "applicationCount": 12,
      "bookMarksCount": 5,
      "views": 120
    }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Project returned |
| 400 | Invalid `projectId` |
| 401 | Not authenticated |
| 404 | Project not found |

---

# Project Stage Lifecycle

```text
   IDEA ──▶ ACTIVE ──▶ PAUSED ──▶ ACTIVE ──▶ COMPLETED
                                                 │
                                                 ▼
                                             ARCHIEVED
```

> Note: the stage value is stored verbatim as `ARCHIEVED` in the schema enum.

---

# Planned Enhancements

- Increment `views` on fetch.
- Client-side UI pages and settings panel for CRUD, Bookmarks, and Invitations.
- Real-time notification updates over Sockets on application and membership actions.

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only visible in development mode"
}
```
