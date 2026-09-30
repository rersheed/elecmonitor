import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'
import { fmtDateTime } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { useDemoState } from '../context/DemoState'
import { downloadCsv } from '../utils/export'

const CATEGORIES = ['All', 'Verification', 'Incidents', 'Users', 'Settings', 'Agents', 'Election', 'AI', 'System']

export function Audit() {
  const { auditLog, controls } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [category, setCategory] = useState('All')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    return auditLog.filter((a) => {
      if (category !== 'All' && (a.category || 'System') !== category) return false
      if (q) {
        const t = q.toLowerCase()
        if (
          !a.actor.toLowerCase().includes(t) &&
          !a.action.toLowerCase().includes(t) &&
          !a.recordId.toLowerCase().includes(t) &&
          !(a.ip || '').includes(t) &&
          !(a.resource || '').toLowerCase().includes(t)
        )
          return false
      }
      return true
    })
  }, [auditLog, category, q])

  function exportAudit() {
    downloadCsv(
      'elecmonitor-audit.csv',
      ['Timestamp', 'Actor', 'ActorId', 'Action', 'Category', 'RecordType', 'RecordId', 'Old', 'New', 'IP', 'Resource'],
      filtered.map((a) => [
        a.timestamp,
        a.actor,
        a.actorId,
        a.action,
        a.category || '',
        a.recordType,
        a.recordId,
        a.oldValue,
        a.newValue,
        a.ip || '',
        a.resource || '',
      ]),
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Audit Log</h1>
          <p className="subtitle">
            Who changed what · IP / resource · {filtered.length} events · {label}
          </p>
        </div>
        <button type="button" className="btn btn-sm" onClick={exportAudit}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="filters-bar">
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Filter actor, action, IP, resource…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="showing">
          Showing {filtered.length} of {auditLog.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No audit entries match the selected filters." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Category</th>
                <th>Record</th>
                <th>IP</th>
                <th>Resource</th>
                <th>Old → New</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{fmtDateTime(a.timestamp)}</td>
                  <td>
                    {a.actor}
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {a.actorId}
                    </div>
                  </td>
                  <td>{a.action}</td>
                  <td>{a.category || 'System'}</td>
                  <td>
                    {a.recordType}
                    <div className="mono" style={{ fontSize: 11 }}>
                      {a.recordId}
                    </div>
                  </td>
                  <td className="mono">{a.ip || '—'}</td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {a.resource || '—'}
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
