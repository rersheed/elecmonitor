import type { Election, Party, Candidate } from '../types'

export const elections: Election[] = [
  {
    id: 'el-nw-2026',
    name: 'North-West Situation Room Demo 2026',
    code: 'NW-CBM-2026-DEMO',
    status: 'Active',
    startDate: '2026-09-30',
    endDate: '2026-10-01',
    coverageStates: ['kd', 'kn', 'kt', 'jg', 'kb', 'so', 'za'],
    puTarget: 42000,
    puReported: 18640,
    description: 'Primary live demo election covering all seven North-West states.',
  },
  {
    id: 'el-nw-gov-2027',
    name: 'NW Gubernatorial Primaries Dry-Run 2027',
    code: 'NW-GOV-2027-DRY',
    status: 'Upcoming',
    startDate: '2027-02-14',
    endDate: '2027-02-15',
    coverageStates: ['kd', 'kn', 'kt', 'jg', 'kb', 'so', 'za'],
    puTarget: 42000,
    puReported: 0,
    description: 'Upcoming dry-run for gubernatorial primaries monitoring.',
  },
  {
    id: 'el-nw-lg-2023',
    name: 'NW Local Government Snapshot 2023',
    code: 'NW-LG-2023-SNAP',
    status: 'Completed',
    startDate: '2023-03-18',
    endDate: '2023-03-19',
    coverageStates: ['kd', 'kn', 'kt'],
    puTarget: 18500,
    puReported: 17220,
    description: 'Archived LG election snapshot used for model calibration.',
  },
  {
    id: 'el-nw-pilot-2025',
    name: 'Kaduna–Kano Pilot 2025',
    code: 'NW-PILOT-2025',
    status: 'Archived',
    startDate: '2025-11-08',
    endDate: '2025-11-08',
    coverageStates: ['kd', 'kn'],
    puTarget: 9200,
    puReported: 9104,
    description: 'Pilot field deployment archived after successful close-out.',
  },
]

export const parties: Party[] = [
  { id: 'pty-apc', abbrev: 'APC', name: 'All Progressives Congress', color: '#39a453', isPrimary: true },
  { id: 'pty-pdp', abbrev: 'PDP', name: 'Peoples Democratic Party', color: '#e52b32', isPrimary: false },
  { id: 'pty-nnpp', abbrev: 'NNPP', name: 'New Nigeria Peoples Party', color: '#5cc3e7', isPrimary: false },
  { id: 'pty-lp', abbrev: 'LP', name: 'Labour Party', color: '#976532', isPrimary: false },
]

/** Map ResultSubmission partyA–D columns to party abbrevs */
export const resultPartySlots = [
  { key: 'partyA' as const, partyId: 'pty-apc', abbrev: 'APC' },
  { key: 'partyB' as const, partyId: 'pty-pdp', abbrev: 'PDP' },
  { key: 'partyC' as const, partyId: 'pty-nnpp', abbrev: 'NNPP' },
  { key: 'partyD' as const, partyId: 'pty-lp', abbrev: 'LP' },
]

export const candidates: Candidate[] = [
  { id: 'cand-01', electionId: 'el-nw-2026', partyId: 'pty-apc', name: 'City Boy Movement Ticket', role: 'Presidential / Lead', stateScope: 'North-West' },
  { id: 'cand-02', electionId: 'el-nw-2026', partyId: 'pty-apc', name: 'Hadiza Abdullahi', role: 'NW Coordinating Candidate', stateScope: 'Kaduna' },
  { id: 'cand-03', electionId: 'el-nw-2026', partyId: 'pty-apc', name: 'Musa Ibrahim', role: 'State Lead', stateScope: 'Kano' },
  { id: 'cand-04', electionId: 'el-nw-2026', partyId: 'pty-pdp', name: 'Ibrahim Suleiman', role: 'Opposition Lead', stateScope: 'North-West' },
  { id: 'cand-05', electionId: 'el-nw-2026', partyId: 'pty-pdp', name: 'Fatima Bello', role: 'State Lead', stateScope: 'Katsina' },
  { id: 'cand-06', electionId: 'el-nw-2026', partyId: 'pty-nnpp', name: 'Yusuf Garba', role: 'Opposition Lead', stateScope: 'Kano' },
  { id: 'cand-07', electionId: 'el-nw-2026', partyId: 'pty-lp', name: 'Chinedu Okoro', role: 'Opposition Lead', stateScope: 'Kaduna' },
  { id: 'cand-08', electionId: 'el-nw-gov-2027', partyId: 'pty-apc', name: 'TBD — APC Primary', role: 'Gubernatorial aspirant pool', stateScope: 'North-West' },
  { id: 'cand-09', electionId: 'el-nw-gov-2027', partyId: 'pty-pdp', name: 'TBD — PDP Primary', role: 'Gubernatorial aspirant pool', stateScope: 'North-West' },
  { id: 'cand-10', electionId: 'el-nw-lg-2023', partyId: 'pty-apc', name: 'Various LG chairs', role: 'LG Chair', stateScope: 'Kaduna / Kano / Katsina' },
]

export function getElection(id: string) {
  return elections.find((e) => e.id === id)
}

export function getParty(id: string) {
  return parties.find((p) => p.id === id)
}
