# StockWallah

Production-ready full-stack website for StockWallah Academy, a practical financial education platform focused on stock market trading and investing, with public marketing pages, daily trading levels, market/news integrations, YouTube live status, lead capture, and a JWT-protected admin portal.

## Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, React Query, Zustand, Lucide, Recharts, TradingView Lightweight Charts
- Backend: Node.js + Express + TypeScript, Prisma ORM, PostgreSQL, Redis cache, JWT + bcrypt, Nodemailer
- Local infra: Docker Compose for PostgreSQL, Redis, backend, and frontend

## Quick Start

1. Copy environment variables:

```bash
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

2. Start infrastructure and apps:

```bash
docker compose up --build
```

3. Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/health
- Admin: http://localhost:3000/admin/login

Default seeded admin:

- Email: `admin@stockwallah.in`
- Password: `StockWallah@2025`

All content is for educational purposes only. StockWallah does not provide tips, calls, advisory services, or guaranteed returns.

## Manual Development

If running without Docker, start PostgreSQL and Redis locally, then:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## API Highlights

- `POST /api/leads` saves lead popup submissions and sends admin notification email when SMTP is configured.
- `GET /api/news` fetches MoneyControl RSS, strips HTML, and caches results for 15 minutes.
- `GET /api/market/gainers-losers` proxies NSE with browser headers, retries, caches for 5 minutes, and falls back to Yahoo Finance/sample data.
- `GET /api/levels` returns daily NIFTY/BANKNIFTY levels and summary stats.
- `POST /api/admin/auth/login` sets an httpOnly JWT cookie for `/admin/*` routes.

## Quality Checks

```bash
cd backend && npm run lint && npm run build
cd frontend && npm run typecheck && npm run build
```

