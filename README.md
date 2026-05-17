# JUDGE. — Hackathon Judging Platform

A full-stack judging platform for a one-day university hackathon.
Built with **React (Vite) + Tailwind CSS + React Router + Supabase**.

Teams submit their idea (with a GitHub repo link), three judges score on
four criteria, the leaderboard updates live, and an admin dashboard
gives the organizer a full overview with CSV export.

---

## 1. Set up Supabase

1. Create a new project at <https://supabase.com/>.
2. Open the **SQL Editor** and paste / run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `teams`, `judges`, `admins`, `scores` tables, the
   `leaderboard` view, opens RLS policies, and seeds three judge
   accounts plus one admin account.
3. Open **Project Settings → API** and copy:
   - `Project URL`  →  `VITE_SUPABASE_URL`
   - `anon` public key  →  `VITE_SUPABASE_ANON_KEY`

> The schema includes a migration block at the bottom — safe to re-run
> against an existing database. It adds `github_url` to `teams` and
> rebuilds the leaderboard view.

### Seeded credentials

**Judges** (sign in at `/login`, then score teams at `/judge`):

| Username | Password            | Display name |
| -------- | ------------------- | ------------ |
| `judge1` | `judge-ieee-2026-a` | Judge One    |
| `judge2` | `judge-ieee-2026-b` | Judge Two    |
| `judge3` | `judge-ieee-2026-c` | Judge Three  |

**Admin** (sign in at `/admin/login`, then preview everything at `/admin`):

| Username | Password          | Display name    |
| -------- | ----------------- | --------------- |
| `admin`  | `admin-ieee-2026` | Hackathon Admin |

**Change every password in the `judges` and `admins` tables before the
event** — they're stored in plain text by design (one-day event, low
stakes). Rotate via Supabase table editor.

---

## 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

When deploying to Vercel or Cloudflare, add the **same two variables**
in the platform's dashboard (Settings → Environment Variables) and
**redeploy** — Vite bakes `VITE_*` vars in at build time, so existing
builds won't pick up new env vars without a rebuild.

---

## 3. Run the dev server

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

Production build / preview:

```bash
npm run build
npm run preview
```

---

## 4. Routes

| Path             | Who          | What it does                                                            |
| ---------------- | ------------ | ----------------------------------------------------------------------- |
| `/`              | Public       | Landing page                                                            |
| `/submit`        | Public       | Submit your idea (team, members, project, GitHub link, contact)         |
| `/register`      | Public       | Redirects to `/submit` (kept for back-compat)                           |
| `/login`         | Public       | Judge login                                                             |
| `/judge`         | Judge only   | List of all submissions, marked `NOT SCORED` or `SCORED: x/100`         |
| `/judge/:teamId` | Judge only   | Score a team across 4 criteria (0–25 each), upserts into `scores`       |
| `/leaderboard`   | Public       | Live podium + table, refreshed every 10 s, hides totals until all 3 judges scored |
| `/admin/login`   | Public       | Admin login                                                             |
| `/admin`         | Admin only   | Full submissions table with per-judge breakdown + CSV export            |

`/judge` and `/judge/:teamId` are wrapped in `<RequireJudge>`; `/admin`
is wrapped in `<RequireAdmin>`. Both guards redirect to the relevant
login on missing session.

**Admin preview link** (replace the host with your own deploy domain):

```
https://<your-deploy-host>/admin/login
```

After logging in with the admin credentials above, you'll land on `/admin`
which shows every submission, the GitHub link, contact details, scoring
progress per judge, and a CSV export button.

---

## 5. Scoring model

| Criterion                    | Max     |
| ---------------------------- | ------- |
| Innovation & originality     | 25      |
| Technical execution          | 25      |
| Presentation & communication | 25      |
| Impact & feasibility         | 25      |
| **Total**                    | **100** |

The `total` column is `GENERATED ALWAYS AS (innovation + execution +
presentation + impact) STORED` so the database is the source of truth.

### Fairness rule on the leaderboard

A team's total is shown publicly only once **all 3 judges have scored
it**. Everyone else appears at the bottom with `PENDING`. Tweak
`REQUIRED_JUDGES` in [`src/pages/Leaderboard.jsx`](./src/pages/Leaderboard.jsx)
if you seed a different number of judges.

---

## 6. Deploying

**Vercel:** push to GitHub, import the repo, add `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` env vars, deploy. `vercel.json` ships
SPA rewrites so `/leaderboard`, `/admin`, etc. work on direct hit.

**Cloudflare (Workers + Static Assets):** auto-detects Vite; needs
Vite 6+ (we're on that). SPA fallback is handled by the
auto-generated `wrangler.jsonc` (`"not_found_handling": "single-page-application"`).
Add the same two env vars in Workers settings.

**Cloudflare Pages:** import repo, build command `npm run build`,
output `dist`, same env vars. Pages auto-handles SPA fallback.

---

## 7. Project structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json                    # SPA rewrites for Vercel
├── .env.example
├── supabase/
│   └── schema.sql                 # run once in Supabase SQL editor
└── src/
    ├── main.jsx
    ├── App.jsx                    # routes + Require guards
    ├── index.css
    ├── lib/
    │   ├── supabase.js
    │   └── auth.js                # judge_session + admin_session helpers
    ├── components/
    │   ├── Layout.jsx
    │   ├── Marquee.jsx
    │   ├── TopNav.jsx
    │   ├── RequireJudge.jsx
    │   ├── RequireAdmin.jsx
    │   ├── Toast.jsx
    │   └── Icons.jsx
    └── pages/
        ├── Landing.jsx
        ├── Submit.jsx
        ├── Login.jsx
        ├── JudgeDashboard.jsx
        ├── ScoreTeam.jsx
        ├── Leaderboard.jsx
        ├── AdminLogin.jsx
        └── Admin.jsx
```

---

## 8. Pre-event checklist

- [ ] Run `supabase/schema.sql` in your Supabase project
- [ ] Rotate the four passwords (3 judges + 1 admin)
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on every host
- [ ] Trigger a fresh build/deploy after setting env vars
- [ ] Edit the placeholder copy on the landing page
- [ ] Test the full flow: submit → judge logs in → score → leaderboard
      updates → admin sees the breakdown
