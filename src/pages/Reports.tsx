import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { FiltersBar } from '../components/ui/Filters'
import { VerificationBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { ArchiveConfirm } from '../components/ui/Modal'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { evidence, results, incidents, geography, countHierarchy } from '../data'
import { forecastModel } from '../data/ai'
import { shortPath, locationPath } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { useDemoState, useActiveElection } from '../context/DemoState'
import { downloadCsv, downloadExcelCsv, openPrintablePdf } from '../utils/export'

const statuses = ['Submitted', 'Under Review', 'Verified', 'Rejected', 'Needs Clarification', 'Contested']

export function ReportsList() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { reports, agents, anomalies, auditLog, controls } = useDemoState()
  const election = useActiveElection()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const [archived, setArchived] = useState<Set<string>>(new Set())

  const cats = useMemo(() => [...new Set(reports.map((r) => r.category))].sort(), [reports])

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
  }, [filters, archived, reports])

  const hierarchy = countHierarchy()

  const exportCards = [
    {
      id: 'results',
      title: 'Results',
      desc: 'Structured PU result submissions',
      csv: () =>
        downloadCsv(
          'elecmonitor-results.csv',
          ['ID', 'PU', 'State', 'LGA', 'Ward', 'APC', 'PDP', 'NNPP', 'LP', 'Invalid', 'Accredited', 'Status'],
          results.map((r) => [
            r.id,
            r.puName,
            r.location.stateName,
            r.location.lgaName,
            r.location.wardName,
            r.partyA,
            r.partyB,
            r.partyC,
            r.partyD,
            r.invalid,
            r.totalAccredited,
            r.status,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-results.csv',
          ['ID', 'PU', 'APC', 'PDP', 'NNPP', 'LP', 'Status'],
          results.map((r) => [r.id, r.puName, r.partyA, r.partyB, r.partyC, r.partyD, r.status]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Results export',
          results.slice(0, 40).map(
            (r) =>
              `${r.id} · ${r.puName} · APC ${r.partyA} / PDP ${r.partyB} / NNPP ${r.partyC} / LP ${r.partyD} · ${r.status}`,
          ),
        ),
    },
    {
      id: 'coverage',
      title: 'Coverage',
      desc: 'State hierarchy + report counts',
      csv: () =>
        downloadCsv(
          'elecmonitor-coverage.csv',
          ['State', 'LGAs', 'Wards', 'PUs', 'Reports'],
          geography.map((s) => [
            s.name,
            s.lgas.length,
            s.lgas.reduce((n, l) => n + l.wards.length, 0),
            s.lgas.reduce((n, l) => n + l.wards.reduce((m, w) => m + w.pollingUnits.length, 0), 0),
            reports.filter((r) => r.location.stateId === s.id).length,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-coverage.csv',
          ['State', 'Reports'],
          geography.map((s) => [s.name, reports.filter((r) => r.location.stateId === s.id).length]),
        ),
      pdf: () =>
        openPrintablePdf('Coverage export', [
          `Hierarchy: ${hierarchy.states} states · ${hierarchy.lgas} LGAs · ${hierarchy.wards} wards · ${hierarchy.pus} PUs`,
          ...geography.map(
            (s) =>
              `${s.name}: ${reports.filter((r) => r.location.stateId === s.id).length} reports`,
          ),
        ]),
    },
    {
      id: 'verification',
      title: 'Verification',
      desc: 'Report verification statuses',
      csv: () =>
        downloadCsv(
          'elecmonitor-verification.csv',
          ['ID', 'Category', 'Status', 'State', 'Reporter', 'Timestamp'],
          reports.map((r) => [
            r.id,
            r.category,
            r.verificationStatus,
            r.location.stateName,
            r.reporterName,
            r.timestamp,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-verification.csv',
          ['ID', 'Status'],
          reports.map((r) => [r.id, r.verificationStatus]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Verification export',
          reports.slice(0, 50).map((r) => `${r.id} · ${r.verificationStatus} · ${r.category}`),
        ),
    },
    {
      id: 'agents',
      title: 'Agents',
      desc: 'Field roster & assignments',
      csv: () =>
        downloadCsv(
          'elecmonitor-agents.csv',
          ['ID', 'Name', 'Role', 'Status', 'State', 'LGA', 'Ward', 'Reports'],
          agents.map((a) => [
            a.id,
            a.name,
            a.role,
            a.status,
            a.assignedLocation.stateName,
            a.assignedLocation.lgaName,
            a.assignedLocation.wardName,
            a.reportsCount,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-agents.csv',
          ['ID', 'Name', 'Status'],
          agents.map((a) => [a.id, a.name, a.status]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Agents export',
          agents.slice(0, 40).map((a) => `${a.id} · ${a.name} · ${a.status} · ${shortPath(a.assignedLocation)}`),
        ),
    },
    {
      id: 'anomalies',
      title: 'Anomalies',
      desc: 'AI anomaly scores',
      csv: () =>
        downloadCsv(
          'elecmonitor-anomalies.csv',
          ['ID', 'Score', 'Type', 'Status', 'State', 'Summary'],
          anomalies.map((a) => [a.id, a.score, a.type, a.status, a.location.stateName, a.summary]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-anomalies.csv',
          ['ID', 'Score', 'Status'],
          anomalies.map((a) => [a.id, a.score, a.status]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Anomalies export',
          anomalies.map((a) => `${a.id} · ${a.score} · ${a.type} · ${a.status}`),
        ),
    },
    {
      id: 'forecast',
      title: 'Forecast',
      desc: 'Lead probabilities by state',
      csv: () =>
        downloadCsv(
          'elecmonitor-forecast.csv',
          ['State', 'Lead', 'Probability', 'Low', 'High', 'Sample'],
          forecastModel.states.map((s) => [
            s.stateName,
            s.leadParty,
            s.leadProbability,
            s.low,
            s.high,
            s.sampleSize,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-forecast.csv',
          ['State', 'Lead', 'Probability'],
          forecastModel.states.map((s) => [s.stateName, s.leadParty, s.leadProbability]),
        ),
      pdf: () =>
        openPrintablePdf('Forecast export', [
          `Model ${forecastModel.version} · ${forecastModel.snapshot}`,
          ...forecastModel.states.map(
            (s) =>
              `${s.stateName}: ${s.leadParty} ${Math.round(s.leadProbability * 100)}% (${Math.round(s.low * 100)}–${Math.round(s.high * 100)}%)`,
          ),
        ]),
    },
    {
      id: 'audit',
      title: 'Audit',
      desc: 'Audit trail export',
      csv: () =>
        downloadCsv(
          'elecmonitor-audit.csv',
          ['Timestamp', 'Actor', 'Action', 'Record', 'Old', 'New', 'IP'],
          auditLog.map((a) => [
            a.timestamp,
            a.actor,
            a.action,
            a.recordId,
            a.oldValue,
            a.newValue,
            a.ip || '',
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-audit.csv',
          ['Timestamp', 'Action', 'Record'],
          auditLog.map((a) => [a.timestamp, a.action, a.recordId]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Audit export',
          auditLog.slice(0, 40).map((a) => `${fmtDateTime(a.timestamp)} · ${a.actor} · ${a.action}`),
        ),
    },
    {
      id: 'turnout',
      title: 'Turnout',
      desc: 'Accredited vs invalid from results',
      csv: () =>
        downloadCsv(
          'elecmonitor-turnout.csv',
          ['ID', 'State', 'Accredited', 'Invalid', 'Valid ballots'],
          results.map((r) => [
            r.id,
            r.location.stateName,
            r.totalAccredited,
            r.invalid,
            r.partyA + r.partyB + r.partyC + r.partyD,
          ]),
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-turnout.csv',
          ['State', 'Accredited'],
          results.map((r) => [r.location.stateName, r.totalAccredited]),
        ),
      pdf: () =>
        openPrintablePdf(
          'Turnout export',
          results.slice(0, 40).map(
            (r) => `${r.id} · accredited ${r.totalAccredited} · invalid ${r.invalid}`,
          ),
        ),
    },
    {
      id: 'overview',
      title: 'Overview',
      desc: 'Situation room snapshot',
      csv: () =>
        downloadCsv(
          'elecmonitor-overview.csv',
          ['Metric', 'Value'],
          [
            ['Election', election.name],
            ['Reports', reports.length],
            ['Incidents', incidents.length],
            ['Agents', agents.length],
            ['Results', results.length],
            ['Anomalies open', anomalies.filter((a) => a.status === 'Open').length],
          ],
        ),
      excel: () =>
        downloadExcelCsv(
          'elecmonitor-overview.csv',
          ['Metric', 'Value'],
          [
            ['Election', election.name],
            ['Reports', reports.length],
            ['Agents', agents.length],
          ],
        ),
      pdf: () =>
        openPrintablePdf('Overview export', [
          `Election: ${election.name} (${election.code})`,
          `Reports: ${reports.length}`,
          `Incidents: ${incidents.length}`,
          `Agents: ${agents.length}`,
          `Results: ${results.length}`,
          `Open anomalies: ${anomalies.filter((a) => a.status === 'Open').length}`,
        ]),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="subtitle">Field observations · exports catalog · {label}</p>
        </div>
      </div>

      <div id="exports" className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-title">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Exports catalog
          </span>
          <span className="meta">CSV / Excel / printable PDF · client-side</span>
        </div>
        <div className="exports-grid">
          {exportCards.map((c) => (
            <div key={c.id} className="export-card">
              <strong>{c.title}</strong>
              <p>{c.desc}</p>
              <div className="export-btns">
                <button type="button" className="btn btn-sm" onClick={c.csv}>
                  <FileText size={12} /> CSV
                </button>
                <button type="button" className="btn btn-sm" onClick={c.excel}>
                  <FileSpreadsheet size={12} /> Excel
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={c.pdf}>
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={reports.length - archived.size}
        categories={cats}
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
  const { reports } = useDemoState()
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
