/** Normalized operational records shared by LiveDataProvider + Analytics. */

export type ResultPipelineStatus =
  | 'draft'
  | 'pending_ward'
  | 'pending_lga'
  | 'pending_state'
  | 'state_verified'
  | 'rejected'

export type LiveResult = {
  id: string
  pollingUnitId: string
  electionId: string
  submittedBy: string
  accreditedVoters: number
  validVotes: number
  invalidVotes: number
  status: ResultPipelineStatus
  rejectionReason?: string | null
  submittedAt: string | null
  updatedAt: string | null
  partyVotes: Record<string, number>
  /** When resolved from geography */
  stateId?: string
  lgaId?: string
  wardId?: string
}

export type LiveIncident = {
  id: string
  pollingUnitId: string
  electionId: string
  reporterId: string
  category: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: string
  createdAt: string
  photoPath?: string | null
  gpsLat?: number | null
  gpsLon?: number | null
  stateId?: string
  lgaId?: string
  wardId?: string
  agentName?: string
}

export type LiveOpening = {
  id: string
  pollingUnitId: string
  electionId: string
  reporterId: string
  openedAt: string
  status: string
  createdAt: string
  stateId?: string
  lgaId?: string
  wardId?: string
}

export type LiveApproval = {
  id: string
  resultId: string
  actorId: string
  fromStatus: string
  toStatus: string
  reason?: string | null
  createdAt: string
}

export type LiveProfile = {
  id: string
  email: string
  fullName: string
  role: string
  stateId?: string | null
  lgaId?: string | null
  wardId?: string | null
  lastActivity?: string | null
}

export type LiveActivityEvent = {
  id: string
  timestamp: string
  kind: 'result' | 'incident' | 'opening' | 'approval' | 'evidence' | 'profile'
  title: string
  detail: string
  severity?: string
}

export type DataSourceMode = 'LIVE SUPABASE' | 'DEMO DATA' | 'OFFLINE CACHE'

export function normalizeResultStatus(raw: string): ResultPipelineStatus {
  const s = (raw || '').toLowerCase().replace(/\s+/g, '_')
  if (s === 'submitted' || s === 'pending' || s === 'under_review') return 'pending_ward'
  if (s === 'verified' || s === 'state_verified') return 'state_verified'
  if (s === 'disputed' || s === 'contested' || s === 'rejected') return 'rejected'
  if (s === 'draft') return 'draft'
  if (s === 'pending_ward' || s === 'pending_lga' || s === 'pending_state') return s
  return 'pending_ward'
}

export function normalizeSeverity(raw: string): LiveIncident['severity'] {
  const s = (raw || '').toLowerCase()
  if (s === 'critical') return 'critical'
  if (s === 'high') return 'high'
  if (s === 'low') return 'low'
  return 'medium'
}
