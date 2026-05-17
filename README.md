# JUDGE. — Hackathon Judging Platform

A full-stack judging platform for a one-day university hackathon.
Built with **React (Vite) + Tailwind CSS + React Router + Supabase**.

It handles:

- Public **team registration**
- **Judge login** and a per-judge scoring desk
- **Live leaderboard** with a fairness rule: a team's total is only
  shown publicly once all judges have scored it

The visual direction is editorial / brutalist — cream paper, hard
black borders, burnt amber accent, large Fraunces display type.

---

## 1. Set up Supabase

1. Create a new project at <https://supabase.com/>.
2. Open the **SQL Editor** and run the contents of
   [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `teams`, `judges`, `scores` tables, the
   `leaderboard` view, opens RLS policies, and seeds three judge
   accounts.
3. Open **Project Settings → API** and copy:
   - `Project URL`  →  `VITE_SUPABASE_URL`
   - `anon` public key  →  `VITE_SUPABASE_ANON_KEY`

> The `scores` table has a `UNIQUE (team_id, judge_id)` constraint so
> the app can upsert: a judge can adjust their score for a team and it
> overwrites the previous row.

### Seeded judge credentials

| Username | Password     | Display name |
| -------- | ------------ | ------------ |
| `judge1` | `changeme1`  | Judge One    |
| `judge2` | `changeme2`  | Judge Two    |
| `judge3` | `changeme3`  | Judge Three  |

**Change the passwords before the event** — they live in plain text in
the `judges` table by design (one-day event, low stakes). To rotate,
just update the row in the Supabase table editor.

---

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

---

## 3. Run the dev server

```bash
npm install
npm run dev
```

Open <http://localhost:5173>.

To build for production:

```bash
npm run build
npm run preview
```

---

## 4. Routes

| Path              | Who          | What it does                                                                 |
| ----------------- | ------------ | ---------------------------------------------------------------------------- |
| `/`               | Public       | Landing page — hero, challenge, tracks, timeline, judging criteria           |
| `/register`       | Public       | Team registration form (writes to `teams`)                                   |
| `/login`          | Public       | Judge login (queries `judges` by username + password)                        |
| `/judge`          | Judge only   | List of all teams, marked `NOT SCORED` or `SCORED: x/100`                    |
| `/judge/:teamId`  | Judge only   | Score the team across 4 criteria (0–25 each), upsert into `scores`          |
| `/leaderboard`    | Public       | Live podium + table, refreshed every 10 s. Hides teams not fully judged.    |

`/judge` and `/judge/:teamId` are wrapped in a `<RequireJudge>` guard
that redirects to `/login` when there is no `judge_session` in
localStorage.

---

## 5. Scoring model

| Criterion                       | Max |
| ------------------------------- | --- |
| Innovation & originality        | 25  |
| Technical execution             | 25  |
| Presentation & communication    | 25  |
| Impact & feasibility            | 25  |
| **Total**                       | **100** |

The `total` column is `GENERATED ALWAYS AS (innovation + execution +
presentation + impact) STORED` so the database is the source of truth.

### Fairness rule on the leaderboard

The Leaderboard view reads `judges_scored = COUNT(scores.id)` per team.
The client only ranks teams whose `judges_scored >= 3` (the number of
seeded judges). Everyone else appears at the bottom of the table with
`PENDING` instead of a total. Change `REQUIRED_JUDGES` in
[`src/pages/Leaderboard.jsx`](./src/pages/Leaderboard.jsx) if you seed a
different number of judges.

---

## 6. Project structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .env.example
├── supabase/
│   └── schema.sql                 # run once in Supabase SQL editor
└── src/
    ├── main.jsx
    ├── App.jsx                    # routes + RequireJudge guard
    ├── index.css                  # Tailwind + custom brutalist styles
    ├── lib/
    │   ├── supabase.js            # createClient + env handling
    │   └── auth.js                # getJudge / setJudge / clearJudge
    ├── components/
    │   ├── Layout.jsx
    │   ├── Marquee.jsx            # scrolling top strip
    │   ├── TopNav.jsx             # logo + page name + clock
    │   ├── RequireJudge.jsx
    │   ├── Toast.jsx
    │   └── Icons.jsx              # inline SVG line icons (no emoji)
    └── pages/
        ├── Landing.jsx
        ├── Register.jsx
        ├── Login.jsx
        ├── JudgeDashboard.jsx
        ├── ScoreTeam.jsx
        └── Leaderboard.jsx
```

---

## 7. Design notes

- Palette: `#f4f0e6` paper, `#0a0a0a` ink, `#ff6b1a` amber,
  `#1f3d2b` moss
- Fonts: **Fraunces** (display, italic for emphasis), **Inter Tight**
  (body), **JetBrains Mono** (numbers, scores, codes)
- Hard `2px` black borders, offset `6px 6px 0 #000` drop shadows on
  cards and buttons
- Subtle SVG turbulence noise as a paper-grain overlay (`.paper-grain`
  in `src/index.css`)
- A black marquee strip scrolls at the top of every page
- No emoji UI, no glassmorphism, no purple gradients

---

## 8. Before the event — quick checklist

- [ ] Run `supabase/schema.sql` in your Supabase project
- [ ] Rotate the three judge passwords in the `judges` table
- [ ] Fill in `.env` with your project URL and anon key
- [ ] Edit the placeholder copy in `src/pages/Landing.jsx`
      (challenge brief, event date, timeline)
- [ ] Deploy: `npm run build` and host `/dist` anywhere static
      (Vercel, Netlify, Cloudflare Pages all work out of the box)
