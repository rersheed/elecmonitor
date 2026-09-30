import { useMemo, useState } from 'react'
import { FiltersBar } from '../components/ui/Filters'
import { AgentBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { useFilters } from '../hooks/useFilters'
import { useDataFreshness } from '../hooks/useDataFreshness'
import { useDemoState, useActiveElection } from '../context/DemoState'
import { geography, shortPath, getState, getLga, getWard } from '../data/geography'
import { fmtDateTime } from '../utils/format'
import { Link } from 'react-router-dom'
import type { Agent, GeoPath } from '../types'

const statuses = ['Active', 'Offline', 'On Leave', 'Suspended']

export function Agents() {
  const { filters, setFilter, clearFilters } = useFilters()
  const { agents, assignAgent, controls } = useDemoState()
  const election = useActiveElection()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const [editAgent, setEditAgent] = useState<Agent | null>(null)
  const [stateId, setStateId] = useState('')
  const [lgaId, setLgaId] = useState('')
  const [wardId, setWardId] = useState('')
  const [puId, setPuId] = useState('')

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (filters.state && a.assignedLocation.stateId !== filters.state) return false
      if (filters.lga && a.assignedLocation.lgaId !== filters.lga) return false
      if (filters.ward && a.assignedLocation.wardId !== filters.ward) return false
      if (filters.status && a.status !== filters.status) return false
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [filters, agents])

  function openAssign(a: Agent) {
    setEditAgent(a)
    setStateId(a.assignedLocation.stateId)
    setLgaId(a.assignedLocation.lgaId)
    setWardId(a.assignedLocation.wardId)
    setPuId(a.assignedLocation.puId || '')
  }

  function saveAssign() {
    if (!editAgent || !stateId || !lgaId || !wardId) return
    const st = getState(stateId)
    const lga = getLga(stateId, lgaId)
    const ward = getWard(stateId, lgaId, wardId)
    if (!st || !lga || !ward) return
    const pu = ward.pollingUnits.find((p) => p.id === puId)
    const loc: GeoPath = {
      stateId: st.id,
      stateName: st.name,
      lgaId: lga.id,
      lgaName: lga.name,
      wardId: ward.id,
      wardName: ward.name,
      puId: pu?.id,
      puName: pu?.name,
    }
    assignAgent(editAgent.id, loc)
    setEditAgent(null)
  }

  const lgas = stateId ? getState(stateId)?.lgas || [] : []
  const wards = stateId && lgaId ? getLga(stateId, lgaId)?.wards || [] : []
  const pus = stateId && lgaId && wardId ? getWard(stateId, lgaId, wardId)?.pollingUnits || [] : []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Agents</h1>
          <p className="subtitle">
            Field personnel · assign to state/LGA/ward/PU · election {election.code} · {label}
          </p>
        </div>
      </div>
      <FiltersBar
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        showing={filtered.length}
        total={agents.length}
        statuses={statuses}
        showCategory={false}
        showDate={false}
      />
      {filtered.length === 0 ? (
        <EmptyState message="No agents match the selected filters." />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Assigned location</th>
                <th>Status</th>
                <th>Last report</th>
                <th>Reports</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{a.id}</td>
                  <td>{a.name}</td>
                  <td>{a.role}</td>
                  <td>
                    <Link
                      to={`/geography/${a.assignedLocation.stateId}/${a.assignedLocation.lgaId}/${a.assignedLocation.wardId}`}
                    >
                      {shortPath(a.assignedLocation)}
                    </Link>
                    {a.assignedLocation.puName && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.assignedLocation.puName}</div>
                    )}
                  </td>
                  <td>
                    <AgentBadge status={a.status} />
                  </td>
                  <td>{a.lastReportAt ? fmtDateTime(a.lastReportAt) : '—'}</td>
                  <td>{a.reportsCount}</td>
                  <td>
                    <button type="button" className="btn btn-sm" onClick={() => openAssign(a)}>
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!editAgent}
        title={editAgent ? `Assign ${editAgent.name}` : 'Assign agent'}
        onClose={() => setEditAgent(null)}
      >
        <p style={{ marginTop: 0, fontSize: 13, color: 'var(--text-muted)' }}>
          Assignment for active election <span className="mono">{election.code}</span> (client-side demo state).
        </p>
        <label className="form-label">State</label>
        <select
          className="form-select"
          value={stateId}
          onChange={(e) => {
            setStateId(e.target.value)
            setLgaId('')
            setWardId('')
            setPuId('')
          }}
        >
          <option value="">Select state</option>
          {geography.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label className="form-label">LGA</label>
        <select
          className="form-select"
          value={lgaId}
          disabled={!stateId}
          onChange={(e) => {
            setLgaId(e.target.value)
            setWardId('')
            setPuId('')
          }}
        >
          <option value="">Select LGA</option>
          {lgas.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <label className="form-label">Ward</label>
        <select
          className="form-select"
          value={wardId}
          disabled={!lgaId}
          onChange={(e) => {
            setWardId(e.target.value)
            setPuId('')
          }}
        >
          <option value="">Select ward</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <label className="form-label">Polling unit (optional)</label>
        <select className="form-select" value={puId} disabled={!wardId} onChange={(e) => setPuId(e.target.value)}>
          <option value="">Ward-level only</option>
          {pus.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="actions">
          <button type="button" className="btn btn-ghost" onClick={() => setEditAgent(null)}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={saveAssign} disabled={!wardId}>
            Save assignment
          </button>
        </div>
      </Modal>
    </div>
  )
}
