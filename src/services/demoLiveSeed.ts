/**
 * Demo / local seed mapped into Live* shapes.
 * Clearly separate from LIVE SUPABASE — never present as official results.
 */
import { agents as seedAgents } from '../data/agents'
import { incidents as seedIncidents } from '../data/incidents'
import { results as seedResults } from '../data/results'
import { activityFeed as seedActivity } from '../data/activity'
import { reports as seedReports } from '../data/reports'
import type {
  LiveActivityEvent,
  LiveApproval,
  LiveIncident,
  LiveOpening,
  LiveProfile,
  LiveResult,
} from './liveTypes'
import { normalizeResultStatus, normalizeSeverity } from './liveTypes'

export function seedLiveResults(): LiveResult[] {
  return seedResults.map((r) => ({
    id: r.id,
    pollingUnitId: r.puId,
    electionId: 'demo-el-nw',
    submittedBy: r.submittedBy,
    accreditedVoters: r.totalAccredited,
    validVotes: r.partyA + r.partyB + r.partyC + r.partyD,
    invalidVotes: r.invalid,
    status: normalizeResultStatus(r.status),
    submittedAt: r.submittedAt,
    updatedAt: r.submittedAt,
    partyVotes: {
      APC: r.partyA,
      PDP: r.partyB,
      NNPP: r.partyC,
      LP: r.partyD,
    },
    stateId: r.location.stateId,
    lgaId: r.location.lgaId,
    wardId: r.location.wardId,
  }))
}

export function seedLiveIncidents(): LiveIncident[] {
  return seedIncidents.map((i) => ({
    id: i.id,
    pollingUnitId: i.location.puId || '',
    electionId: 'demo-el-nw',
    reporterId: i.assignedOfficerId,
    category: i.title.includes('BVAS')
      ? 'BVAS/Technology'
      : i.title.toLowerCase().includes('violence')
        ? 'Violence'
        : i.title.toLowerCase().includes('material')
          ? 'Materials'
          : i.severity === 'Critical'
            ? 'Security'
            : 'Other',
    description: i.description,
    severity: normalizeSeverity(i.severity),
    status: i.status.toLowerCase(),
    createdAt: i.reportedAt,
    stateId: i.location.stateId,
    lgaId: i.location.lgaId,
    wardId: i.location.wardId,
    agentName: i.assignedOfficer,
  }))
}

export function seedLiveOpenings(): LiveOpening[] {
  return seedReports
    .filter((r) => /opening/i.test(r.category))
    .map((r) => ({
      id: r.id,
      pollingUnitId: r.location.puId || '',
      electionId: 'demo-el-nw',
      reporterId: r.reporterId,
      openedAt: r.timestamp,
      status: 'submitted',
      createdAt: r.timestamp,
      stateId: r.location.stateId,
      lgaId: r.location.lgaId,
      wardId: r.location.wardId,
    }))
}

export function seedLiveProfiles(): LiveProfile[] {
  return seedAgents.map((a) => ({
    id: a.id,
    email: `${a.id.toLowerCase()}@cbmnw.demo`,
    fullName: a.name,
    role: a.role.toLowerCase().includes('agent') ? 'field_agent' : a.role,
    stateId: a.assignedLocation.stateId,
    lgaId: a.assignedLocation.lgaId,
    wardId: a.assignedLocation.wardId,
    lastActivity: a.lastReportAt,
  }))
}

export function seedLiveApprovals(results: LiveResult[]): LiveApproval[] {
  const out: LiveApproval[] = []
  for (const r of results) {
    if (r.status === 'pending_lga' || r.status === 'pending_state' || r.status === 'state_verified') {
      out.push({
        id: `apr-${r.id}-ward`,
        resultId: r.id,
        actorId: 'demo-ward',
        fromStatus: 'pending_ward',
        toStatus: 'pending_lga',
        createdAt: r.submittedAt || new Date().toISOString(),
      })
    }
    if (r.status === 'pending_state' || r.status === 'state_verified') {
      out.push({
        id: `apr-${r.id}-lga`,
        resultId: r.id,
        actorId: 'demo-lga',
        fromStatus: 'pending_lga',
        toStatus: 'pending_state',
        createdAt: r.submittedAt || new Date().toISOString(),
      })
    }
    if (r.status === 'state_verified') {
      out.push({
        id: `apr-${r.id}-state`,
        resultId: r.id,
        actorId: 'demo-state',
        fromStatus: 'pending_state',
        toStatus: 'state_verified',
        createdAt: r.updatedAt || r.submittedAt || new Date().toISOString(),
      })
    }
  }
  return out
}

export function seedLiveActivity(): LiveActivityEvent[] {
  return seedActivity.map((a) => ({
    id: a.id,
    timestamp: a.timestamp,
    kind:
      a.type === 'incident'
        ? 'incident'
        : a.type === 'verification'
          ? 'approval'
          : a.type === 'evidence'
            ? 'evidence'
            : 'result',
    title: a.summary,
    detail: a.locationLabel || '',
  }))
}
