import { Menu } from 'lucide-react'
import { GlobalSearch } from '../ui/GlobalSearch'
import { useDataFreshness, useLiveClock } from '../../hooks/useDataFreshness'
import { fmtClock } from '../../utils/format'
import { Link } from 'react-router-dom'
import { useDemoState } from '../../context/DemoState'
import { elections } from '../../data/elections'
import { geography } from '../../data/geography'

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { controls, setControls, activeElectionId, setActiveElectionId } = useDemoState()
  const { label } = useDataFreshness(controls.syncIntervalSec * 100)
  const now = useLiveClock()

  return (
    <header className="topbar">
      <button type="button" className="btn btn-sm btn-ghost" onClick={onMenu} aria-label="Toggle navigation" style={{ display: 'none' }} id="menu-btn">
        <Menu size={18} />
      </button>
      <style>{`@media (max-width:960px){#menu-btn{display:inline-flex!important}}`}</style>
      <GlobalSearch />
      <div className="topbar-meta">
        <label className="topbar-select" title="Active election">
          <span className="sr-only">Election</span>
          <select
            value={activeElectionId}
            onChange={(e) => setActiveElectionId(e.target.value)}
            aria-label="Active election"
          >
            {elections.map((el) => (
              <option key={el.id} value={el.id}>
                {el.code}
              </option>
            ))}
          </select>
        </label>
        <label className="topbar-select" title="Geographic scope (NW)">
          <span className="sr-only">Scope</span>
          <select
            value={controls.geoScopeStateId}
            onChange={(e) => setControls({ geoScopeStateId: e.target.value })}
            aria-label="Geographic scope"
          >
            <option value="">All NW</option>
            {geography.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
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
