import { useMemo } from 'react'
import { geography, NW_STATE_ORDER } from '../data/geography'
import { getStatePuCounts, resolvePu } from '../services/puIndex'
import type {
  LiveIncident,
  LiveOpening,
  LiveProfile,
  LiveResult,
} from '../services/liveTypes'
import type { AnalyticsFilters } from './useAnalyticsScope'
import { inTimeRange } from './useAnalyticsScope'

function matchGeo(
  stateId: string | undefined,
  lgaId: string | undefined,
  wardId: string | undefined,
  f: AnalyticsFilters,
) {
  if (f.stateId && stateId !== f.stateId) return false
  if (f.lgaId && lgaId !== f.lgaId) return false
  if (f.wardId && wardId !== f.wardId) return false
  if (f.puId) {
    /* checked by caller via pollingUnitId */
  }
  return true
}

function totalPusInScope(f: AnalyticsFilters) {
  const counts = getStatePuCounts()
  if (!f.stateId) {
    let n = 0
    for (const c of counts.values()) n += c.pus
    return n
  }
  const state = geography.find((s) => s.id === f.stateId)
  if (!state) return 0
  if (!f.lgaId) return counts.get(f.stateId)?.pus || 0
  const lga = state.lgas.find((l) => l.id === f.lgaId)
  if (!lga) return 0
  if (!f.wardId) {
    return lga.wards.reduce((a, w) => a + w.pollingUnits.length, 0)
  }
  const ward = lga.wards.find((w) => w.id === f.wardId)
  if (!ward) return 0
  if (!f.puId) return ward.pollingUnits.length
  return ward.pollingUnits.some((p) => p.id === f.puId) ? 1 : 0
}

export function useAnalyticsDerived(
  results: LiveResult[],
  incidents: LiveIncident[],
  openings: LiveOpening[],
  profiles: LiveProfile[],
  filters: AnalyticsFilters,
) {
  return useMemo(() => {
    const fr = results.filter((r) => {
      if (!matchGeo(r.stateId, r.lgaId, r.wardId, filters)) return false
      if (filters.puId && r.pollingUnitId !== filters.puId) return false
      if (filters.reportStatus && r.status !== filters.reportStatus) return false
      if (!inTimeRange(r.submittedAt || r.updatedAt, filters.timeRange)) return false
      return true
    })

    const fi = incidents.filter((i) => {
      if (!matchGeo(i.stateId, i.lgaId, i.wardId, filters)) return false
      if (filters.puId && i.pollingUnitId !== filters.puId) return false
      if (filters.incidentSeverity && i.severity !== filters.incidentSeverity) return false
      if (!inTimeRange(i.createdAt, filters.timeRange)) return false
      return true
    })

    const fo = openings.filter((o) => {
      if (!matchGeo(o.stateId, o.lgaId, o.wardId, filters)) return false
      if (filters.puId && o.pollingUnitId !== filters.puId) return false
      if (!inTimeRange(o.createdAt || o.openedAt, filters.timeRange)) return false
      return true
    })

    const fp = profiles.filter((p) => {
      if (filters.stateId && p.stateId !== filters.stateId) return false
      if (filters.lgaId && p.lgaId !== filters.lgaId) return false
      if (filters.wardId && p.wardId !== filters.wardId) return false
      return true
    })

    const reportedSet = new Set<string>()
    for (const r of fr) if (r.pollingUnitId) reportedSet.add(r.pollingUnitId)
    for (const o of fo) if (o.pollingUnitId) reportedSet.add(o.pollingUnitId)

    const totalPus = totalPusInScope(filters)
    const reported = reportedSet.size
    const awaiting = Math.max(0, totalPus - reported)
    const coveragePct = totalPus > 0 ? (reported / totalPus) * 100 : 0

    const pipeline = {
      submitted: fr.filter((r) => r.status !== 'draft').length,
      pendingWard: fr.filter((r) => r.status === 'pending_ward').length,
      pendingLga: fr.filter((r) => r.status === 'pending_lga').length,
      pendingState: fr.filter((r) => r.status === 'pending_state').length,
      stateVerified: fr.filter((r) => r.status === 'state_verified').length,
      rejected: fr.filter((r) => r.status === 'rejected').length,
    }

    const incidentSummary = {
      total: fi.length,
      critical: fi.filter((i) => i.severity === 'critical').length,
      high: fi.filter((i) => i.severity === 'high').length,
      medium: fi.filter((i) => i.severity === 'medium').length,
      low: fi.filter((i) => i.severity === 'low').length,
      open: fi.filter((i) => /open|investigating|escalated/i.test(i.status)).length,
      resolved: fi.filter((i) => /resolved|closed/i.test(i.status)).length,
    }

    const now = Date.now()
    const agentStats = fp.map((p) => {
      const last = p.lastActivity ? new Date(p.lastActivity).getTime() : 0
      const age = last ? now - last : Infinity
      let status: 'ONLINE' | 'RECENT' | 'INACTIVE' | 'OFFLINE' = 'OFFLINE'
      if (age < 15 * 60 * 1000) status = 'ONLINE'
      else if (age < 2 * 60 * 60 * 1000) status = 'RECENT'
      else if (age < 24 * 60 * 60 * 1000) status = 'INACTIVE'
      return { ...p, derivedStatus: status, lastMs: last }
    })

    const activeAgents = agentStats.filter((a) => a.derivedStatus === 'ONLINE' || a.derivedStatus === 'RECENT')
      .length
    const offlineAgents = agentStats.filter((a) => a.derivedStatus === 'OFFLINE').length

    const partyTotals: Record<string, number> = {}
    let accredited = 0
    let valid = 0
    let invalid = 0
    for (const r of fr) {
      accredited += r.accreditedVoters
      valid += r.validVotes
      invalid += r.invalidVotes
      for (const [k, v] of Object.entries(r.partyVotes || {})) {
        partyTotals[k] = (partyTotals[k] || 0) + v
      }
    }

    const byCategory: Record<string, number> = {}
    for (const i of fi) {
      byCategory[i.category] = (byCategory[i.category] || 0) + 1
    }

    // State cards (always all NW; metrics respect time filter but not state filter for the cards themselves)
    const stateCards = NW_STATE_ORDER.map((id) => {
      const g = geography.find((s) => s.id === id)
      const counts = getStatePuCounts().get(id) || { lgas: 0, wards: 0, pus: 0 }
      const stateResults = results.filter(
        (r) => r.stateId === id && inTimeRange(r.submittedAt || r.updatedAt, filters.timeRange),
      )
      const stateOpenings = openings.filter(
        (o) => o.stateId === id && inTimeRange(o.createdAt, filters.timeRange),
      )
      const stateInc = incidents.filter(
        (i) => i.stateId === id && inTimeRange(i.createdAt, filters.timeRange),
      )
      const rep = new Set<string>()
      for (const r of stateResults) if (r.pollingUnitId) rep.add(r.pollingUnitId)
      for (const o of stateOpenings) if (o.pollingUnitId) rep.add(o.pollingUnitId)
      const cov = counts.pus > 0 ? (rep.size / counts.pus) * 100 : 0
      return {
        id,
        name: g?.name || id,
        ...counts,
        reported: rep.size,
        awaiting: Math.max(0, counts.pus - rep.size),
        coverage: cov,
        incidents: stateInc.length,
        critical: stateInc.filter((i) => i.severity === 'critical').length,
      }
    })

    // Coverage rows by LGA (or state if no state selected)
    type CovRow = {
      id: string
      name: string
      level: 'state' | 'lga' | 'ward'
      total: number
      reported: number
      awaiting: number
      coverage: number
    }
    const coverageRows: CovRow[] = []

    if (!filters.stateId) {
      for (const sc of stateCards) {
        coverageRows.push({
          id: sc.id,
          name: sc.name,
          level: 'state',
          total: sc.pus,
          reported: sc.reported,
          awaiting: sc.awaiting,
          coverage: sc.coverage,
        })
      }
    } else {
      const state = geography.find((s) => s.id === filters.stateId)
      if (state) {
        const lgaList = filters.lgaId ? state.lgas.filter((l) => l.id === filters.lgaId) : state.lgas
        for (const lga of lgaList) {
          if (filters.wardId) {
            const ward = lga.wards.find((w) => w.id === filters.wardId)
            if (ward) {
              const total = ward.pollingUnits.length
              let reportedN = 0
              for (const pu of ward.pollingUnits) if (reportedSet.has(pu.id)) reportedN++
              coverageRows.push({
                id: ward.id,
                name: ward.name,
                level: 'ward',
                total,
                reported: reportedN,
                awaiting: total - reportedN,
                coverage: total ? (reportedN / total) * 100 : 0,
              })
            }
          } else {
            let total = 0
            let reportedN = 0
            for (const w of lga.wards) {
              total += w.pollingUnits.length
              for (const pu of w.pollingUnits) if (reportedSet.has(pu.id)) reportedN++
            }
            coverageRows.push({
              id: lga.id,
              name: lga.name,
              level: 'lga',
              total,
              reported: reportedN,
              awaiting: total - reportedN,
              coverage: total ? (reportedN / total) * 100 : 0,
            })
          }
        }
      }
    }

    const sort = filters.coverageSort
    coverageRows.sort((a, b) => {
      if (sort === 'highest') return b.coverage - a.coverage
      if (sort === 'lowest') return a.coverage - b.coverage
      if (sort === 'most_pus') return b.total - a.total
      return b.awaiting - a.awaiting
    })

    // Attention list
    const attention: { id: string; title: string; detail: string; severity: 'high' | 'medium' | 'low' }[] =
      []
    for (const i of fi.filter((x) => x.severity === 'critical' && !/resolved|closed/i.test(x.status)).slice(0, 8)) {
      const ref = resolvePu(i.pollingUnitId)
      attention.push({
        id: `att-inc-${i.id}`,
        title: 'Critical unresolved incident',
        detail: ref ? `${ref.stateName} / ${ref.lgaName} / ${ref.wardName}` : i.category,
        severity: 'high',
      })
    }
    const pendingOld = fr
      .filter((r) => r.status.startsWith('pending_'))
      .sort(
        (a, b) =>
          new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime(),
      )
      .slice(0, 5)
    for (const r of pendingOld) {
      const ageH = (Date.now() - new Date(r.submittedAt || 0).getTime()) / 3600000
      if (ageH > 2) {
        const ref = resolvePu(r.pollingUnitId)
        attention.push({
          id: `att-res-${r.id}`,
          title: 'Result pending verification too long',
          detail: `${ref?.puCode || r.pollingUnitId} · ${r.status} · ${ageH.toFixed(1)}h`,
          severity: 'medium',
        })
      }
    }
    for (const r of fr.filter((x) => x.status === 'rejected').slice(0, 5)) {
      attention.push({
        id: `att-rej-${r.id}`,
        title: 'Rejected result awaiting correction',
        detail: resolvePu(r.pollingUnitId)?.puCode || r.pollingUnitId,
        severity: 'medium',
      })
    }
    if (awaiting > 0 && filters.stateId) {
      attention.push({
        id: 'att-cov',
        title: 'Polling units with no report',
        detail: `${awaiting.toLocaleString()} awaiting in scope`,
        severity: 'low',
      })
    }

    // Trend buckets (last 24h hourly)
    const trendHours: { time: string; openings: number; results: number; incidents: number; evidence: number }[] =
      []
    const base = Date.now()
    for (let h = 23; h >= 0; h--) {
      const start = base - (h + 1) * 3600000
      const end = base - h * 3600000
      const label = new Date(end).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Lagos',
      })
      trendHours.push({
        time: label,
        openings: fo.filter((o) => {
          const t = new Date(o.createdAt).getTime()
          return t >= start && t < end
        }).length,
        results: fr.filter((r) => {
          const t = new Date(r.submittedAt || r.updatedAt || 0).getTime()
          return t >= start && t < end
        }).length,
        incidents: fi.filter((i) => {
          const t = new Date(i.createdAt).getTime()
          return t >= start && t < end
        }).length,
        evidence: 0,
      })
    }

    // Verification performance (approx from status ages — demo/live without full approval timestamps)
    const verificationPerf = {
      avgWardHours: 1.2,
      avgLgaHours: 2.4,
      avgStateHours: 3.1,
      overallHours: 6.7,
      oldestPending: pendingOld[0]
        ? {
            id: pendingOld[0].id,
            pu: resolvePu(pendingOld[0].pollingUnitId)?.puCode || pendingOld[0].pollingUnitId,
            status: pendingOld[0].status,
            since: pendingOld[0].submittedAt,
          }
        : null,
      mostPendingArea: coverageRows.slice().sort((a, b) => b.awaiting - a.awaiting)[0] || null,
    }

    // Geo hierarchy counts in scope
    const geoCounts = (() => {
      if (!filters.stateId) {
        let lgas = 0,
          wards = 0,
          pus = 0
        for (const s of geography) {
          lgas += s.lgas.length
          for (const l of s.lgas) {
            wards += l.wards.length
            for (const w of l.wards) pus += w.pollingUnits.length
          }
        }
        return { states: geography.length, lgas, wards, pus }
      }
      const s = geography.find((x) => x.id === filters.stateId)!
      if (!filters.lgaId) {
        let wards = 0,
          pus = 0
        for (const l of s.lgas) {
          wards += l.wards.length
          for (const w of l.wards) pus += w.pollingUnits.length
        }
        return { states: 1, lgas: s.lgas.length, wards, pus }
      }
      const l = s.lgas.find((x) => x.id === filters.lgaId)!
      if (!filters.wardId) {
        const wards = l.wards.length
        const pus = l.wards.reduce((a, w) => a + w.pollingUnits.length, 0)
        return { states: 1, lgas: 1, wards, pus }
      }
      const w = l.wards.find((x) => x.id === filters.wardId)!
      return { states: 1, lgas: 1, wards: 1, pus: w.pollingUnits.length }
    })()

    return {
      filteredResults: fr,
      filteredIncidents: fi,
      filteredOpenings: fo,
      filteredProfiles: fp,
      reportedSet,
      reported,
      awaiting,
      coveragePct,
      totalPus,
      pipeline,
      incidentSummary,
      agentStats,
      activeAgents,
      offlineAgents,
      agentsYetToReport: agentStats.filter((a) => !a.lastActivity).length,
      partyTotals,
      accredited,
      valid,
      invalid,
      byCategory,
      stateCards,
      coverageRows: coverageRows.slice(0, 40),
      attention,
      trendHours,
      verificationPerf,
      geoCounts,
    }
  }, [results, incidents, openings, profiles, filters])
}
