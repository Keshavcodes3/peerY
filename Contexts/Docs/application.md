# Application API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All endpoints require a valid JWT.
> Pass it via **Cookie** `token=<jwt>` or **Header** `Authorization: Bearer <jwt>`

---

## Routes Overview

| Method | Route | Auth | Who |
|--------|-------|------|-----|
| `POST` | `/project/:projectId/apply` | ✅ | Any authenticated user |
| `GET` | `/applications/me` | ✅ | Applicant (self) |
| `GET` | `/project/:projectId/applications` | ✅ | Project owner only |
| `GET` | `/applications/:applicationId` | ✅ | Applicant or project owner |
| `PATCH` | `/applications/:applicationId/accept` | ✅ | Project owner only |
| `PATCH` | `/applications/:applicationId/reject` | ✅ | Project owner only |
| `PATCH` | `/applications/:applicationId/withdraw` | ✅ | Applicant only |

---

## 1. Apply to a Project

```
POST /api/v1/project/:projectId/apply
```

**Description**
Authenticated user submits an application to join a project. The system verifies the project exists, is not archived, the user is not the project owner, and they have not already applied. On success, the project's `applicationCount` is incremented and the project owner receives a notification.

**Path Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `projectId` | `ObjectId` | ✅ | ID of the project to apply to |

**Request Body**

```json
{
  "coverLetter": "I would love to contribute to this project because...",
  "github": "https://github.com/username",
  "portfolio": "https://myportfolio.dev",
  "resume": "https://cdn.example.com/resume.pdf"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `coverLetter` | `string` | ❌ | Max 1000 chars |
| `github` | `string` | ❌ | Must be a valid URL |
| `portfolio` | `string` | ❌ | Must be a valid URL |
| `resume` | `string` | ❌ | Must be a valid URL |

**Success Response — `201 Created`**

```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "project": "64e2b3c4d5e6f7a8b9c0d1e2",
      "applicant": "64d3c4d5e6f7a8b9c0d1e2f3",
      "owner": "64c4d5e6f7a8b9c0d1e2f3a4",
      "status": "PENDING",
      "coverLetter": "I would love to contribute...",
      "github": "https://github.com/username",
      "appliedAt": "2026-06-30T18:00:00.000Z",
      "createdAt": "2026-06-30T18:00:00.000Z"
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `201` | Application created successfully |
| `400` | Invalid `projectId` / project is archived |
| `401` | No token or invalid token |
| `403` | Applicant is the project owner |
| `404` | Project not found |
| `409` | You have already applied to this project |

---

## 2. Get My Applications

```
GET /api/v1/applications/me
```

**Description**
Returns a paginated list of all applications submitted by the currently authenticated user. Each application includes populated project and owner details. Results are sorted newest first.

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Applications fetched successfully",
  "data": {
    "applications": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "project": {
          "_id": "64e2b3c4d5e6f7a8b9c0d1e2",
          "title": "devspark",
          "banner": "https://cdn.example.com/banner.png",
          "category": "web",
          "Stage": "ACTIVE",
          "techStack": ["React", "Node.js"]
        },
        "owner": {
          "_id": "64c4d5e6f7a8b9c0d1e2f3a4",
          "name": "Bob Smith",
          "email": "bob@example.com"
        },
        "status": "PENDING",
        "appliedAt": "2026-06-30T18:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Applications returned |
| `401` | Not authenticated |

---

## 3. Get Project Applications

```
GET /api/v1/project/:projectId/applications
```

**Description**
Returns all applications received by a specific project. Only the **project owner** can access this endpoint. Supports pagination and filtering by status. Each application includes the applicant's name and email.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `projectId` | `ObjectId` | ✅ |

**Query Parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page |
| `status` | `string` | — | Filter: `PENDING` \| `ACCEPTED` \| `REJECTED` \| `WITHDRAWN` |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Project applications fetched successfully",
  "data": {
    "applications": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "applicant": {
          "_id": "64d3c4d5e6f7a8b9c0d1e2f3",
          "name": "Alice Dev",
          "email": "alice@dev.com"
        },
        "status": "PENDING",
        "coverLetter": "I have 3 years of experience in...",
        "github": "https://github.com/alicedev",
        "portfolio": "https://alicedev.io",
        "appliedAt": "2026-06-30T18:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Applications returned |
| `400` | Invalid `projectId` |
| `401` | Not authenticated |
| `403` | Requester is not the project owner |
| `404` | Project not found |

---

## 4. Get Single Application

```
GET /api/v1/applications/:applicationId
```

**Description**
Returns full details for a single application. Accessible by the **applicant** who submitted it **or** the **project owner**. Returns all fields including status, timeline, and any rejection reason.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `applicationId` | `ObjectId` | ✅ |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Application fetched successfully",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "project": "64e2b3c4d5e6f7a8b9c0d1e2",
      "applicant": "64d3c4d5e6f7a8b9c0d1e2f3",
      "owner": "64c4d5e6f7a8b9c0d1e2f3a4",
      "status": "PENDING",
      "coverLetter": "I would love to contribute...",
      "github": "https://github.com/username",
      "portfolio": "https://myportfolio.dev",
      "resume": "https://cdn.example.com/resume.pdf",
      "rejectionReason": null,
      "appliedAt": "2026-06-30T18:00:00.000Z",
      "acceptedAt": null,
      "rejectedAt": null,
      "withdrawnAt": null,
      "createdAt": "2026-06-30T18:00:00.000Z",
      "updatedAt": "2026-06-30T18:00:00.000Z"
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Application returned |
| `400` | Invalid `applicationId` |
| `401` | Not authenticated |
| `403` | Requester is neither the applicant nor the owner |
| `404` | Application not found |

---

## 5. Accept Application

```
PATCH /api/v1/applications/:applicationId/accept
```

**Description**
Project owner accepts a pending application. This runs inside a **MongoDB transaction**:
1. Application status is updated to `ACCEPTED`
2. A new `ProjectMember` document is created with role `MEMBER`
3. The project's `membersCount` is incremented

If any step fails, the entire transaction is rolled back. No request body is required. The applicant receives a notification on success.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `applicationId` | `ObjectId` | ✅ |

**Request Body** — None required.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Application accepted. Member added to project.",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "ACCEPTED",
      "acceptedAt": "2026-06-30T19:00:00.000Z"
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Application accepted, member created |
| `400` | Invalid `applicationId` / application is not `PENDING` |
| `401` | Not authenticated |
| `403` | Requester is not the project owner |
| `404` | Application not found |
| `409` | Applicant is already a member of the project |
| `500` | Transaction failed and was rolled back |

---

## 6. Reject Application

```
PATCH /api/v1/applications/:applicationId/reject
```

**Description**
Project owner rejects a pending application and stores a reason for the rejection. Cannot reject an application that is already `ACCEPTED` or `REJECTED`. The applicant receives a notification.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `applicationId` | `ObjectId` | ✅ |

**Request Body**

```json
{
  "rejectionReason": "We are looking for someone with more experience in Rust."
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `rejectionReason` | `string` | ✅ | 10–500 characters |

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Application rejected successfully",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "REJECTED",
      "rejectionReason": "We are looking for someone with more experience in Rust.",
      "rejectedAt": "2026-06-30T19:30:00.000Z"
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Application rejected |
| `400` | Invalid `applicationId` / already `ACCEPTED` / already `REJECTED` / reason too short |
| `401` | Not authenticated |
| `403` | Requester is not the project owner |
| `404` | Application not found |

---

## 7. Withdraw Application

```
PATCH /api/v1/applications/:applicationId/withdraw
```

**Description**
Applicant voluntarily withdraws their own application. Cannot withdraw an application that is already `ACCEPTED`, `REJECTED`, or `WITHDRAWN`. No request body required. The project owner receives a notification.

**Path Parameters**

| Param | Type | Required |
|-------|------|----------|
| `applicationId` | `ObjectId` | ✅ |

**Request Body** — None required.

**Success Response — `200 OK`**

```json
{
  "success": true,
  "message": "Application withdrawn successfully",
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "WITHDRAWN",
      "withdrawnAt": "2026-06-30T20:00:00.000Z"
    }
  }
}
```

**Status Codes**

| Code | Reason |
|------|--------|
| `200` | Application withdrawn |
| `400` | Invalid ID / already `ACCEPTED` / already `REJECTED` / already `WITHDRAWN` |
| `401` | Not authenticated |
| `403` | Requester is not the applicant |
| `404` | Application not found |

---

## Application Status Lifecycle

```
                  ┌─────────┐
                  │ PENDING │
                  └────┬────┘
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌───────────┐
    │ ACCEPTED │  │ REJECTED │  │ WITHDRAWN │
    └──────────┘  └──────────┘  └───────────┘
    (terminal)    (terminal)    (terminal)
```

> Once in a terminal state the status cannot be changed.

---

## Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "...only visible in development mode..."
}
```
