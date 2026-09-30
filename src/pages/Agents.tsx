import { useMemo } from 'react'
import { FiltersBar } from '../components/ui/Filters'
import { AgentBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { agents } from '../data'
import { shortPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { Link } from 'react-router-dom'

const statuses = ['Active', 'Offline', 'On Leave', 'Suspended']

export function Agents() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { label } = useDataFreshness()

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (filters.state && a.assignedLocation.stateId !== filters.state) return false
      if (filters.lga && a.assignedLocation.lgaId !== filters.lga) return false
      if (filters.ward && a.assignedLocation.wardId !== filters.ward) return false
      if (filters.status && a.status !== filters.status) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filters])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Agents</h1>
          <p className="subtitle">Field personnel roster · {label}</p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={agents.length}
        statuses={statuses}
        showCategory={false}
        showDate={false}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No agents match the selected filters." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Assigned location</th>
                <th>Status</th>
                <th>Last report</th>
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{a.id}</td>
                  <td>{a.name}</td>
                  <td>{a.role}</td>
                  <td>
                    <Link
                      to={`/geography/${a.assignedLocation.stateId}/${a.assignedLocation.lgaId}/${a.assignedLocation.wardId}`}
                    >
                      {shortPath(a.assignedLocation)}
                    </Link>
                  </td>
                  <td>
                    <AgentBadge status={a.status} />
                  </td>
                  <td>{a.lastReportAt ? fmtDateTime(a.lastReportAt) : '—'}</td>
                  <td>{a.reportsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
