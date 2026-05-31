# OfficeMate AI

AI-powered office tools: Email Writer, SOP Generator, and Excel Formula Generator.

## Setup

### 1. Environment variables

Copy the example file and add your Supabase keys:

```powershell
copy .env.local.example .env.local
notepad .env.local
```

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Get keys from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

### 2. Database migration

In Supabase → **SQL Editor**, paste and run:

- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_usage.sql`

### 3. Supabase Auth URLs

Authentication → URL Configuration:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:**
  - `http://localhost:3000/auth/callback`
  - `https://officemate-ai.vercel.app/auth/callback`

Enable **Email** (and optionally **Google**) under Authentication → Providers.

### 4. Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Sign in / sign up |
| `/dashboard` | Protected dashboard |

## Deploy (Vercel)

Add the same `NEXT_PUBLIC_*` environment variables in Vercel project settings, then redeploy.
