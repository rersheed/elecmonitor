import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiltersBar } from '../components/ui/Filters'
import { VerificationBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { evidence } from '../data'
import { fmtDateTime } from '../utils/format'
import type { EvidenceItem } from '../types'

export function Evidence() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { label } = useDataFreshness()
  const [viewer, setViewer] = useState<EvidenceItem | null>(null)

  const filtered = useMemo(() => {
    return evidence.filter((e) => {
      if (filters.status && e.verificationState !== filters.status) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (
          !e.id.toLowerCase().includes(q) &&
          !e.filename.toLowerCase().includes(q) &&
          !(e.relatedReportId || '').toLowerCase().includes(q)
        )
          return false
      }
      if (filters.category && e.type !== filters.category) return false
      if (filters.date && !e.uploadedAt.startsWith(filters.date)) return false
      return true
    })
  }, [filters])

  const types = [...new Set(evidence.map((e) => e.type))]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Evidence</h1>
          <p className="subtitle">File metadata linked to reports and incidents · {label}</p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={evidence.length}
        categories={types}
        statuses={['Submitted', 'Under Review', 'Verified', 'Rejected', 'Needs Clarification']}
        showDate
      />
      {filtered.length === 0 ? (
        <EmptyState message="No evidence items match the selected filters." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Preview</th>
                <th>ID</th>
                <th>Filename</th>
                <th>Type</th>
                <th>Uploader</th>
                <th>Related report</th>
                <th>Verification</th>
                <th>Uploaded</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <button
                      type="button"
                      className="evid-thumb"
                      style={{ background: e.thumbnailColor, border: 'none', cursor: 'pointer' }}
                      onClick={() => setViewer(e)}
                      aria-label={`View ${e.filename}`}
                    >
                      {e.type}
                    </button>
                  </td>
                  <td className="mono">{e.id}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setViewer(e)}>
                      {e.filename}
                    </button>
                  </td>
                  <td>{e.type}</td>
                  <td>{e.uploaderName}</td>
                  <td>
                    {e.relatedReportId ? (
                      <Link to={`/reports/${encodeURIComponent(e.relatedReportId)}`} className="mono">
                        {e.relatedReportId}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <VerificationBadge status={e.verificationState} />
                  </td>
                  <td>{fmtDateTime(e.uploadedAt)}</td>
                  <td>{e.sizeKb} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!viewer}
        title={viewer?.filename || 'Evidence'}
        onClose={() => setViewer(null)}
        actions={
          <button type="button" className="btn" onClick={() => setViewer(null)}>
            Close
          </button>
        }
      >
        {viewer && (
          <div>
            <div
              style={{
                height: 220,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${viewer.thumbnailColor}, #0b1220)`,
                display: 'grid',
                placeItems: 'center',
                marginBottom: 12,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Demo {viewer.type} preview
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>{viewer.description}</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              {viewer.mimeType} · {viewer.sizeKb} KB · {viewer.id}
            </p>
            <p style={{ fontSize: 12 }}>
              Export label: <strong>ElecMonitor · Election Situation Room</strong>
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
