import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive } from 'lucide-react'
import { FiltersBar } from '../components/ui/Filters'
import { VerificationBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { ArchiveConfirm } from '../components/ui/Modal'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { reports, evidence } from '../data'
import { shortPath, locationPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'

const categories = [...new Set(reports.map((r) => r.category))].sort()
const statuses = ['Submitted', 'Under Review', 'Verified', 'Rejected', 'Needs Clarification']

export function ReportsList() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { label } = useDataFreshness()
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archived, setArchived] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (archived.has(r.id)) return false
      if (filters.state && r.location.stateId !== filters.state) return false
      if (filters.lga && r.location.lgaId !== filters.lga) return false
      if (filters.ward && r.location.wardId !== filters.ward) return false
      if (filters.category && r.category !== filters.category) return false
      if (filters.status && r.verificationStatus !== filters.status) return false
      if (filters.date && !r.timestamp.startsWith(filters.date)) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (
          !r.id.toLowerCase().includes(q) &&
          !r.reporterName.toLowerCase().includes(q) &&
          !(r.location.puId || '').includes(q)
        )
          return false
      }
      return true
    })
  }, [filters, archived])

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="subtitle">Field observations · distinct from incidents · {label}</p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={reports.length - archived.size}
        categories={categories}
        statuses={statuses}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No reports have been submitted for this ward during the selected period." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Category</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link to={`/reports/${encodeURIComponent(r.id)}`} className="mono">
                      {r.id}
                    </Link>
                  </td>
                  <td>{shortPath(r.location)}</td>
                  <td>{r.category}</td>
                  <td>{r.reporterName}</td>
                  <td>
                    <VerificationBadge status={r.verificationStatus} />
                  </td>
                  <td>{fmtDateTime(r.timestamp)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      title="Archive"
                      onClick={() => setArchiveId(r.id)}
                    >
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
        recordLabel={archiveId || ''}
        onCancel={() => setArchiveId(null)}
        onConfirm={() => {
          if (archiveId) setArchived((s) => new Set(s).add(archiveId))
          setArchiveId(null)
        }}
      />
    </div>
  )
}

export function ReportDetail() {
  const { id } = useParams()
  const decoded = id ? decodeURIComponent(id) : ''
  const report = reports.find((r) => r.id === decoded)
  if (!report) {
    return <EmptyState title="Report not found" message="No report matches this ID in the demo dataset." />
  }
  const evid = evidence.filter((e) => report.evidenceIds.includes(e.id))

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Reports', to: '/reports' },
          { label: report.id },
        ]}
      />
      <div className="page-header">
        <div>
          <h1 className="mono" style={{ fontSize: 20 }}>
            {report.id}
          </h1>
          <p className="subtitle">{locationPath(report.location)}</p>
        </div>
        <VerificationBadge status={report.verificationStatus} />
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">Report details</div>
          <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, margin: 0 }}>
            <dt style={{ color: 'var(--text-muted)' }}>Reporter</dt>
            <dd style={{ margin: 0 }}>
              {report.reporterName} ({report.reporterId})
            </dd>
            <dt style={{ color: 'var(--text-muted)' }}>Category</dt>
            <dd style={{ margin: 0 }}>{report.category}</dd>
            <dt style={{ color: 'var(--text-muted)' }}>Timestamp</dt>
            <dd style={{ margin: 0 }}>{fmtDateTime(report.timestamp)}</dd>
            <dt style={{ color: 'var(--text-muted)' }}>Location</dt>
            <dd style={{ margin: 0 }}>
              <Link to={`/geography/${report.location.stateId}/${report.location.lgaId}/${report.location.wardId}`}>
                {locationPath(report.location)}
              </Link>
            </dd>
          </dl>
          <h3 style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>Reported narrative</h3>
          <p className="reported-block">{report.narrative}</p>
          {report.verifiedNarrative && (
            <>
              <h3 style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                Verified / review notes
              </h3>
              <p className="verified-block">{report.verifiedNarrative}</p>
              {report.verifiedBy && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  By {report.verifiedBy}
                  {report.verifiedAt ? ` · ${fmtDateTime(report.verifiedAt)}` : ''}
                </p>
              )}
            </>
          )}
        </div>
        <div className="panel">
          <div className="panel-title">Linked evidence</div>
          {evid.length === 0 ? (
            <EmptyState message="No evidence linked to this report." />
          ) : (
            <ul className="stack">
              {evid.map((e) => (
                <li key={e.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div className="evid-thumb" style={{ background: e.thumbnailColor }}>
                    {e.type}
                  </div>
                  <div>
                    <Link to={`/evidence?q=${e.id}`}>{e.filename}</Link>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {e.id} · {e.sizeKb} KB
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: 16 }}>
            <Link className="btn btn-sm" to={`/verification?q=${encodeURIComponent(report.id)}`}>
              Open in verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
