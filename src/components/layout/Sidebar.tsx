import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  MapPinned,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Users,
  BarChart3,
  Image,
  UserCog,
  ScrollText,
  Settings,
  Brain,
  Vote,
  Flag,
  Activity,
} from 'lucide-react'

const groups: {
  label: string
  items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[]
}[] = [
  {
    label: 'Overview',
    items: [
      { to: '/', label: 'Situation Room', icon: LayoutDashboard, end: true },
      { to: '/analytics', label: 'Live Analytics', icon: Activity },
      { to: '/maps', label: 'Maps', icon: MapPinned },
    ],
  },
  {
    label: 'Field Operations',
    items: [
      { to: '/reports', label: 'Reports', icon: FileText },
      { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
      { to: '/verification', label: 'Verification', icon: ShieldCheck },
      { to: '/results', label: 'Results', icon: BarChart3 },
      { to: '/evidence', label: 'Evidence', icon: Image },
    ],
  },
  {
    label: 'Network',
    items: [
      { to: '/agents', label: 'Agents', icon: Users },
      { to: '/geography', label: 'Geography', icon: Map },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/elections', label: 'Elections', icon: Vote },
      { to: '/parties', label: 'Parties', icon: Flag },
      { to: '/users', label: 'Users', icon: UserCog },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/ai', label: 'AI Assistant', icon: Brain },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/audit', label: 'Audit Log', icon: ScrollText },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const base = import.meta.env.BASE_URL

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary">
      <div className="sidebar-brand">
        <div className="brand-logos" aria-hidden>
          <img src={`${base}city-boy-logo.png`} alt="" className="logo-mark city-boy" />
          <img src={`${base}apc-logo.png`} alt="" className="logo-mark apc" />
        </div>
        <div className="brand-text">
          <div className="product">CITY BOY MOVEMENT</div>
          <div className="workspace">NORTH WEST</div>
          <div className="brand-tag">ElecMonitor · Situation Room</div>
        </div>
      </div>
      <nav style={{ overflow: 'auto', flex: 1 }}>
        {groups.map((g) => (
          <div className="nav-section" key={g.label}>
            <div className="nav-section-label">{g.label}</div>
            {g.items.map((item) => (
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
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="brand-strip" aria-hidden>
          <span className="c green" />
          <span className="c blue" />
          <span className="c red" />
        </div>
        City Boy Movement North West
      </div>
    </aside>
  )
}
