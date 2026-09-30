import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiltersBar } from '../components/ui/Filters'
import { GenericBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { results } from '../data'
import { shortPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'

const statuses = ['Draft', 'Submitted', 'Verified', 'Disputed']

function tone(s: string) {
  if (s === 'Verified') return 'success' as const
  if (s === 'Disputed') return 'danger' as const
  if (s === 'Draft') return 'neutral' as const
  return 'info' as const
}

export function Results() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { label } = useDataFreshness()

  const filtered = useMemo(() => {
    return results.filter((r) => {
      if (filters.state && r.location.stateId !== filters.state) return false
      if (filters.lga && r.location.lgaId !== filters.lga) return false
      if (filters.ward && r.location.wardId !== filters.ward) return false
      if (filters.status && r.status !== filters.status) return false
      if (filters.date && !r.submittedAt.startsWith(filters.date)) return false
      return true
    })
  }, [filters])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Results</h1>
          <p className="subtitle">Structured result submissions by polling unit · {label}</p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={results.length}
        statuses={statuses}
        showCategory={false}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No result submissions match the selected filters." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Polling unit</th>
                <th>Location</th>
                <th>APC</th>
                <th>PDP</th>
                <th>NNPP</th>
                <th>LP</th>
                <th>Invalid</th>
                <th>Accredited</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td>{r.puName}</td>
                  <td>
                    <Link to={`/geography/${r.location.stateId}/${r.location.lgaId}/${r.location.wardId}`}>
                      {shortPath(r.location)}
                    </Link>
                  </td>
                  <td>{r.partyA}</td>
                  <td>{r.partyB}</td>
                  <td>{r.partyC}</td>
                  <td>{r.partyD}</td>
                  <td>{r.invalid}</td>
                  <td>{r.totalAccredited}</td>
                  <td>
                    <GenericBadge label={r.status} tone={tone(r.status)} />
                  </td>
                  <td>
                    {fmtDateTime(r.submittedAt)}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.submittedBy}</div>
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
