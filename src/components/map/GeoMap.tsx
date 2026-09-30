import { geography, statePositions, lgaOffsets, reports, incidents } from '../../data'

interface Props {
  selectedStateId?: string
  selectedLgaId?: string
  onSelectState?: (id: string) => void
  onSelectLga?: (stateId: string, lgaId: string) => void
}

function coverageForState(stateId: string) {
  const count = reports.filter((r) => r.location.stateId === stateId).length
  return Math.min(1, count / 25)
}

function coverageForLga(lgaId: string) {
  const count = reports.filter((r) => r.location.lgaId === lgaId).length
  return Math.min(1, count / 12)
}

function fill(cov: number, selected: boolean) {
  if (selected) return 'rgba(59,130,246,0.55)'
  const g = Math.round(30 + cov * 100)
  const b = Math.round(60 + cov * 80)
  return `rgba(40,${g},${b},0.75)`
}

export function GeoMap({ selectedStateId, selectedLgaId, onSelectState, onSelectLga }: Props) {
  return (
    <div className="geo-map" role="img" aria-label="Geographic coverage map of monitored states">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="100" height="100" fill="#0b1220" rx="2" />
        <text x="4" y="7" fill="#64748b" fontSize="3.5">
          Nigeria · monitored subset
        </text>
        {geography.map((state) => {
          const pos = statePositions[state.id]
          if (!pos) return null
          const cov = coverageForState(state.id)
          const selected = selectedStateId === state.id && !selectedLgaId
          const openInc = incidents.filter(
            (i) => i.location.stateId === state.id && (i.status === 'Open' || i.status === 'Investigating' || i.status === 'Escalated'),
          ).length
          const reportCount = reports.filter((r) => r.location.stateId === state.id).length
          return (
            <g key={state.id}>
              <rect
                className={`geo-region${selected ? ' highlight' : ''}`}
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={pos.h}
                rx={1.5}
                fill={fill(cov, selected)}
                onClick={() => onSelectState?.(state.id)}
              >
                <title>{`${state.name}: ${reportCount} reports, ${openInc} open incidents`}</title>
              </rect>
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + 6}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="3.2"
                fontWeight="600"
                pointerEvents="none"
              >
                {state.name}
              </text>
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + 11}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="2.6"
                pointerEvents="none"
              >
                {reportCount} rpt · {openInc} open
              </text>
              {selectedStateId === state.id &&
                state.lgas.map((lga) => {
                  const off = lgaOffsets[lga.id] || { dx: 0, dy: 0 }
                  const lx = pos.x + pos.w / 2 + off.dx - 6
                  const ly = pos.y + pos.h / 2 + off.dy - 4
                  const lcov = coverageForLga(lga.id)
                  const lsel = selectedLgaId === lga.id
                  const lc = reports.filter((r) => r.location.lgaId === lga.id).length
                  return (
                    <g key={lga.id}>
                      <rect
                        className={`geo-region${lsel ? ' highlight' : ''}`}
                        x={lx}
                        y={ly}
                        width={12}
                        height={8}
                        rx={1}
                        fill={fill(lcov, lsel)}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectLga?.(state.id, lga.id)
                        }}
                      >
                        <title>{`${lga.name}: ${lc} reports`}</title>
                      </rect>
                      <text
                        x={lx + 6}
                        y={ly + 5}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="2"
                        pointerEvents="none"
                      >
                        {lga.name.length > 10 ? lga.code : lga.name}
                      </text>
                    </g>
                  )
                })}
            </g>
          )
        })}
        <text x="4" y="96" fill="#64748b" fontSize="2.8">
          Click region to filter · darker = higher report volume
        </text>
      </svg>
    </div>
  )
}
