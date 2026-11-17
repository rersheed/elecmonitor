import { Link, useNavigate } from 'react-router-dom'

const base = import.meta.env.BASE_URL

export function Login() {
  const navigate = useNavigate()
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brands">
          <img src={`${base}city-boy-logo.png`} alt="City Boy Movement" className="login-logo city-boy" />
          <img src={`${base}apc-logo.png`} alt="All Progressives Congress" className="login-logo apc" />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '0.04em' }}>
            CITY BOY MOVEMENT NORTH WEST
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Election Monitoring & Situation Room
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>ElecMonitor</div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
          Demo login — no credentials required. Continues as Situation Room Lead.
        </p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" defaultValue="hauwa.ibrahim@elecmonitor.demo" readOnly />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" defaultValue="demo-password" readOnly />
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
          onClick={() => navigate('/analytics')}
        >
          Enter Situation Room
        </button>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 16, textAlign: 'center' }}>
          <Link to="/analytics">Skip to Live Analytics</Link> · APC partner branding · demo or live
          backend
        </p>
      </div>
    </div>
  )
}
