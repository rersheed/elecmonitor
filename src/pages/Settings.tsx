import { electionSettings } from '../data'
import { fmtDateTime } from '../utils/format'

export function Settings() {
  const s = electionSettings
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Election / event configuration placeholders (demo)</p>
        </div>
      </div>
      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="panel-title">Event configuration</div>
        <dl style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 10, margin: 0 }}>
          <dt style={{ color: 'var(--text-muted)' }}>Election name</dt>
          <dd style={{ margin: 0 }}>{s.electionName}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Election date</dt>
          <dd style={{ margin: 0 }}>{s.electionDate}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Event code</dt>
          <dd style={{ margin: 0 }} className="mono">
            {s.eventCode}
          </dd>
          <dt style={{ color: 'var(--text-muted)' }}>Timezone</dt>
          <dd style={{ margin: 0 }}>{s.timezone}</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Reporting window</dt>
          <dd style={{ margin: 0 }}>
            {fmtDateTime(s.reportingWindowStart)} → {fmtDateTime(s.reportingWindowEnd)}
          </dd>
          <dt style={{ color: 'var(--text-muted)' }}>Verification SLA</dt>
          <dd style={{ margin: 0 }}>{s.verificationSlaHours} hours</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Incident escalation</dt>
          <dd style={{ margin: 0 }}>{s.incidentEscalationMinutes} minutes</dd>
          <dt style={{ color: 'var(--text-muted)' }}>Contact</dt>
          <dd style={{ margin: 0 }}>
            {s.contactEmail}
            <br />
            {s.contactPhone}
          </dd>
        </dl>
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-dim)' }}>
          Changes are disabled in this ElecMonitor demo. Product: ElecMonitor · Workspace: Election
          Situation Room.
        </p>
      </div>
    </div>
  )
}
