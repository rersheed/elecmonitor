import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import { GeoMap } from '../components/map/GeoMap'
import { EmptyState } from '../components/ui/EmptyState'
import {
  geography,
  getState,
  getLga,
  getWard,
  reports,
  incidents,
  agents,
  evidence,
  countHierarchy,
} from '../data'
import { shortPath } from '../data/geography'
import { fmtDateTime, fmtRelative } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'

function locStats(pred: (r: (typeof reports)[0]) => boolean) {
  const rs = reports.filter(pred)
  const last = rs[0]
  const openInc = incidents.filter(
    (i) =>
      pred({ location: i.location } as (typeof reports)[0]) &&
      ['Open', 'Investigating', 'Escalated'].includes(i.status),
  ).length
  const personnel = agents.filter((a) => pred({ location: a.assignedLocation } as (typeof reports)[0])).length
  const evid = evidence.filter((e) => {
    const r = reports.find((x) => x.id === e.relatedReportId)
    return r ? pred(r) : false
  }).length
  return {
    reports: rs.length,
    lastReport: last?.timestamp ?? null,
    personnel,
    openIncidents: openInc,
    coverage: rs.length,
    evidence: evid,
  }
}

export function GeographyIndex() {
  const navigate = useNavigate()
  const { label } = useDataFreshness()
  const [highlight, setHighlight] = useState<string | undefined>()
  const counts = countHierarchy()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Geography</h1>
          <p className="subtitle">
            North-West only · {counts.states} states · {counts.lgas} LGAs · {counts.wards} wards ·{' '}
            {counts.pus} polling units · {label}
          </p>
        </div>
      </div>
      <Breadcrumbs items={[{ label: 'North-West Nigeria' }]} />
      <div className="geo-layout">
        <div className="stack">
          <GeoMap
            selectedStateId={highlight}
            onSelectState={(id) => {
              setHighlight(id)
              navigate(`/geography/${id}`)
            }}
          />
        </div>
        <div className="panel">
          <div className="panel-title">States</div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>State</th>
                  <th>LGAs</th>
                  <th>Reports</th>
                  <th>Open incidents</th>
                  <th>Personnel</th>
                </tr>
              </thead>
              <tbody>
                {geography.map((s) => {
                  const st = locStats((r) => r.location.stateId === s.id)
                  return (
                    <tr
                      key={s.id}
                      className={highlight === s.id ? 'selected' : ''}
                      onMouseEnter={() => setHighlight(s.id)}
                      onClick={() => navigate(`/geography/${s.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <Link to={`/geography/${s.id}`} onClick={(e) => e.stopPropagation()}>
                          {s.name}
                        </Link>
                      </td>
                      <td>{s.lgas.length}</td>
                      <td>{st.reports}</td>
                      <td>{st.openIncidents}</td>
                      <td>{st.personnel}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GeographyDetail() {
  const { stateId, lgaId, wardId } = useParams()
  const navigate = useNavigate()
  const { label } = useDataFreshness()
  const state = stateId ? getState(stateId) : undefined
  const lga = stateId && lgaId ? getLga(stateId, lgaId) : undefined
  const ward = stateId && lgaId && wardId ? getWard(stateId, lgaId, wardId) : undefined

  const crumbs = useMemo(() => {
    const items: { label: string; to?: string }[] = [{ label: 'North-West', to: '/geography' }]
    if (state) items.push({ label: state.name, to: `/geography/${state.id}` })
    if (lga && state) items.push({ label: lga.name, to: `/geography/${state.id}/${lga.id}` })
    if (ward) items.push({ label: ward.name })
    else if (lga) items[items.length - 1] = { label: lga.name }
    else if (state) items[items.length - 1] = { label: state.name }
    return items
  }, [state, lga, ward])

  if (stateId && !state) {
    return <EmptyState title="Location not found" message="No state matches this deep link in the demo geography." />
  }
  if (lgaId && !lga) {
    return <EmptyState title="LGA not found" message="No LGA matches this path in the demo geography." />
  }
  if (wardId && !ward) {
    return <EmptyState title="Ward not found" message="No ward matches this path in the demo geography." />
  }

  const pred = (r: { location: { stateId: string; lgaId: string; wardId: string } }) => {
    if (ward) return r.location.wardId === ward.id
    if (lga) return r.location.lgaId === lga.id
    if (state) return r.location.stateId === state.id
    return false
  }
  const stats = locStats(pred)
  const localReports = reports.filter(pred)

  const children = ward
    ? ward.pollingUnits.map((pu) => ({
        id: pu.id,
        name: pu.name,
        meta: pu.code,
        to: `/reports?ward=${ward.id}&q=${encodeURIComponent(pu.id)}`,
        reports: reports.filter((r) => r.location.puId === pu.id).length,
      }))
    : lga
      ? lga.wards.map((w) => ({
          id: w.id,
          name: w.name,
          meta: `${w.pollingUnits.length} PUs`,
          to: `/geography/${state!.id}/${lga.id}/${w.id}`,
          reports: reports.filter((r) => r.location.wardId === w.id).length,
        }))
      : state
        ? state.lgas.map((l) => ({
            id: l.id,
            name: l.name,
            meta: `${l.wards.length} wards`,
            to: `/geography/${state.id}/${l.id}`,
            reports: reports.filter((r) => r.location.lgaId === l.id).length,
          }))
        : []

  const title = ward?.name || lga?.name || state?.name || 'Geography'

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p className="subtitle">Operational snapshot · {label}</p>
        </div>
      </div>
      <Breadcrumbs items={crumbs} />

      <div className="stats-row">
        <div className="stat-box">
          <div className="k">Reports</div>
          <div className="v">{stats.reports}</div>
        </div>
        <div className="stat-box">
          <div className="k">Last report</div>
          <div className="v" style={{ fontSize: 13 }}>
            {stats.lastReport ? fmtRelative(stats.lastReport) : '—'}
          </div>
        </div>
        <div className="stat-box">
          <div className="k">Personnel</div>
          <div className="v">{stats.personnel}</div>
        </div>
        <div className="stat-box">
          <div className="k">Open incidents</div>
          <div className="v">{stats.openIncidents}</div>
        </div>
        <div className="stat-box">
          <div className="k">Evidence items</div>
          <div className="v">{stats.evidence}</div>
        </div>
      </div>

      <div className="geo-layout">
        <GeoMap
          selectedStateId={state?.id}
          selectedLgaId={lga?.id}
          onSelectState={(id) => navigate(`/geography/${id}`)}
          onSelectLga={(sid, lid) => navigate(`/geography/${sid}/${lid}`)}
        />
        <div className="stack">
          <div className="panel">
            <div className="panel-title">{ward ? 'Polling units' : lga ? 'Wards' : 'LGAs'}</div>
            {children.length === 0 ? (
              <EmptyState
                message={`No child locations under ${title} for the selected period.`}
              />
            ) : (
              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Detail</th>
                      <th>Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link to={c.to}>{c.name}</Link>
                        </td>
                        <td>{c.meta}</td>
                        <td>{c.reports}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="panel">
            <div className="panel-title">Recent reports here</div>
            {localReports.length === 0 ? (
              <EmptyState
                message={`No reports have been submitted for this ${ward ? 'ward' : lga ? 'LGA' : 'state'} during the selected period.`}
              />
            ) : (
              <div className="table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Location</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localReports.slice(0, 8).map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link to={`/reports/${encodeURIComponent(r.id)}`} className="mono">
                            {r.id}
                          </Link>
                        </td>
                        <td>{shortPath(r.location)}</td>
                        <td>{fmtDateTime(r.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
