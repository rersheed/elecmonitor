import { Link } from 'react-router-dom'
import { elections } from '../data/elections'
import { geography } from '../data/geography'
import { useDemoState, useActiveElection } from '../context/DemoState'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { GenericBadge } from '../components/ui/StatusBadge'

function statusTone(s: string) {
  if (s === 'Active') return 'success' as const
  if (s === 'Upcoming') return 'info' as const
  if (s === 'Completed') return 'neutral' as const
  return 'warning' as const
}

export function Elections() {
  const { activeElectionId, setActiveElectionId, controls } = useDemoState()
  const active = useActiveElection()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Elections</h1>
          <p className="subtitle">
            Election management · active: {active.name} · {label}
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card" style={{ cursor: 'default' }}>
          <div className="label">Total elections</div>
          <div className="value">{elections.length}</div>
        </div>
        <div className="metric-card" style={{ cursor: 'default' }}>
          <div className="label">Active</div>
          <div className="value">{elections.filter((e) => e.status === 'Active').length}</div>
        </div>
        <div className="metric-card" style={{ cursor: 'default' }}>
          <div className="label">Coverage (active)</div>
          <div className="value">
            {active.puReported.toLocaleString()} / {active.puTarget.toLocaleString()}
          </div>
          <div className="hint">PU reported / target</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Election</th>
              <th>Code</th>
              <th>Status</th>
              <th>Dates</th>
              <th>Coverage states</th>
              <th>PU progress</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {elections.map((e) => {
              const names = e.coverageStates
                .map((id) => geography.find((g) => g.id === id)?.name || id)
                .join(', ')
              const pct = e.puTarget ? Math.round((e.puReported / e.puTarget) * 100) : 0
              return (
                <tr key={e.id} className={e.id === activeElectionId ? 'selected' : ''}>
                  <td>
                    <strong>{e.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.description}</div>
                  </td>
                  <td className="mono">{e.code}</td>
                  <td>
                    <GenericBadge label={e.status} tone={statusTone(e.status)} />
                  </td>
                  <td>
                    {e.startDate}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ {e.endDate}</div>
                  </td>
                  <td style={{ fontSize: 12 }}>{names}</td>
                  <td>
                    <div className="prob-bar">
                      <div className="prob-fill" style={{ width: `${pct}%` }} />
                      <span>{pct}%</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {e.puReported.toLocaleString()} / {e.puTarget.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    {e.id === activeElectionId ? (
                      <GenericBadge label="Active scope" tone="success" />
                    ) : (
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => setActiveElectionId(e.id)}>
                        Set active
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
        Multi-election selector also lives in the top bar. Parties for the active election:{' '}
        <Link to="/parties">Parties & candidates</Link>.
      </p>
    </div>
  )
}
