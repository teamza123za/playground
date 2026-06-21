# Repository Guidelines

## Project Context

This repository is a full-stack playground named Slowwork. It combines a Next.js frontend with an Express backend and a Prisma-managed SQL database. The main implemented feature is a Todo list with create, read, update, and delete behavior.

Top-level structure:

```text
D:\playground
|-- frontend/   # Next.js 16 app, React 19, TypeScript, Tailwind CSS
|-- backend/    # Express API, CommonJS JavaScript, Prisma client
|-- AGENTS.md   # Contributor, agent, and project context guidance
`-- .gitignore
```

## Project Structure & Module Organization

This repository is split into two apps. `frontend/` contains the Next.js UI, with routes and styles under `frontend/src/app/` and static assets under `frontend/public/`. `backend/` contains the Express API, organized by responsibility: `src/routes/`, `src/controllers/`, `src/services/`, and shared configuration in `src/config/`. Database schema and migrations live in `backend/prisma/`.

Frontend overview:

- `src/app/page.tsx` is the landing page for Slowwork.
- `src/app/todos/page.tsx` is a client-side Todo UI.
- `src/app/layout.tsx` defines global metadata, fonts, and root layout.
- `src/app/globals.css` imports Tailwind CSS and defines theme defaults.
- `public/logo.png` and other files in `public/` are static assets.

Backend overview:

- `src/server.js` creates the Express app, configures CORS, parses JSON, and mounts API routes under `/api`.
- `src/routes/` maps HTTP paths to controller functions.
- `src/controllers/` handles request validation, response shape, and error responses.
- `src/services/` contains business/data access logic.
- `src/config/prisma.js` initializes and exports a shared Prisma client.

Current API routes:

- `GET /` returns `{ message: "Backend Running" }`.
- `GET /api/hello` is a simple hello route.
- `GET /api/users` returns static sample users.
- `GET /api/todos` lists todos.
- `POST /api/todos` creates a todo from `{ title }`.
- `PUT /api/todos/:id` updates `{ isDone }`.
- `DELETE /api/todos/:id` deletes a todo.

The Todo data flow starts in `frontend/src/app/todos/page.tsx`, which fetches from `${NEXT_PUBLIC_API_URL}/api/todos`. Express receives the request through `todo.route.js`, delegates to `todo.controller.js`, then calls `todo.service.js`, which reads or writes through Prisma.

## Build, Test, and Development Commands

Run commands from the app directory they belong to:

- `cd frontend && npm run dev` starts the Next.js development server.
- `cd frontend && npm run build` creates a production frontend build.
- `cd frontend && npm run lint` runs ESLint with the Next.js TypeScript config.
- `cd backend && npm run dev` starts the API with `nodemon`.
- `cd backend && npm start` runs the API with Node.
- `cd backend && npx prisma generate` regenerates the Prisma client after schema changes.

There is no configured test runner yet in either app.

## Coding Style & Naming Conventions

Frontend code uses TypeScript, React, Next.js App Router conventions, ESLint, Tailwind utility classes, and React client components where needed. Prefer component and route files that match the existing `src/app/.../page.tsx` pattern, and use 4-space indentation in edited pages. Backend code uses CommonJS JavaScript; keep route, controller, and service responsibilities separate. Use descriptive filenames like `todo.route.js`, `todo.controller.js`, and `todo.service.js`.

## Testing Guidelines

No test runner is currently configured. Before submitting changes, run the relevant lint or build command and manually verify affected frontend pages or API endpoints. If adding tests, colocate them near the code they cover and add an npm script so future contributors can run them consistently.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Fix backend cors` or `Update home page and add nav bar`. Keep commits focused on one change. Pull requests should describe what changed, list verification steps, link related issues when available, and include screenshots for visible UI changes.

## Security & Configuration Tips

Do not commit secrets or local environment files. The backend Prisma datasource uses `DATABASE_URL`; document any required environment variables when changing database or deployment behavior.

Environment variables:

- Frontend: `NEXT_PUBLIC_API_URL` must point to the backend base URL, for example `http://localhost:5000`.
- Backend: `PORT` optionally overrides the default API port `5000`.
- Backend: `DATABASE_URL` is required by Prisma for MySQL.

## Database

Prisma configuration is in `backend/prisma/`.

- `schema.prisma` defines a MySQL datasource using `DATABASE_URL`.
- The active model is `Todo` with `id`, `title`, `isDone`, `createdAt`, and `updatedAt`.
- Migrations are stored under `backend/prisma/migrations/`.

Run `cd backend && npx prisma generate` after schema changes.

## Known Issues And Follow-Up Notes

- Some Thai UI and API message strings appear mojibaked in the current files. Treat this as an encoding/content cleanup task before editing those strings further.
- Frontend metadata still uses the default Next.js title and description in `layout.tsx`.
- Todo error handling is minimal; failed create/update/delete requests do not currently show user-facing errors.
- Backend update/delete operations do not handle missing IDs with a custom 404 response.
- No automated tests are configured. Add scripts before relying on test commands in documentation or CI.
