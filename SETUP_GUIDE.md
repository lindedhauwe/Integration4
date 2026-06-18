# Stappenplan — Project opstarten

## Systeemvereisten

| Vereiste | Minimum |
|---|---|
| OS | macOS 13+ of Windows 10/11 |
| Node.js | v18+ (v22 aanbevolen) |
| npm | v10+ |
| Internetverbinding | Vereist (Supabase & Cloudinary zijn clouddiensten) |
| Browser | Chrome, Firefox, Safari, Edge (recente versies) |

> **Aanbevolen:** gebruik [nvm](https://github.com/nvm-sh/nvm) om Node versies te beheren.
> Voer `nvm install 22 && nvm use 22` uit indien nodig.

---

## Projectstructuur

```
Integration4/
└── router-app/        ← alle broncode staat hier
    ├── app/
    │   ├── routes/    ← pagina's (_index, thespot, map, recommendations, …)
    │   ├── components/
    │   └── assets/
    ├── public/
    ├── package.json
    └── .env           ← omgevingsvariabelen (zie Stap 2)
```

---

## Stap 1 — Repository klonen

```bash
git clone https://github.com/lindedhauwe/Integration4.git
cd Integration4/router-app
```

---

## Stap 2 — .env bestand aanmaken

Maak in de map `router-app/` een bestand aan met de naam `.env` en zet hier de volgende inhoud in:

```
SUPABASE_URL=https://kxbcmhntcgskcbduezpu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmNtaG50Y2dza2NiZHVlenB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4Njk5OCwiZXhwIjoyMDk1NzYyOTk4fQ.PGbg0B7-wgZ2k1Vina8iK96-QWz_sx5esKyTAKGIR24

VITE_SUPABASE_URL=https://kxbcmhntcgskcbduezpu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_fxNwDK9vM24IZ3Jw8_r7nw_e0VyTRcj
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YmNtaG50Y2dza2NiZHVlenB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDE4Njk5OCwiZXhwIjoyMDk1NzYyOTk4fQ.PGbg0B7-wgZ2k1Vina8iK96-QWz_sx5esKyTAKGIR24
```

> Dit bestand is niet meegeleverd in de repository om veiligheidsredenen, maar de waarden hierboven zijn correct en geven toegang tot onze Supabase database.

---

## Stap 3 — Dependencies installeren

```bash
npm install
```

Dit installeert alle benodigde packages (React Router, Supabase, GSAP, ...).

---

## Stap 4 — Project starten

```bash
npm run dev
```

De app is beschikbaar op **http://localhost:5173** (of een andere poort als 5173 bezet is — check de terminal output).

---

## Stap 5 — Bouwen voor productie (optioneel)

```bash
npm run build
```

Dit genereert een `build/client/` map met statische bestanden klaar om te deployen.

---

## Gebruikte diensten

| Dienst | Waarvoor | Toegang nodig? |
|---|---|---|
| **Supabase** | Database (cafés, aanbevelingen, gebruikers) + Auth | Nee — credentials zitten in `.env` |
| **Cloudinary** | Foto-uploads bij aanbevelingen | Nee — gekoppeld via onze account |

---

## Overzicht van pagina's

| URL | Pagina |
|---|---|
| `/` | Home — toont een willekeurige aanbeveling na NFC scan |
| `/beerloading` | NFC startpunt — triggert de volledige scan flow |
| `/storytelling` | Onboarding verhaal na NFC scan |
| `/loadingrecommendation` | Laadscherm voor de aanbeveling |
| `/thespot?cafe_id=…` | Detailpagina van een specifiek café |
| `/map` | Kaart met huidig + bezocht + geliket cafés |
| `/recommendations` | Aanbeveling indienen |
| `/login` | Inloggen |
| `/create-profile` | Account aanmaken |
| `/account` | Gebruikersprofiel & gelikete plekken |
| `/account/edit` | Accountgegevens bewerken |

---

## NFC Flow

De app is ontworpen om geactiveerd te worden door NFC-tags in cafés. Elke tag bevat een URL die de beerloading-pagina opent, waarna de volledige flow start:

**beerloading → storytelling → loadingrecommendation → home**

Voor lokaal testen kan je dit simuleren door naar het volgende te navigeren:

```
http://localhost:5173/beerloading
```

---

## Account aanmaken in de app

Je kan zelf een account aanmaken via de app (knop "Create Profile"). Er is geen e-mailbevestiging vereist. Na aanmaken krijg je automatisch een willekeurige huidige locatie en enkele bezochte cafés op je map.

Wil je inloggen met een bestaand testaccount, neem dan contact op met een van de teamleden.

---

## Live deployment

De app staat live op **Netlify**:
**https://integration4-ten.netlify.app**

Elke push naar de `main` branch triggert automatisch een nieuwe deployment.

---

## Problemen?

| Probleem | Oplossing |
|---|---|
| `npm install` geeft errors | Controleer of Node.js correct geïnstalleerd is: `node -v` |
| Pagina laadt maar toont niets | Controleer of het `.env` bestand correct aangemaakt is in `router-app/` |
| Foto's uploaden niet | Dit werkt enkel met een internetverbinding (Cloudinary) |
