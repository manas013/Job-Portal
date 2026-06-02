# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Pass the JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Auth Routes

### POST /auth/register
```json
{ "name": "Alice", "email": "alice@example.com", "password": "secret123", "role": "jobseeker" }
```

### POST /auth/login
```json
{ "email": "alice@example.com", "password": "secret123" }
```

### GET /auth/me
Returns the authenticated user object.

---

## Job Routes

### GET /jobs
Query params: `search`, `type`, `experience`, `page`, `limit`

### POST /jobs (employer)
```json
{
  "title": "Frontend Developer",
  "description": "...",
  "company": "Acme Inc",
  "location": "Remote",
  "type": "full-time",
  "experience": "mid",
  "skills": ["React", "TypeScript"],
  "salary": { "min": 80000, "max": 120000, "currency": "USD" }
}
```

### POST /jobs/:id/apply (jobseeker)
No body required.

---

## Error Responses
All errors follow this shape:
```json
{ "message": "Human-readable error" }
```
