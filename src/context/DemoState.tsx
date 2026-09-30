import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Agent,
  AnomalyItem,
  AnomalyReviewStatus,
  DemoControls,
  GeoPath,
  Report,
  VerificationStatus,
} from '../types'
import { agents as seedAgents } from '../data/agents'
import { reports as seedReports } from '../data/reports'
import { anomaliesSeed } from '../data/ai'
import { elections } from '../data/elections'
import { auditLog as seedAudit } from '../data/audit'
import type { AuditEntry } from '../types'

const STORAGE_KEY = 'elecmonitor-demo-state-v1'

const defaultControls: DemoControls = {
  syncIntervalSec: 30,
  defaultElectionId: 'el-nw-2026',
  mfaEnabled: true,
  sessionTimeoutMin: 45,
  aiForecastEnabled: true,
  aiAnomalyEnabled: true,
  aiAssistantEnabled: true,
  emailNotifications: true,
  autoBackup: true,
  lastBackupAt: '2026-09-30T22:15:00+01:00',
  geoScopeStateId: '',
}

interface Persisted {
  controls: DemoControls
  activeElectionId: string
  reportOverrides: Record<string, Partial<Report>>
  agentOverrides: Record<string, Partial<Agent>>
  anomalyOverrides: Record<string, Partial<AnomalyItem>>
  extraAudit: AuditEntry[]
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error('empty')
    const parsed = JSON.parse(raw) as Persisted
    return {
      controls: { ...defaultControls, ...parsed.controls },
      activeElectionId: parsed.activeElectionId || defaultControls.defaultElectionId,
      reportOverrides: parsed.reportOverrides || {},
      agentOverrides: parsed.agentOverrides || {},
      anomalyOverrides: parsed.anomalyOverrides || {},
      extraAudit: parsed.extraAudit || [],
    }
  } catch {
    return {
      controls: defaultControls,
      activeElectionId: defaultControls.defaultElectionId,
      reportOverrides: {},
      agentOverrides: {},
      anomalyOverrides: {},
      extraAudit: [],
    }
  }
}

interface DemoStateValue {
  controls: DemoControls
  setControls: (patch: Partial<DemoControls>) => void
  activeElectionId: string
  setActiveElectionId: (id: string) => void
  reports: Report[]
  agents: Agent[]
  anomalies: AnomalyItem[]
  auditLog: AuditEntry[]
  setVerification: (
    reportId: string,
    status: VerificationStatus,
    note?: string,
  ) => void
  assignAgent: (agentId: string, location: GeoPath) => void
  reviewAnomaly: (id: string, status: AnomalyReviewStatus) => void
  resetDemoState: () => void
}

const DemoStateContext = createContext<DemoStateValue | null>(null)

function pushAudit(
  list: AuditEntry[],
  action: string,
  recordType: string,
  recordId: string,
  oldValue: string,
  newValue: string,
  category: string,
): AuditEntry[] {
  const entry: AuditEntry = {
    id: `AUD-LIVE-${Date.now()}`,
    timestamp: new Date().toISOString().replace('Z', '+01:00'),
    actor: 'Demo User',
    actorId: 'USR-DEMO',
    action,
    recordType,
    recordId,
    oldValue,
    newValue,
    category,
    ip: '10.20.4.' + (40 + (list.length % 50)),
    resource: `${recordType}/${recordId}`,
  }
  return [entry, ...list].slice(0, 80)
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(() => load())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  }, [persisted])

  const reports = useMemo(() => {
    return seedReports.map((r) => {
      const o = persisted.reportOverrides[r.id]
      return o ? { ...r, ...o } : r
    })
  }, [persisted.reportOverrides])

  const agents = useMemo(() => {
    return seedAgents.map((a) => {
      const o = persisted.agentOverrides[a.id]
      return o ? { ...a, ...o, electionId: persisted.activeElectionId } : { ...a, electionId: persisted.activeElectionId }
    })
  }, [persisted.agentOverrides, persisted.activeElectionId])

  const anomalies = useMemo(() => {
    return anomaliesSeed.map((a) => {
      const o = persisted.anomalyOverrides[a.id]
      return o ? { ...a, ...o } : a
    })
  }, [persisted.anomalyOverrides])

  const auditLog = useMemo(() => {
    const enriched = seedAudit.map((a, i) => ({
      ...a,
      category: a.category || categorize(a.action),
      ip: a.ip || `102.89.${10 + (i % 40)}.${20 + (i % 200)}`,
      resource: a.resource || `${a.recordType}/${a.recordId}`,
    }))
    return [...persisted.extraAudit, ...enriched]
  }, [persisted.extraAudit])

  const setControls = useCallback((patch: Partial<DemoControls>) => {
    setPersisted((p) => ({ ...p, controls: { ...p.controls, ...patch } }))
  }, [])

  const setActiveElectionId = useCallback((id: string) => {
    setPersisted((p) => ({
      ...p,
      activeElectionId: id,
      controls: { ...p.controls, defaultElectionId: id },
      extraAudit: pushAudit(p.extraAudit, 'Switched active election', 'Election', id, p.activeElectionId, id, 'Election'),
    }))
  }, [])

  const setVerification = useCallback((reportId: string, status: VerificationStatus, note?: string) => {
    setPersisted((p) => {
      const prev = p.reportOverrides[reportId]?.verificationStatus
        || seedReports.find((r) => r.id === reportId)?.verificationStatus
        || 'Submitted'
      const override: Partial<Report> = {
        verificationStatus: status,
        verifiedBy: 'Demo User',
        verifiedAt: new Date().toISOString().replace('Z', '+01:00'),
        verifiedNarrative:
          note ||
          (status === 'Verified'
            ? 'Approved in situation room demo review.'
            : status === 'Rejected'
              ? 'Rejected — evidence insufficient or inconsistent.'
              : status === 'Contested'
                ? 'Contested — flagged for party liaison follow-up.'
                : 'Needs clarification from field agent.'),
      }
      return {
        ...p,
        reportOverrides: { ...p.reportOverrides, [reportId]: { ...p.reportOverrides[reportId], ...override } },
        extraAudit: pushAudit(
          p.extraAudit,
          'Updated verification status',
          'Report',
          reportId,
          prev,
          status,
          'Verification',
        ),
      }
    })
  }, [])

  const assignAgent = useCallback((agentId: string, location: GeoPath) => {
    setPersisted((p) => {
      const prev = p.agentOverrides[agentId]?.assignedLocation
        || seedAgents.find((a) => a.id === agentId)?.assignedLocation
      const prevLabel = prev ? `${prev.stateName}/${prev.lgaName}/${prev.wardName}` : '—'
      const nextLabel = `${location.stateName}/${location.lgaName}/${location.wardName}`
      return {
        ...p,
        agentOverrides: {
          ...p.agentOverrides,
          [agentId]: {
            ...p.agentOverrides[agentId],
            assignedLocation: location,
            electionId: p.activeElectionId,
          },
        },
        extraAudit: pushAudit(
          p.extraAudit,
          'Assigned agent',
          'Agent',
          agentId,
          prevLabel,
          nextLabel,
          'Agents',
        ),
      }
    })
  }, [])

  const reviewAnomaly = useCallback((id: string, status: AnomalyReviewStatus) => {
    setPersisted((p) => {
      const prev = p.anomalyOverrides[id]?.status || anomaliesSeed.find((a) => a.id === id)?.status || 'Open'
      return {
        ...p,
        anomalyOverrides: { ...p.anomalyOverrides, [id]: { ...p.anomalyOverrides[id], status } },
        extraAudit: pushAudit(p.extraAudit, 'Reviewed anomaly', 'Anomaly', id, prev, status, 'AI'),
      }
    })
  }, [])

  const resetDemoState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setPersisted(load())
  }, [])

  const value: DemoStateValue = {
    controls: persisted.controls,
    setControls,
    activeElectionId: persisted.activeElectionId,
    setActiveElectionId,
    reports,
    agents,
    anomalies,
    auditLog,
    setVerification,
    assignAgent,
    reviewAnomaly,
    resetDemoState,
  }

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}

function categorize(action: string): string {
  const a = action.toLowerCase()
  if (a.includes('verif')) return 'Verification'
  if (a.includes('incident') || a.includes('escalat')) return 'Incidents'
  if (a.includes('user') || a.includes('role')) return 'Users'
  if (a.includes('setting')) return 'Settings'
  if (a.includes('assign') || a.includes('agent')) return 'Agents'
  if (a.includes('election')) return 'Election'
  if (a.includes('anomal') || a.includes('ai')) return 'AI'
  return 'System'
}

export function useDemoState() {
  const ctx = useContext(DemoStateContext)
  if (!ctx) throw new Error('useDemoState must be used within DemoStateProvider')
  return ctx
}

export function useActiveElection() {
  const { activeElectionId } = useDemoState()
  return elections.find((e) => e.id === activeElectionId) || elections[0]
}
