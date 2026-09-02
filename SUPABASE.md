❤️# MST Service — bază de date Supabase (cloud, gratuit)

Aplicația salvează programările într-o bază de date cloud **Supabase**
(PostgreSQL gratuit). Totul funcționează prin `lib/db.ts`, care folosește
fie Supabase, fie fișierul local `data/appointments.json` ca **fallback**,
dacă configurarea lipsește.

---

## 1. Creează un proiect Supabase (gratuit)

1. Deschide <https://supabase.com/dashboard> și creează un cont (sau loghează-te).
2. Apasă **New project**, alege un nume (ex: `mst-service`), o parolă și o
   regiune aproape de tine, apoi **Create new project** (durează ~2 minute).

## 2. Creează tabelul `appointments`

1. În dashboard, deschide **SQL Editor** → **New query**.
2. Copiază întregul conținut din `supabase/schema.sql` și apasă **Run**.
   - Se creează tabelul `appointments`, indexul pe `created_at` și se
     dezactivează Row Level Security (pentru simplu, cu Service Role Key).

## 3. Completează variabilele de mediu

1. În dashboard: **Project Settings** (⚙️) → **API**.
2. Copiază:
   - **Project URL** → `SUPABASE_URL`
   - **Project API keys** → `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. Crează/editează fișierul `.env.local` la rădăcina proiectului:

```env
SUPABASE_URL=https://abc123xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> ⚠️ `service_role` este o cheie secretă care ocolește securitatea.
> Nu o expune niciodată în cod client/browser.

## 4. (Opțional) Migrează datele existente

Dacă ai deja programări în `data/appointments.json` și vrei să le muți în
Supabase, rulează:

```bash
node scripts/migrate-to-supabase.mjs
```

(repetă oricând; scriptul face upsert pe `id`, deci e sigur de rulat de mai multe ori)

---

## Comportamentul fallback

Dacă `SUPABASE_URL` sau `SUPABASE_SERVICE_ROLE_KEY` lipsesc din `.env.local`,
aplicația **continuă să funcționeze** folosind automat `data/appointments.json`.
Vei vedea un mesaj de warning în consolă:

```
[db] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY lipsesc. Se folosește data/appointments.json (fallback local, doar pentru dezvoltare).
```

Astfel poți dezvolta local fără cont Supabase, iar când adaugi cheile, datele
încep să se salveze în cloud.

---

## Fișiere relevante

| Fișier | Rol |
| --- | --- |
| `lib/db.ts` | Stratul de date: Supabase + fallback local |
| `supabase/schema.sql` | Schema tabelului `appointments` (rulează în SQL Editor) |
| `scripts/migrate-to-supabase.mjs` | Importă `data/appointments.json` în Supabase |

> Variabilele de mediu (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) se
> completează direct în `.env.local` — vezi secțiunea 3 de mai sus.
