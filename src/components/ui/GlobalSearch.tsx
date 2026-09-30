import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { geography, reports, incidents, agents, allWards } from '../../data'

interface Hit {
  kind: string
  title: string
  sub: string
  to: string
}

export function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    const out: Hit[] = []
    for (const s of geography) {
      if (s.name.toLowerCase().includes(term) || s.id.includes(term) || s.code.toLowerCase().includes(term)) {
        out.push({ kind: 'State', title: s.name, sub: s.code, to: `/geography/${s.id}` })
      }
      for (const l of s.lgas) {
        if (l.name.toLowerCase().includes(term) || l.id.includes(term)) {
          out.push({ kind: 'LGA', title: l.name, sub: s.name, to: `/geography/${s.id}/${l.id}` })
        }
      }
    }
    for (const { state, lga, ward } of allWards()) {
      if (!lga) continue
      if (ward.name.toLowerCase().includes(term) || ward.id.includes(term)) {
        out.push({
          kind: 'Ward',
          title: ward.name,
          sub: `${state.name} / ${lga.name}`,
          to: `/geography/${state.id}/${lga.id}/${ward.id}`,
        })
      }
    }
    for (const a of agents) {
      if (a.name.toLowerCase().includes(term) || a.id.toLowerCase().includes(term)) {
        out.push({ kind: 'Agent', title: a.name, sub: a.id, to: `/agents?q=${encodeURIComponent(a.id)}` })
      }
    }
    for (const r of reports) {
      if (r.id.toLowerCase().includes(term) || r.reporterName.toLowerCase().includes(term)) {
        out.push({ kind: 'Report', title: r.id, sub: r.category, to: `/reports/${encodeURIComponent(r.id)}` })
      }
    }
    for (const i of incidents) {
      if (
        i.caseNumber.toLowerCase().includes(term) ||
        i.id.toLowerCase().includes(term) ||
        i.title.toLowerCase().includes(term)
      ) {
        out.push({ kind: 'Incident', title: i.caseNumber, sub: i.title, to: `/incidents/${i.id}` })
      }
    }
    return out.slice(0, 12)
  }, [q])

  return (
    <div className="topbar-search" ref={ref}>
      <Search className="icon" size={16} aria-hidden />
      <input
        type="search"
        placeholder="Search state, LGA, ward, agent, incident, report…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        aria-label="Global search"
      />
      {open && hits.length > 0 && (
        <div className="search-results" role="listbox">
          {hits.map((h) => (
            <button
              key={`${h.kind}-${h.to}-${h.title}`}
              type="button"
              role="option"
              onClick={() => {
                nav(h.to)
                setQ('')
                setOpen(false)
              }}
            >
              <div className="kind">{h.kind}</div>
              <div className="title">{h.title}</div>
              <div className="sub">{h.sub}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
