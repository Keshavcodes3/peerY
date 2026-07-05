# Project Invitation API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Invitation endpoints require a valid JWT.
> Pass it via **Cookie** `token=<jwt>` or **Header** `Authorization: Bearer <jwt>`

---

## Routes Overview

| Method | Route | Auth | Who |
|--------|-------|------|-----|
| `POST` | `/project/:projectId/invite` | ✅ | Inviter (must have `canInviteMembers` permission) |
| `GET` | `/project/:projectId/invitations` | ✅ | Admin / Owner |
| `GET` | `/invitations/me` | ✅ | Invited User (recipient) |
| `PATCH` | `/invitations/:invitationId/accept` | ✅ | Recipient only |
| `PATCH` | `/invitations/:invitationId/reject` | ✅ | Recipient only |
| `PATCH` | `/invitations/:invitationId/withdraw` | ✅ | Inviter or Admin/Owner |

---

## 1. Send an Invitation

```
POST /api/v1/project/:projectId/invite
```

**Description**
Sends an invitation to a user to join a project.
Verifies that:
*   The project exists.
*   The inviter is a member of the project and has the `canInviteMembers` permission.
*   The recipient is not already a member.
*   There is no existing pending invitation for the recipient to this project.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | `ObjectId` | ✅ | ID of the project to invite the user to |

**Request Body**

```json
{
  "invitedUser": "64d3c4d5e6f7a8b9c0d1e2f3",
  "role": "MEMBER",
  "message": "Hey! We'd love to have you help us build the frontend of our project."
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `invitedUser` | `string` | ✅ | Valid MongoDB User ID |
| `role` | `enum` | ❌ | `ADMIN` \| `MAINTAINER` \| `MEMBER` \| `VIEWER` (default `MEMBER`) |
| `message` | `string` | ❌ | Max 500 characters |

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "invitation": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "projectId": "64e2b3c4d5e6f7a8b9c0d1e2",
      "invitedBy": "64c4d5e6f7a8b9c0d1e2f3a4",
      "invitedUser": "64d3c4d5e6f7a8b9c0d1e2f3",
      "role": "MEMBER",
      "status": "PENDING",
      "message": "Hey! We'd love to...",
      "createdAt": "2026-07-04T12:00:00.000Z",
      "updatedAt": "2026-07-04T12:00:00.000Z"
    }
  }
}
```

---

## 2. Get Project Invitations

```
GET /api/v1/project/:projectId/invitations
```

**Description**
Lists all invitations sent for a specific project. Requires the requester to have the `canInviteMembers` permission.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `projectId` | `ObjectId` | ✅ |

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |
| `status` | `string` | — | Filter by status (`PENDING` \| `ACCEPTED` \| `REJECTED` \| `WITHDRAWNED`) |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Project invitations fetched successfully",
  "data": {
    "invitations": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "invitedUser": {
          "_id": "64d3c4d5e6f7a8b9c0d1e2f3",
          "username": "alice",
          "email": "alice@dev.com"
        },
        "invitedBy": {
          "_id": "64c4d5e6f7a8b9c0d1e2f3a4",
          "username": "bob",
          "email": "bob@example.com"
        },
        "status": "PENDING",
        "role": "MEMBER",
        "createdAt": "2026-07-04T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 3. Get My Pending Invitations

```
GET /api/v1/invitations/me
```

**Description**
Returns a paginated list of pending invitations received by the currently logged-in user.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "My invitations fetched successfully",
  "data": {
    "invitations": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "projectId": {
          "_id": "64e2b3c4d5e6f7a8b9c0d1e2",
          "title": "devspark",
          "banner": "https://cdn.example.com/banner.png",
          "category": "web",
          "Stage": "ACTIVE",
          "techStack": ["React", "Node.js"]
        },
        "invitedBy": {
          "_id": "64c4d5e6f7a8b9c0d1e2f3a4",
          "username": "bob",
          "email": "bob@example.com"
        },
        "role": "MEMBER",
        "status": "PENDING",
        "createdAt": "2026-07-04T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 4. Accept Invitation

```
PATCH /api/v1/invitations/:invitationId/accept
```

**Description**
The invited recipient accepts the pending invitation.
1. Creates a new project `Member` document with role and default permissions matching the invitation's specified role.
2. Increments `project.membersCount`.
3. Sets status to `ACCEPTED`.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `invitationId` | `ObjectId` | ✅ |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Invitation accepted successfully",
  "data": {
    "invitation": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "ACCEPTED"
    }
  }
}
```

---

## 5. Reject Invitation

```
PATCH /api/v1/invitations/:invitationId/reject
```

**Description**
The invited recipient rejects the pending invitation, marking the status as `REJECTED`.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `invitationId` | `ObjectId` | ✅ |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Invitation rejected successfully",
  "data": {
    "invitation": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "REJECTED"
    }
  }
}
```

---

## 6. Withdraw Invitation

```
PATCH /api/v1/invitations/:invitationId/withdraw
```

**Description**
Withdraws a pending invitation. Can be performed by the user who sent it, or any workspace owner/admin with the `canInviteMembers` permission. Marks status as `WITHDRAWNED`.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `invitationId` | `ObjectId` | ✅ |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Invitation withdrawn successfully",
  "data": {
    "invitation": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "WITHDRAWNED"
    }
  }
}
```
