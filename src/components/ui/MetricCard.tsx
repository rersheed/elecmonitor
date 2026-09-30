import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
  to?: string
}

export function MetricCard({ label, value, hint, icon, to }: Props) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="metric-card"
      onClick={() => to && navigate(to)}
      disabled={!to}
      style={!to ? { cursor: 'default' } : undefined}
    >
      <div className="label">
        {icon}
        {label}
      </div>
      <div className="value">{value}</div>
      {hint && <div className="hint">{hint}</div>}
    </button>
  )
}
