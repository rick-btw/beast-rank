# BEAST//RANK

A premium Monster Energy flavor ranking app with a dark cyberpunk interface, admin-only editing, drag-and-drop tiers, flavor search, category filters, generated can art, stats, highlights, recent flavors, and SEO-friendly flavor pages.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- dnd-kit drag and drop
- Prisma ORM
- SQLite for local development
- PostgreSQL/Supabase-ready Prisma schema included

## Project Structure

```txt
app/
  admin/                  Admin login page
  api/auth/login/         Admin session creation
  api/auth/logout/        Session clearing
  api/cans/[slug]/        Dynamic generated can artwork
  api/rankings/           Admin-only ranking persistence
  flavors/[slug]/         SEO-friendly flavor detail pages
  globals.css             Global design system
  layout.tsx              Metadata and shell
  page.tsx                Ranking board
components/
  AdminLogin.tsx
  SafeCanImage.tsx
  ranking/
    BucketRow.tsx
    FlavorCard.tsx
    FlavorDetailModal.tsx
    RankingExperience.tsx
data/
  flavors.ts              Researched seed catalog
lib/
  constants.ts            Tier/category constants
  db.ts                   Prisma singleton
  queries.ts              Board/flavor data loaders
  session.ts              Signed HTTP-only admin session
  utils.ts
prisma/
  migrations/             Initial SQL migration
  schema.prisma           Local SQLite schema
  schema.postgres.prisma  PostgreSQL/Supabase schema variant
  seed.ts                 Flavor and ranking seed script
scripts/
  ensure-sqlite-db.mjs    Local setup helper
```

## Local Setup

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Example admin credentials from `.env.example`:

```txt
admin@beastrank.local
monsteradmin
```

Change these before deploying.

## Environment Variables

```txt
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@beastrank.local"
ADMIN_PASSWORD="monsteradmin"
AUTH_SECRET="replace-with-a-long-random-secret"
ADMIN_PASSWORD_HASH=""
```

`ADMIN_PASSWORD_HASH` is optional. If present, it takes precedence over `ADMIN_PASSWORD`.

Generate a bcrypt hash:

```bash
node -e "require('bcryptjs').hash('your-password', 12).then(console.log)"
```

## Ranking Model

The app stores flavor metadata separately from editable ranking state.

- `Flavor` keeps the catalog: name, slug, category, profile, status, source URL, accent color, nutrition hints, and generated image URL.
- `RankingEntry` keeps admin edits: tier bucket, position, highlight flag, and notes.

Seed runs are safe for your rankings: existing ranking entries are preserved.

## Flavor Data

The seed currently includes 103 flavors across:

- Original
- Ultra
- Juice/Punch
- Rehab
- Java
- Nitro
- Reserve
- Hydro
- Tea
- Limited/Regional

Sources used for the seed research:

- [Monster Energy official U.S. products](https://www.monsterenergy.com/en-us/energy-drinks/)
- [Monster Energy official U.S. homepage](https://www.monsterenergy.com/en-us/)
- [Monster Energy Wiki flavor list](https://monster-energy.fandom.com/wiki/Flavours)
- [Energy Drink Mania Monster archive](https://www.energydrinkmania.net/en/monster_energy/)

Official image hosts can block hotlinking, so every flavor gets high-quality generated can art at `/api/cans/[slug]`. The UI also has a runtime fallback if any external image is later added and fails.

## Vercel and Supabase/PostgreSQL

For local development, this project defaults to SQLite so it can run immediately. For production PostgreSQL or Supabase:

1. Create a Supabase/Postgres database.
2. Set `DATABASE_URL` in Vercel.
3. Replace `prisma/schema.prisma` with `prisma/schema.postgres.prisma`, or copy the provider settings into your main schema.
4. Generate a Postgres migration from that schema.
5. Run migrations against production before or during deployment.
6. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `AUTH_SECRET` in Vercel.
7. Use the Vercel build command:

```bash
npm run vercel-build
```

For a first hosted seed, run:

```bash
npm run seed
```

from an environment that has production `DATABASE_URL` configured.

## Verification

Validated locally with:

```bash
npm run setup
npm run seed
npm run build
```

Browser checks covered the viewer board, generated can art, flavor modal, admin login, and autosave on highlight changes.
