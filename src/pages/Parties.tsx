import { parties, candidates, getParty } from '../data/elections'
import { useActiveElection, useDemoState } from '../context/DemoState'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { GenericBadge } from '../components/ui/StatusBadge'

export function Parties() {
  const election = useActiveElection()
  const { controls } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const cands = candidates.filter((c) => c.electionId === election.id)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Parties & candidates</h1>
          <p className="subtitle">
            Active election: {election.name} · {label}
          </p>
        </div>
      </div>

      <div className="parties-grid">
        {parties.map((p) => (
          <div
            key={p.id}
            className={`panel party-card${p.isPrimary ? ' primary' : ''}`}
            style={{ borderColor: p.isPrimary ? p.color : undefined }}
          >
            <div className="party-swatch" style={{ background: p.color }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 18 }}>{p.abbrev}</strong>
                {p.isPrimary && <GenericBadge label="Primary" tone="success" />}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.name}</div>
              <div className="mono" style={{ fontSize: 11, marginTop: 4, color: 'var(--text-dim)' }}>
                {p.color}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <div className="panel-title">
          Candidates · {election.code}
          <span className="meta">{cands.length} listed</span>
        </div>
        {cands.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No candidates seeded for this election yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Party</th>
                  <th>Role</th>
                  <th>Scope</th>
                </tr>
              </thead>
              <tbody>
                {cands.map((c) => {
                  const party = getParty(c.partyId)
                  return (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: `${party?.color}33`,
                            color: party?.color,
                            borderColor: party?.color,
                          }}
                        >
                          {party?.abbrev}
                        </span>
                      </td>
                      <td>{c.role}</td>
                      <td>{c.stateScope}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
