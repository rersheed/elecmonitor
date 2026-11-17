import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getSupabase } from '../services/supabase'
import { realtimeHub, type RealtimeStatus, type RowChange } from '../services/realtime'
import {
  seedLiveActivity,
  seedLiveApprovals,
  seedLiveIncidents,
  seedLiveOpenings,
  seedLiveProfiles,
  seedLiveResults,
} from '../services/demoLiveSeed'
import type {
  DataSourceMode,
  LiveActivityEvent,
  LiveApproval,
  LiveIncident,
  LiveOpening,
  LiveProfile,
  LiveResult,
} from '../services/liveTypes'
import { normalizeResultStatus, normalizeSeverity } from '../services/liveTypes'
import { resolvePu } from '../services/puIndex'

type Toast = { id: string; message: string; detail?: string } | null

interface LiveDataValue {
  mode: DataSourceMode
  connectionStatus: RealtimeStatus
  lastDataAt: number | null
  lastReconcileAt: number | null
  results: LiveResult[]
  incidents: LiveIncident[]
  openings: LiveOpening[]
  approvals: LiveApproval[]
  profiles: LiveProfile[]
  activity: LiveActivityEvent[]
  toast: Toast
  dismissToast: () => void
  refreshFromBackend: () => Promise<void>
  applyingDemo: boolean
}

const LiveDataContext = createContext<LiveDataValue | null>(null)

function enrichResult(row: LiveResult): LiveResult {
  const ref = resolvePu(row.pollingUnitId)
  if (!ref) return row
  return { ...row, stateId: ref.stateId, lgaId: ref.lgaId, wardId: ref.wardId }
}

function enrichIncident(row: LiveIncident): LiveIncident {
  const ref = resolvePu(row.pollingUnitId)
  if (!ref) return row
  return { ...row, stateId: ref.stateId, lgaId: ref.lgaId, wardId: ref.wardId }
}

function enrichOpening(row: LiveOpening): LiveOpening {
  const ref = resolvePu(row.pollingUnitId)
  if (!ref) return row
  return { ...row, stateId: ref.stateId, lgaId: ref.lgaId, wardId: ref.wardId }
}

function mapResultRow(r: Record<string, unknown>, partyVotes: Record<string, number> = {}): LiveResult {
  return enrichResult({
    id: String(r.id),
    pollingUnitId: String(r.polling_unit_id || ''),
    electionId: String(r.election_id || ''),
    submittedBy: String(r.submitted_by || ''),
    accreditedVoters: Number(r.accredited_voters || 0),
    validVotes: Number(r.valid_votes || 0),
    invalidVotes: Number(r.invalid_votes || 0),
    status: normalizeResultStatus(String(r.status || 'pending_ward')),
    rejectionReason: (r.rejection_reason as string) || null,
    submittedAt: (r.submitted_at as string) || null,
    updatedAt: (r.updated_at as string) || null,
    partyVotes,
  })
}

function mapIncidentRow(r: Record<string, unknown>): LiveIncident {
  return enrichIncident({
    id: String(r.id),
    pollingUnitId: String(r.polling_unit_id || ''),
    electionId: String(r.election_id || ''),
    reporterId: String(r.reporter_id || ''),
    category: String(r.category || 'Other'),
    description: String(r.description || ''),
    severity: normalizeSeverity(String(r.severity || 'medium')),
    status: String(r.status || 'open'),
    createdAt: String(r.created_at || new Date().toISOString()),
    photoPath: (r.photo_path as string) || null,
    gpsLat: (r.gps_lat as number) ?? null,
    gpsLon: (r.gps_lon as number) ?? null,
  })
}

function mapOpeningRow(r: Record<string, unknown>): LiveOpening {
  return enrichOpening({
    id: String(r.id),
    pollingUnitId: String(r.polling_unit_id || ''),
    electionId: String(r.election_id || ''),
    reporterId: String(r.reporter_id || ''),
    openedAt: String(r.opened_at || r.created_at || ''),
    status: String(r.status || 'pending_ward'),
    createdAt: String(r.created_at || new Date().toISOString()),
  })
}

function mapApprovalRow(r: Record<string, unknown>): LiveApproval {
  return {
    id: String(r.id),
    resultId: String(r.result_id || ''),
    actorId: String(r.actor_id || ''),
    fromStatus: String(r.from_status || ''),
    toStatus: String(r.to_status || ''),
    reason: (r.reason as string) || null,
    createdAt: String(r.created_at || new Date().toISOString()),
  }
}

function mapProfileRow(r: Record<string, unknown>): LiveProfile {
  return {
    id: String(r.id),
    email: String(r.email || ''),
    fullName: String(r.full_name || ''),
    role: String(r.role || ''),
    stateId: (r.state_id as string) || null,
    lgaId: (r.lga_id as string) || null,
    wardId: (r.ward_id as string) || null,
    lastActivity: (r.created_at as string) || null,
  }
}

function upsertById<T extends { id: string }>(list: T[], row: T): T[] {
  const i = list.findIndex((x) => x.id === row.id)
  if (i < 0) return [row, ...list]
  const next = list.slice()
  next[i] = row
  return next
}

function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((x) => x.id !== id)
}

function loadDemoBundle() {
  const results = seedLiveResults()
  return {
    results,
    incidents: seedLiveIncidents(),
    openings: seedLiveOpenings(),
    approvals: seedLiveApprovals(results),
    profiles: seedLiveProfiles(),
    activity: seedLiveActivity(),
  }
}

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const demo = useMemo(() => loadDemoBundle(), [])
  const [mode, setMode] = useState<DataSourceMode>('DEMO DATA')
  const [connectionStatus, setConnectionStatus] = useState<RealtimeStatus>('DEMO MODE')
  const [lastDataAt, setLastDataAt] = useState<number | null>(null)
  const [lastReconcileAt, setLastReconcileAt] = useState<number | null>(null)
  const [results, setResults] = useState<LiveResult[]>(demo.results)
  const [incidents, setIncidents] = useState<LiveIncident[]>(demo.incidents)
  const [openings, setOpenings] = useState<LiveOpening[]>(demo.openings)
  const [approvals, setApprovals] = useState<LiveApproval[]>(demo.approvals)
  const [profiles, setProfiles] = useState<LiveProfile[]>(demo.profiles)
  const [activity, setActivity] = useState<LiveActivityEvent[]>(demo.activity)
  const [toast, setToast] = useState<Toast>(null)
  const [applyingDemo] = useState(false)
  const liveRef = useRef(false)
  const partyCache = useRef<Map<string, Record<string, number>>>(new Map())

  const pushActivity = useCallback((ev: LiveActivityEvent) => {
    setActivity((prev) => [ev, ...prev].slice(0, 200))
  }, [])

  const touchData = useCallback(() => setLastDataAt(Date.now()), [])

  const fetchAll = useCallback(async (): Promise<boolean> => {
    const client = getSupabase()
    if (!client) return false
    try {
      const [resR, incR, openR, aprR, profR, detR] = await Promise.all([
        client.from('polling_results').select('*').order('updated_at', { ascending: false }).limit(5000),
        client.from('incidents').select('*').order('created_at', { ascending: false }).limit(2000),
        client.from('opening_reports').select('*').order('created_at', { ascending: false }).limit(5000),
        client.from('approvals').select('*').order('created_at', { ascending: false }).limit(5000),
        client.from('profiles').select('*').limit(2000),
        client.from('result_details').select('*').limit(20000),
      ])

      if (resR.error) throw resR.error

      const parties = new Map<string, Record<string, number>>()
      for (const d of detR.data || []) {
        const rid = String((d as { result_id: string }).result_id)
        const pid = String((d as { party_id: string }).party_id)
        const votes = Number((d as { votes: number }).votes || 0)
        const cur = parties.get(rid) || {}
        cur[pid] = votes
        parties.set(rid, cur)
      }
      partyCache.current = parties

      const mappedResults = (resR.data || []).map((r) =>
        mapResultRow(r as Record<string, unknown>, parties.get(String((r as { id: string }).id)) || {}),
      )
      const mappedIncidents = (incR.data || []).map((r) => mapIncidentRow(r as Record<string, unknown>))
      const mappedOpenings = (openR.data || []).map((r) => mapOpeningRow(r as Record<string, unknown>))
      const mappedApprovals = (aprR.data || []).map((r) => mapApprovalRow(r as Record<string, unknown>))
      const mappedProfiles = (profR.data || []).map((r) => mapProfileRow(r as Record<string, unknown>))

      // Prefer live rows; keep demo only if backend empty so Situation Room still useful
      if (mappedResults.length || mappedIncidents.length || mappedOpenings.length) {
        setResults(mappedResults.length ? mappedResults : demo.results)
        setIncidents(mappedIncidents.length ? mappedIncidents : demo.incidents)
        setOpenings(mappedOpenings.length ? mappedOpenings : demo.openings)
        setApprovals(mappedApprovals.length ? mappedApprovals : demo.approvals)
        setProfiles(mappedProfiles.length ? mappedProfiles : demo.profiles)
      }

      setLastReconcileAt(Date.now())
      touchData()
      return true
    } catch (e) {
      console.warn('[LiveData] fetch failed', e)
      return false
    }
  }, [demo, touchData])

  const handleChange = useCallback(
    (change: RowChange) => {
      touchData()
      const row = change.new
      const old = change.old

      if (change.table === 'polling_results') {
        if (change.event === 'DELETE' && old?.id) {
          setResults((prev) => removeById(prev, String(old.id)))
          pushActivity({
            id: `act-${change.at}`,
            timestamp: new Date(change.at).toISOString(),
            kind: 'result',
            title: 'Result removed',
            detail: String(old.polling_unit_id || ''),
          })
          return
        }
        if (row) {
          const mapped = mapResultRow(row, partyCache.current.get(String(row.id)) || {})
          setResults((prev) => upsertById(prev, mapped))
          const ref = resolvePu(mapped.pollingUnitId)
          pushActivity({
            id: `act-${change.at}-res`,
            timestamp: new Date(change.at).toISOString(),
            kind: 'result',
            title:
              change.event === 'INSERT'
                ? 'Result submitted'
                : `Result → ${mapped.status.replace(/_/g, ' ')}`,
            detail: ref
              ? `${ref.lgaName} / ${ref.wardName} / ${ref.puCode}`
              : mapped.pollingUnitId,
          })
        }
        return
      }

      if (change.table === 'incidents') {
        if (change.event === 'DELETE' && old?.id) {
          setIncidents((prev) => removeById(prev, String(old.id)))
          return
        }
        if (row) {
          const mapped = mapIncidentRow(row)
          setIncidents((prev) => upsertById(prev, mapped))
          const ref = resolvePu(mapped.pollingUnitId)
          const sev = mapped.severity.toUpperCase()
          pushActivity({
            id: `act-${change.at}-inc`,
            timestamp: new Date(change.at).toISOString(),
            kind: 'incident',
            title: `${sev} incident reported`,
            detail: ref ? `${ref.lgaName} / ${ref.wardName}` : mapped.category,
            severity: mapped.severity,
          })
          if (mapped.severity === 'high' || mapped.severity === 'critical') {
            setToast({
              id: `t-${change.at}`,
              message: `New ${sev} incident received`,
              detail: ref ? `${ref.lgaName} / ${ref.wardName}` : mapped.category,
            })
          }
        }
        return
      }

      if (change.table === 'opening_reports') {
        if (change.event === 'DELETE' && old?.id) {
          setOpenings((prev) => removeById(prev, String(old.id)))
          return
        }
        if (row) {
          const mapped = mapOpeningRow(row)
          setOpenings((prev) => upsertById(prev, mapped))
          const ref = resolvePu(mapped.pollingUnitId)
          pushActivity({
            id: `act-${change.at}-op`,
            timestamp: new Date(change.at).toISOString(),
            kind: 'opening',
            title: 'Opening report submitted',
            detail: ref ? `${ref.lgaName} / ${ref.wardName}` : mapped.pollingUnitId,
          })
        }
        return
      }

      if (change.table === 'approvals') {
        if (change.event === 'DELETE' && old?.id) {
          setApprovals((prev) => removeById(prev, String(old.id)))
          return
        }
        if (row) {
          const mapped = mapApprovalRow(row)
          setApprovals((prev) => upsertById(prev, mapped))
          pushActivity({
            id: `act-${change.at}-apr`,
            timestamp: new Date(change.at).toISOString(),
            kind: 'approval',
            title: `Supervisor moved result → ${mapped.toStatus.replace(/_/g, ' ')}`,
            detail: mapped.resultId,
          })
        }
        return
      }

      if (change.table === 'result_details' && row) {
        const rid = String(row.result_id)
        const pid = String(row.party_id)
        const votes = Number(row.votes || 0)
        const cur = { ...(partyCache.current.get(rid) || {}), [pid]: votes }
        partyCache.current.set(rid, cur)
        setResults((prev) =>
          prev.map((r) => (r.id === rid ? { ...r, partyVotes: { ...cur } } : r)),
        )
        return
      }

      if (change.table === 'profiles') {
        if (change.event === 'DELETE' && old?.id) {
          setProfiles((prev) => removeById(prev, String(old.id)))
          return
        }
        if (row) {
          setProfiles((prev) => upsertById(prev, mapProfileRow(row)))
        }
      }
    },
    [pushActivity, touchData],
  )

  const refreshFromBackend = useCallback(async () => {
    const ok = await fetchAll()
    if (ok) {
      setMode('LIVE SUPABASE')
      liveRef.current = true
    }
  }, [fetchAll])

  useEffect(() => {
    let cancelled = false
    const unsubStatus = realtimeHub.onStatus((s) => {
      if (!cancelled) setConnectionStatus(s)
    })
    const unsubRows = realtimeHub.subscribe(handleChange)

    async function boot() {
      const client = getSupabase()
      if (!client) {
        realtimeHub.markDemo()
        setMode('DEMO DATA')
        setConnectionStatus('DEMO MODE')
        return
      }
      setConnectionStatus('CONNECTING')
      try {
        const probe = await client.from('parties').select('id').limit(1)
        if (probe.error) throw probe.error
        if (cancelled) return
        const ok = await fetchAll()
        if (cancelled) return
        if (ok) {
          setMode('LIVE SUPABASE')
          liveRef.current = true
          await realtimeHub.start(client)
        } else {
          realtimeHub.markDemo()
          setMode('DEMO DATA')
        }
      } catch (e) {
        console.warn('[LiveData] backend unavailable — DEMO DATA', e)
        if (!cancelled) {
          realtimeHub.markDemo()
          setMode('DEMO DATA')
          setConnectionStatus('DEMO MODE')
        }
      }
    }

    boot()

    return () => {
      cancelled = true
      unsubStatus()
      unsubRows()
      realtimeHub.stop()
    }
  }, [fetchAll, handleChange])

  // Reconcile after reconnect (not on every LIVE tick)
  const prevConn = useRef<RealtimeStatus>(connectionStatus)
  useEffect(() => {
    const was = prevConn.current
    prevConn.current = connectionStatus
    if (
      connectionStatus === 'LIVE' &&
      liveRef.current &&
      (was === 'RECONNECTING' || was === 'CONNECTING' || was === 'OFFLINE')
    ) {
      void fetchAll()
    }
  }, [connectionStatus, fetchAll])

  const value: LiveDataValue = {
    mode,
    connectionStatus,
    lastDataAt,
    lastReconcileAt,
    results,
    incidents,
    openings,
    approvals,
    profiles,
    activity,
    toast,
    dismissToast: () => setToast(null),
    refreshFromBackend,
    applyingDemo,
  }

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext)
  if (!ctx) throw new Error('useLiveData requires LiveDataProvider')
  return ctx
}
