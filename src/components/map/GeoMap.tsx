import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import type { FeatureCollection, Geometry } from 'geojson'
import L from 'leaflet'
import { geography, reports, incidents } from '../../data'
import 'leaflet/dist/leaflet.css'

interface Props {
  selectedStateId?: string
  selectedLgaId?: string
  onSelectState?: (id: string) => void
  onSelectLga?: (stateId: string, lgaId: string) => void
}

const BASE = import.meta.env.BASE_URL

function coverageForState(stateId: string) {
  const count = reports.filter((r) => r.location.stateId === stateId).length
  return Math.min(1, count / 20)
}

function coverageForLga(lgaId: string) {
  const count = reports.filter((r) => r.location.lgaId === lgaId).length
  return Math.min(1, count / 8)
}

function stateFill(cov: number, selected: boolean) {
  if (selected) return '#5cc3e7'
  // APC green scale
  const g = Math.round(80 + cov * 100)
  return `rgb(16, ${g}, 60)`
}

function lgaFill(cov: number, selected: boolean) {
  if (selected) return '#e52b32'
  const g = Math.round(90 + cov * 90)
  return `rgb(20, ${g}, 90)`
}

function FitBounds({ data }: { data: FeatureCollection | null }) {
  const map = useMap()
  useEffect(() => {
    if (!data || !data.features.length) return
    const layer = L.geoJSON(data as never)
    const b = layer.getBounds()
    if (b.isValid()) map.fitBounds(b.pad(0.08))
  }, [map, data])
  return null
}

export function GeoMap({ selectedStateId, selectedLgaId, onSelectState, onSelectLga }: Props) {
  const [states, setStates] = useState<FeatureCollection | null>(null)
  const [lgas, setLgas] = useState<FeatureCollection | null>(null)
  const [markers, setMarkers] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [s, l, m] = await Promise.all([
        fetch(`${BASE}geo/nw-states.geojson`).then((r) => r.json()),
        fetch(`${BASE}geo/nw-lgas.geojson`).then((r) => r.json()),
        fetch(`${BASE}geo/nw-ward-markers.json`).then((r) => r.json()),
      ])
      if (!cancelled) {
        setStates(s)
        setLgas(l)
        setMarkers(m)
      }
    }
    load().catch(console.error)
    return () => {
      cancelled = true
    }
  }, [])

  const filteredLgas = useMemo(() => {
    if (!lgas) return null
    if (!selectedStateId) return lgas
    return {
      type: 'FeatureCollection' as const,
      features: lgas.features.filter((f) => f.properties?.stateId === selectedStateId),
    }
  }, [lgas, selectedStateId])

  const filteredMarkers = useMemo(() => {
    if (!markers || !selectedStateId) return null
    return {
      type: 'FeatureCollection' as const,
      features: markers.features.filter((f) => {
        const p = f.properties
        if (!p) return false
        if (p.stateId !== selectedStateId) return false
        if (selectedLgaId && p.lgaId !== selectedLgaId) return false
        return true
      }),
    }
  }, [markers, selectedStateId, selectedLgaId])

  const boundsData = selectedStateId ? filteredLgas : states

  return (
    <div className="geo-map leaflet-host" role="img" aria-label="North-West Nigeria coverage map">
      <MapContainer
        center={[12.0, 7.5]}
        zoom={6}
        minZoom={5}
        maxZoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', borderRadius: 6 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds data={boundsData} />

        {states && !selectedStateId && (
          <GeoJSON
            key="states"
            data={states}
            style={(feat) => {
              const sid = feat?.properties?.stateId as string
              const cov = coverageForState(sid)
              const selected = selectedStateId === sid
              return {
                fillColor: stateFill(cov, selected),
                weight: selected ? 2.5 : 1.2,
                color: selected ? '#5cc3e7' : '#39a453',
                fillOpacity: 0.72,
              }
            }}
            onEachFeature={(feature, layer) => {
              const p = feature.properties || {}
              const sid = p.stateId as string
              const openInc = incidents.filter(
                (i) =>
                  i.location.stateId === sid &&
                  ['Open', 'Investigating', 'Escalated'].includes(i.status),
              ).length
              const reportCount = reports.filter((r) => r.location.stateId === sid).length
              layer.bindTooltip(
                `<strong>${p.stateName}</strong><br/>${reportCount} reports · ${openInc} open incidents`,
                { sticky: true },
              )
              layer.on({
                click: () => onSelectState?.(sid),
              })
            }}
          />
        )}

        {filteredLgas && selectedStateId && (
          <GeoJSON
            key={`lgas-${selectedStateId}-${selectedLgaId || ''}`}
            data={filteredLgas}
            style={(feat) => {
              const lid = feat?.properties?.lgaId as string
              const cov = coverageForLga(lid)
              const selected = selectedLgaId === lid
              return {
                fillColor: lgaFill(cov, selected),
                weight: selected ? 2.5 : 1,
                color: selected ? '#e52b32' : '#39a453',
                fillOpacity: 0.65,
              }
            }}
            onEachFeature={(feature, layer) => {
              const p = feature.properties || {}
              const lid = p.lgaId as string
              const sid = p.stateId as string
              const lc = reports.filter((r) => r.location.lgaId === lid).length
              const openInc = incidents.filter(
                (i) =>
                  i.location.lgaId === lid &&
                  ['Open', 'Investigating', 'Escalated'].includes(i.status),
              ).length
              layer.bindTooltip(
                `<strong>${p.lgaName}</strong><br/>${lc} reports · ${openInc} open`,
                { sticky: true },
              )
              layer.on({
                click: () => onSelectLga?.(sid, lid),
              })
            }}
          />
        )}

        {filteredMarkers?.features.map((f) => {
          const p = f.properties || {}
          const coords = (f.geometry as Geometry & { coordinates: number[] }).coordinates
          if (!coords) return null
          const [lon, lat] = coords
          const selected = selectedLgaId === p.lgaId
          return (
            <CircleMarker
              key={p.id as string}
              center={[lat, lon]}
              radius={selected ? 6 : 4}
              pathOptions={{
                color: '#e52b32',
                fillColor: '#e52b32',
                fillOpacity: 0.85,
                weight: 1,
              }}
              eventHandlers={{
                click: () => onSelectLga?.(p.stateId as string, p.lgaId as string),
              }}
            >
              <Tooltip>
                {p.name as string} · {p.puCount as number} PUs
                <br />
                {p.lgaName as string}, {p.stateName as string}
              </Tooltip>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="map-legend" aria-label="Map legend">
        <div className="legend-title">
          {selectedStateId
            ? `${geography.find((s) => s.id === selectedStateId)?.name || 'State'} · LGAs`
            : 'North-West · 7 states'}
        </div>
        <div className="legend-row">
          <span className="swatch" style={{ background: '#1a5c2e' }} /> Low reports
        </div>
        <div className="legend-row">
          <span className="swatch" style={{ background: '#39a453' }} /> Higher volume
        </div>
        <div className="legend-row">
          <span className="swatch" style={{ background: selectedStateId ? '#e52b32' : '#5cc3e7' }} /> Selected
        </div>
        {selectedStateId && (
          <div className="legend-row">
            <span className="swatch round" style={{ background: '#e52b32' }} /> Ward points
          </div>
        )}
        <div className="legend-hint">Click region to filter · syncs with table</div>
      </div>
    </div>
  )
}
