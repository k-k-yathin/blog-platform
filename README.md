# Blogify — Full-Stack Blogging Platform

A modern, full-stack blogging platform built with React, Node.js, Express, PostgreSQL, and Prisma.

## Features

- **Authentication** — Register, login, logout with JWT and bcrypt password hashing
- **Blog Posts** — Create, read, update, and delete posts with rich UI
- **Comments** — Add, view, and delete your own comments
- **Search** — Full-text search across post titles and content
- **Categories & Tags** — Organize posts with categories and tags
- **Pagination** — Paginated post listings
- **Featured Posts** — Highlight featured articles on the homepage
- **Responsive Design** — Mobile-first UI with Tailwind CSS and Framer Motion

## Tech Stack

| Layer      | Technologies                                      |
|------------|---------------------------------------------------|
| Frontend   | React, TypeScript, Tailwind CSS, React Router, Axios, Framer Motion |
| Backend    | Node.js, Express.js, TypeScript                   |
| Database   | PostgreSQL, Prisma ORM                            |
| Auth       | JWT, bcrypt                                       |

## Project Structure

```
Blog-platform/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   └── seed.ts            # Demo seed data
│   └── src/
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Auth, validation, error handling
│       ├── routes/            # API route definitions
│       ├── services/          # Business logic
│       ├── utils/             # Helpers, JWT, Prisma client
│       ├── app.ts             # Express app setup
│       └── index.ts           # Server entry point
├── frontend/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── contexts/          # Auth context
│       ├── pages/             # Route pages
│       ├── services/          # API client (Axios)
│       └── types/             # TypeScript interfaces
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Getting Started

### 1. Clone and install dependencies

```bash
cd Blog-platform

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy and edit `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_platform?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

**Frontend** — copy and edit `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Set up the database

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data (optional)
npm run db:seed
```

Demo credentials after seeding:
- **Email:** `demo@blog.com`
- **Password:** `password123`

### 4. Run the development servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## API Endpoints

### Authentication

| Method | Endpoint           | Auth | Description        |
|--------|--------------------|------|--------------------|
| POST   | `/api/auth/register` | No   | Register new user  |
| POST   | `/api/auth/login`    | No   | Login              |
| POST   | `/api/auth/logout`   | Yes  | Logout             |
| GET    | `/api/auth/profile`  | Yes  | Get user profile   |

### Posts

| Method | Endpoint                | Auth | Description              |
|--------|-------------------------|------|--------------------------|
| GET    | `/api/posts`            | No   | List posts (paginated)   |
| GET    | `/api/posts/featured`   | No   | Featured posts           |
| GET    | `/api/posts/categories` | No   | All categories           |
| GET    | `/api/posts/tags`       | No   | All tags                 |
| GET    | `/api/posts/my-posts`   | Yes  | Current user's posts     |
| GET    | `/api/posts/:id`        | No   | Single post with comments|
| POST   | `/api/posts`            | Yes  | Create post              |
| PUT    | `/api/posts/:id`        | Yes  | Update own post          |
| DELETE | `/api/posts/:id`        | Yes  | Delete own post          |

**Query params for GET `/api/posts`:**
- `search` — search title/content
- `category` — filter by category slug
- `tag` — filter by tag slug
- `featured` — `true` for featured only
- `page` — page number (default: 1)
- `limit` — items per page (default: 10, max: 50)

### Comments

| Method | Endpoint                      | Auth | Description           |
|--------|-------------------------------|------|-----------------------|
| GET    | `/api/comments/post/:postId`  | No   | Comments for a post   |
| POST   | `/api/comments/post/:postId`  | Yes  | Add comment           |
| DELETE | `/api/comments/:id`           | Yes  | Delete own comment    |

## Database Models

- **User** — id, name, email, password, createdAt
- **Post** — id, title, content, image, published, featured, authorId, createdAt, updatedAt
- **Category** — id, name, slug (many-to-many with Post)
- **Tag** — id, name, slug (many-to-many with Post)
- **Comment** — id, content, postId, userId, createdAt

## Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment Notes

1. Set strong `JWT_SECRET` in production
2. Use a managed PostgreSQL instance (Supabase, Neon, RDS)
3. Run `npm run db:migrate` for production migrations
4. Set `FRONTEND_URL` to your deployed frontend domain for CORS
5. Serve frontend build via CDN/static host; point `VITE_API_URL` to your API

## License

MIT
