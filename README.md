# ElecMonitor · Election Situation Room

Production-quality **demo** webapp for a North-West Nigeria election situation room (City Boy Movement × APC branding). All operational data is fictional and local — there is no backend.

**Live:** https://rersheed.github.io/elecmonitor/

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173/elecmonitor/`).

```bash
npm run build   # tsc + vite + dist/404.html
npm run preview
```

Refresh GitHub Pages from build:

```bash
rm -rf docs && cp -a dist docs && touch docs/.nojekyll
```

## Branding

| Mark | File | Source |
|------|------|--------|
| City Boy Movement | `public/city-boy-logo.png` | Campaign wordmark (cap + glasses) |
| APC (All Progressives Congress) | `public/apc-logo.png` | [Wikipedia APC logo](https://en.wikipedia.org/wiki/All_Progressives_Congress) (`upload.wikimedia.org/.../All_Progressives_Congress_logo.png`) |

UI palette follows APC flag colours: **green, white, sky blue, red** on a dense dark Situation Room chrome. Product names remain **ElecMonitor** / **Election Situation Room**.

## Geography scope

**North-West only** — Lagos, Rivers, and all non-NW states removed.

| State | Code |
|-------|------|
| Kaduna | KD |
| Kano | KN |
| Katsina | KT |
| Jigawa | JG |
| Kebbi | KB |
| Sokoto | SO |
| Zamfara | ZA |

Demo seed includes **all LGAs**, **all wards**, and **all polling units** for these states (INEC-derived names).

Rebuild NW data:

```bash
python3 scripts/build_nw.py
```

### Data sources

- **State → LGA → Ward → PU:** [afeibukun/nigerian-state-lgas-wards-polling-units](https://github.com/afeibukun/nigerian-state-lgas-wards-polling-units) (INEC-scraped hierarchy)
- **Ward coordinates:** [open-admin-data/nigeria-administrative-divisions](https://github.com/open-admin-data/nigeria-administrative-divisions) (CC-BY-4.0)
- **Boundaries:** [geoBoundaries](https://www.geoboundaries.org/) NGA ADM1/ADM2 simplified (gbOpen) — clipped to NW

### Known gaps

- A few LGA GeoJSON polygons use generated ids when name matching failed (e.g. spelling variants like Biriniwa / Birniwa).
- Polling units have **names only** (no PU lat/lon in source); maps show **ward centroids** as points when zoomed to a state.
- ~6% of wards lack open-admin coordinates.

## Maps

- **Leaflet** + Carto dark basemap
- NW state choropleth (report volume) → LGA polygons on state select → ward point markers
- Legend + click sync with geography table filters

GeoJSON assets live in `public/geo/` (`nw-states.geojson`, `nw-lgas.geojson`, `nw-ward-markers.json`).

## Routes

| Path | Module |
|------|--------|
| `/` | Overview (Situation Room) |
| `/geography` … | Drill-down State → LGA → Ward |
| `/reports`, `/incidents`, `/verification`, `/agents`, `/results`, `/evidence`, `/analytics` | Ops modules |
| `/users`, `/audit`, `/settings`, `/login` | Admin / demo login |

Base path: `/elecmonitor/` (Vite `base` + `BrowserRouter` basename). `dist/404.html` copies `index.html` for GitHub Pages SPA fallback.

## Stack

Vite · React · TypeScript · react-router-dom · Leaflet · recharts · lucide-react · date-fns
