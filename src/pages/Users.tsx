import { users } from '../data'
import { GenericBadge } from '../components/ui/StatusBadge'
import { fmtDateTime } from '../utils/format'
import { useDataFreshness } from '../hooks/useDataFreshness'

const roleScopes: Record<string, string> = {
  'Super Admin': 'Full national access · manage users & settings',
  'Situation Room Lead': 'National ops · verification & incidents',
  'State Coordinator': 'Scoped to assigned state',
  'LGA Coordinator': 'Scoped to assigned LGA',
  Analyst: 'Read + analytics across assigned scope',
  Verifier: 'Verification queue for assigned geography',
  'Field Agent': 'Submit reports/evidence for assigned ward',
  'Read-only Observer': 'View-only · no mutations',
}

export function Users() {
  const { label } = useDataFreshness()
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Users & Roles</h1>
          <p className="subtitle">Demo directory with scoped access · {label}</p>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-title">Role matrix (demo)</div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Role</th>
                <th>Scoped access</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(roleScopes).map(([role, scope]) => (
                <tr key={role}>
                  <td>{role}</td>
                  <td>{scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Scope</th>
              <th>Status</th>
              <th>Last login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.scope}</td>
                <td>
                  <GenericBadge label={u.status} tone={u.status === 'Active' ? 'success' : 'neutral'} />
                </td>
                <td>{fmtDateTime(u.lastLogin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
