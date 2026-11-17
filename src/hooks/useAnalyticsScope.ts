import { useMemo, useState, useCallback } from 'react'
import { geography, getState } from '../data/geography'

export type TimeRange = '15m' | 'hourly' | 'election_day' | '24h' | 'all'

export type AnalyticsFilters = {
  stateId: string
  lgaId: string
  wardId: string
  puId: string
  reportStatus: string
  timeRange: TimeRange
  incidentSeverity: string
  search: string
  coverageSort: 'highest' | 'lowest' | 'most_pus' | 'most_awaiting'
  mapLayer: 'coverage' | 'incidents' | 'verification' | 'agents'
}

const defaults: AnalyticsFilters = {
  stateId: '',
  lgaId: '',
  wardId: '',
  puId: '',
  reportStatus: '',
  timeRange: 'all',
  incidentSeverity: '',
  search: '',
  coverageSort: 'lowest',
  mapLayer: 'coverage',
}

export function useAnalyticsScope() {
  const [filters, setFilters] = useState<AnalyticsFilters>(defaults)

  const patch = useCallback((p: Partial<AnalyticsFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...p }
      if (p.stateId !== undefined && p.stateId !== prev.stateId) {
        next.lgaId = ''
        next.wardId = ''
        next.puId = ''
      }
      if (p.lgaId !== undefined && p.lgaId !== prev.lgaId) {
        next.wardId = ''
        next.puId = ''
      }
      if (p.wardId !== undefined && p.wardId !== prev.wardId) {
        next.puId = ''
      }
      return next
    })
  }, [])

  const selectState = useCallback((stateId: string) => patch({ stateId }), [patch])

  const lgas = useMemo(() => {
    if (!filters.stateId) return []
    return getState(filters.stateId)?.lgas || []
  }, [filters.stateId])

  const wards = useMemo(() => {
    if (!filters.stateId || !filters.lgaId) return []
    return lgas.find((l) => l.id === filters.lgaId)?.wards || []
  }, [filters.stateId, filters.lgaId, lgas])

  const pus = useMemo(() => {
    if (!filters.wardId) return []
    return wards.find((w) => w.id === filters.wardId)?.pollingUnits || []
  }, [filters.wardId, wards])

  const scopeLabel = useMemo(() => {
    if (!filters.stateId) return 'All North West'
    const s = geography.find((g) => g.id === filters.stateId)
    if (!s) return 'All North West'
    let label = s.name
    if (filters.lgaId) {
      const l = s.lgas.find((x) => x.id === filters.lgaId)
      if (l) label += ` › ${l.name}`
    }
    if (filters.wardId) {
      const l = s.lgas.find((x) => x.id === filters.lgaId)
      const w = l?.wards.find((x) => x.id === filters.wardId)
      if (w) label += ` › ${w.name}`
    }
    return label
  }, [filters])

  return { filters, patch, selectState, lgas, wards, pus, scopeLabel, reset: () => setFilters(defaults) }
}

export function inTimeRange(iso: string | null | undefined, range: TimeRange, now = Date.now()) {
  if (range === 'all' || !iso) return true
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return true
  if (range === '15m') return now - t <= 15 * 60 * 1000
  if (range === 'hourly') return now - t <= 60 * 60 * 1000
  if (range === '24h') return now - t <= 24 * 60 * 60 * 1000
  if (range === 'election_day') {
    const d = new Date(t)
    const n = new Date(now)
    return d.toDateString() === n.toDateString()
  }
  return true
}
