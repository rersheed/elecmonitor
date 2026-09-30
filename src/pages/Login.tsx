import { Link, useNavigate } from 'react-router-dom'
import { Radar } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div className="logo" style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
            <Radar size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>ElecMonitor</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Election Situation Room</div>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Demo login — no credentials required. Continues as Situation Room Lead.
        </p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" defaultValue="chinedu.okoro@elecmonitor.demo" readOnly />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" defaultValue="demo-password" readOnly />
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
          onClick={() => navigate('/')}
        >
          Enter Situation Room
        </button>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 16, textAlign: 'center' }}>
          <Link to="/">Skip to overview</Link> · ElecMonitor demo data only
        </p>
      </div>
    </div>
  )
}
