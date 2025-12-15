# Cresent Moon Directory — Session Notes

## Project of record
- Repo: cresentmoon-business-profiles
- Goal: Ship a working directory using JSON now, swap to Airtable later.

## Current state
- Next.js app created (App Router + Tailwind).
- Git remote origin set; branch main.
- businesses.json created at app/data/businesses.json (was untracked at last check).

## Key issues observed
- Confusion between similarly named projects (e.g., cresent-moon-directory vs cresentmoon-business-profiles).
- GitHub 404 came from opening the wrong repo URL/path.
- Vercel settings touched: Node version + Environment Variables.

## What “U” means in VS Code Source Control
- Untracked = file exists locally but is NOT committed, so GitHub/Vercel cannot see it yet.

## Commands we used / will use
- npm install
- npm run dev
- git remote -v
- git status
- git add .
- git commit -m "..."
- git push

## Next code change (tomorrow)
1) Confirm local runs: npm run dev → http://localhost:3000
2) Ensure app/page.js imports and renders businesses.json
3) Commit + push so Vercel deploys latest

## Vercel guidance
- Prefer Node 22.x if builds are unstable on 24.x.
- Env vars only needed once we switch to Airtable.
