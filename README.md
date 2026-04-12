# xarkive.com — Arkiveit Web

Next.js frontend for xarkive.com. Deployed on Vercel.

## Setup

1. Install dependencies:
```
npm install
```

2. Create `.env.local` from the example:
```
cp .env.local.example .env.local
```

3. Fill in your Supabase credentials in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public key (safe to expose)

4. Run locally:
```
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com → New Project → Import `xarkive-web`
3. Add environment variables in Vercel dashboard
4. Deploy
5. Add custom domain `xarkive.com` in Vercel settings

## Getting your Supabase anon key

Go to supabase.com → your project → Settings → API → copy the `anon` `public` key.
This key is safe to use in the frontend — it only has read access to public data.
