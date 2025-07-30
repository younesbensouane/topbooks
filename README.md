# TopBooks

A mini full‑stack app to discover books quickly with **search**, **tag filters**, and **concise Markdown summaries**. Supports **dark mode**, **cover images (2:3)**, **unique slugs**, and a **Markdown editor with live preview**. Deployed on **Vercel (frontend)** and **Render (backend)** with **MongoDB Atlas**.

---

## Live URLs

- **Frontend (Vercel):** https://topbooks.vercel.app/
- **Backend API (Render):** https://topbooks-api.onrender.com
  - Health: `https://topbooks-api.onrender.com`
  - Posts: `https://topbooks-api.onrender.com/api/posts`
  - Tags: `https://topbooks-api.onrender.com/api/posts/tags`

> Free tier note: first request may be slow (cold start).

---

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS (plugins: typography, forms, aspect‑ratio)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas (Mongoose)
- **Deploy:** Vercel (client), Render (server)
- **HTTP:** Axios

---

## Architecture

```
[React + Vite] <--Axios--> [Express API] <--Mongoose--> [MongoDB Atlas]
     Vercel                      Render                        Atlas
```

---

## Environment Variables

> Create these files (values up to the deployer). Do **not** commit real secrets. Commit only the `.env.example` files shown below.

### `client/.env.example`
```
# Frontend
# MUST end with /api in production
VITE_API_BASE_URL=https://topbooks-api.onrender.com/api
```

### `server/.env.example`
```
# Backend
MONGODB_URI=your_mongodb_connection_string
# PORT is provided by Render in production; locally you can use 4000
PORT=4000
```

---

## Slug Policy

- Slugs are generated from the title: lowercase, spaces → hyphens, remove non‑alphanumerics.
- **Uniqueness:** if a slug already exists, append `-2`, `-3`, …
- On title change, the backend regenerates a new unique slug during **PUT**.

---

## API Endpoints

Base: `https://topbooks-api.onrender.com/api`

- `POST /posts` — create (auto‑slug). Body: `title`, `content`, `tags` (array or comma string), `status`, `imageUrl`.
- `GET /posts` — list with filters:
  - Query: `status` (default `published`), `page` (default 1), `limit` (default 9), `search`, `tags` (comma list; OR logic)
  - Returns: `{ data, page, limit, total, totalPages }`
- `GET /posts/tags` — distinct tags
- `GET /posts/:slug` — detail
- `PUT /posts/:id` — update (re‑slug on title change)
- `DELETE /posts/:id` — delete

Optional (if enabled):
- `GET /export.json` — export all posts (can be protected by a token)

---

## Local Development

### Prereqs
- Node.js 18+
- MongoDB Atlas URI

### Backend
```bash
cd server
cp .env.example .env   # add your MONGODB_URI
npm install
npm run dev            # http://localhost:4000
```

### Frontend
```bash
cd client
cp .env.example .env   # optionally set VITE_API_BASE_URL for prod preview
npm install
npm run dev            # http://localhost:5173
```

> In dev, the client falls back to `http://localhost:4000/api` when `VITE_API_BASE_URL` is not set.

---

## Production Deploy (summary)

### Backend (Render Web Service)
- Root directory: `server`
- Build: `npm install`
- Start: `npm start`
- Env: `MONGODB_URI` (no fixed `PORT` needed; Render provides it)

### Frontend (Vercel Project)
- Root directory: `client`
- Env: `VITE_API_BASE_URL=https://topbooks-api.onrender.com/api`
- Build: `npm run build`
- Output: `dist`

---

## Scripts

**server/package.json**
- `dev` — start w/ nodemon
- `start` — start Node

**client/package.json**
- `dev`, `build`, `preview`

---

## License

MIT (or your choice).