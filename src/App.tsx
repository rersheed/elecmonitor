import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DemoStateProvider } from './context/DemoState'
import { AppShell } from './components/layout/AppShell'
import { Overview } from './pages/Overview'
import { GeographyIndex, GeographyDetail } from './pages/Geography'
import { ReportsList, ReportDetail } from './pages/Reports'
import { IncidentsList, IncidentDetail } from './pages/Incidents'
import { Verification } from './pages/Verification'
import { Agents } from './pages/Agents'
import { Results } from './pages/Results'
import { Evidence } from './pages/Evidence'
import { Analytics } from './pages/Analytics'
import { AI } from './pages/AI'
import { Elections } from './pages/Elections'
import { Parties } from './pages/Parties'
import { Maps } from './pages/Maps'
import { Users } from './pages/Users'
import { Audit } from './pages/Audit'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <DemoStateProvider>
      <BrowserRouter basename="/elecmonitor">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppShell />}>
            <Route index element={<Overview />} />
            <Route path="geography" element={<GeographyIndex />} />
            <Route path="geography/:stateId" element={<GeographyDetail />} />
            <Route path="geography/:stateId/:lgaId" element={<GeographyDetail />} />
            <Route path="geography/:stateId/:lgaId/:wardId" element={<GeographyDetail />} />
            <Route path="maps" element={<Maps />} />
            <Route path="reports" element={<ReportsList />} />
            <Route path="reports/:id" element={<ReportDetail />} />
            <Route path="incidents" element={<IncidentsList />} />
            <Route path="incidents/:id" element={<IncidentDetail />} />
            <Route path="verification" element={<Verification />} />
            <Route path="agents" element={<Agents />} />
            <Route path="elections" element={<Elections />} />
            <Route path="parties" element={<Parties />} />
            <Route path="results" element={<Results />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai" element={<AI />} />
            <Route path="users" element={<Users />} />
            <Route path="audit" element={<Audit />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoStateProvider>
  )
}
