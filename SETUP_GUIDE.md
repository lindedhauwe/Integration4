# Antwerp on Tap — Setup Guide

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
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> Copy the **URL** and **anon key** from your Supabase project under **Project Settings → API**.
> Do **not** share these keys publicly.

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
```

This generates a `build/client/` folder with static files ready to be deployed to any static hosting provider (Vercel, Netlify, etc.).

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

**To import the database schema and seed data**, a SQL file is included in the project root:

- `supabase_import.sql` — creates all tables and inserts all data

**Steps to re-create the database on a new Supabase project:**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the left sidebar go to **SQL Editor**
3. Paste and run `supabase_import.sql`
4. Copy your new project's **URL** and **anon key** from **Project Settings → API**
5. Replace the values in `.env` with your new credentials

---

## App Routes Overview

| URL | Page |
|---|---|
| `/` | Home — shows a random recommendation after NFC scan |
| `/beerloading` | NFC entry point — triggers the full scan flow |
| `/storytelling` | Onboarding story after NFC scan |
| `/loadingrecommendation` | Loading screen before showing recommendation |
| `/thespot?cafe_id=…` | Detail page of a specific café |
| `/map` | Map with current + visited + liked cafés |
| `/recommendations` | Submit a new recommendation |
| `/login` | Log in / register |
| `/account` | User account & liked places |
| `/account/edit` | Edit account details |

---

## NFC Flow

The app is designed to be triggered by NFC tags placed in cafés. Each tag encodes a URL:

```
https://integration4-ten.vercel.app/beerloader
```

Scanning the tag opens the beerloading page which starts the full flow:
**beerloading → storytelling → loadingrecommendation → home**

For local testing you can simulate this by visiting:

```
http://localhost:5173/beerloader
```

---

## Live Deployment

The app is deployed on **Vercel** at:
**https://integration4-ten.vercel.app**

Deployment is automatic on every push to the `main` branch.
