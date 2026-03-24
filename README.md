# Society Keeper

Society Keeper is a full-stack property management application with:
- **Backend**: Node.js + Express + PostgreSQL for authentication, admin and resident APIs.
- **Frontend**: Next.js (App Router + TypeScript) for admin/resident dashboards, flats, payments, reports.

## 📁 Project structure

- `/backend`
  - `package.json`, `README.md`
  - `/src`
    - `server.js` - Express app entrypoint
    - `/config/db.js` - PostgreSQL connection
    - `/controllers` - route handlers
    - `/middleware` - auth guards (`isAdmin`, `isResident`, etc.)
    - `/routes` - route definitions
    - `/utils/jwtUtils.js` - JWT helper functions

- `/frontend`
  - `package.json`, `next.config.ts`, `tsconfig.json`
  - `/app` - Next.js app router pages
    - `/auth` - sign-in, sign-up flows
    - `/features` - dashboard for admin and resident plus CRUD pages
  - `/components` - reusable UI components and design system
  - `/hooks` - custom hooks like `use-mobile`
  - `/lib` - shared utilities
  - `/public` - static assets
  - `/types` - TypeScript shared types
  - `/utilities` - navigation data, constants

## ⚙️ Prerequisites

- Node.js 18+ (LTS)
- npm 10+ or yarn
- PostgreSQL instance (local or cloud)

## 🚀 Backend setup

1. `cd backend`
2. `npm install`
3. Configure `.env` (create if missing):
   - `PORT=5000`
   - `DB_URL=<your postgres url>`
   - `JWT_SECRET=<your secret>`
4. Run:
   - `npm run dev` (if script exists) or `node src/server.js`

## 🚀 Frontend setup

1. `cd frontend`
2. `npm install`
3. Configure environment (if needed): `.env.local` (for API URL etc.)
4. Run:
   - `npm run dev`
5. Open browser at `http://localhost:3000`

## 🧩 Typical workflow

- Admin can manage flats, payments, notifications, subscriptions, reports.
- Resident can view dashboard, pay, profile and payment history.

## 🛠️ Production build

- Backend: `npm run build` (if present) + `npm start`
- Frontend: `npm run build` then `npm run start`

## 📌 Notes

- Use consistent `.env` values in both services if frontend calls backend by domain.
- Backend default route usually at `http://localhost:4000`.
