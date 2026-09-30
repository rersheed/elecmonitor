import { electionSettings } from '../data'
import { elections } from '../data/elections'
import { geography } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { useDemoState } from '../context/DemoState'

export function Settings() {
  const s = electionSettings
  const { controls, setControls, resetDemoState, activeElectionId } = useDemoState()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Demo controls persist in localStorage · feel real, stay local</p>
        </div>
        <button type="button" className="btn btn-sm btn-danger" onClick={resetDemoState}>
          Reset demo state
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
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
        </div>

        <div className="panel">
          <div className="panel-title">Demo controls</div>
          <div className="settings-grid">
            <label>
              Sync interval (seconds)
              <input
                type="number"
                min={5}
                max={300}
                value={controls.syncIntervalSec}
                onChange={(e) => setControls({ syncIntervalSec: Number(e.target.value) || 30 })}
              />
            </label>
            <label>
              Default / active election
              <select
                value={controls.defaultElectionId || activeElectionId}
                onChange={(e) => setControls({ defaultElectionId: e.target.value })}
              >
                {elections.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Session timeout (minutes)
              <input
                type="number"
                min={5}
                max={240}
                value={controls.sessionTimeoutMin}
                onChange={(e) => setControls({ sessionTimeoutMin: Number(e.target.value) || 45 })}
              />
            </label>
            <label>
              Geographic scope (NW)
              <select
                value={controls.geoScopeStateId}
                onChange={(e) => setControls({ geoScopeStateId: e.target.value })}
              >
                <option value="">All North-West</option>
                {geography.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="toggle-list">
            <Toggle
              label="MFA for privileged users"
              checked={controls.mfaEnabled}
              onChange={(v) => setControls({ mfaEnabled: v })}
            />
            <Toggle
              label="AI forecast"
              checked={controls.aiForecastEnabled}
              onChange={(v) => setControls({ aiForecastEnabled: v })}
            />
            <Toggle
              label="AI anomaly detection"
              checked={controls.aiAnomalyEnabled}
              onChange={(v) => setControls({ aiAnomalyEnabled: v })}
            />
            <Toggle
              label="NL assistant"
              checked={controls.aiAssistantEnabled}
              onChange={(v) => setControls({ aiAssistantEnabled: v })}
            />
            <Toggle
              label="Email notifications"
              checked={controls.emailNotifications}
              onChange={(v) => setControls({ emailNotifications: v })}
            />
            <Toggle
              label="Auto-backup"
              checked={controls.autoBackup}
              onChange={(v) => setControls({ autoBackup: v })}
            />
          </div>

          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Backup status:</strong>{' '}
            {controls.autoBackup ? 'Audit logging active · Auto-backup on' : 'Auto-backup off'} · Last
            backup {fmtDateTime(controls.lastBackupAt)}
            <button
              type="button"
              className="btn btn-sm"
              style={{ marginLeft: 8 }}
              onClick={() =>
                setControls({
                  lastBackupAt: new Date().toISOString().replace('Z', '+01:00'),
                })
              }
            >
              Run backup now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle${checked ? ' on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="knob" />
      </button>
    </label>
  )
}
