import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
} from 'lucide-react'
import { MetricCard } from '../components/ui/MetricCard'
import { IncidentBadge, VerificationBadge } from '../components/ui/StatusBadge'
import { GeoMap } from '../components/map/GeoMap'
import { useDataFreshness, useLiveClock } from '../hooks/useDataFreshness'
import { fmtClock, fmtRelative, fmtDateTime } from '../utils/format'
import {
  reports,
  incidents,
  agents,
  activityFeed,
  allPollingUnits,
  geography,
} from '../data'
import { shortPath } from '../data/geography'

export function Overview() {
  const navigate = useNavigate()
  const { label } = useDataFreshness()
  const now = useLiveClock()
  const totalPUs = allPollingUnits().length
  const reportingLocations = new Set(reports.map((r) => r.location.puId || r.location.wardId)).size
  const yetToReport = Math.max(0, totalPUs - reportingLocations)
  const awaiting = reports.filter(
    (r) =>
      r.verificationStatus === 'Submitted' ||
      r.verificationStatus === 'Under Review' ||
      r.verificationStatus === 'Needs Clarification',
  ).length
  const openInc = incidents.filter((i) =>
    ['Open', 'Investigating', 'Escalated'].includes(i.status),
  ).length
  const activeAgents = agents.filter((a) => a.status === 'Active').length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Situation Room</h1>
          <p className="subtitle">
            ElecMonitor overview · {label} · Live clock {fmtClock(now)} WAT
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Reporting locations"
          value={`${reportingLocations} / ${totalPUs}`}
          hint={`${yetToReport} yet to report`}
          icon={<MapPin size={14} aria-hidden />}
          to="/geography"
        />
        <MetricCard
          label="Reports received"
          value={reports.length}
          hint="All categories"
          icon={<FileText size={14} aria-hidden />}
          to="/reports"
        />
        <MetricCard
          label="Awaiting verification"
          value={awaiting}
          hint="Submitted · Review · Clarification"
          icon={<ShieldCheck size={14} aria-hidden />}
          to="/verification?tab=Pending"
        />
        <MetricCard
          label="Open incidents"
          value={openInc}
          hint="Open · Investigating · Escalated"
          icon={<AlertTriangle size={14} aria-hidden />}
          to="/incidents?status=Open"
        />
        <MetricCard
          label="Active field personnel"
          value={activeAgents}
          hint={`of ${agents.length} agents`}
          icon={<Users size={14} aria-hidden />}
          to="/agents?status=Active"
        />
        <MetricCard
          label="Last system update"
          value={fmtClock(now).slice(11)}
          hint="Live clock (WAT)"
          icon={<Clock size={14} aria-hidden />}
        />
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-title">
            Live activity <span className="meta">{label}</span>
          </div>
          <div style={{ maxHeight: 320, overflow: 'auto' }}>
            {activityFeed.slice(0, 10).map((a) => (
              <div className="feed-item" key={a.id}>
                <div className="time">{fmtRelative(a.timestamp)}</div>
                <div className="body">
                  <Link to={a.link}>{a.summary}</Link>
                  <div className="loc">{a.locationLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            Incident summary{' '}
            <Link to="/incidents" className="meta">
              View all
            </Link>
          </div>
          <div className="stack">
            {incidents.slice(0, 5).map((i) => (
              <div key={i.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Link to={`/incidents/${i.id}`} className="mono">
                  {i.caseNumber}
                </Link>
                <span>{i.title}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <IncidentBadge status={i.status} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {shortPath(i.location)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            Geographic coverage{' '}
            <Link to="/geography" className="meta">
              Drill down
            </Link>
          </div>
          <GeoMap onSelectState={(id) => navigate(`/geography/${id}`)} />
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            {geography.map((s) => {
              const n = reports.filter((r) => r.location.stateId === s.id).length
              return (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <Link to={`/geography/${s.id}`}>{s.name}</Link>
                  <span>{n} reports</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          Recent submissions <span className="meta">{label}</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Category</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 8).map((r) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
