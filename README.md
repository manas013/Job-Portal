# Job Portal — Full Stack

A full-stack job portal built with **MongoDB, Express, React (Vite), and Node.js**.

## Live Demo

- Live site: https://job-portal-frontend-1sgl.onrender.com

## Demo Accounts

- Employer login: `employer@demo.com` / `demo123456`
- Jobseeker login: `seeker@demo.com` / `demo123456`

---

## Features

- JWT auth with refresh tokens, forgot/reset password, optional Google OAuth
- Roles: `jobseeker`, `employer`, `admin`
- Jobs: search, filters, sort, salary range, auto-expire after deadline
- Applications with status tracking, cover letter, multi-step apply
- Saved jobs, job alerts, company profiles, resume/avatar upload
- Employer applicant management with notes and messaging
- Real-time notifications (Socket.io), email on apply (SMTP optional)
- Admin panel, analytics dashboard with charts, dark mode, mobile nav
- Notifications page, application timeline, employer Kanban pipeline
- Public company pages with logo upload
- **Job recommendations** — skill/experience/location match scoring for jobseekers
- **AI-style match score & cover letter draft** — template-based match % and apply helper
- **Email job alerts** — instant email on new matching jobs + daily digest (9 AM cron)
- **Withdraw application** — jobseekers can withdraw pending applications
- **Interview scheduler** — employers propose slots; jobseekers confirm from `/interviews`

---

## Project Structure

```
job-portal/
├── backend/          # Node + Express + MongoDB API
│   ├── config/       # DB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error, validation
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   └── utils/        # JWT helper
├── frontend/         # React + Vite + Tailwind
│   └── src/
│       ├── components/   # Shared UI components
│       ├── context/      # Auth context
│       ├── hooks/        # Custom hooks
│       ├── pages/        # Route pages
│       ├── services/     # Axios API calls
│       └── utils/        # Constants, storage helpers
└── docs/             # Additional documentation
```

---

## Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

---

## Setup

### 1. Clone and install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and set MONGO_URI, JWT_SECRET

# Frontend
cp frontend/.env.example frontend/.env
# Edit VITE_API_URL if your backend runs on a different port
```

### 3. Run in development

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

### 4. Production

```bash
cd frontend && npm run build   # outputs to frontend/dist/
cd ../backend && npm start
```

---

## API Endpoints

| Method | Endpoint              | Auth   | Description          |
|--------|-----------------------|--------|----------------------|
| POST   | /api/auth/register    | —      | Register user        |
| POST   | /api/auth/login       | —      | Login                |
| GET    | /api/auth/me          | JWT    | Current user         |
| GET    | /api/jobs             | —      | List jobs (filtered) |
| GET    | /api/jobs/:id         | —      | Job detail           |
| POST   | /api/jobs             | employer| Create job          |
| PUT    | /api/jobs/:id         | employer| Update job          |
| DELETE | /api/jobs/:id         | employer| Delete job          |
| POST   | /api/jobs/:id/apply   | jobseeker| Apply to job       |
| GET    | /api/users/profile    | JWT    | Get profile          |
| PUT    | /api/users/profile    | JWT    | Update profile       |
| GET    | /api/users            | admin  | List all users       |

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router 6, Axios, Tailwind CSS |
| Backend   | Node.js, Express 4, Mongoose 8      |
| Database  | MongoDB                             |
| Auth      | JWT + bcryptjs                      |
| Validation| express-validator                   |

---

## Deployment

### 1. Push project to GitHub

From the root `Job-Portal` folder:

```bash
# Initialize repo only if not already a git repo
git init

# Add all files and commit
git add .
git commit -m "Initial Job Portal commit"

# Add your GitHub remote (replace with your URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push code
git branch -M main
git push -u origin main
```

### 2. Render deployment overview

You will create **two services** on Render:

- **Backend service**: Node + Express API (uses `backend/server.js`)
- **Frontend service**: React + Vite app (in `frontend/`)

Make sure you have:

- A MongoDB connection string (Atlas or other)
- A GitHub repository with this project pushed (see step 1)

### 3. Backend on Render

1. Log in to Render and click **New → Web Service**.  
2. Choose **Build from Git** and select your GitHub repo.  
3. Configure:
   - **Name**: `job-portal-backend` (or any name)
   - **Root directory**: `backend`
   - **Runtime**: Node
   - **Build command**: `npm install`
   - **Start command**: `npm start`
4. Under **Environment → Environment Variables**, add at least:
   - `MONGO_URI` — from your MongoDB provider
   - `JWT_SECRET` — any strong secret string
   - (Optional) email / OAuth envs if you’re using them
5. Create the service and wait until it deploys.  
6. After deploy, copy the **backend URL** (e.g. `https://job-portal-backend.onrender.com`) — you’ll use this in the frontend.

### 4. Frontend on Render

1. In Render, click **New → Static Site** (or Web Service if you prefer SSR) and pick the **same GitHub repo**.  
2. Configure:
   - **Name**: `job-portal-frontend`
   - **Root directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `dist`
3. Under **Environment → Environment Variables**, set:
   - `VITE_API_URL` — your backend URL from step 3 (e.g. `https://job-portal-backend.onrender.com`)
4. Create the service and wait until it deploys.  
5. After deploy, you’ll get a **public frontend URL** you can share.

### 5. Local `.env` vs Render variables

- For local development, keep using `backend/.env` and `frontend/.env` as shown above.  
- On Render, you **do not commit `.env` files**; instead you put the same keys in **Environment Variables** in each service’s settings.

Once these steps are done, you will have:

- **Code hosted on GitHub**
- **Backend** live on Render
- **Frontend** live on Render, configured to call the deployed backend via `VITE_API_URL`
