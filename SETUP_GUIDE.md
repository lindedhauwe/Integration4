# Antwerp on Tap — Setup Guide

## System Requirements

| Requirement | Minimum |
|---|---|
| OS | macOS 13+ or Windows 10/11 |
| Node.js | v18+ (v22 recommended) |
| npm | v10+ |
| Internet connection | Required (Supabase & Cloudinary are cloud services) |
| Browser | Chrome, Firefox, Safari, Edge (modern versions) |

> **Recommended:** use [nvm](https://github.com/nvm-sh/nvm) to manage Node versions.
> Run `nvm install 22 && nvm use 22` if needed.

---

## Project Structure

```
Integration4/
└── router-app/        ← all source code lives here
    ├── app/
    │   ├── routes/    ← pages (_index, thespot, map, recommendations, …)
    │   ├── components/
    │   └── assets/
    ├── public/
    ├── package.json
    └── .env           ← environment variables (see Step 2)
```

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/lindedhauwe/Integration4.git
cd Integration4/router-app
```

---

## Step 2 — Create the .env file

Create a file called `.env` inside the `router-app/` folder with the following content:

```env
SUPABASE_URL=https://kxbcmhntcgskcbduezpu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmNtaG50Y2dza2NiZHVlenB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4Njk5OCwiZXhwIjoyMDk1NzYyOTk4fQ.PGbg0B7-wgZ2k1Vina8iK96-QWz_sx5esKyTAKGIR24

VITE_SUPABASE_URL=https://kxbcmhntcgskcbduezpu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fxNwDK9vM24IZ3Jw8_r7nw_e0VyTRcj
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmNtaG50Y2dza2NiZHVlenB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4Njk5OCwiZXhwIjoyMDk1NzYyOTk4fQ.PGbg0B7-wgZ2k1Vina8iK96-QWz_sx5esKyTAKGIR24
```

> This file is not included in the repository for security reasons, but the values above are correct and give access to our Supabase database.

---

## Step 3 — Install dependencies

```bash
npm install
```

This installs all required packages (React Router, Supabase, GSAP, …).

---

## Step 4 — Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or another port if 5173 is taken — check the terminal output).

---

## Step 5 — Build for production (optional)

```bash
npm run build
```

This generates a `build/client/` folder with static files ready to deploy.

---

## Online Services

| Service | Purpose | Setup needed? |
|---|---|---|
| **Supabase** | Database (cafés, recommendations, users) + Auth | No — credentials are in `.env` |
| **Cloudinary** | Photo uploads for recommendations | No — linked via our account |

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
| `/login` | Log in |
| `/create-profile` | Create an account |
| `/account` | User account & liked places |
| `/account/edit` | Edit account details |

---

## NFC Flow

The app is designed to be triggered by NFC tags placed in cafés. Each tag encodes a URL that opens the beerloading page, which starts the full flow:

**beerloading → storytelling → loadingrecommendation → home**

For local testing you can simulate this by visiting:

```
http://localhost:5173/beerloading
```

---

## Creating an account in the app

You can create your own account via the app ("Create Profile" button). No email confirmation is required. After creating an account you automatically get a random current location and a few visited cafés on your map.

To log in with an existing test account, contact one of the team members.

---

## Live Deployment

The app is deployed on **Netlify** at:
**https://integration4-ten.netlify.app**

Deployment is automatic on every push to the `main` branch.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npm install` gives errors | Check that Node.js is correctly installed: `node -v` |
| Page loads but shows nothing | Check that the `.env` file is correctly created inside `router-app/` |
| Photos don't upload | This only works with an internet connection (Cloudinary) |
