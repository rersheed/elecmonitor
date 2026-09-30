import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="empty-state" style={{ marginTop: 48 }}>
      <h3>Page not found</h3>
      <p>This ElecMonitor route does not exist in the demo.</p>
      <p>
        <Link to="/">Return to Situation Room</Link>
      </p>
    </div>
  )
}
