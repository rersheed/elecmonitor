import { geography } from '../data/geography'

export type PuRef = {
  puId: string
  puName: string
  puCode: string
  wardId: string
  wardName: string
  lgaId: string
  lgaName: string
  stateId: string
  stateName: string
}

let _index: Map<string, PuRef> | null = null
let _byState: Map<string, { lgas: number; wards: number; pus: number }> | null = null

export function getPuIndex(): Map<string, PuRef> {
  if (_index) return _index
  const map = new Map<string, PuRef>()
  for (const state of geography) {
    for (const lga of state.lgas) {
      for (const ward of lga.wards) {
        for (const pu of ward.pollingUnits) {
          const ref: PuRef = {
            puId: pu.id,
            puName: pu.name,
            puCode: pu.code || pu.id,
            wardId: ward.id,
            wardName: ward.name,
            lgaId: lga.id,
            lgaName: lga.name,
            stateId: state.id,
            stateName: state.name,
          }
          map.set(pu.id, ref)
          if (pu.code) map.set(pu.code, ref)
        }
      }
    }
  }
  _index = map
  return map
}

export function resolvePu(pollingUnitId: string): PuRef | undefined {
  return getPuIndex().get(pollingUnitId)
}

export function getStatePuCounts() {
  if (_byState) return _byState
  const m = new Map<string, { lgas: number; wards: number; pus: number }>()
  for (const state of geography) {
    let wards = 0
    let pus = 0
    for (const lga of state.lgas) {
      wards += lga.wards.length
      for (const w of lga.wards) pus += w.pollingUnits.length
    }
    m.set(state.id, { lgas: state.lgas.length, wards, pus })
  }
  _byState = m
  return m
}
