import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Monitor, RotateCw, Download } from 'lucide-react'
import { useLiveData } from '../context/LiveDataProvider'
import { useDemoState } from '../context/DemoState'
import { elections } from '../data/elections'
import { geography } from '../data/geography'
import { resolvePu } from '../services/puIndex'
import { useAnalyticsScope } from '../hooks/useAnalyticsScope'
import { useAnalyticsDerived } from '../hooks/useAnalyticsDerived'
import { useLiveClock } from '../hooks/useDataFreshness'
import { ConnectionBadge } from '../components/analytics/ConnectionBadge'
import { AnalyticsMap } from '../components/analytics/AnalyticsMap'
import { downloadCsv, downloadExcelCsv, openPrintablePdf } from '../utils/export'
import { fmtClock } from '../utils/format'

const CHART_COLORS = ['#39a453', '#5cc3e7', '#e52b32', '#976532', '#7dd3a0', '#8ed9f0']
const TV_PANELS = ['overview', 'map', 'incidents', 'coverage', 'verification'] as const

export function Analytics() {
  const live = useLiveData()
  const { activeElectionId } = useDemoState()
  const election = elections.find((e) => e.id === activeElectionId) || elections[0]
  const now = useLiveClock()
  const scope = useAnalyticsScope()
  const d = useAnalyticsDerived(
    live.results,
    live.incidents,
    live.openings,
    live.profiles,
    scope.filters,
  )

  const [tvMode, setTvMode] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [tvPanel, setTvPanel] = useState(0)
  const [puPage, setPuPage] = useState(0)
  const [puSearch, setPuSearch] = useState('')
  const pageSize = 25

  useEffect(() => {
    if (!autoRotate || !tvMode) return
    const t = setInterval(() => setTvPanel((p) => (p + 1) % TV_PANELS.length), 25000)
    return () => clearInterval(t)
  }, [autoRotate, tvMode])

  useEffect(() => {
    document.body.classList.toggle('tv-mode', tvMode)
    return () => document.body.classList.remove('tv-mode')
  }, [tvMode])

  useEffect(() => {
    if (!live.toast) return
    const t = setTimeout(() => live.dismissToast(), 4500)
    return () => clearTimeout(t)
  }, [live.toast, live.dismissToast])

  const coverageByState = useMemo(() => {
    const m: Record<string, number> = {}
    for (const s of d.stateCards) m[s.id] = s.coverage
    return m
  }, [d.stateCards])

  const partyChart = useMemo(
    () =>
      Object.entries(d.partyTotals).map(([name, value]) => ({ name, value })),
    [d.partyTotals],
  )

  const categoryChart = useMemo(
    () =>
      Object.entries(d.byCategory)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    [d.byCategory],
  )

  const trendData = useMemo(() => {
    const range = scope.filters.timeRange
    if (range === '15m') return d.trendHours.slice(-1)
    if (range === 'hourly') return d.trendHours.slice(-6)
    return d.trendHours
  }, [d.trendHours, scope.filters.timeRange])

  // Polling unit monitoring rows — only units with activity (or scoped ward), paginated
  const puRows = useMemo(() => {
    const q = (puSearch || scope.filters.search).trim().toLowerCase()
    const ids = new Set<string>()
    for (const r of d.filteredResults) if (r.pollingUnitId) ids.add(r.pollingUnitId)
    for (const o of d.filteredOpenings) if (o.pollingUnitId) ids.add(o.pollingUnitId)
    for (const i of d.filteredIncidents) if (i.pollingUnitId) ids.add(i.pollingUnitId)

    if (scope.filters.wardId) {
      const state = geography.find((s) => s.id === scope.filters.stateId)
      const lga = state?.lgas.find((l) => l.id === scope.filters.lgaId)
      const ward = lga?.wards.find((w) => w.id === scope.filters.wardId)
      for (const pu of ward?.pollingUnits || []) ids.add(pu.id)
    }

    const rows = [...ids].map((id) => {
      const ref = resolvePu(id)
      const result = d.filteredResults.find((r) => r.pollingUnitId === id)
      const opening = d.filteredOpenings.find((o) => o.pollingUnitId === id)
      const incident = d.filteredIncidents.find((i) => i.pollingUnitId === id)
      const agent = d.filteredProfiles.find((p) => p.wardId === ref?.wardId)
      const statuses: string[] = []
      if (opening) statuses.push('OPENED')
      if (incident) statuses.push('INCIDENT REPORTED')
      if (result) {
        if (result.status === 'state_verified') statuses.push('STATE VERIFIED')
        else if (result.status.startsWith('pending')) statuses.push('UNDER REVIEW')
        else if (result.status === 'rejected') statuses.push('REJECTED')
        else statuses.push('RESULT SUBMITTED')
      }
      if (!opening && !result) statuses.push('NOT REPORTED')
      const hay = `${ref?.puCode} ${ref?.puName} ${ref?.wardName} ${ref?.lgaName} ${ref?.stateName}`.toLowerCase()
      return {
        id,
        code: ref?.puCode || id,
        name: ref?.puName || id,
        ward: ref?.wardName || '—',
        lga: ref?.lgaName || '—',
        state: ref?.stateName || '—',
        agent: agent?.fullName || '—',
        opening: opening ? 'Yes' : '—',
        incident: incident ? incident.severity.toUpperCase() : '—',
        result: result ? result.status.replace(/_/g, ' ') : '—',
        verification: result?.status || '—',
        last:
          result?.updatedAt ||
          result?.submittedAt ||
          opening?.createdAt ||
          incident?.createdAt ||
          '—',
        statuses,
        hay,
      }
    })

    const filtered = q ? rows.filter((r) => r.hay.includes(q)) : rows
    filtered.sort((a, b) => String(b.last).localeCompare(String(a.last)))
    return filtered
  }, [d, scope.filters, puSearch])

  const puPageCount = Math.max(1, Math.ceil(puRows.length / pageSize))
  const puSlice = puRows.slice(puPage * pageSize, puPage * pageSize + pageSize)

  useEffect(() => setPuPage(0), [puSearch, scope.filters])

  const exportOps = useCallback(
    (fmt: 'csv' | 'excel' | 'pdf') => {
      const headers = [
        'PU Code',
        'Polling Unit',
        'Ward',
        'LGA',
        'State',
        'Opening',
        'Incident',
        'Result',
        'Verification',
        'Last Report',
      ]
      const rows = puRows.map((r) => [
        r.code,
        r.name,
        r.ward,
        r.lga,
        r.state,
        r.opening,
        r.incident,
        r.result,
        r.verification,
        r.last,
      ])
      const title = 'CITY BOY MOVEMENT NORTH WEST — ELECTION SITUATION ROOM'
      if (fmt === 'pdf') {
        openPrintablePdf(title, [
          'Internal Monitoring Data — NOT OFFICIAL INEC RESULTS',
          `Scope: ${scope.scopeLabel}`,
          `Coverage: ${d.coveragePct.toFixed(2)}% (${d.reported}/${d.totalPus})`,
          `Incidents: ${d.incidentSummary.total} (Critical ${d.incidentSummary.critical})`,
          `Results verified: ${d.pipeline.stateVerified}`,
          ...puRows.slice(0, 80).map(
            (r) => `${r.code} · ${r.lga}/${r.ward} · ${r.result} · ${r.incident}`,
          ),
        ])
        return
      }
      if (fmt === 'excel') downloadExcelCsv('cbmnw-analytics.csv', headers, rows)
      else downloadCsv('cbmnw-analytics.csv', headers, rows)
    },
    [puRows, scope.scopeLabel, d],
  )

  const show = (panel: (typeof TV_PANELS)[number]) =>
    !tvMode || !autoRotate || TV_PANELS[tvPanel] === panel || panel === 'overview'

  return (
    <div className={`analytics-page${tvMode ? ' is-tv' : ''}`}>
      {live.toast && (
        <div className="analytics-toast" role="status">
          <strong>{live.toast.message}</strong>
          {live.toast.detail && <span>{live.toast.detail}</span>}
        </div>
      )}

      {/* SECTION 1 — Command header */}
      <header className="analytics-command">
        <div className="analytics-command-brand">
          <div className="cmd-org">CITY BOY MOVEMENT NORTH WEST</div>
          <h1>ELECTION SITUATION ROOM</h1>
          <div className="cmd-sub">LIVE ANALYTICS & COMMAND DASHBOARD</div>
        </div>
        <div className="analytics-command-meta">
          <div>
            <span className="meta">Active election</span>
            <div>{election?.name || '—'}</div>
            <div className="meta">{election?.startDate || election?.code}</div>
          </div>
          <div>
            <span className="meta">Monitoring time</span>
            <div className="mono">{fmtClock(now)} WAT</div>
          </div>
          <div>
            <span className="meta">Geographic scope</span>
            <div>{scope.scopeLabel}</div>
          </div>
          <ConnectionBadge
            status={live.connectionStatus}
            mode={live.mode}
            lastDataAt={live.lastDataAt}
          />
        </div>
        <div className="analytics-toolbar">
          <button type="button" className="btn btn-sm" onClick={() => setTvMode((v) => !v)}>
            <Monitor size={14} /> {tvMode ? 'Exit TV Mode' : 'Command Screen / TV Mode'}
          </button>
          {tvMode && (
            <button type="button" className="btn btn-sm" onClick={() => setAutoRotate((v) => !v)}>
              <RotateCw size={14} /> Auto Rotate {autoRotate ? 'On' : 'Off'}
            </button>
          )}
          <button type="button" className="btn btn-sm" onClick={() => exportOps('csv')}>
            <Download size={14} /> CSV
          </button>
          <button type="button" className="btn btn-sm" onClick={() => exportOps('excel')}>
            Excel
          </button>
          <button type="button" className="btn btn-sm" onClick={() => exportOps('pdf')}>
            PDF
          </button>
          <button type="button" className="btn btn-sm" onClick={() => void live.refreshFromBackend()}>
            Reconcile
          </button>
        </div>
      </header>

      <div className="analytics-filters">
        <label>
          State
          <select
            value={scope.filters.stateId}
            onChange={(e) => scope.patch({ stateId: e.target.value })}
          >
            <option value="">All North West</option>
            {geography.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          LGA
          <select
            value={scope.filters.lgaId}
            onChange={(e) => scope.patch({ lgaId: e.target.value })}
            disabled={!scope.filters.stateId}
          >
            <option value="">All LGAs</option>
            {scope.lgas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ward
          <select
            value={scope.filters.wardId}
            onChange={(e) => scope.patch({ wardId: e.target.value })}
            disabled={!scope.filters.lgaId}
          >
            <option value="">All Wards</option>
            {scope.wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Polling Unit
          <select
            value={scope.filters.puId}
            onChange={(e) => scope.patch({ puId: e.target.value })}
            disabled={!scope.filters.wardId}
          >
            <option value="">All PUs</option>
            {scope.pus.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code || p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Report Status
          <select
            value={scope.filters.reportStatus}
            onChange={(e) => scope.patch({ reportStatus: e.target.value })}
          >
            <option value="">All</option>
            <option value="pending_ward">Pending Ward</option>
            <option value="pending_lga">Pending LGA</option>
            <option value="pending_state">Pending State</option>
            <option value="state_verified">State Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
        <label>
          Time Range
          <select
            value={scope.filters.timeRange}
            onChange={(e) =>
              scope.patch({ timeRange: e.target.value as typeof scope.filters.timeRange })
            }
          >
            <option value="all">All</option>
            <option value="15m">15 minutes</option>
            <option value="hourly">Hourly</option>
            <option value="election_day">Election Day</option>
            <option value="24h">Last 24 Hours</option>
          </select>
        </label>
        <button type="button" className="btn btn-sm" onClick={scope.reset}>
          Reset filters
        </button>
      </div>

      <div className="analytics-disclaimer">
        FIELD-REPORTED / INTERNAL MONITORING DATA — NOT OFFICIAL INEC RESULTS · Data source:{' '}
        {live.mode}
      </div>

      {/* SECTION 2 — KPIs */}
      {(show('overview') || !tvMode) && (
        <section className="analytics-kpis">
          <Kpi label="States Monitored" value={d.geoCounts.states} />
          <Kpi label="LGAs Monitored" value={d.geoCounts.lgas} />
          <Kpi label="Wards Monitored" value={d.geoCounts.wards} />
          <Kpi label="Polling Units" value={d.geoCounts.pus} />
          <Kpi label="PUs Reported" value={d.reported} accent="green" />
          <Kpi label="PUs Awaiting" value={d.awaiting} accent="brown" />
          <Kpi label="Coverage %" value={`${d.coveragePct.toFixed(2)}%`} accent="blue" />
          <Kpi label="Total Agents" value={d.filteredProfiles.length} />
          <Kpi label="Active Agents" value={d.activeAgents} accent="green" />
          <Kpi label="Offline Agents" value={d.offlineAgents} />
          <Kpi label="Yet To Report" value={d.agentsYetToReport} accent="brown" />
          <Kpi label="Total Incidents" value={d.incidentSummary.total} accent="red" />
          <Kpi label="Critical" value={d.incidentSummary.critical} accent="red" />
          <Kpi label="Open Incidents" value={d.incidentSummary.open} />
          <Kpi label="Resolved" value={d.incidentSummary.resolved} accent="green" />
          <Kpi label="Results Submitted" value={d.pipeline.submitted} />
          <Kpi label="Pending Ward" value={d.pipeline.pendingWard} accent="blue" />
          <Kpi label="Pending LGA" value={d.pipeline.pendingLga} accent="blue" />
          <Kpi label="Pending State" value={d.pipeline.pendingState} accent="brown" />
          <Kpi label="State Verified" value={d.pipeline.stateVerified} accent="green" />
          <Kpi label="Rejected / Contested" value={d.pipeline.rejected} accent="red" />
        </section>
      )}

      <div className="analytics-grid">
        <div className="analytics-main">
          {/* SECTION 4 — State cards */}
          {(show('overview') || !tvMode) && (
            <section className="panel">
              <div className="panel-title">North West State Overview</div>
              <div className="state-cards">
                {d.stateCards.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className={`state-card${scope.filters.stateId === s.id ? ' active' : ''}`}
                    onClick={() => scope.selectState(scope.filters.stateId === s.id ? '' : s.id)}
                  >
                    <div className="state-card-name">{s.name.toUpperCase()}</div>
                    <div className="state-card-grid">
                      <span>LGAs</span>
                      <strong>{s.lgas}</strong>
                      <span>Wards</span>
                      <strong>{s.wards.toLocaleString()}</strong>
                      <span>Polling Units</span>
                      <strong>{s.pus.toLocaleString()}</strong>
                      <span>Reported</span>
                      <strong>{s.reported.toLocaleString()}</strong>
                      <span>Awaiting</span>
                      <strong>{s.awaiting.toLocaleString()}</strong>
                      <span>Coverage</span>
                      <strong className="cov">{s.coverage.toFixed(2)}%</strong>
                      <span>Incidents</span>
                      <strong>{s.incidents}</strong>
                      <span>Critical</span>
                      <strong className="crit">{s.critical}</strong>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 3 — Reporting coverage */}
          {(show('coverage') || !tvMode) && (
            <section className="panel">
              <div className="panel-title">
                Reporting Coverage
                <label className="meta" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  Sort
                  <select
                    value={scope.filters.coverageSort}
                    onChange={(e) =>
                      scope.patch({
                        coverageSort: e.target.value as typeof scope.filters.coverageSort,
                      })
                    }
                  >
                    <option value="highest">Highest Coverage</option>
                    <option value="lowest">Lowest Coverage</option>
                    <option value="most_pus">Most Polling Units</option>
                    <option value="most_awaiting">Most Awaiting Reports</option>
                  </select>
                </label>
              </div>
              <div className="coverage-list">
                {d.coverageRows.map((row) => (
                  <div key={row.id} className="coverage-row">
                    <div className="coverage-label">
                      <strong>{row.name}</strong>
                      <span className="meta">
                        {row.level.toUpperCase()} · {row.reported}/{row.total} · awaiting{' '}
                        {row.awaiting}
                      </span>
                    </div>
                    <div className="coverage-bar-track">
                      <div
                        className="coverage-bar-fill"
                        style={{ width: `${Math.min(100, row.coverage)}%` }}
                      />
                    </div>
                    <div className="coverage-pct mono">{row.coverage.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5 — Map */}
          {(show('map') || !tvMode) && (
            <section className="panel">
              <div className="panel-title">
                Live North West Map
                <select
                  value={scope.filters.mapLayer}
                  onChange={(e) =>
                    scope.patch({ mapLayer: e.target.value as typeof scope.filters.mapLayer })
                  }
                >
                  <option value="coverage">Reporting Coverage</option>
                  <option value="incidents">Incidents</option>
                  <option value="verification">Result Verification</option>
                  <option value="agents">Agent Activity</option>
                </select>
              </div>
              <AnalyticsMap
                filters={scope.filters}
                coverageByState={coverageByState}
                onSelectState={(id) => scope.selectState(id)}
                onSelectLga={(sid, lid) => scope.patch({ stateId: sid, lgaId: lid })}
              />
            </section>
          )}

          {/* SECTION 7 — Pipeline */}
          {(show('verification') || !tvMode) && (
            <section className="panel">
              <div className="panel-title">Result Verification Pipeline</div>
              <div className="pipeline">
                <PipeStep label="Submitted" value={d.pipeline.submitted} />
                <span className="pipe-arrow">↓</span>
                <PipeStep label="Pending Ward" value={d.pipeline.pendingWard} />
                <span className="pipe-arrow">↓</span>
                <PipeStep label="Pending LGA" value={d.pipeline.pendingLga} />
                <span className="pipe-arrow">↓</span>
                <PipeStep label="Pending State" value={d.pipeline.pendingState} />
                <span className="pipe-arrow">↓</span>
                <PipeStep label="State Verified" value={d.pipeline.stateVerified} accent />
                <PipeStep label="Rejected" value={d.pipeline.rejected} danger />
              </div>
            </section>
          )}

          {/* SECTION 6 — Incidents */}
          {(show('incidents') || !tvMode) && (
            <section className="panel">
              <div className="panel-title">
                Incident Command Centre
                <div className="sev-pills">
                  <span className="sev critical">Critical {d.incidentSummary.critical}</span>
                  <span className="sev high">High {d.incidentSummary.high}</span>
                  <span className="sev medium">Medium {d.incidentSummary.medium}</span>
                  <span className="sev low">Low {d.incidentSummary.low}</span>
                </div>
              </div>
              <div className="table-wrap">
                <table className="data-table compact">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>State</th>
                      <th>LGA</th>
                      <th>Ward</th>
                      <th>PU</th>
                      <th>Category</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Agent</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {d.filteredIncidents.slice(0, 40).map((i) => {
                      const ref = resolvePu(i.pollingUnitId)
                      return (
                        <tr
                          key={i.id}
                          className={
                            i.severity === 'critical'
                              ? 'row-critical'
                              : i.severity === 'high'
                                ? 'row-high'
                                : ''
                          }
                        >
                          <td className="mono">
                            {new Date(i.createdAt).toLocaleTimeString('en-GB', {
                              timeZone: 'Africa/Lagos',
                            })}
                          </td>
                          <td>{ref?.stateName || '—'}</td>
                          <td>{ref?.lgaName || '—'}</td>
                          <td>{ref?.wardName || '—'}</td>
                          <td>{ref?.puCode || i.pollingUnitId || '—'}</td>
                          <td>{i.category}</td>
                          <td>
                            <span className={`sev ${i.severity}`}>{i.severity.toUpperCase()}</span>
                          </td>
                          <td>{i.status}</td>
                          <td>{i.agentName || i.reporterId || '—'}</td>
                          <td className="row-actions">
                            <Link to={`/incidents/${i.id}`}>Details</Link>
                            {i.photoPath && <span className="meta">Evidence</span>}
                            {i.gpsLat != null && <span className="meta">Location</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION 8 — PU table */}
          {!tvMode && (
            <section className="panel">
              <div className="panel-title">
                Polling Unit Monitoring
                <input
                  type="search"
                  placeholder="Search polling unit, ward, LGA or code"
                  value={puSearch}
                  onChange={(e) => setPuSearch(e.target.value)}
                  className="analytics-search"
                />
              </div>
              <div className="table-wrap">
                <table className="data-table compact">
                  <thead>
                    <tr>
                      <th>PU Code</th>
                      <th>Polling Unit</th>
                      <th>Ward</th>
                      <th>LGA</th>
                      <th>State</th>
                      <th>Agent</th>
                      <th>Opening</th>
                      <th>Incident</th>
                      <th>Result</th>
                      <th>Verification</th>
                      <th>Last Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {puSlice.map((r) => (
                      <tr key={r.id}>
                        <td className="mono">{r.code}</td>
                        <td>{r.name}</td>
                        <td>{r.ward}</td>
                        <td>{r.lga}</td>
                        <td>{r.state}</td>
                        <td>{r.agent}</td>
                        <td>{r.opening}</td>
                        <td>{r.incident}</td>
                        <td>{r.result}</td>
                        <td>
                          <div className="status-chips">
                            {r.statuses.map((s) => (
                              <span key={s} className="chip">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="mono meta">{String(r.last).slice(11, 19) || r.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pager">
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={puPage === 0}
                  onClick={() => setPuPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span className="meta">
                  Page {puPage + 1} / {puPageCount} · {puRows.length} units (activity-scoped)
                </span>
                <button
                  type="button"
                  className="btn btn-sm"
                  disabled={puPage + 1 >= puPageCount}
                  onClick={() => setPuPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {/* SECTION 9 — Agents */}
          {!tvMode && (
            <section className="panel">
              <div className="panel-title">Field Agent Activity</div>
              <div className="kpi-inline">
                <span>Total {d.filteredProfiles.length}</span>
                <span>Active {d.activeAgents}</span>
                <span>Offline {d.offlineAgents}</span>
                <span>Yet to report {d.agentsYetToReport}</span>
              </div>
              <p className="meta" style={{ marginBottom: 8 }}>
                Status derived from last_activity only — not live presence.
              </p>
              <div className="table-wrap">
                <table className="data-table compact">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>State</th>
                      <th>LGA</th>
                      <th>Ward</th>
                      <th>Last activity</th>
                      <th>Status</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.agentStats.slice(0, 30).map((a) => (
                      <tr key={a.id}>
                        <td>{a.fullName}</td>
                        <td>{a.stateId || '—'}</td>
                        <td>{a.lgaId || '—'}</td>
                        <td>{a.wardId || '—'}</td>
                        <td className="mono meta">
                          {a.lastActivity
                            ? new Date(a.lastActivity).toLocaleString('en-GB', {
                                timeZone: 'Africa/Lagos',
                              })
                            : '—'}
                        </td>
                        <td>
                          <span className={`chip ${a.derivedStatus.toLowerCase()}`}>
                            {a.derivedStatus}
                          </span>
                        </td>
                        <td>{a.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION 11–14 charts */}
          {!tvMode && (
            <>
              <section className="panel">
                <div className="panel-title">
                  Results Analytics
                  <span className="meta">Internal monitoring — not INEC official</span>
                </div>
                <div className="kpi-inline">
                  <span>Accredited {d.accredited.toLocaleString()}</span>
                  <span>Valid {d.valid.toLocaleString()}</span>
                  <span>Invalid {d.invalid.toLocaleString()}</span>
                  <span>Received {d.pipeline.submitted}</span>
                  <span>Verified {d.pipeline.stateVerified}</span>
                </div>
                <div className="grid-2">
                  <div style={{ height: 220 }}>
                    <div className="meta">Votes by Party</div>
                    <ResponsiveContainer>
                      <BarChart data={partyChart}>
                        <CartesianGrid stroke="#1a3d30" />
                        <XAxis dataKey="name" stroke="#6b8578" fontSize={11} />
                        <YAxis stroke="#6b8578" fontSize={11} />
                        <Tooltip contentStyle={{ background: '#0b1a14', border: '1px solid #2d5a45' }} />
                        <Bar dataKey="value" fill="#39a453" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ height: 220 }}>
                    <div className="meta">Vote Distribution</div>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={partyChart} dataKey="value" nameKey="name" outerRadius={80} label>
                          {partyChart.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#0b1a14', border: '1px solid #2d5a45' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel-title">Reports Received Over Time</div>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer>
                    <LineChart data={trendData}>
                      <CartesianGrid stroke="#1a3d30" />
                      <XAxis dataKey="time" stroke="#6b8578" fontSize={10} />
                      <YAxis stroke="#6b8578" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#0b1a14', border: '1px solid #2d5a45' }} />
                      <Legend />
                      <Line type="monotone" dataKey="openings" stroke="#5cc3e7" name="Opening Reports" dot={false} />
                      <Line type="monotone" dataKey="results" stroke="#39a453" name="Results" dot={false} />
                      <Line type="monotone" dataKey="incidents" stroke="#e52b32" name="Incidents" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="panel">
                <div className="panel-title">Incidents by Category</div>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer>
                    <BarChart data={categoryChart}>
                      <CartesianGrid stroke="#1a3d30" />
                      <XAxis dataKey="name" stroke="#6b8578" fontSize={10} />
                      <YAxis stroke="#6b8578" fontSize={11} />
                      <Tooltip contentStyle={{ background: '#0b1a14', border: '1px solid #2d5a45' }} />
                      <Bar dataKey="value" fill="#e52b32" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="panel">
                <div className="panel-title">Verification Performance</div>
                <div className="kpi-inline">
                  <span>Agent → Ward ~{d.verificationPerf.avgWardHours}h</span>
                  <span>Ward → LGA ~{d.verificationPerf.avgLgaHours}h</span>
                  <span>LGA → State ~{d.verificationPerf.avgStateHours}h</span>
                  <span>Overall ~{d.verificationPerf.overallHours}h</span>
                </div>
                {d.verificationPerf.oldestPending && (
                  <p className="meta">
                    Oldest pending: {d.verificationPerf.oldestPending.pu} (
                    {d.verificationPerf.oldestPending.status})
                  </p>
                )}
                {d.verificationPerf.mostPendingArea && (
                  <p className="meta">
                    Most awaiting reports: {d.verificationPerf.mostPendingArea.name} (
                    {d.verificationPerf.mostPendingArea.awaiting})
                  </p>
                )}
              </section>
            </>
          )}
        </div>

        {/* SECTION 10 + 15 side column */}
        <aside className="analytics-side">
          <section className="panel">
            <div className="panel-title">Live Activity Feed</div>
            <ul className="activity-feed">
              {live.activity.slice(0, 40).map((a) => (
                <li key={a.id} className={`feed-item feed-${a.kind}`}>
                  <time>
                    {new Date(a.timestamp).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'Africa/Lagos',
                    })}
                  </time>
                  <strong>{a.title}</strong>
                  <span>{a.detail}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <div className="panel-title">Attention Required</div>
            <ul className="attention-list">
              {d.attention.length === 0 && <li className="meta">No operational exceptions in scope.</li>}
              {d.attention.map((a) => (
                <li key={a.id} className={`att ${a.severity}`}>
                  <strong>{a.title}</strong>
                  <span>{a.detail}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: 'green' | 'blue' | 'red' | 'brown'
}) {
  return (
    <div className={`kpi-card${accent ? ` accent-${accent}` : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

function PipeStep({
  label,
  value,
  accent,
  danger,
}: {
  label: string
  value: number
  accent?: boolean
  danger?: boolean
}) {
  return (
    <div className={`pipe-step${accent ? ' ok' : ''}${danger ? ' danger' : ''}`}>
      <div className="pipe-val mono">{String(value).padStart(3, '0')}</div>
      <div className="pipe-label">{label}</div>
    </div>
  )
}
