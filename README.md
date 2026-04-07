# COMP3133 Assignment 2 — Angular + GraphQL (full stack)

Monorepo layout: `backend/` (Assignment 1 GraphQL API), `frontend/` (Angular + Apollo + Angular Material), optional `docker-compose.yml` at the root.

**Repository name (example):** `101480537_comp3133_assignment2` — replace `101480537` with your student ID everywhere you publish or clone.

## Submission screenshots (D2L)

See **`readme/SCREENSHOTS.md`** for what each screenshot type should show. Exported PNGs live in **`readme/screenshots/`** (numbered `01`–`25`). Re-run **`readme/copy-screenshots.ps1`** if you need to refresh copies from Cursor’s asset folder.

## Prerequisites

- Node.js 20+
- MongoDB (local, Atlas, or Docker)
- Cloudinary account (for employee profile photo uploads)

## Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI, JWT_SECRET, and Cloudinary keys in .env
npm install
npm start
```

GraphQL endpoint: `http://localhost:4000/graphql`

Protected operations require `Authorization: Bearer <token>` after login.

## Frontend

```bash
cd frontend
npm install
```

Set `graphqlUrl` in `src/environments/environment.ts` (dev) and `environment.prod.ts` (production build).

```bash
npm start
```

Opens `http://localhost:4200` with CORS allowed for that origin on the backend.

## Docker (full stack)

From the project root:

```bash
# Optional: export Cloudinary + a strong JWT for production
export JWT_SECRET=your_long_secret
docker compose up --build
```

- Frontend (nginx): `http://localhost:8080`
- GraphQL: `http://localhost:4000/graphql`
- MongoDB: `localhost:27017`

The frontend image substitutes `GRAPHQL_URL` at build time (default `http://localhost:4000/graphql`). For cloud deployment, rebuild with your public API URL.

## Features (rubric)

- **Auth:** Login & signup (GraphQL), JWT stored in `localStorage` (`ems_auth_token`), `AuthService`, `authGuard`, `guestGuard`.
- **Employees:** List (Material table), add (reactive form + image upload as base64), view, update, delete (confirm dialog).
- **Search:** By department and/or position (maps to backend `designation`).
- **Angular:** Standalone components, routing, reactive forms, pipes (`salary`, `fullName`), directive (`appTrimBlur`), services, Apollo Client.

## Deployment notes

- Deploy the backend (Heroku, Railway, Render, Cyclic, etc.) and set `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS` (your frontend URL), and Cloudinary env vars.
- Deploy the Angular app (Vercel, Netlify, Cloudflare Pages, etc.) and set production `graphqlUrl` to the deployed GraphQL HTTPS endpoint.
- Update `frontend/src/environments/environment.prod.ts` before production builds, or pass `GRAPHQL_URL` when building the Docker image.

## Screenshots & submission

Collect MongoDB, Postman GraphQL tests, CRUD, and search screenshots as required by the course and submit on D2L with your GitHub and live URLs.
