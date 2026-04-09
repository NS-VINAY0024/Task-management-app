# Task Management App

A full-stack task workspace built with React, TypeScript, Express, Prisma, and PostgreSQL.

## Tech Stack

- Frontend: React, Vite, TypeScript, Material UI, Axios
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL

## What is Improved

- Backend environment validation and cleaner app startup structure
- Shared API pagination metadata for list views
- Search, priority filter, sort order, and pagination on the frontend
- URL-driven filters so list state survives refresh and can be shared
- Better due-date visibility with overdue messaging in task cards
- Dedicated 404 page instead of redirecting every unknown route to home
- Full authentication flow with register, login, session restore, protected routes, and user-owned tasks
- Basic automated backend tests for validation and pagination utilities
- `.env.example` files for frontend and backend setup

## Project Structure

- `frontend/`: React application
- `backend/`: Express API, Prisma schema, migrations, tests, and seed script

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL

## Backend Setup

1. Go to `backend/`.
2. Install dependencies with `npm install`.
3. Create `.env` from `.env.example`.
4. Run the Prisma migration:

```bash
npx prisma migrate dev
```

5. Seed the database if you want sample data:

```bash
npx prisma db seed
```

6. Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### Backend Scripts

- `npm run dev`: start the API in development mode
- `npm run build`: compile TypeScript
- `npm run start`: run the compiled server
- `npm run test`: build and run backend tests

## Frontend Setup

1. Go to `frontend/`.
2. Install dependencies with `npm install`.
3. Create `.env` from `.env.example`.
4. Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### Frontend Scripts

- `npm run dev`: start the Vite dev server
- `npm run lint`: run ESLint
- `npm run build`: type-check and build for production
- `npm run preview`: preview the production build

## API Endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### List Query Params

- `search`: text search against title and description
- `status`: `TODO`, `IN_PROGRESS`, `DONE`
- `priority`: `LOW`, `MEDIUM`, `HIGH`
- `sortBy`: `createdAt` or `dueDate`
- `order`: `asc` or `desc`
- `page`: page number starting from `1`
- `pageSize`: number of tasks per page, max `50`

## Notes

- Authentication is required before task routes can be accessed.
- Tasks are owned per user, so each account sees only its own data.
- The backend expects `AUTH_SECRET` in `.env`.
- The seeded demo account is `demo@example.com` / `Demo@123`.
- Frontend list filters are persisted in the URL query string.
- The frontend Vite config proxies `/api` and `/health` to the backend in development.

## Screenshots

<img width="2239" height="1275" alt="image" src="https://github.com/user-attachments/assets/395f35f3-f84b-4356-a1fc-59ac2647bad9" />
<img width="2239" height="1281" alt="image" src="https://github.com/user-attachments/assets/ce8b6dfc-5ff0-4f72-9e98-01372c43c178" />
<img width="2239" height="1264" alt="image" src="https://github.com/user-attachments/assets/6c1b7784-eda2-4d74-95a6-d52c76d4d0e8" />
<img width="2237" height="1269" alt="image" src="https://github.com/user-attachments/assets/f8c2f236-7c0a-47c6-a140-ae95bef0f30f" />
