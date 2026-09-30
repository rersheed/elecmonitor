import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive } from 'lucide-react'
import { FiltersBar } from '../components/ui/Filters'
import { IncidentBadge, SeverityBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { ArchiveConfirm } from '../components/ui/Modal'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { incidents } from '../data'
import { shortPath, locationPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'

const statuses = ['Open', 'Investigating', 'Resolved', 'Escalated', 'Closed']
const openish = new Set(['Open', 'Investigating', 'Escalated'])

export function IncidentsList() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { label } = useDataFreshness()
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archived, setArchived] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (archived.has(i.id)) return false
      if (filters.state && i.location.stateId !== filters.state) return false
      if (filters.lga && i.location.lgaId !== filters.lga) return false
      if (filters.ward && i.location.wardId !== filters.ward) return false
      if (filters.status) {
        // Overview metric links with status=Open meaning active open-ish cases
        if (filters.status === 'Open') {
          if (!openish.has(i.status)) return false
        } else if (i.status !== filters.status) {
          return false
        }
      }
      if (filters.date && !i.reportedAt.startsWith(filters.date)) return false
      return true
    })
  }, [filters, archived])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Incidents</h1>
          <p className="subtitle">
            Exceptional cases with case numbers · not field reports · {label}
          </p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={incidents.length - archived.size}
        statuses={statuses}
        showCategory={false}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No incidents match the selected filters for this period." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Case number</th>
                <th>Title</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Officer</th>
                <th>Reported</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link to={`/incidents/${i.id}`} className="mono">
                      {i.caseNumber}
                    </Link>
                  </td>
                  <td>{i.title}</td>
                  <td>{shortPath(i.location)}</td>
                  <td>
                    <SeverityBadge severity={i.severity} />
                  </td>
                  <td>
                    <IncidentBadge status={i.status} />
                  </td>
                  <td>{i.assignedOfficer}</td>
                  <td>{fmtDateTime(i.reportedAt)}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setArchiveId(i.id)}>
                      <Archive size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ArchiveConfirm
        open={!!archiveId}
        recordLabel={incidents.find((i) => i.id === archiveId)?.caseNumber || ''}
        onCancel={() => setArchiveId(null)}
        onConfirm={() => {
          if (archiveId) setArchived((s) => new Set(s).add(archiveId))
          setArchiveId(null)
        }}
      />
    </div>
  )
}

export function IncidentDetail() {
  const { id } = useParams()
  const incident = incidents.find((i) => i.id === id)
  if (!incident) {
    return <EmptyState title="Incident not found" message="No incident matches this ID in the demo dataset." />
  }
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Incidents', to: '/incidents' }, { label: incident.caseNumber }]} />
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 20 }}>{incident.title}</h1>
          <p className="subtitle mono">{incident.caseNumber}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SeverityBadge severity={incident.severity} />
          <IncidentBadge status={incident.status} />
        </div>
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Case details</div>
          <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, margin: 0 }}>
            <dt style={{ color: 'var(--text-muted)' }}>Location</dt>
            <dd style={{ margin: 0 }}>
              <Link
                to={`/geography/${incident.location.stateId}/${incident.location.lgaId}/${incident.location.wardId}`}
              >
                {locationPath(incident.location)}
              </Link>
            </dd>
            <dt style={{ color: 'var(--text-muted)' }}>Assigned officer</dt>
            <dd style={{ margin: 0 }}>
              {incident.assignedOfficer} ({incident.assignedOfficerId})
            </dd>
            <dt style={{ color: 'var(--text-muted)' }}>Reported</dt>
            <dd style={{ margin: 0 }}>{fmtDateTime(incident.reportedAt)}</dd>
            <dt style={{ color: 'var(--text-muted)' }}>Description</dt>
            <dd style={{ margin: 0 }}>{incident.description}</dd>
            <dt style={{ color: 'var(--text-muted)' }}>Actions taken</dt>
            <dd style={{ margin: 0 }}>
              <ul>
                {incident.actionsTaken.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </dd>
            <dt style={{ color: 'var(--text-muted)' }}>Related reports</dt>
            <dd style={{ margin: 0 }}>
              {incident.relatedReportIds.length === 0
                ? '—'
                : incident.relatedReportIds.map((rid) => (
                    <div key={rid}>
                      <Link to={`/reports/${encodeURIComponent(rid)}`} className="mono">
                        {rid}
                      </Link>
                    </div>
                  ))}
            </dd>
          </dl>
        </div>
        <div className="panel">
          <div className="panel-title">Chronological timeline</div>
          <div className="timeline">
            {[...incident.timeline]
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((t) => (
                <div className="timeline-item" key={t.id}>
                  <div className="when">{fmtDateTime(t.timestamp)}</div>
                  <div className="what">
                    {t.action} · {t.actor}
                  </div>
                  <div className="detail">{t.detail}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
