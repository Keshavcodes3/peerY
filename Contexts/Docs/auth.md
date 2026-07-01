# Authentication API — Documentation

**Base URL:** `http://localhost:<PORT>/api/v1`

> All protected endpoints require a valid JWT.
> Authentication can be provided using:
>
> - **Cookie:** `token=<jwt>`
> - **Authorization Header:** `Bearer <jwt>`

---

# Routes Overview

| Method | Route | Auth | Description |
|---------|------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new account |
| `POST` | `/auth/login` | ❌ | Login existing user |
| `GET` | `/auth/me` | ✅ | Get authenticated user |
| `POST` | `/auth/logout` | ✅ | Logout current user |
| `DELETE` | `/auth/delete` | ✅ | Permanently delete account |
| `PUT` | `/auth/disable` | ✅ | Disable current account |

---

# Authentication Flow

```text
Register
    │
    ▼
Account Created
    │
    ▼
Login
    │
    ▼
JWT Issued
    │
    ▼
Authenticated Requests
    │
    ▼
Logout
```

---

# 1. Register User

```
POST /api/v1/auth/register
```

## Description

Creates a new user account.

The system validates the incoming data, ensures the email and username are unique, hashes the password securely, creates the account, and returns the authenticated user.

---

## Request Body

```json
{
    "username":"keshav",
    "email":"keshav@gmail.com",
    "password":"StrongPassword123"
}
```

| Field | Type | Required | Rules |
|---------|------|----------|------|
| username | string | ✅ | 3-30 characters, unique |
| email | string | ✅ | Valid email, unique |
| password | string | ✅ | Minimum 8 characters |

---

## Success Response — `201 Created`

```json
{
    "success":true,
    "message":"User registered successfully",
    "data":{
        "user":{
            "_id":"665fd6...",
            "username":"keshav",
            "email":"keshav@gmail.com",
            "createdAt":"2026-07-01T12:00:00.000Z"
        }
    }
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 201 | User created |
| 400 | Validation failed |
| 409 | Username already exists |
| 409 | Email already exists |
| 500 | Internal server error |

---

## Business Rules

- Username must be unique.
- Email must be unique.
- Password must be hashed before saving.
- Password is never returned.
- JWT may be issued immediately after registration (depending on implementation).

---

# 2. Login User

```
POST /api/v1/auth/login
```

## Description

Authenticates a user using email and password.

If credentials are valid, a JWT token is generated and returned as an HTTP-only cookie (or via response depending on implementation).

---

## Request Body

```json
{
    "email":"keshav@gmail.com",
    "password":"StrongPassword123"
}
```

---

## Success Response — `200 OK`

```json
{
    "success":true,
    "message":"Login successful",
    "data":{
        "user":{
            "_id":"665fd6...",
            "username":"keshav",
            "email":"keshav@gmail.com"
        }
    }
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Login successful |
| 400 | Invalid payload |
| 401 | Invalid credentials |
| 403 | Account disabled |
| 404 | User not found |

---

## Business Rules

- Password must match hashed password.
- Disabled users cannot login.
- Token expiration follows JWT configuration.
- Password is never exposed.

---

# 3. Get Current User

```
GET /api/v1/auth/me
```

## Description

Returns the currently authenticated user's information.

Requires a valid JWT.

---

## Headers

```
Authorization: Bearer <jwt>
```

or

```
Cookie: token=<jwt>
```

---

## Success Response — `200 OK`

```json
{
    "success":true,
    "message":"Authenticated user fetched successfully",
    "data":{
        "user":{
            "_id":"665fd6...",
            "username":"keshav",
            "email":"keshav@gmail.com"
        }
    }
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | User returned |
| 401 | Missing token |
| 401 | Invalid token |
| 404 | User not found |

---

## Business Rules

- Token must be valid.
- Disabled users cannot access protected routes.
- Deleted accounts return Not Found.

---

# 4. Logout User

```
POST /api/v1/auth/logout
```

## Description

Logs out the authenticated user.

The authentication cookie is cleared and the client is considered unauthenticated.

---

## Request Body

None

---

## Success Response — `200 OK`

```json
{
    "success":true,
    "message":"Logged out successfully"
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Logout successful |
| 401 | Unauthorized |

---

## Business Rules

- Clears authentication cookie.
- Existing JWT becomes unusable if token blacklist is implemented.
- Client should remove local authentication state.

---

# 5. Delete Account

```
DELETE /api/v1/auth/delete
```

## Description

Permanently deletes the authenticated user's account.

This action is irreversible.

---

## Request Body

None

---

## Success Response — `200 OK`

```json
{
    "success":true,
    "message":"Account deleted successfully"
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Account deleted |
| 401 | Unauthorized |
| 404 | User not found |

---

## Business Rules

- Only authenticated user can delete their account.
- Associated profile should also be deleted.
- Active sessions should be invalidated.
- Future logins are impossible.

---

# 6. Disable Account

```
PUT /api/v1/auth/disable
```

## Description

Temporarily disables the authenticated user's account without deleting data.

The account can later be re-enabled (future feature).

---

## Request Body

None

---

## Success Response — `200 OK`

```json
{
    "success":true,
    "message":"Account disabled successfully"
}
```

---

## Status Codes

| Code | Reason |
|------|--------|
| 200 | Account disabled |
| 401 | Unauthorized |
| 404 | User not found |

---

## Business Rules

- User cannot login after disabling account.
- Existing JWT sessions should be invalidated.
- User data remains stored.
- Projects, profiles, and applications remain linked unless business logic specifies otherwise.

---

# JWT Authentication Lifecycle

```text
            Register
                │
                ▼
        User Created
                │
                ▼
             Login
                │
                ▼
        JWT Generated
                │
                ▼
       HTTP-only Cookie
                │
                ▼
      Protected Endpoints
                │
      ┌─────────┴─────────┐
      ▼                   ▼
   Logout           Disable Account
      │                   │
      ▼                   ▼
 Cookie Cleared     Access Revoked
```

---

# Protected Routes

These endpoints require authentication.

| Route | JWT Required |
|--------|--------------|
| GET /auth/me | ✅ |
| POST /auth/logout | ✅ |
| DELETE /auth/delete | ✅ |
| PUT /auth/disable | ✅ |

---

# Error Response Format

```json
{
    "success":false,
    "error":"Human-readable error message",
    "stack":"Only visible in development mode"
}
```

---

# Authentication Middleware

All protected endpoints use:

```ts
verifyAuth
```

Responsibilities:

- Read JWT from Cookie or Authorization Header
- Verify signature
- Decode payload
- Validate expiration
- Fetch authenticated user
- Attach user to `req.user`
- Reject unauthorized requests

---

# Security Notes

- Passwords must be hashed using **bcrypt**.
- JWT should be signed with a strong secret.
- Authentication cookies should use:
  - `httpOnly`
  - `secure` (production)
  - `sameSite`
- Never expose password hashes.
- Never trust client-provided user IDs.
- Always authorize using the authenticated user from the JWT.

---

# Authentication State Diagram

```text
          REGISTER
              │
              ▼
         ACTIVE USER
              │
     ┌────────┴────────┐
     ▼                 ▼
 LOGIN SUCCESS     DISABLE ACCOUNT
     │                 │
     ▼                 ▼
 AUTHENTICATED     DISABLED
     │
     ▼
 LOGOUT
     │
     ▼
UNAUTHENTICATED
```
