# Stappenplan — Project opstarten

## Vereisten

Zorg dat het volgende geïnstalleerd is op je computer:

- [Node.js](https://nodejs.org/) versie 18 of hoger
- Een terminal (Terminal op Mac, PowerShell of Git Bash op Windows)
- [Git](https://git-scm.com/)

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

De terminal toont een lokale URL, normaal gezien:

```
http://localhost:5173
```

Open deze URL in je browser.

---

## Wat wordt er gebruikt?

| Service | Waarvoor | Toegang nodig? |
|---|---|---|
| **Supabase** | Database (cafés, aanbevelingen, gebruikers) | Nee — credentials zitten in `.env` |
| **Cloudinary** | Foto-uploads bij aanbevelingen | Nee — gekoppeld via onze account |
| **Supabase Auth** | Inloggen & account aanmaken | Nee — werkt via Supabase |

---

## Account aanmaken in de app

Je kan zelf een account aanmaken via de app (knop "Create Profile"). Er is geen e-mailbevestiging vereist. Na aanmaken krijg je automatisch een willekeurige huidige locatie en enkele bezochte cafés op je map.

Wil je inloggen met een bestaand testaccount, neem dan contact op met een van de teamleden.

---

## Problemen?

- **`npm install` geeft errors** → controleer of Node.js correct geïnstalleerd is (`node -v`)
- **Pagina laadt maar toont niets** → controleer of het `.env` bestand correct aangemaakt is in `router-app/`
- **Foto's uploaden niet** → dit werkt enkel met een internetverbinding (Cloudinary)
