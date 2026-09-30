import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight size={14} className="sep" aria-hidden />}
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  )
}
