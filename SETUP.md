# NITKKR Food - Setup & Deployment Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `MEILI_HOST` | Meilisearch host URL | `http://localhost:7700` |
| `MEILI_MASTER_KEY` | Meilisearch master key | `masterKey` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image optimization |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PLAUSIBLE_DOMAIN` | Plausible analytics domain |
| `GOOGLE_ANALYTICS_ID` | Google Analytics measurement ID |

## Database Setup

### Local Development (Docker)

```bash
# Start PostgreSQL + Meilisearch
docker-compose up -d

# Run migrations
npm run db:push

# Seed with sample data
npm run db:seed

# Sync to Meilisearch
npm run meili:sync
```

### Production (Neon / Supabase / Vercel Postgres)

1. Create a PostgreSQL database
2. Set `DATABASE_URL` in your environment
3. Run migrations: `npm run db:push`
4. Seed data: `npm run db:seed`
5. Sync search: `npm run meili:sync`

## Meilisearch Setup

### Local (Docker)

```bash
docker-compose up -d meilisearch
# Access at http://localhost:7700
```

### Production (Meilisearch Cloud)

1. Create account at https://cloud.meilisearch.com
2. Create a new instance
3. Set `MEILI_HOST` and `MEILI_MASTER_KEY` in environment variables

## Deployment to Vercel

### Automatic (Recommended)

1. Push to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual

```bash
# Install Vercel CLI
npm i -g vercel

# Build
npm run build

# Deploy
vercel --prod
```

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

- `DATABASE_URL`
- `MEILI_HOST`
- `MEILI_MASTER_KEY`
- (Optional) Cloudinary, Analytics vars

## Project Structure

```
nitkkr-food/
├── src/
│   ├── components/     # Reusable Astro components
│   ├── layouts/        # Page layouts
│   ├── lib/
│   │   ├── db.ts       # Drizzle DB client
│   │   ├── schema.ts   # Database schema
│   │   ├── queries.ts  # Database queries
│   │   ├── meilisearch.ts # Search client
│   │   └── mock-data.ts  # Fallback data
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── search.astro       # Search page
│   │   ├── v/[slug].astro     # Vendor detail
│   │   ├── admin/index.astro  # Admin dashboard
│   │   └── api/
│   │       ├── search.json.ts      # Search API
│   │       ├── sync-meili.json.ts  # Meilisearch sync
│   │       └── admin/vendors/index.ts # Admin CRUD API
│   └── middleware.ts   # Error handling
├── public/             # Static assets
├── scripts/            # DB seed & sync scripts
├── docker-compose.yml  # Local dev services
├── drizzle.config.ts   # Drizzle config
├── astro.config.mjs    # Astro + Vercel config
└── tailwind.config.mjs # Tailwind theme
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (background: `astro dev --background`) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run meili:sync` | Sync menu items to Meilisearch |
| `npm run astro -- --help` | Astro CLI help |

## Admin Dashboard

Access at `/admin` - Self-service stall management:
- Toggle stall open/closed status
- Add new stalls
- View QR codes for stall pages
- Test WhatsApp links

API endpoints (require `DATABASE_URL`):
- `GET /api/admin/vendors` - List all vendors
- `POST /api/admin/vendors` - Create vendor
- `PATCH /api/admin/vendors` - Update vendor (send `{ id, ...fields }`)

## Tech Stack

- **Framework**: Astro 7 (server mode with Vercel adapter)
- **Database**: PostgreSQL + Drizzle ORM
- **Search**: Meilisearch
- **Styling**: Tailwind CSS + custom NITKKR theme
- **Interactivity**: Alpine.js (embedded in components)
- **PWA**: Vite PWA plugin (Workbox)
- **Deployment**: Vercel (serverless functions)

## Troubleshooting

### Build fails with "Cannot find module '@/lib/db'"
- Ensure `astro.config.mjs` has the alias: `'@': path.resolve('./src')`

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check database allows connections from your IP (for local dev)
- Ensure SSL mode is correct for your provider

### Meilisearch sync fails
- Verify `MEILI_HOST` and `MEILI_MASTER_KEY`
- Check Meilisearch instance is running and accessible
- Run `npm run meili:sync` manually to see detailed errors

### Admin API returns 503 "Database not configured"
- Set `DATABASE_URL` environment variable
- Restart dev server after adding env vars

## License

MIT