# Project Member API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Member endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Who |
|--------|-------|------|-----|
| `GET` | `/project/:projectId/members` | ✅ | Anyone (public) / members (private) |
| `GET` | `/project/:projectId/members/:memberId` | ✅ | Anyone (public) / members (private) |
| `PATCH` | `/project/:projectId/members/:memberId/role` | ✅ | `ADMIN`+ |
| `DELETE` | `/project/:projectId/members/:memberId` | ✅ | `ADMIN`+ |
| `DELETE` | `/project/:projectId/members/leave` | ✅ | Any member (self) |
| `PATCH` | `/project/:projectId/transfer-owner` | ✅ | `OWNER` only |

> **Status:** ✅ Implemented (backend). A `Member` document is created automatically
> when a project owner accepts an application (see [application.md](./application.md)).

---

# Member Model Overview

A Member links a `User` to a `Project` with a role, a derived permission set, and
membership status. Roles follow a fixed hierarchy; permissions are auto-assigned
from the role on save.

## Schema — `Member` collection

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `project` | `ObjectId` (ref `Project`) | — | Required, indexed |
| `user` | `ObjectId` (ref `User`) | — | Required, indexed |
| `role` | `enum` | `MEMBER` | `OWNER` \| `ADMIN` \| `MAINTAINER` \| `MEMBER` \| `VIEWER` |
| `permissions` | `object` | derived | Auto-populated from role (see below) |
| `status` | `enum` | `ACTIVE` | `ACTIVE` \| `INACTIVE` \| `SUSPENDED` (indexed) |
| `joinedBy` | `enum` | — | `APPLICATION` \| `INVITATION` \| `OWNER` (required) |
| `joinedAt` | `Date` | `Date.now` | |
| `lastActive` | `Date` | — | Optional |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- Unique compound: `{ project: 1, user: 1 }` — one membership per user per project.
- `{ project: 1, role: 1 }` — role queries.

**Pre-save hook:** whenever a member is created or its `role` changes, the
`permissions` object is re-derived from the role's default permission set.

## Role Hierarchy & Default Permissions

| Role | Rank | Permissions |
|------|------|-------------|
| `OWNER` | 5 | All permissions |
| `ADMIN` | 4 | All except `canTransferOwnership` |
| `MAINTAINER` | 3 | `canEditProject`, `canManageTasks`, `canManageRepository` |
| `MEMBER` | 2 | `canManageTasks` |
| `VIEWER` | 1 | None |

Permission flags: `canInviteMembers`, `canRemoveMembers`, `canEditProject`,
`canManageApplications`, `canTransferOwnership`, `canManageTasks`,
`canManageRepository`.

---

# 1. List Project Members

```
GET /api/v1/project/:projectId/members
```

## Description

Returns a paginated list of members for a project. Public projects are readable
by anyone authenticated; private / member-only projects require the requester to
be a member.

## Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |
| `role` | `string` | — | Filter by role |
| `search` | `string` | — | Search members (max 100 chars) |
| `sort` | `string` | `joinedAt` | `joinedAt` \| `role` \| `lastActive` |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Members fetched successfully",
  "data": {
    "members": [
      {
        "_id": "64f1a2...",
        "user": { "_id": "64d3c4...", "name": "Alice Dev", "email": "alice@dev.com" },
        "role": "MEMBER",
        "status": "ACTIVE",
        "joinedBy": "APPLICATION",
        "joinedAt": "2026-06-30T18:00:00.000Z"
      }
    ],
    "pagination": { "total": 3, "page": 1, "limit": 10, "totalPages": 1 }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Members returned |
| 400 | Invalid `projectId` |
| 401 | Not authenticated |
| 403 | Private project and requester is not a member |
| 404 | Project not found |

---

# 2. Get Member by ID

```
GET /api/v1/project/:projectId/members/:memberId
```

## Description

Returns a single member's details. Same visibility rules as the list endpoint.

## Path Parameters

| Param | Type | Required |
|-------|------|----------|
| `projectId` | `ObjectId` | ✅ |
| `memberId` | `ObjectId` | ✅ |

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Member returned |
| 400 | Invalid IDs |
| 401 | Not authenticated |
| 403 | Private project and requester is not a member |
| 404 | Project or member not found |

---

# 3. Update Member Role

```
PATCH /api/v1/project/:projectId/members/:memberId/role
```

## Description

Changes a member's role. Requires `ADMIN` or higher. Permissions are re-derived
automatically from the new role.

## Request Body

```json
{
  "role": "MAINTAINER"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `role` | `enum` | One of `ADMIN` \| `MAINTAINER` \| `MEMBER` \| `VIEWER` (cannot set `OWNER`) |

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Role updated |
| 400 | Invalid IDs / role |
| 401 | Not authenticated |
| 403 | Requester below `ADMIN`, or target promotion ≥ requester's role |
| 404 | Project or member not found |

## Business Rules

- Requester must be `ADMIN`+.
- Cannot assign `OWNER` via this endpoint (use transfer-owner).
- Cannot demote the `OWNER`.
- Cannot promote a member to a role greater than or equal to your own.

---

# 4. Remove Member

```
DELETE /api/v1/project/:projectId/members/:memberId
```

## Description

Removes a member from the project. Requires `ADMIN`+. Decrements the project's
`membersCount` and notifies the removed member.

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Member removed |
| 400 | Invalid IDs |
| 401 | Not authenticated |
| 403 | Requester below `ADMIN`, or attempting to remove `OWNER`/self |
| 404 | Project or member not found |

## Business Rules

- Requester must be `ADMIN`+.
- Cannot remove the `OWNER`.
- Cannot remove yourself (use **Leave Project** instead).
- Decrements `project.membersCount`.

---

# 5. Leave Project

```
DELETE /api/v1/project/:projectId/members/leave
```

## Description

The authenticated member voluntarily leaves the project. Decrements
`membersCount` and notifies the owner.

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Left project |
| 400 | Invalid `projectId` |
| 401 | Not authenticated |
| 403 | `OWNER` must transfer ownership before leaving |
| 404 | Project or membership not found |

## Business Rules

- The `OWNER` cannot leave without first transferring ownership.
- Decrements `project.membersCount`.

---

# 6. Transfer Ownership

```
PATCH /api/v1/project/:projectId/transfer-owner
```

## Description

Transfers project ownership to another **active** member. `OWNER` only. Runs
inside a **MongoDB transaction**:

1. Current owner is demoted to `ADMIN`.
2. New owner is promoted to `OWNER`.
3. `project.owner` is updated.

If any step fails, the whole transaction is rolled back.

## Request Body

```json
{
  "newOwnerId": "64d3c4d5e6f7a8b9c0d1e2f3"
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Ownership transferred |
| 400 | Invalid IDs |
| 401 | Not authenticated |
| 403 | Requester is not the `OWNER` |
| 404 | Project or target member not found |
| 500 | Transaction failed and was rolled back |

## Business Rules

- Only the current `OWNER` can transfer.
- The new owner must be an existing **active** member of the project.
- Atomic: demotion + promotion + project update happen together.

---

# Member Role Hierarchy

```text
OWNER (5)
   │  can transfer ownership, full control
   ▼
ADMIN (4)
   │  manage members, applications, edit project
   ▼
MAINTAINER (3)
   │  edit project, manage tasks & repository
   ▼
MEMBER (2)
   │  manage tasks
   ▼
VIEWER (1)
      read-only
```

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only visible in development mode"
}
```
