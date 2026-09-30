import { Menu } from 'lucide-react'
import { GlobalSearch } from '../ui/GlobalSearch'
import { useDataFreshness, useLiveClock } from '../../hooks/useDataFreshness'
import { fmtClock } from '../../utils/format'
import { Link } from 'react-router-dom'

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { label } = useDataFreshness()
  const now = useLiveClock()

  return (
    <header className="topbar">
      <button type="button" className="btn btn-sm btn-ghost" onClick={onMenu} aria-label="Toggle navigation" style={{ display: 'none' }} id="menu-btn">
        <Menu size={18} />
      </button>
      <style>{`@media (max-width:960px){#menu-btn{display:inline-flex!important}}`}</style>
      <GlobalSearch />
      <div className="topbar-meta">
        <span>
          <span className="freshness-dot" aria-hidden /> {label}
        </span>
        <span className="mono">{fmtClock(now)} WAT</span>
        <Link to="/login" className="btn btn-sm">
          Demo user
        </Link>
      </div>
    </header>
  )
}
