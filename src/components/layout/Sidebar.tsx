import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Users,
  BarChart3,
  Image,
  LineChart,
  UserCog,
  ScrollText,
  Settings,
  Radar,
} from 'lucide-react'

const primary = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/geography', label: 'Geography', icon: Map },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { to: '/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/agents', label: 'Agents', icon: Users },
  { to: '/results', label: 'Results', icon: BarChart3 },
  { to: '/evidence', label: 'Evidence', icon: Image },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
]

const admin = [
  { to: '/users', label: 'Users', icon: UserCog },
  { to: '/audit', label: 'Audit Log', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <div className="sidebar-brand">
        <div className="logo" aria-hidden>
          <Radar size={18} />
        </div>
        <div className="brand-text">
          <div className="product">ElecMonitor</div>
          <div className="workspace">Election Situation Room</div>
        </div>
      </div>
      <nav style={{ overflow: 'auto', flex: 1 }}>
        <div className="nav-section">
          <div className="nav-section-label">Primary</div>
          {primary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={onNavigate}
            >
              <item.icon aria-hidden />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-section-label">Admin</div>
          {admin.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={onNavigate}
            >
              <item.icon aria-hidden />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="sidebar-footer">ElecMonitor demo · Demo data only</div>
    </aside>
  )
}
