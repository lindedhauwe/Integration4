# The Spot — Setup Guide

## System Requirements

| Requirement | Minimum |
|---|---|
| OS | macOS 13+ or Windows 10/11 |
| Node.js | v22 (tested on v22.20.0) |
| npm | v10+ |
| Internet connection | Required (Supabase is a cloud database) |
| Browser | Chrome, Firefox, Safari, Edge (modern versions) |

> **Recommended:** use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.
> Run `nvm install 22 && nvm use 22` if needed.

---

## Project Structure

```
Integration4/
└── router-app/        ← all source code lives here
    ├── app/
    │   ├── routes/    ← pages (home, thespot, map, recommendations, …)
    │   ├── components/
    │   └── assets/
    ├── public/
    ├── package.json
    └── .env           ← environment variables (see below)
```

---

## Environment Variables

Create a file called `.env` inside the `router-app/` folder with the following content:

```env
VITE_SUPABASE_URL=https://kxbcmhntcgskcbduezpu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmNtaG50Y2dza2NiZHVlenB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4Njk5OCwiZXhwIjoyMDk1NzYyOTk4fQ.PGbg0B7-wgZ2k1Vina8iK96-QWz_sx5esKyTAKGIR24
```

> These keys give read/write access to the project's Supabase database.
> Do **not** share them publicly.

---

## Step-by-step Installation

### First time

```bash
# 1. Navigate into the app folder
cd router-app

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (or another port if 5173 is taken — check the terminal output).

### After the first install

```bash
cd router-app
npm run dev
```

### Build for production

```bash
cd router-app
npm run build
npm run start
```

---

## Online Services

### Supabase (database + auth + storage)

The project uses [Supabase](https://supabase.com) as its backend. The database is already live — no local setup needed as long as the `.env` values above are in place.

**Tables used:**

| Table | Description |
|---|---|
| `cafés` | All café data: name, address, GPS, opening hours, vibe tags, beer info, photo |
| `recommendations` | User-submitted recommendations linked to a café |
| `spots` | Neighbourhood spots linked to a café |

**To import the database schema and seed data**, SQL files are included in the zip:

- `supabase_cafes.sql` — creates the `cafés` table and inserts café data
- `supabase_recommendations.sql` — creates the `recommendations` table
- `supabase_spots.sql` — creates the `spots` table and inserts spot data

**Steps to re-create the database on a new Supabase project:**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the left sidebar go to **SQL Editor**
3. Paste and run each `.sql` file in the order listed above
4. Copy your new project's **URL** and **anon key** from **Project Settings → API**
5. Replace the values in `.env` with your new credentials

---

## App Routes Overview

| URL | Page |
|---|---|
| `/` | Home — shows a random recommendation after NFC scan |
| `/thespot?cafe_id=…` | Detail page of a specific café |
| `/map` | Map with current + visited + liked cafés |
| `/recommendations` | Submit a new recommendation |
| `/login` | Log in / register |
| `/account` | User account & liked places |

---

## NFC Flow

The app is designed to be triggered by NFC tags placed in cafés. Each tag encodes a URL:

```
https://thespot.netlify.app/?cafe=<cafe_uuid>
```

Scanning the tag opens the home page with a recommendation filtered to that café's vibe.

For local testing you can simulate this by visiting:

```
http://localhost:5173/?cafe=<cafe_uuid>
```

Replace `<cafe_uuid>` with a valid UUID from the `cafés` table in Supabase.

---

## Live Deployment

The app is deployed on **Vercel** at:
**https://integration4.vercel.app**

Deployment is automatic on every push to the `main` branch.
