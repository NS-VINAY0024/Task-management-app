# Task Management App

## Tech Stack
- React (TypeScript)
- Node.js + Express (TypeScript)
- PostgreSQL
- Prisma ORM

## Setup
This repository contains a full-stack task management application with:

- React + Vite frontend
- Express + TypeScript backend
- PostgreSQL database
- Prisma ORM for schema, migrations, and seeding

## Project Structure
- `frontend/` React application
- `backend/` Express API, Prisma schema, migration, and seed script

## Prerequisites
- Node.js 18+
- npm
- PostgreSQL

## Backend Setup
1. Go to `backend/`.
2. Install dependencies with `npm install`.
3. Create a `.env` file with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_management_db?schema=public"
```

4. Run the Prisma migration:

```bash
npx prisma migrate dev
```

5. Seed the database:

```bash
npx prisma db seed
```

6. Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

## Frontend Setup
1. Go to `frontend/`.
2. Install dependencies with `npm install`.
3. Optionally create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api/tasks
```

4. Start the frontend:

```bash
npm run dev
```

The frontend runs on the Vite dev server, usually `http://localhost:5173`.

## API Endpoints
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Supported list query params:
- `status`
- `priority`
- `sortBy` as `createdAt` or `dueDate`
- `order` as `asc` or `desc`

## Features
- Create, view, update, and delete tasks
- Filter tasks by status
- Sort tasks by created date or due date
- Color-coded status and priority badges
- Client-side and server-side validation
- Loading, error, and success feedback
- Task detail view with created and updated timestamps
- Responsive Material UI layout

## Assumptions
- This app is intended for a single-user task management workflow.
- Authentication and authorization are out of scope for the assignment.
- A task may be created without description or due date.
- PostgreSQL is available locally during development.

## Screenshots
<img width="2239" height="1275" alt="image" src="https://github.com/user-attachments/assets/395f35f3-f84b-4356-a1fc-59ac2647bad9" />
<img width="2239" height="1281" alt="image" src="https://github.com/user-attachments/assets/ce8b6dfc-5ff0-4f72-9e98-01372c43c178" />
<img width="2239" height="1264" alt="image" src="https://github.com/user-attachments/assets/6c1b7784-eda2-4d74-95a6-d52c76d4d0e8" />
<img width="2237" height="1269" alt="image" src="https://github.com/user-attachments/assets/f8c2f236-7c0a-47c6-a140-ae95bef0f30f" />

