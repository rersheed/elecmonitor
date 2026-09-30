# ElecMonitor · Election Situation Room

Production-quality **demo** webapp for an election situation room. All data is fictional and local — there is no backend.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173/elecmonitor/`).

Production build:

```bash
npm run build
npm run preview
```

`npm run build` runs TypeScript, Vite, then copies `dist/index.html` → `dist/404.html` for GitHub Pages SPA fallback.

## Product naming

| Item | Value |
|------|--------|
| Product | **ElecMonitor** |
| Workspace | **Election Situation Room** |
| Browser title | `ElecMonitor · Election Situation Room` |

## Routes

| Path | Module |
|------|--------|
| `/` | Overview (Situation Room) |
| `/geography` | Geography index |
| `/geography/:stateId` | State detail |
| `/geography/:stateId/:lgaId` | LGA detail |
| `/geography/:stateId/:lgaId/:wardId` | Ward detail |
| `/reports`, `/reports/:id` | Field reports |
| `/incidents`, `/incidents/:id` | Incidents (case numbers) |
| `/verification` | Verification queue |
| `/agents` | Field agents |
| `/results` | PU result submissions |
| `/evidence` | Evidence library |
| `/analytics` | Charts |
| `/users` | Users & roles |
| `/audit` | Audit log |
| `/settings` | Event settings |
| `/login` | Demo login mock |

Base path is `/elecmonitor/` (Vite `base` + `BrowserRouter` basename).

## Deep links (SPA fallback)

Direct loads such as `/elecmonitor/geography` must not 404.

### GitHub Pages

1. Vite `base: '/elecmonitor/'`
2. `BrowserRouter basename="/elecmonitor"`
3. After build, `dist/404.html` is a copy of `dist/index.html` (see `npm run build`) so unknown paths serve the SPA

### Vercel

`vercel.json` ships with:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Also includes `public/_redirects` for Netlify-style hosts:

```
/*    /index.html   200
```

## Stack

- Vite + React + TypeScript
- react-router-dom (`BrowserRouter`)
- recharts, lucide-react, date-fns
- Demo data in `src/data/`

## Notes

- Reports ≠ Incidents
- Status uses text + icons (not colour alone)
- Archive with confirmation instead of Delete
- “Updated Ns ago” ticks on live sections
