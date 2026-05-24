# BEAST//RANK

A premium static Monster Energy flavor ranking site with a dark cyberpunk interface, flavor search, category filters, generated can art, stats, highlights, recent flavors, and SEO-friendly flavor pages.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Framer Motion
- dnd-kit drag and drop
- Static export for GitHub Pages

## Project Structure

```txt
app/
  admin/                  Static note about read-only hosting
  flavors/[slug]/         SEO-friendly flavor detail pages
  globals.css             Global design system
  layout.tsx              Metadata and shell
  page.tsx                Ranking board
components/
  SafeCanImage.tsx
  ranking/
    BucketRow.tsx
    FlavorCard.tsx
    FlavorDetailModal.tsx
    RankingExperience.tsx
data/
  flavors.ts              Researched seed catalog
lib/
  can-svg.ts              Shared generated can SVG renderer
  constants.ts            Tier/category constants
  public-path.ts          GitHub Pages base-path helper
  static-board.ts         Static board/flavor data loaders
  utils.ts
scripts/
  generate-static-cans.ts Static fallback can generator
```

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ranking Model

The public site is static so it can run on GitHub Pages.

- `data/flavors.ts` keeps the catalog, image URLs, initial tier bucket, position, and highlight flag.
- `lib/static-board.ts` converts that source data into the board and flavor detail pages.
- Ranking changes are source edits followed by a rebuild/redeploy.

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

Official image hosts can block hotlinking, so tried flavors use local `.webp` assets in `public/cans/`, and every other flavor gets generated static can art in `public/cans/generated/`. The UI falls back to the generated static asset if a custom image fails.

## GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. Push the project to GitHub.
2. In the repo settings, go to **Pages**.
3. Set **Build and deployment** to **GitHub Actions**.
4. Push to `main`, or run the workflow manually.

The workflow runs:

```bash
npm ci
npm run pages:build
```

The build exports the site to `out/`. `next.config.mjs` automatically adds the repository name as the base path when it runs in GitHub Actions, so project pages like `https://username.github.io/repo-name/` load scripts and images correctly.

To test the static export locally:

```bash
npm run build
```

## Verification

Validated locally with:

```bash
npm run build
```

The export generates 108 static pages: the board, admin read-only note, not-found page, and all 103 flavor detail pages.
