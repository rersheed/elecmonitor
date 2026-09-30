import type { ElectionSettings } from '../types'

export const electionSettings: ElectionSettings = {
  electionName: 'Demo General Election 2026',
  electionDate: '2026-09-30',
  eventCode: 'DGE-2026-DEMO',
  timezone: 'Africa/Lagos',
  reportingWindowStart: '2026-09-30T07:00:00+01:00',
  reportingWindowEnd: '2026-10-01T02:00:00+01:00',
  verificationSlaHours: 4,
  incidentEscalationMinutes: 90,
  contactEmail: 'situation-room@elecmonitor.demo',
  contactPhone: '+234 800 000 2026',
}
