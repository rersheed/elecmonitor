import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import type { FeatureCollection, Geometry } from 'geojson'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { useDemoState } from '../context/DemoState'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { geography } from '../data'
import type { PuMapStatus } from '../types'
import 'leaflet/dist/leaflet.css'

const BASE = import.meta.env.BASE_URL

const STATUS_COLORS: Record<PuMapStatus, string> = {
  Verified: '#39a453',
  Review: '#5cc3e7',
  Pending: '#976532',
  Rejected: '#e52b32',
}

function FitAll({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) return
    const b = L.latLngBounds(points)
    if (b.isValid()) map.fitBounds(b.pad(0.12))
  }, [map, points])
  return null
}

function mapReportStatus(status: string): PuMapStatus {
  if (status === 'Verified') return 'Verified'
  if (status === 'Rejected' || status === 'Contested') return 'Rejected'
  if (status === 'Under Review' || status === 'Needs Clarification') return 'Review'
  return 'Pending'
}

export function Maps() {
  const { reports, controls } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [markers, setMarkers] = useState<FeatureCollection | null>(null)
  const [filter, setFilter] = useState<PuMapStatus | 'All'>('All')
  const scope = controls.geoScopeStateId

  useEffect(() => {
    fetch(`${BASE}geo/nw-ward-markers.json`)
      .then((r) => r.json())
      .then(setMarkers)
      .catch(console.error)
  }, [])

  const wardStatus = useMemo(() => {
    const map = new Map<string, PuMapStatus>()
    // Aggregate: worst/priority status per ward from reports
    const priority: Record<PuMapStatus, number> = { Rejected: 4, Review: 3, Pending: 2, Verified: 1 }
    for (const r of reports) {
      if (scope && r.location.stateId !== scope) continue
      const wid = r.location.wardId
      const st = mapReportStatus(r.verificationStatus)
      const prev = map.get(wid)
      if (!prev || priority[st] > priority[prev]) map.set(wid, st)
    }
    return map
  }, [reports, scope])

  const points = useMemo(() => {
    if (!markers) return []
    return markers.features
      .filter((f) => {
        const p = f.properties
        if (!p) return false
        if (scope && p.stateId !== scope) return false
        const st = wardStatus.get(p.id as string) || 'Pending'
        if (filter !== 'All' && st !== filter) return false
        return true
      })
      .map((f) => {
        const p = f.properties!
        const coords = (f.geometry as Geometry & { coordinates: number[] }).coordinates
        const st = wardStatus.get(p.id as string) || 'Pending'
        return {
          id: p.id as string,
          name: p.name as string,
          stateId: p.stateId as string,
          stateName: p.stateName as string,
          lgaId: p.lgaId as string,
          lgaName: p.lgaName as string,
          puCount: p.puCount as number,
          lat: coords[1],
          lon: coords[0],
          status: st,
        }
      })
  }, [markers, wardStatus, filter, scope])

  const counts = useMemo(() => {
    const c: Record<PuMapStatus | 'All', number> = {
      All: 0,
      Verified: 0,
      Review: 0,
      Pending: 0,
      Rejected: 0,
    }
    if (!markers) return c
    for (const f of markers.features) {
      const p = f.properties
      if (!p) continue
      if (scope && p.stateId !== scope) continue
      const st = wardStatus.get(p.id as string) || 'Pending'
      c[st]++
      c.All++
    }
    return c
  }, [markers, wardStatus, scope])

  const fitPts = points.map((p) => [p.lat, p.lon] as [number, number])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Maps</h1>
          <p className="subtitle">
            Polling-unit / ward status layers · NW only
            {scope ? ` · scoped to ${geography.find((g) => g.id === scope)?.name}` : ''} · {label}
          </p>
        </div>
        <Link to="/geography" className="btn btn-sm">
          Geography drill-down
        </Link>
      </div>

      <div className="status-filters">
        {(['All', 'Verified', 'Review', 'Pending', 'Rejected'] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn-sm status-chip${filter === s ? ' active' : ''}`}
            style={
              s !== 'All'
                ? { borderColor: STATUS_COLORS[s], color: filter === s ? '#fff' : STATUS_COLORS[s], background: filter === s ? STATUS_COLORS[s] : undefined }
                : undefined
            }
            onClick={() => setFilter(s)}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="geo-map leaflet-host" style={{ height: 520, minHeight: 520 }}>
          <MapContainer
            center={[12.0, 7.5]}
            zoom={6}
            minZoom={5}
            maxZoom={12}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <FitAll points={fitPts} />
            {points.map((p) => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lon]}
                radius={6}
                pathOptions={{
                  color: STATUS_COLORS[p.status],
                  fillColor: STATUS_COLORS[p.status],
                  fillOpacity: 0.85,
                  weight: 1,
                }}
              >
                <Tooltip>
                  <strong>{p.name}</strong>
                  <br />
                  {p.status} · {p.puCount} PUs
                  <br />
                  {p.lgaName}, {p.stateName}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
          <div className="map-legend" aria-label="Status legend">
            <div className="legend-title">Ward status layer</div>
            {(Object.keys(STATUS_COLORS) as PuMapStatus[]).map((s) => (
              <div className="legend-row" key={s}>
                <span className="swatch round" style={{ background: STATUS_COLORS[s] }} /> {s}
              </div>
            ))}
            <div className="legend-hint">Derived from field report verification · ward centroids</div>
          </div>
        </div>
      </div>
    </div>
  )
}
