# Discover API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Discover endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `GET` | `/discover/profile` | ✅ | Get recommended developer profiles for the authenticated user |

> **Status:** ✅ Implemented (backend). Profile discovery is live. Project discovery is planned.

---

# Discovery Model Overview

Discover is the recommendation engine that surfaces relevant developers to the
authenticated user. It does **not** own its own collection — it runs a MongoDB
aggregation over the **Profile** collection and consults the **Match** module to
exclude users you've already interacted with.

The result is a ranked list of builders you are most likely to want to team up with.

---

# 1. Discover Profiles

```
GET /api/v1/discover/profile
```

## Description

Returns a ranked list of recommended developer profiles for the authenticated
user, based on skill and tech-stack overlap.

The engine:

1. Loads the requester's own profile (skills, tech stack).
2. Excludes the requester and every user they have already interacted with
   (liked / matched) — resolved via the Match module.
3. Computes a `matchScore` for every remaining profile using MongoDB aggregation.
4. Keeps only profiles with `matchScore > 0`.
5. Sorts by `matchScore` (desc), then `totalProject` (desc).
6. Returns the **top 20** results.

---

## Match Scoring

| Signal | Points |
|--------|--------|
| Each common **skill** | `+3` |
| Each common **techstack** entry | `+2` |
| Profile **Rank** is `S` or `A` | `+1.5` (bonus) |

Only profiles with a resulting `matchScore` greater than `0` are returned.

---

## Authentication

Required ✅

---

## Query Parameters

None. Recommendations are derived entirely from the authenticated user's profile.

---

## Success Response — `200 OK`

```json
{
  "success": true,
  "message": "Recommended profiles fetched successfully",
  "data": {
    "profiles": [
      {
        "_id": "665fd6...",
        "authId": "665fd6...",
        "name": "keshav",
        "avatar": "https://cdn.example.com/avatar.png",
        "skills": ["react", "node.js"],
        "techstack": ["express", "mongodb"],
        "Bio": "Full Stack MERN & AI developer.",
        "experience": "intermediate",
        "Rank": "A",
        "matchScore": 11.5
      }
    ]
  }
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Recommendations returned (may be an empty list) |
| 401 | Missing or invalid token |
| 404 | Requester has no profile yet |

---

## Business Rules

- The requester **must have a profile** — discovery is powered by their own skills / tech stack.
- The requester is always excluded from their own feed.
- Users the requester has already liked or matched are excluded (via the Match module).
- Disabled accounts should not appear in recommendations.
- Results are capped at **20** profiles per request.
- Ordering: `matchScore` desc → `totalProject` desc.

---

# Recommendation Flow

```text
Requester Profile
      │
      ▼
Exclude self + already-interacted users
      │
      ▼
Aggregate over Profile collection
      │
      ▼
Compute matchScore (skills ×3, techstack ×2, Rank S/A +1.5)
      │
      ▼
Filter matchScore > 0
      │
      ▼
Sort by matchScore, totalProject
      │
      ▼
Return top 20
```

---

# Planned Enhancements

- Project discovery feed (`/discover/project`).
- Filters (role, availability, experience level, location).
- Pagination / infinite scroll.
- AI-based compatibility scoring beyond keyword overlap.

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Only visible in development mode"
}
```
