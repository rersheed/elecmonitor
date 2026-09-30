import type { AnomalyItem, ForecastModel } from '../types'
import { geography } from './geography'

const stateForecastSeed: { code: string; lead: string; p: number; low: number; high: number; n: number }[] = [
  { code: 'kd', lead: 'APC', p: 0.62, low: 0.54, high: 0.71, n: 1840 },
  { code: 'kn', lead: 'APC', p: 0.48, low: 0.41, high: 0.56, n: 2210 },
  { code: 'kt', lead: 'APC', p: 0.71, low: 0.64, high: 0.78, n: 1560 },
  { code: 'jg', lead: 'APC', p: 0.68, low: 0.60, high: 0.75, n: 980 },
  { code: 'kb', lead: 'APC', p: 0.55, low: 0.47, high: 0.64, n: 760 },
  { code: 'so', lead: 'APC', p: 0.59, low: 0.51, high: 0.67, n: 890 },
  { code: 'za', lead: 'APC', p: 0.52, low: 0.44, high: 0.61, n: 640 },
]

export const forecastModel: ForecastModel = {
  id: 'mdl-nw-lead-v2',
  name: 'NW Lead Probability Ensemble',
  version: '2.1.0-demo',
  trainedAt: '2026-09-28T18:00:00+01:00',
  snapshot: 'SNAP-2026-001',
  description:
    'Demo ensemble combining verified PU share, turnout priors, and anomaly-adjusted coverage. Not a real forecast.',
  states: stateForecastSeed.map((s) => {
    const st = geography.find((g) => g.id === s.code)!
    return {
      stateId: st.id,
      stateName: st.name,
      leadParty: s.lead,
      leadProbability: s.p,
      low: s.low,
      high: s.high,
      sampleSize: s.n,
    }
  }),
}

export const anomaliesSeed: AnomalyItem[] = [
  {
    id: 'ANM-001',
    score: 0.94,
    type: 'Turnout spike',
    location: {
      stateId: 'kn',
      stateName: 'Kano',
      lgaId: 'kn-dala',
      lgaName: 'Dala',
      wardId: 'kn-dala-gwammaja',
      wardName: 'Gwammaja',
      puId: 'kn-dala-gwammaja-pu003',
      puName: 'Gwammaja Primary III',
    },
    summary: 'Accredited voters 38% above ward median with incomplete Form EC8A scan.',
    detectedAt: '2026-09-30T21:12:00+01:00',
    relatedResultId: 'RES-0002',
    status: 'Open',
  },
  {
    id: 'ANM-002',
    score: 0.88,
    type: 'Result inconsistency',
    location: {
      stateId: 'kd',
      stateName: 'Kaduna',
      lgaId: 'kd-kaduna-south',
      lgaName: 'Kaduna South',
      wardId: 'kd-kaduna-south-barnawa',
      wardName: 'Barnawa',
    },
    summary: 'Party totals exceed accredited count by 17 ballots on submitted sheet.',
    detectedAt: '2026-09-30T20:44:00+01:00',
    relatedResultId: 'RES-0004',
    status: 'Open',
  },
  {
    id: 'ANM-003',
    score: 0.81,
    type: 'Duplicate submission',
    location: {
      stateId: 'kt',
      stateName: 'Katsina',
      lgaId: 'kt-dandume',
      lgaName: 'Dandume',
      wardId: 'kt-dandume-dandume-a',
      wardName: 'Dandume A',
    },
    summary: 'Two result packs from same PU within 6 minutes with divergent APC totals.',
    detectedAt: '2026-09-30T19:58:00+01:00',
    relatedResultId: 'RES-0001',
    status: 'Open',
  },
  {
    id: 'ANM-004',
    score: 0.76,
    type: 'Coverage gap',
    location: {
      stateId: 'za',
      stateName: 'Zamfara',
      lgaId: 'za-gusau',
      lgaName: 'Gusau',
      wardId: 'za-gusau-madawaki',
      wardName: 'Madawaki',
    },
    summary: 'Zero verified reports after 18:00 despite 12 assigned agents online.',
    detectedAt: '2026-09-30T19:10:00+01:00',
    status: 'Open',
  },
  {
    id: 'ANM-005',
    score: 0.72,
    type: 'Late burst',
    location: {
      stateId: 'jg',
      stateName: 'Jigawa',
      lgaId: 'jg-birnin-kudu',
      lgaName: 'Birnin Kudu',
      wardId: 'jg-birnin-kudu-unguwar-ya',
      wardName: 'Unguwar Ya',
    },
    summary: '14 result submissions arrived in a 3-minute window from one device fingerprint.',
    detectedAt: '2026-09-30T18:33:00+01:00',
    relatedResultId: 'RES-0003',
    status: 'Reviewed',
  },
  {
    id: 'ANM-006',
    score: 0.69,
    type: 'Vote share outlier',
    location: {
      stateId: 'so',
      stateName: 'Sokoto',
      lgaId: 'so-sokoto-north',
      lgaName: 'Sokoto North',
      wardId: 'so-sokoto-north-waziri-a',
      wardName: 'Waziri A',
    },
    summary: 'LP share 4.6σ above LGA historical prior with no matching incident trail.',
    detectedAt: '2026-09-30T17:55:00+01:00',
    status: 'Open',
  },
  {
    id: 'ANM-007',
    score: 0.64,
    type: 'Agent silence',
    location: {
      stateId: 'kb',
      stateName: 'Kebbi',
      lgaId: 'kb-birnin-kebbi',
      lgaName: 'Birnin Kebbi',
      wardId: 'kb-birnin-kebbi-gwadangaji',
      wardName: 'Gwadangaji',
    },
    summary: 'Assigned agents offline >90 minutes during peak accreditation window.',
    detectedAt: '2026-09-30T16:40:00+01:00',
    status: 'Dismissed',
  },
  {
    id: 'ANM-008',
    score: 0.61,
    type: 'Form mismatch',
    location: {
      stateId: 'kd',
      stateName: 'Kaduna',
      lgaId: 'kd-kubau',
      lgaName: 'Kubau',
      wardId: 'kd-kubau-karreh',
      wardName: 'Karreh',
    },
    summary: 'OCR of EC8A differs from keyed totals for APC by more than 5%.',
    detectedAt: '2026-09-30T15:22:00+01:00',
    relatedResultId: 'RES-0002',
    relatedReportId: 'RPT/KD/2026/00012',
    status: 'Escalated',
  },
]

export interface AssistantReply {
  answer: string
  links?: { label: string; to: string }[]
}

export function answerAssistant(question: string): AssistantReply {
  const q = question.toLowerCase().trim()
  if (!q) {
    return { answer: 'Ask about forecast, anomalies, coverage, verification queue, or APC lead.' }
  }
  if (/forecast|lead|probabilit|who.?s? winning|uncertainty/.test(q)) {
    return {
      answer:
        'Demo forecast (model NW Lead Probability Ensemble v2.1.0): APC leads in all seven NW states. Strongest lead probability is Katsina (~71%, 64–78% interval). Kano is the tightest race (~48%, 41–56%). Snapshot SNAP-2026-001. This is synthetic demo output only.',
      links: [{ label: 'Open AI Forecast', to: '/ai' }],
    }
  }
  if (/anomal|outlier|spike|inconsist/.test(q)) {
    const open = anomaliesSeed.filter((a) => a.status === 'Open').length
    return {
      answer: `There are ${open} open anomaly alerts. Highest score is ANM-001 (Turnout spike, Kano / Dala, score 0.94). Review them on the AI Intelligence page.`,
      links: [{ label: 'Review anomalies', to: '/ai#anomalies' }],
    }
  }
  if (/verif|queue|pending|await/.test(q)) {
    return {
      answer:
        'Verification queue tracks Submitted, Under Review, Needs Clarification, Verified, Rejected, and Contested. Use Approve / Reject / Contest / Needs Clarification on the Verification detail pane — actions update local demo state.',
      links: [{ label: 'Open Verification', to: '/verification' }],
    }
  }
  if (/coverage|report(ing)?|how many|pu|polling/.test(q)) {
    return {
      answer:
        'Active election NW-CBM-2026-DEMO targets ~42k polling units across Kaduna, Kano, Katsina, Jigawa, Kebbi, Sokoto, and Zamfara. Demo seed shows partial PU reporting — use Geography and Maps for ward-level status layers.',
      links: [
        { label: 'Geography', to: '/geography' },
        { label: 'Status map', to: '/maps' },
      ],
    }
  }
  if (/apc|city.?boy|party|candidate|opponent/.test(q)) {
    return {
      answer:
        'APC (All Progressives Congress, #39a453) is the primary party. Demo opponents: PDP (#e52b32), NNPP (#5cc3e7), LP (#976532). Candidates for the active election are listed under Parties.',
      links: [{ label: 'Parties & candidates', to: '/parties' }],
    }
  }
  if (/agent|assign|field/.test(q)) {
    return {
      answer:
        'Field agents can be reassigned to state / LGA / ward / PU for the active election from the Agents page. Assignments persist in local demo state (localStorage).',
      links: [{ label: 'Agents', to: '/agents' }],
    }
  }
  if (/export|csv|excel|pdf|download/.test(q)) {
    return {
      answer:
        'Exports catalog on Reports includes Results, Coverage, Verification, Agents, Anomalies, Forecast, Audit, Turnout, and Overview. CSV downloads are generated client-side; PDF opens a printable summary.',
      links: [{ label: 'Exports', to: '/reports#exports' }],
    }
  }
  if (/incident|security|violence/.test(q)) {
    return {
      answer:
        'Open incidents are listed on the Incidents module with severity, assignment, and timeline. Critical items also surface on the Situation Room overview.',
      links: [{ label: 'Incidents', to: '/incidents' }],
    }
  }
  if (/help|what can|capabilities|hello|hi\b/.test(q)) {
    return {
      answer:
        'I am a local pattern-match assistant (no LLM API). Try: “forecast”, “anomalies”, “verification queue”, “coverage”, “APC parties”, “agent assign”, or “exports”.',
    }
  }
  return {
    answer:
      'No canned match for that question. Try keywords: forecast, anomalies, verification, coverage, APC, agents, exports, incidents.',
  }
}
