export type VerificationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Needs Clarification'
  | 'Contested'

export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved' | 'Escalated' | 'Closed'
export type AgentStatus = 'Active' | 'Offline' | 'On Leave' | 'Suspended'
export type EvidenceType = 'Photo' | 'Video' | 'Document' | 'Audio' | 'Form'
export type UserRole =
  | 'Super Admin'
  | 'Situation Room Lead'
  | 'State Coordinator'
  | 'LGA Coordinator'
  | 'Analyst'
  | 'Verifier'
  | 'Field Agent'
  | 'Read-only Observer'

export type ElectionStatus = 'Upcoming' | 'Active' | 'Completed' | 'Archived'
export type AnomalyReviewStatus = 'Open' | 'Reviewed' | 'Dismissed' | 'Escalated'
export type PuMapStatus = 'Verified' | 'Review' | 'Pending' | 'Rejected'

export interface PollingUnit {
  id: string
  name: string
  code: string
}

export interface Ward {
  id: string
  name: string
  code: string
  pollingUnits: PollingUnit[]
  lat?: number
  lon?: number
}

export interface LGA {
  id: string
  name: string
  code: string
  wards: Ward[]
}

export interface State {
  id: string
  name: string
  code: string
  lgas: LGA[]
}

export interface GeoPath {
  stateId: string
  stateName: string
  lgaId: string
  lgaName: string
  wardId: string
  wardName: string
  puId?: string
  puName?: string
}

export interface Report {
  id: string
  reporterId: string
  reporterName: string
  location: GeoPath
  timestamp: string
  category: string
  narrative: string
  evidenceIds: string[]
  verificationStatus: VerificationStatus
  verifiedNarrative?: string
  verifiedBy?: string
  verifiedAt?: string
  linkedResultId?: string
}

export interface TimelineEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface Incident {
  id: string
  caseNumber: string
  title: string
  location: GeoPath
  reportedAt: string
  status: IncidentStatus
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  assignedOfficer: string
  assignedOfficerId: string
  description: string
  actionsTaken: string[]
  relatedReportIds: string[]
  timeline: TimelineEntry[]
}

export interface Agent {
  id: string
  name: string
  role: string
  phone: string
  assignedLocation: GeoPath
  status: AgentStatus
  lastReportAt: string | null
  reportsCount: number
  electionId?: string
}

export interface EvidenceItem {
  id: string
  filename: string
  type: EvidenceType
  uploaderId: string
  uploaderName: string
  uploadedAt: string
  relatedReportId: string | null
  relatedIncidentId: string | null
  verificationState: VerificationStatus
  sizeKb: number
  mimeType: string
  thumbnailColor: string
  description: string
}

export interface ResultSubmission {
  id: string
  puId: string
  puName: string
  location: GeoPath
  submittedAt: string
  submittedBy: string
  partyA: number
  partyB: number
  partyC: number
  partyD: number
  invalid: number
  totalAccredited: number
  status: 'Draft' | 'Submitted' | 'Verified' | 'Disputed'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  scope: string
  status: 'Active' | 'Inactive'
  lastLogin: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  actor: string
  actorId: string
  action: string
  recordType: string
  recordId: string
  oldValue: string
  newValue: string
  category?: string
  ip?: string
  resource?: string
}

export interface ActivityItem {
  id: string
  timestamp: string
  type: 'report' | 'incident' | 'verification' | 'agent' | 'result' | 'evidence'
  summary: string
  link: string
  locationLabel: string
}

export interface ElectionSettings {
  electionName: string
  electionDate: string
  eventCode: string
  timezone: string
  reportingWindowStart: string
  reportingWindowEnd: string
  verificationSlaHours: number
  incidentEscalationMinutes: number
  contactEmail: string
  contactPhone: string
}

export interface Election {
  id: string
  name: string
  code: string
  status: ElectionStatus
  startDate: string
  endDate: string
  coverageStates: string[]
  puTarget: number
  puReported: number
  description: string
}

export interface Party {
  id: string
  abbrev: string
  name: string
  color: string
  isPrimary: boolean
}

export interface Candidate {
  id: string
  electionId: string
  partyId: string
  name: string
  role: string
  stateScope: string
}

export interface ForecastState {
  stateId: string
  stateName: string
  leadParty: string
  leadProbability: number
  low: number
  high: number
  sampleSize: number
}

export interface ForecastModel {
  id: string
  name: string
  version: string
  trainedAt: string
  snapshot: string
  description: string
  states: ForecastState[]
}

export interface AnomalyItem {
  id: string
  score: number
  type: string
  location: GeoPath
  summary: string
  detectedAt: string
  relatedResultId?: string
  relatedReportId?: string
  status: AnomalyReviewStatus
}

export interface DemoControls {
  syncIntervalSec: number
  defaultElectionId: string
  mfaEnabled: boolean
  sessionTimeoutMin: number
  aiForecastEnabled: boolean
  aiAnomalyEnabled: boolean
  aiAssistantEnabled: boolean
  emailNotifications: boolean
  autoBackup: boolean
  lastBackupAt: string
  geoScopeStateId: string
}

export interface PartyVoteShare {
  partyId: string
  abbrev: string
  name: string
  color: string
  votes: number
  share: number
}
