import { CheckCircle2, Clock, AlertTriangle, XCircle, HelpCircle, Circle, Radio, Pause } from 'lucide-react'
import type { VerificationStatus, IncidentStatus, AgentStatus } from '../../types'

const vMap: Record<VerificationStatus, { cls: string; Icon: typeof CheckCircle2 }> = {
  Submitted: { cls: 'badge-info', Icon: Clock },
  'Under Review': { cls: 'badge-warning', Icon: Radio },
  Verified: { cls: 'badge-success', Icon: CheckCircle2 },
  Rejected: { cls: 'badge-danger', Icon: XCircle },
  'Needs Clarification': { cls: 'badge-warning', Icon: HelpCircle },
}

const iMap: Record<IncidentStatus, { cls: string; Icon: typeof CheckCircle2 }> = {
  Open: { cls: 'badge-danger', Icon: AlertTriangle },
  Investigating: { cls: 'badge-warning', Icon: Radio },
  Resolved: { cls: 'badge-success', Icon: CheckCircle2 },
  Escalated: { cls: 'badge-danger', Icon: AlertTriangle },
  Closed: { cls: 'badge-neutral', Icon: Circle },
}

const aMap: Record<AgentStatus, { cls: string; Icon: typeof CheckCircle2 }> = {
  Active: { cls: 'badge-success', Icon: CheckCircle2 },
  Offline: { cls: 'badge-neutral', Icon: Circle },
  'On Leave': { cls: 'badge-warning', Icon: Pause },
  Suspended: { cls: 'badge-danger', Icon: XCircle },
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { cls, Icon } = vMap[status]
  return (
    <span className={`badge ${cls}`} title={status}>
      <Icon size={12} aria-hidden />
      <span>{status}</span>
    </span>
  )
}

export function IncidentBadge({ status }: { status: IncidentStatus }) {
  const { cls, Icon } = iMap[status]
  return (
    <span className={`badge ${cls}`} title={status}>
      <Icon size={12} aria-hidden />
      <span>{status}</span>
    </span>
  )
}

export function AgentBadge({ status }: { status: AgentStatus }) {
  const { cls, Icon } = aMap[status]
  return (
    <span className={`badge ${cls}`} title={status}>
      <Icon size={12} aria-hidden />
      <span>{status}</span>
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: string }) {
  const cls =
    severity === 'Critical' || severity === 'High'
      ? 'badge-danger'
      : severity === 'Medium'
        ? 'badge-warning'
        : 'badge-neutral'
  return (
    <span className={`badge ${cls}`}>
      <AlertTriangle size={12} aria-hidden />
      <span>{severity}</span>
    </span>
  )
}

export function GenericBadge({ label, tone = 'neutral' }: { label: string; tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{label}</span>
}
