import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { VerificationBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { reports, evidence } from '../data'
import { locationPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'
import type { VerificationStatus } from '../types'

type Tab = 'Pending' | 'Needs Clarification' | 'Verified' | 'Rejected'

const tabs: Tab[] = ['Pending', 'Needs Clarification', 'Verified', 'Rejected']

function matchesTab(status: VerificationStatus, tab: Tab) {
  if (tab === 'Pending') return status === 'Submitted' || status === 'Under Review'
  return status === tab
}

export function Verification() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'Pending'
  const q = params.get('q') || ''
  const { label } = useDataFreshness()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const queue = useMemo(() => {
    return reports.filter((r) => {
      if (!matchesTab(r.verificationStatus, tab)) return false
      if (q && !r.id.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [tab, q])

  const selected = reports.find((r) => r.id === (selectedId || queue[0]?.id)) || null
  const evid = selected ? evidence.filter((e) => selected.evidenceIds.includes(e.id)) : []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Verification</h1>
          <p className="subtitle">Queue for field reports · Reported vs Verified · {label}</p>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {tabs.map((t) => {
          const count = reports.filter((r) => matchesTab(r.verificationStatus, t)).length
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={`tab${tab === t ? ' active' : ''}`}
              onClick={() => {
                setParams({ tab: t })
                setSelectedId(null)
              }}
            >
              {t} ({count})
            </button>
          )
        })}
      </div>

      {queue.length === 0 ? (
        <EmptyState message={`No reports in the “${tab}” queue for the selected filters.`} />
      ) : (
        <div className="grid-2">
          <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((r) => (
                    <tr
                      key={r.id}
                      className={selected?.id === r.id ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedId(r.id)}
                    >
                      <td className="mono">{r.id}</td>
                      <td>{r.category}</td>
                      <td>
                        <VerificationBadge status={r.verificationStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <div className="panel">
              <div className="panel-title">
                <span className="mono">{selected.id}</span>
                <Link to={`/reports/${encodeURIComponent(selected.id)}`} className="meta">
                  Full report
                </Link>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 0 }}>
                {locationPath(selected.location)} · {fmtDateTime(selected.timestamp)}
              </p>
              <div className="verify-split">
                <div className="verify-col">
                  <h3>Reported</h3>
                  <div className="reported-block">
                    <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{selected.category}</p>
                    <p style={{ margin: 0 }}>{selected.narrative}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      By {selected.reporterName}
                    </p>
                  </div>
                </div>
                <div className="verify-col">
                  <h3>Verified</h3>
                  <div className="verified-block">
                    {selected.verifiedNarrative ? (
                      <>
                        <p style={{ margin: 0 }}>{selected.verifiedNarrative}</p>
                        {selected.verifiedBy && (
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                            {selected.verifiedBy}
                            {selected.verifiedAt ? ` · ${fmtDateTime(selected.verifiedAt)}` : ''}
                          </p>
                        )}
                      </>
                    ) : (
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                        Not yet verified — awaiting situation room review.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: 13, marginTop: 16, color: 'var(--text-muted)' }}>Evidence</h3>
              {evid.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No evidence attached.</p>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {evid.map((e) => (
                    <div
                      key={e.id}
                      className="evid-thumb"
                      style={{ background: e.thumbnailColor, width: 96, height: 72 }}
                      title={e.filename}
                    >
                      {e.type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
