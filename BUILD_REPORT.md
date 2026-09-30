# ElecMonitor build report

## How to run
```bash
cd /workspace/elecmonitor
npm install
npm run dev          # http://localhost:5173/elecmonitor/
npm run build        # tsc + vite + cp dist/index.html dist/404.html
npm run preview
```

## Routes
- `/` Overview
- `/geography`, `/geography/:stateId`, `/geography/:stateId/:lgaId`, `/geography/:stateId/:lgaId/:wardId`
- `/reports`, `/reports/:id`
- `/incidents`, `/incidents/:id`
- `/verification`
- `/agents`
- `/results`
- `/evidence`
- `/analytics`
- `/users`
- `/audit`
- `/settings`
- `/login`

SPA deep links work via `base: '/elecmonitor/'` + `BrowserRouter basename="/elecmonitor"` + `dist/404.html` (GitHub Pages) and `vercel.json` rewrites (Vercel). Also `public/_redirects` for Netlify-style hosts.

## Build
`npm run build` succeeds (verified).

## Demo seed
65 reports, 20 incidents, 32 agents, 42 evidence, 36 results, 14 users, 28 audit, 24 activity; geography: Kaduna, Lagos, Rivers.
