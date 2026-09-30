import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { reports, incidents, geography } from '../data'
import { useDataFreshness } from '../hooks/useDataFreshness'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#38bdf8', '#a78bfa']

export function Analytics() {
  const { label } = useDataFreshness()

  const byCategory = Object.entries(
    reports.reduce<Record<string, number>>((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1
      return acc
    }, {}),
  ).map(([name, value]) => ({ name: name.split(' ')[0], full: name, value }))

  const byState = geography.map((s) => ({
    name: s.name,
    reports: reports.filter((r) => r.location.stateId === s.id).length,
    incidents: incidents.filter((i) => i.location.stateId === s.id).length,
  }))

  const coverageOverTime = Array.from({ length: 8 }, (_, i) => {
    const hour = 8 + i * 2
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      coverage: Math.min(100, 20 + i * 10 + (i === 3 ? 8 : 0)),
    }
  })

  const turnaround = [
    { name: '<1h', value: 12 },
    { name: '1–2h', value: 18 },
    { name: '2–4h', value: 22 },
    { name: '>4h', value: 8 },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="subtitle">Coverage, category mix, geography, verification turnaround · {label}</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="panel">
          <div className="panel-title">
            Coverage over time
            <Link to="/geography" className="meta">
              View records
            </Link>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={coverageOverTime}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #334155' }}
                />
                <Line type="monotone" dataKey="coverage" stroke="#3b82f6" strokeWidth={2} name="Coverage %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            Reports by category
            <Link to="/reports" className="meta">
              View records
            </Link>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={byCategory}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #334155' }}
                  formatter={(v, _n, item) => [v, (item?.payload as { full?: string })?.full || '']}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Reports" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-title">
            By geography
            <Link to="/geography" className="meta">
              View records
            </Link>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={byState}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155' }} />
                <Bar dataKey="reports" fill="#22c55e" name="Reports" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" fill="#f59e0b" name="Incidents" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            Verification turnaround
            <Link to="/verification" className="meta">
              View records
            </Link>
          </div>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={turnaround} dataKey="value" nameKey="name" outerRadius={80} label>
                  {turnaround.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #334155' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
