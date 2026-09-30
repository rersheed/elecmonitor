import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell() {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <TopBar onMenu={() => setOpen((v) => !v)} />
      <main className="main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>ElecMonitor · Election Situation Room · City Boy · APC · North-West</span>
        <span>Export label: ElecMonitor Demo · Not for operational use</span>
      </footer>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 25 }}
          aria-hidden
        />
      )}
    </div>
  )
}
