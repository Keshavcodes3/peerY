# Profile API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All Profile endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `POST` | `/profile` | ✅ | Create profile |
| `GET` | `/profile/me` | ✅ | Get authenticated user's profile |
| `PUT` | `/profile` | ✅ | Update profile |
| `DELETE` | `/profile` | ✅ | Delete profile |

---

# Profile Lifecycle

```text
Register
    │
    ▼
Create Profile
    │
    ▼
Update Profile
    │
    ▼
Developer Discovery
    │
    ▼
Delete Profile (Optional)
```

---

# Profile Model Overview

A Profile represents the public identity of a developer on PeerY.

It contains:

- Personal Information
- Professional Information
- Skills
- Social Links
- Experience
- Availability
- Bio
- Tech Stack
- Portfolio Links
- Developer Preferences

Profiles are used throughout PeerY for:

- Discover
- Matching
- Team Invitations
- Project Applications
- Networking

---

# 1. Create Profile

```
POST /api/v1/profile
```

## Description

Creates a profile for the authenticated user.

A user can only own **one profile**.

---

## Authentication

Required ✅

---

## Request Body

```json
{
  "displayName": "Keshav",
  "headline": "Full Stack Developer",
  "bio": "Passionate MERN & AI developer.",
  "location": "India",
  "experienceLevel": "INTERMEDIATE",
  "skills": [
    "React",
    "Node.js",
    "TypeScript",
    "MongoDB"
  ],
  "techStack": [
    "Express",
    "Redux",
    "Tailwind"
  ],
  "github": "https://github.com/Keshavcodes3",
  "portfolio": "https://portfolio.dev",
  "linkedin": "https://linkedin.com/in/keshav"
}
```

---

## Request Fields

| Field | Type | Required | Description |
|---------|------|----------|-------------|
| displayName | string | ✅ | Public name |
| headline | string | ✅ | Professional title |
| bio | string | ❌ | About section |
| location | string | ❌ | Current location |
| experienceLevel | enum | ✅ | Beginner / Intermediate / Advanced |
| skills | string[] | ❌ | Primary skills |
| techStack | string[] | ❌ | Technologies |
| github | string | ❌ | GitHub profile |
| portfolio | string | ❌ | Portfolio website |
| linkedin | string | ❌ | LinkedIn profile |

---

## Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Profile created successfully",
  "data": {
    "profile": {
      "_id": "66...",
      "user": "66...",
      "displayName": "Keshav",
      "headline": "Full Stack Developer",
      "experienceLevel": "INTERMEDIATE",
      "skills": [
        "React",
        "Node.js"
      ]
    }
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 201 | Profile created |
| 400 | Validation failed |
| 401 | Unauthorized |
| 409 | Profile already exists |

---

## Business Rules

- One profile per user.
- Profile is linked to authenticated user.
- Invalid URLs are rejected.
- Arrays are sanitized.
- Empty values are ignored.

---

# 2. Get My Profile

```
GET /api/v1/profile/me
```

## Description

Returns the authenticated user's complete profile.

---

## Authentication

Required ✅

---

## Success Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "profile": {
      "_id": "66...",
      "displayName": "Keshav",
      "headline": "Full Stack Developer",
      "bio": "Building AI products.",
      "skills": [
        "React",
        "Node"
      ],
      "techStack": [
        "MongoDB",
        "Express"
      ]
    }
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Profile returned |
| 401 | Unauthorized |
| 404 | Profile not found |

---

## Business Rules

- Returns only authenticated user's profile.
- Includes all editable fields.
- Sensitive user data is never exposed.

---

# 3. Update Profile

```
PUT /api/v1/profile
```

## Description

Updates the authenticated user's profile.

Supports partial updates.

Only supplied fields are modified.

---

## Authentication

Required ✅

---

## Example Request

```json
{
  "headline": "Senior MERN Developer",
  "bio": "Building scalable AI products.",
  "skills": [
    "Node.js",
    "React",
    "Redis",
    "Docker"
  ]
}
```

---

## Success Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "_id": "66...",
      "headline": "Senior MERN Developer"
    }
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Profile updated |
| 400 | Validation failed |
| 401 | Unauthorized |
| 404 | Profile not found |

---

## Business Rules

- Partial updates supported.
- Existing values remain unchanged if omitted.
- Arrays replace previous arrays.
- Invalid URLs are rejected.

---

# 4. Delete Profile

```
DELETE /api/v1/profile
```

## Description

Deletes the authenticated user's profile.

Only the profile is removed.

The user account remains active.

---

## Authentication

Required ✅

---

## Request Body

None

---

## Success Response

```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Profile deleted |
| 401 | Unauthorized |
| 404 | Profile not found |

---

## Business Rules

- Only owner can delete profile.
- User account remains intact.
- Discover page will no longer show this user.
- Applications and projects remain linked to account.

---

# Profile Visibility

Profiles are used in:

- Discover Page
- Builder Search
- AI Matching
- Invitations
- Project Members
- Applications
- Team Recommendations

Deleting a profile removes the user from these discovery features.

---

# Authentication Matrix

| Endpoint | JWT Required |
|------------|--------------|
| POST /profile | ✅ |
| GET /profile/me | ✅ |
| PUT /profile | ✅ |
| DELETE /profile | ✅ |

---

# Error Response Format

```json
{
  "success": false,
  "error": "Human-readable error message",
  "stack": "Visible only in development"
}
```

---

# Security Notes

- Profile ownership is always derived from the authenticated JWT.
- User IDs cannot be spoofed.
- Invalid URLs are rejected.
- HTML/script injection should be sanitized.
- Arrays should be validated before persistence.

---

# Profile State Diagram

```text
           REGISTER
               │
               ▼
      PROFILE NOT CREATED
               │
               ▼
        CREATE PROFILE
               │
               ▼
       PROFILE ACTIVE
         │         │
         ▼         ▼
   UPDATE PROFILE  DELETE PROFILE
         │         │
         ▼         ▼
   PROFILE ACTIVE  PROFILE REMOVED
```

---

# Integration Notes

The Profile module is the foundation of the PeerY ecosystem.

It powers:

- Builder Discovery
- AI Matchmaking
- Project Applications
- Invitations
- Team Members
- Networking
- Public Builder Profiles

Every authenticated user should create a profile before participating in the platform to unlock the full collaborative experience.
