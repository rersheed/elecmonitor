export type VerificationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Needs Clarification'

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
