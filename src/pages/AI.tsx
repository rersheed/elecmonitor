import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Send, Sparkles, AlertTriangle } from 'lucide-react'
import { forecastModel, answerAssistant } from '../data/ai'
import { useDemoState } from '../context/DemoState'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { fmtDateTime } from '../utils/format'
import { shortPath } from '../data/geography'
import { GenericBadge } from '../components/ui/StatusBadge'
import type { AnomalyReviewStatus } from '../types'

function toneForAnomaly(status: string) {
  if (status === 'Open') return 'danger' as const
  if (status === 'Escalated') return 'warning' as const
  if (status === 'Reviewed') return 'info' as const
  return 'neutral' as const
}

export function AI() {
  const { anomalies, reviewAnomaly, controls } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string; links?: { label: string; to: string }[] }[]>([
    {
      role: 'bot',
      text: 'NL Assistant online (local demo — no LLM API). Ask about forecast, anomalies, coverage, verification, APC, agents, or exports.',
    },
  ])

  const selected = anomalies.find((a) => a.id === (selectedId || anomalies[0]?.id)) || null
  const openCount = anomalies.filter((a) => a.status === 'Open').length

  const sorted = useMemo(
    () => [...anomalies].sort((a, b) => b.score - a.score),
    [anomalies],
  )

  function ask(q?: string) {
    const text = (q ?? question).trim()
    if (!text) return
    const reply = answerAssistant(text)
    setChat((c) => [...c, { role: 'user', text }, { role: 'bot', text: reply.answer, links: reply.links }])
    setQuestion('')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>AI Intelligence</h1>
          <p className="subtitle">
            Forecast · Anomaly review · NL assistant · {label}
            {!controls.aiForecastEnabled || !controls.aiAnomalyEnabled || !controls.aiAssistantEnabled
              ? ' · some AI flags disabled in Settings'
              : ''}
          </p>
        </div>
      </div>

      {controls.aiForecastEnabled && (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} aria-hidden /> Forecast
            </span>
            <span className="meta">
              Model {forecastModel.version} · {forecastModel.snapshot}
            </span>
          </div>
          <p style={{ marginTop: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            {forecastModel.description} Trained {fmtDateTime(forecastModel.trainedAt)}.
          </p>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Lead</th>
                  <th>Lead probability</th>
                  <th>Uncertainty interval</th>
                  <th>Sample (verified PUs)</th>
                </tr>
              </thead>
              <tbody>
                {forecastModel.states.map((s) => (
                  <tr key={s.stateId}>
                    <td>
                      <Link to={`/geography/${s.stateId}`}>{s.stateName}</Link>
                    </td>
                    <td>
                      <GenericBadge label={s.leadParty} tone="success" />
                    </td>
                    <td>
                      <div className="prob-bar" title={`${Math.round(s.leadProbability * 100)}%`}>
                        <div className="prob-fill" style={{ width: `${s.leadProbability * 100}%` }} />
                        <span>{Math.round(s.leadProbability * 100)}%</span>
                      </div>
                    </td>
                    <td className="mono">
                      {Math.round(s.low * 100)}% – {Math.round(s.high * 100)}%
                    </td>
                    <td>{s.sampleSize.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 0 }}>
            Model metadata: {forecastModel.id} · {forecastModel.name} · demo only
          </p>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 16 }} id="anomalies">
        {controls.aiAnomalyEnabled && (
          <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="panel-title" style={{ padding: '16px 16px 0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} aria-hidden /> Anomaly scores
              </span>
              <span className="meta">{openCount} open</span>
            </div>
            <div className="table-wrap" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Score</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((a) => (
                    <tr
                      key={a.id}
                      className={selected?.id === a.id ? 'selected' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedId(a.id)}
                    >
                      <td className="mono">{a.id}</td>
                      <td className="mono">{a.score.toFixed(2)}</td>
                      <td>{a.type}</td>
                      <td>
                        <GenericBadge label={a.status} tone={toneForAnomaly(a.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {controls.aiAnomalyEnabled && selected && (
          <div className="panel anomaly-card">
            <div className="anomaly-header">
              <div>
                <div className="mono">{selected.id}</div>
                <h3 style={{ margin: '4px 0' }}>{selected.type}</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                  {shortPath(selected.location)} · {fmtDateTime(selected.detectedAt)}
                </p>
              </div>
              <GenericBadge label={`Score ${selected.score.toFixed(2)}`} tone="danger" />
            </div>
            <p style={{ fontSize: 13 }}>{selected.summary}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {selected.relatedResultId && (
                <Link className="btn btn-sm" to={`/results?q=${selected.relatedResultId}`}>
                  Result {selected.relatedResultId}
                </Link>
              )}
              {selected.relatedReportId && (
                <Link className="btn btn-sm" to={`/reports/${encodeURIComponent(selected.relatedReportId)}`}>
                  Report
                </Link>
              )}
            </div>
            <div className="anomaly-actions">
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>Review workflow:</span>
              {(['Reviewed', 'Dismissed', 'Escalated', 'Open'] as AnomalyReviewStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`btn btn-sm${selected.status === s ? ' btn-primary' : ''}`}
                  onClick={() => reviewAnomaly(selected.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {controls.aiAssistantEnabled && (
        <div className="panel">
          <div className="panel-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Brain size={16} aria-hidden /> NL Assistant
            </span>
            <span className="meta">Pattern-match · local demo data</span>
          </div>
          <div className="chat-log">
            {chat.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <div>{m.text}</div>
                {m.links && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {m.links.map((l) => (
                      <Link key={l.to} to={l.to} className="btn btn-sm">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="chat-quick">
            {['Forecast lead?', 'Open anomalies', 'Verification queue', 'APC parties', 'Exports'].map((q) => (
              <button key={q} type="button" className="btn btn-sm" onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault()
              ask()
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a canned question…"
              aria-label="Assistant question"
            />
            <button type="submit" className="btn btn-primary">
              <Send size={14} /> Ask
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
