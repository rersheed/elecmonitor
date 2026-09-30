import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, X, Swords, HelpCircle } from 'lucide-react'
import { VerificationBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { evidence, results } from '../data'
import { parties, resultPartySlots } from '../data/elections'
import { locationPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { useDemoState } from '../context/DemoState'
import type { VerificationStatus } from '../types'

type Tab = 'Pending' | 'Needs Clarification' | 'Verified' | 'Rejected' | 'Contested'

const tabs: Tab[] = ['Pending', 'Needs Clarification', 'Verified', 'Rejected', 'Contested']

function matchesTab(status: VerificationStatus, tab: Tab) {
  if (tab === 'Pending') return status === 'Submitted' || status === 'Under Review'
  return status === tab
}

export function Verification() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'Pending'
  const q = params.get('q') || ''
  const { reports, setVerification, controls } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const queue = useMemo(() => {
    return reports.filter((r) => {
      if (!matchesTab(r.verificationStatus, tab)) return false
      if (q && !r.id.toLowerCase().includes(q.toLowerCase())) return false
      return true
    })
  }, [tab, q, reports])

  const selected = reports.find((r) => r.id === (selectedId || queue[0]?.id)) || null
  const evid = selected ? evidence.filter((e) => selected.evidenceIds.includes(e.id)) : []

  const linkedResult = useMemo(() => {
    if (!selected) return null
    if (selected.linkedResultId) {
      return results.find((r) => r.id === selected.linkedResultId) || null
    }
    // Heuristic: same ward + result category or “Result” in category
    const isResultish = /result|form ec|collation|vote/i.test(selected.category)
    if (!isResultish) {
      // Still show a nearby result for demo depth on some reports
      return results.find((r) => r.location.wardId === selected.location.wardId) || null
    }
    return results.find((r) => r.location.wardId === selected.location.wardId) || results[0] || null
  }, [selected])

  const voteBreakdown = useMemo(() => {
    if (!linkedResult) return null
    const total =
      linkedResult.partyA + linkedResult.partyB + linkedResult.partyC + linkedResult.partyD || 1
    return resultPartySlots.map((slot) => {
      const votes = linkedResult[slot.key]
      const party = parties.find((p) => p.id === slot.partyId)!
      return {
        abbrev: party.abbrev,
        name: party.name,
        color: party.color,
        votes,
        share: Math.round((votes / total) * 100),
      }
    })
  }, [linkedResult])

  function act(status: VerificationStatus) {
    if (!selected) return
    setVerification(selected.id, status)
    setToast(`${selected.id} → ${status}`)
    window.setTimeout(() => setToast(null), 2500)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Verification</h1>
          <p className="subtitle">Queue for field reports · Approve / Reject / Contest · {label}</p>
        </div>
        {toast && <div className="toast-inline">{toast}</div>}
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

              <div className="verify-actions">
                <button type="button" className="btn btn-sm btn-primary" onClick={() => act('Verified')}>
                  <Check size={14} /> Approve
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => act('Rejected')}>
                  <X size={14} /> Reject
                </button>
                <button type="button" className="btn btn-sm" onClick={() => act('Contested')}>
                  <Swords size={14} /> Contest
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => act('Needs Clarification')}>
                  <HelpCircle size={14} /> Needs Clarification
                </button>
              </div>

              <div className="verify-split" style={{ marginTop: 16 }}>
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
                        Not yet verified — use actions above.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {voteBreakdown && linkedResult && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Vote breakdown · {linkedResult.id} · {linkedResult.puName}
                  </h3>
                  <div className="vote-breakdown">
                    {voteBreakdown.map((v) => (
                      <div key={v.abbrev} className="vote-row">
                        <div className="vote-label">
                          <span className="swatch" style={{ background: v.color }} />
                          <strong>{v.abbrev}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{v.name}</span>
                        </div>
                        <div className="vote-bar-track">
                          <div className="vote-bar-fill" style={{ width: `${v.share}%`, background: v.color }} />
                        </div>
                        <div className="mono vote-nums">
                          {v.votes} · {v.share}%
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      Invalid {linkedResult.invalid} · Accredited {linkedResult.totalAccredited} · Status{' '}
                      {linkedResult.status}
                    </div>
                  </div>
                </div>
              )}

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
