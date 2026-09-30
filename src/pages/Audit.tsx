import { auditLog } from '../data'
import { EmptyState } from '../components/ui/EmptyState'
import { fmtDateTime } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'

export function Audit() {
  const { label } = useDataFreshness()
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Audit Log</h1>
          <p className="subtitle">Read-only trail of who changed what · {label}</p>
        </div>
      </div>
      {auditLog.length === 0 ? (
        <EmptyState message="No audit entries in the demo dataset." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Record</th>
                <th>Old → New</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((a) => (
                <tr key={a.id}>
                  <td>{fmtDateTime(a.timestamp)}</td>
                  <td>
                    {a.actor}
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {a.actorId}
                    </div>
                  </td>
                  <td>{a.action}</td>
                  <td>
                    {a.recordType}
                    <div className="mono" style={{ fontSize: 11 }}>
                      {a.recordId}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)' }}>{a.oldValue}</span>
                    {' → '}
                    <strong>{a.newValue}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
