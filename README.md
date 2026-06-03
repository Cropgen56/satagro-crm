# SatAgro CRM Admin

React + Vite + JavaScript admin dashboard for SatAgro, styled with Tailwind CSS.

## Stack

- **React 19** with JavaScript (JSX)
- **Vite 6** for dev and build
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **React Router** for navigation
- **Recharts** for dashboard charts
- **Lucide React** for icons

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Phone number login |
| `/otp` | OTP verification |
| `/dashboard` | Operations dashboard |
| `/farmers` | Farmers management |

## Getting started

```bash
nvm use 20   # Node 20+ recommended
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The admin UI talks to **cropgen-server** BioDrops auth + CRM routes (`/v1/api/auth/biodrops/*`, `/v1/api/auth/crm/*`). Start the server locally (default port `7070`) and set `VITE_API_BASE_URL` in `.env` if needed.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
# satagro-crm
