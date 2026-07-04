# Match API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Match endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `POST` | `/match/like/:userId` | ✅ | Like a user — sends a request, or auto-matches if mutual |
| `PUT` | `/match/:matchId/accept` | ✅ | Accept a pending incoming request (recipient only) |
| `DELETE` | `/match/:matchId/reject` | ✅ | Reject a pending incoming request (recipient only) |
| `DELETE` | `/match/:matchId/unmatch` | ✅ | Unmatch from an accepted match (either party) |
| `GET` | `/match` | ✅ | Get all accepted, active matches |
| `GET` | `/match/pending` | ✅ | Get pending incoming match requests |

> **Status:** ✅ Implemented (backend).

---

# Match Model Overview

A Match represents a directional "like" between two users that becomes a mutual
connection once accepted. The first user to like becomes `userOne`; the target
becomes `userTwo`. Only `userTwo` (the recipient) can accept or reject a pending
request.

## Schema — `match` collection

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `userOne` | `ObjectId` (ref `user`) | — | Sender of the like (required) |
| `userTwo` | `ObjectId` (ref `user`) | — | Recipient of the like (required) |
| `matchedAt` | `Date` | `null` | Set when the match is accepted |
| `accepted` | `Boolean` | `false` | `true` once mutual / accepted |
| `status` | `enum` | `ACTIVE` | `ACTIVE` \| `BLOCKED` \| `ARCHIVE` \| `UNMATCHED` |
| `createdAt` | `Date` | auto | |
| `updatedAt` | `Date` | auto | |

**Indexes**

- Unique compound: `{ userOne: 1, userTwo: 1 }` — prevents duplicate likes.

---

# 1. Like a User

```
POST /api/v1/match/like/:userId
```

## Description

The authenticated user likes another user.

- If the target has **already liked** the requester, the existing request is
  **auto-accepted** and a mutual match is created (`accepted = true`,
  `matchedAt = now`). Both users are notified.
- Otherwise a new **pending** request is created (`accepted = false`) and the
  target receives a "new like" notification.

## Path Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `ObjectId` | ✅ | ID of the user to like |

## Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Match request sent",
  "data": {
    "match": {
      "_id": "665fd6...",
      "userOne": "665aaa...",
      "userTwo": "665bbb...",
      "accepted": false,
      "status": "ACTIVE",
      "matchedAt": null
    }
  }
}
```

On a mutual like, `accepted` is `true`, `matchedAt` is set, and the message
indicates a mutual match.

## Status Codes

| Code | Reason |
|------|--------|
| 201 | Request sent / mutual match created |
| 400 | Invalid `userId` / cannot like yourself |
| 401 | Not authenticated |
| 404 | Target user not found |
| 409 | You have already liked this user |

## Business Rules

- A user cannot like themselves.
- Duplicate likes are blocked by the unique `{ userOne, userTwo }` index.
- Mutual likes are auto-accepted — no explicit accept step needed.
- Notifications fired: `NEW_LIKE`, and `MUTUAL_MATCH` on auto-match.

---

# 2. Accept a Match Request

```
PUT /api/v1/match/:matchId/accept
```

## Description

The recipient (`userTwo`) accepts a pending incoming request. Sets
`accepted = true` and `matchedAt = now`.

## Path Parameters

| Param | Type | Required |
|-------|------|----------|
| `matchId` | `ObjectId` | ✅ |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Match accepted",
  "data": {
    "match": {
      "_id": "665fd6...",
      "accepted": true,
      "status": "ACTIVE",
      "matchedAt": "2026-07-01T12:00:00.000Z"
    }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Match accepted |
| 400 | Invalid `matchId` / already accepted |
| 401 | Not authenticated |
| 403 | Requester is not the recipient (`userTwo`) |
| 404 | Match not found |

## Business Rules

- Only `userTwo` can accept.
- Notification fired: `MATCH_ACCEPTED`.

---

# 3. Reject a Match Request

```
DELETE /api/v1/match/:matchId/reject
```

## Description

The recipient (`userTwo`) rejects a pending incoming request. The match record
is deleted.

## Path Parameters

| Param | Type | Required |
|-------|------|----------|
| `matchId` | `ObjectId` | ✅ |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Match request rejected"
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Request rejected |
| 400 | Invalid `matchId` |
| 401 | Not authenticated |
| 403 | Requester is not the recipient (`userTwo`) |
| 404 | Match not found |

## Business Rules

- Only `userTwo` can reject.
- The pending record is removed, allowing a fresh like later.

---

# 4. Unmatch

```
DELETE /api/v1/match/:matchId/unmatch
```

## Description

Either party ends an existing accepted match. Sets `status = UNMATCHED` and
`accepted = false`. The other party is notified.

## Path Parameters

| Param | Type | Required |
|-------|------|----------|
| `matchId` | `ObjectId` | ✅ |

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Unmatched successfully",
  "data": {
    "match": {
      "_id": "665fd6...",
      "status": "UNMATCHED",
      "accepted": false
    }
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Unmatched |
| 400 | Invalid `matchId` |
| 401 | Not authenticated |
| 403 | Requester is not part of this match |
| 404 | Match not found |

## Business Rules

- Either `userOne` or `userTwo` can unmatch.
- Notification fired: `UNMATCHED`.

---

# 5. Get Matches

```
GET /api/v1/match
```

## Description

Returns all matches where `accepted = true` and `status = ACTIVE` involving the
authenticated user. Both parties are populated with `username` and `email`.

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Matches fetched successfully",
  "data": {
    "matches": [
      {
        "_id": "665fd6...",
        "userOne": { "_id": "665aaa...", "username": "keshav", "email": "keshav@gmail.com" },
        "userTwo": { "_id": "665bbb...", "username": "alice", "email": "alice@dev.com" },
        "accepted": true,
        "status": "ACTIVE",
        "matchedAt": "2026-07-01T12:00:00.000Z"
      }
    ]
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Matches returned |
| 401 | Not authenticated |

---

# 6. Get Pending Requests

```
GET /api/v1/match/pending
```

## Description

Returns pending **incoming** requests — matches where the authenticated user is
`userTwo`, `accepted = false`, and `status = ACTIVE`.

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Pending requests fetched successfully",
  "data": {
    "requests": [
      {
        "_id": "665fd6...",
        "userOne": { "_id": "665aaa...", "username": "keshav", "email": "keshav@gmail.com" },
        "userTwo": "665bbb...",
        "accepted": false,
        "status": "ACTIVE"
      }
    ]
  }
}
```

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Pending requests returned |
| 401 | Not authenticated |

---

# Match Lifecycle

```text
        User A likes User B
                │
        ┌───────┴────────┐
        ▼                ▼
  B already liked A?   No → PENDING (accepted=false)
        │                        │
       Yes                       ▼
        │              B accepts │ B rejects
        ▼                ▼       ▼
   MUTUAL MATCH      ACCEPTED  (record deleted)
  (accepted=true)   (accepted=true)
        │                │
        └───────┬────────┘
                ▼
             ACTIVE
                │
                ▼
            UNMATCHED  (either party)
```

---

# Notifications

The Match module fires notifications via the notification middleware:

| Event | Trigger |
|-------|---------|
| `NEW_LIKE` | Someone likes you (pending) |
| `MUTUAL_MATCH` | A mutual like auto-creates a match |
| `MATCH_ACCEPTED` | Your pending request is accepted |
| `UNMATCHED` | The other party unmatches you |

> Notifications are currently fire-and-forget (persisted server-side).
> Real-time delivery over Socket.io is scaffolded but not yet wired.

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only visible in development mode"
}
```
