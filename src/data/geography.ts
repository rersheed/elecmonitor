import type { State, GeoPath, LGA, Ward, PollingUnit } from '../types'
import raw from './nw-geography.json'

export const geography = raw as State[]

export function getState(stateId: string) {
  return geography.find((s) => s.id === stateId)
}

export function getLga(stateId: string, lgaId: string) {
  return getState(stateId)?.lgas.find((l) => l.id === lgaId)
}

export function getWard(stateId: string, lgaId: string, wardId: string) {
  return getLga(stateId, lgaId)?.wards.find((w) => w.id === wardId)
}

export function locationPath(loc: GeoPath): string {
  const parts = [loc.stateName, loc.lgaName, loc.wardName]
  if (loc.puName) parts.push(loc.puName)
  return parts.join(' / ')
}

export function shortPath(loc: GeoPath): string {
  return `${loc.stateName} › ${loc.lgaName} › ${loc.wardName}`
}

export function allWards() {
  const wards: { state: State; lga: LGA; ward: Ward }[] = []
  for (const state of geography) {
    for (const lga of state.lgas) {
      for (const ward of lga.wards) {
        wards.push({ state, lga, ward })
      }
    }
  }
  return wards
}

export function allPollingUnits() {
  const pus: { state: State; lga: LGA; ward: Ward; pu: PollingUnit }[] = []
  for (const state of geography) {
    for (const lga of state.lgas) {
      for (const ward of lga.wards) {
        for (const pu of ward.pollingUnits) {
          pus.push({ state, lga, ward, pu })
        }
      }
    }
  }
  return pus
}

let _counts: { states: number; lgas: number; wards: number; pus: number } | null = null
export function countHierarchy() {
  if (_counts) return _counts
  let lgas = 0
  let wards = 0
  let pus = 0
  for (const s of geography) {
    lgas += s.lgas.length
    for (const l of s.lgas) {
      wards += l.wards.length
      for (const w of l.wards) pus += w.pollingUnits.length
    }
  }
  _counts = { states: geography.length, lgas, wards, pus }
  return _counts
}

/** @deprecated SVG placeholders removed — Leaflet GeoJSON is used instead */
export const statePositions: Record<string, { x: number; y: number; w: number; h: number }> = {}
export const lgaOffsets: Record<string, { dx: number; dy: number }> = {}
