import { useMemo } from 'react'
import { GeoMap } from '../map/GeoMap'
import type { AnalyticsFilters } from '../../hooks/useAnalyticsScope'

type Props = {
  filters: AnalyticsFilters
  onSelectState: (id: string) => void
  onSelectLga: (stateId: string, lgaId: string) => void
  coverageByState: Record<string, number>
}

/** Reuses Situation Room GeoMap; layer label is informational until choropleth is fully data-driven. */
export function AnalyticsMap({ filters, onSelectState, onSelectLga, coverageByState }: Props) {
  const layerLabel = useMemo(() => {
    switch (filters.mapLayer) {
      case 'incidents':
        return 'Layer: Incidents'
      case 'verification':
        return 'Layer: Result Verification'
      case 'agents':
        return 'Layer: Agent Activity'
      default:
        return 'Layer: Reporting Coverage'
    }
  }, [filters.mapLayer])

  const hint = useMemo(() => {
    const entries = Object.entries(coverageByState)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, v]) => `${id.toUpperCase()} ${v.toFixed(1)}%`)
    return entries.length ? `Top coverage: ${entries.join(' · ')}` : ''
  }, [coverageByState])

  return (
    <div className="analytics-map-wrap">
      <div className="analytics-map-meta">
        <span>{layerLabel}</span>
        <span className="meta">{hint}</span>
      </div>
      <GeoMap
        selectedStateId={filters.stateId || undefined}
        selectedLgaId={filters.lgaId || undefined}
        onSelectState={onSelectState}
        onSelectLga={onSelectLga}
      />
    </div>
  )
}
