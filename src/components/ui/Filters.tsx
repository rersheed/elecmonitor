import { geography } from '../../data'
import type { FilterKey } from '../../hooks/useFilters'

interface Props {
  filters: Record<string, string>
  setFilter: (key: FilterKey, value: string) => void
  clearFilters: () => void
  showing: number
  total: number
  categories?: string[]
  statuses?: string[]
  showDate?: boolean
  showCategory?: boolean
  showStatus?: boolean
}

export function FiltersBar({
  filters,
  setFilter,
  clearFilters,
  showing,
  total,
  categories = [],
  statuses = [],
  showDate = true,
  showCategory = true,
  showStatus = true,
}: Props) {
  const state = geography.find((s) => s.id === filters.state)
  const lga = state?.lgas.find((l) => l.id === filters.lga)

  return (
    <div className="filters-bar">
      <select
        aria-label="Filter by state"
        value={filters.state || ''}
        onChange={(e) => setFilter('state', e.target.value)}
      >
        <option value="">All states</option>
        {geography.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by LGA"
        value={filters.lga || ''}
        onChange={(e) => setFilter('lga', e.target.value)}
        disabled={!state}
      >
        <option value="">All LGAs</option>
        {state?.lgas.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by ward"
        value={filters.ward || ''}
        onChange={(e) => setFilter('ward', e.target.value)}
        disabled={!lga}
      >
        <option value="">All wards</option>
        {lga?.wards.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      {showCategory && categories.length > 0 && (
        <select
          aria-label="Filter by category"
          value={filters.category || ''}
          onChange={(e) => setFilter('category', e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
      {showStatus && statuses.length > 0 && (
        <select
          aria-label="Filter by status"
          value={filters.status || ''}
          onChange={(e) => setFilter('status', e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      {showDate && (
        <input
          type="date"
          aria-label="Filter by date"
          value={filters.date || ''}
          onChange={(e) => setFilter('date', e.target.value)}
        />
      )}
      <button type="button" className="btn btn-sm btn-ghost" onClick={clearFilters}>
        Clear filters
      </button>
      <span className="showing">
        Showing {showing} of {total}
      </span>
    </div>
  )
}
