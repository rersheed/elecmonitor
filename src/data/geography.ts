import type { State, GeoPath } from '../types'

export const geography: State[] = [
  {
    id: 'kd',
    name: 'Kaduna',
    code: 'KD',
    lgas: [
      {
        id: 'kd-north',
        name: 'Kaduna North',
        code: 'KD-NORTH',
        wards: [
          {
            id: 'kd-north-badarawa',
            name: 'Badarawa-Malali',
            code: 'BM',
            pollingUnits: [
              { id: 'kd-n-bm-01', name: 'Badarawa Primary School', code: '01' },
              { id: 'kd-n-bm-02', name: 'Malali Community Hall', code: '02' },
              { id: 'kd-n-bm-03', name: 'Unguwan Rimi Open Space', code: '03' },
              { id: 'kd-n-bm-04', name: 'Badarawa Market Square', code: '04' },
            ],
          },
          {
            id: 'kd-north-kabala',
            name: 'Kabala',
            code: 'KB',
            pollingUnits: [
              { id: 'kd-n-kb-01', name: 'Kabala Costain School', code: '01' },
              { id: 'kd-n-kb-02', name: 'Kabala West Clinic', code: '02' },
              { id: 'kd-n-kb-03', name: 'Kabala Junction Hall', code: '03' },
            ],
          },
          {
            id: 'kd-north-ungwan-sarki',
            name: 'Ungwan Sarki',
            code: 'US',
            pollingUnits: [
              { id: 'kd-n-us-01', name: 'Ungwan Sarki Primary', code: '01' },
              { id: 'kd-n-us-02', name: 'Sarki Community Centre', code: '02' },
              { id: 'kd-n-us-03', name: 'Kawo Road Open Ground', code: '03' },
              { id: 'kd-n-us-04', name: 'Sarki Market Stall Area', code: '04' },
            ],
          },
        ],
      },
      {
        id: 'kd-south',
        name: 'Kaduna South',
        code: 'KD-SOUTH',
        wards: [
          {
            id: 'kd-south-barnawa',
            name: 'Barnawa',
            code: 'BN',
            pollingUnits: [
              { id: 'kd-s-bn-01', name: 'Barnawa Primary School', code: '01' },
              { id: 'kd-s-bn-02', name: 'Barnawa Police Station Ground', code: '02' },
              { id: 'kd-s-bn-03', name: 'Television Road Hall', code: '03' },
            ],
          },
          {
            id: 'kd-south-kakuri',
            name: 'Kakuri',
            code: 'KK',
            pollingUnits: [
              { id: 'kd-s-kk-01', name: 'Kakuri Industrial Layout', code: '01' },
              { id: 'kd-s-kk-02', name: 'Kakuri Community School', code: '02' },
              { id: 'kd-s-kk-03', name: 'Railway Quarters Ground', code: '03' },
              { id: 'kd-s-kk-04', name: 'Kakuri Market Area', code: '04' },
            ],
          },
        ],
      },
      {
        id: 'kd-chikun',
        name: 'Chikun',
        code: 'CHIKUN',
        wards: [
          {
            id: 'kd-chikun-sabon-tasha',
            name: 'Sabon Tasha',
            code: 'ST',
            pollingUnits: [
              { id: 'kd-c-st-01', name: 'Sabon Tasha Primary', code: '01' },
              { id: 'kd-c-st-02', name: 'Maraban Jos Junction', code: '02' },
              { id: 'kd-c-st-03', name: 'Sabon Tasha Town Hall', code: '03' },
            ],
          },
          {
            id: 'kd-chikun-narayi',
            name: 'Narayi',
            code: 'NY',
            pollingUnits: [
              { id: 'kd-c-ny-01', name: 'Narayi Baptist School', code: '01' },
              { id: 'kd-c-ny-02', name: 'Narayi High Cost Ground', code: '02' },
              { id: 'kd-c-ny-03', name: 'Ungwan Romi Open Space', code: '03' },
              { id: 'kd-c-ny-04', name: 'Narayi Market Square', code: '04' },
              { id: 'kd-c-ny-05', name: 'Romai Primary School', code: '05' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'la',
    name: 'Lagos',
    code: 'LA',
    lgas: [
      {
        id: 'la-ikeja',
        name: 'Ikeja',
        code: 'IKEJA',
        wards: [
          {
            id: 'la-ikeja-ojodu',
            name: 'Ojodu',
            code: 'OJ',
            pollingUnits: [
              { id: 'la-ik-oj-01', name: 'Ojodu Primary School', code: '01' },
              { id: 'la-ik-oj-02', name: 'Berger Roundabout Hall', code: '02' },
              { id: 'la-ik-oj-03', name: 'Omole Phase 1 Ground', code: '03' },
            ],
          },
          {
            id: 'la-ikeja-ogba',
            name: 'Ogba',
            code: 'OG',
            pollingUnits: [
              { id: 'la-ik-og-01', name: 'Ogba Grammar School', code: '01' },
              { id: 'la-ik-og-02', name: 'Acme Road Open Space', code: '02' },
              { id: 'la-ik-og-03', name: 'Ogba Community Centre', code: '03' },
              { id: 'la-ik-og-04', name: 'Ifako Junction Hall', code: '04' },
            ],
          },
        ],
      },
      {
        id: 'la-alimosho',
        name: 'Alimosho',
        code: 'ALIM',
        wards: [
          {
            id: 'la-alim-egbe',
            name: 'Egbe',
            code: 'EG',
            pollingUnits: [
              { id: 'la-al-eg-01', name: 'Egbe Primary School', code: '01' },
              { id: 'la-al-eg-02', name: 'Idimu Road Hall', code: '02' },
              { id: 'la-al-eg-03', name: 'Egbe Market Ground', code: '03' },
            ],
          },
          {
            id: 'la-alim-ikotun',
            name: 'Ikotun',
            code: 'IK',
            pollingUnits: [
              { id: 'la-al-ik-01', name: 'Ikotun High School', code: '01' },
              { id: 'la-al-ik-02', name: 'Ijegun Community Hall', code: '02' },
              { id: 'la-al-ik-03', name: 'Ikotun Roundabout Ground', code: '03' },
              { id: 'la-al-ik-04', name: 'Isheri Olofin School', code: '04' },
            ],
          },
          {
            id: 'la-alim-egbeda',
            name: 'Egbeda',
            code: 'EB',
            pollingUnits: [
              { id: 'la-al-eb-01', name: 'Egbeda Primary School', code: '01' },
              { id: 'la-al-eb-02', name: 'Council Bus Stop Hall', code: '02' },
              { id: 'la-al-eb-03', name: 'Akowonjo Open Space', code: '03' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ri',
    name: 'Rivers',
    code: 'RI',
    lgas: [
      {
        id: 'ri-phc',
        name: 'Port Harcourt',
        code: 'PHC',
        wards: [
          {
            id: 'ri-phc-diobu',
            name: 'Diobu',
            code: 'DB',
            pollingUnits: [
              { id: 'ri-ph-db-01', name: 'Diobu Primary School', code: '01' },
              { id: 'ri-ph-db-02', name: 'Mile 1 Market Ground', code: '02' },
              { id: 'ri-ph-db-03', name: 'Azikiwe Road Hall', code: '03' },
            ],
          },
          {
            id: 'ri-phc-transamadi',
            name: 'Trans-Amadi',
            code: 'TA',
            pollingUnits: [
              { id: 'ri-ph-ta-01', name: 'Trans-Amadi Industrial School', code: '01' },
              { id: 'ri-ph-ta-02', name: 'Slaughter Market Area', code: '02' },
              { id: 'ri-ph-ta-03', name: 'Oginigba Community Hall', code: '03' },
              { id: 'ri-ph-ta-04', name: 'Rumubiakani Open Space', code: '04' },
            ],
          },
        ],
      },
      {
        id: 'ri-obio',
        name: 'Obio-Akpor',
        code: 'OBIO',
        wards: [
          {
            id: 'ri-obio-rumuola',
            name: 'Rumuola',
            code: 'RM',
            pollingUnits: [
              { id: 'ri-ob-rm-01', name: 'Rumuola Primary School', code: '01' },
              { id: 'ri-ob-rm-02', name: 'GRA Junction Hall', code: '02' },
              { id: 'ri-ob-rm-03', name: 'Rumuola Market Ground', code: '03' },
            ],
          },
          {
            id: 'ri-obio-rumuokoro',
            name: 'Rumuokoro',
            code: 'RK',
            pollingUnits: [
              { id: 'ri-ob-rk-01', name: 'Rumuokoro Primary', code: '01' },
              { id: 'ri-ob-rk-02', name: 'Eliozu Community Hall', code: '02' },
              { id: 'ri-ob-rk-03', name: 'Rumuokoro Roundabout Ground', code: '03' },
              { id: 'ri-ob-rk-04', name: 'Mgbuoba Open Space', code: '04' },
            ],
          },
          {
            id: 'ri-obio-choba',
            name: 'Choba',
            code: 'CH',
            pollingUnits: [
              { id: 'ri-ob-ch-01', name: 'Choba Primary School', code: '01' },
              { id: 'ri-ob-ch-02', name: 'Uniport Gate Ground', code: '02' },
              { id: 'ri-ob-ch-03', name: 'Aluu Junction Hall', code: '03' },
            ],
          },
        ],
      },
    ],
  },
]

export function getState(stateId: string) {
  return geography.find((s) => s.id === stateId)
}

export function getLga(stateId: string, lgaId: string) {
  return getState(stateId)?.lgas.find((l) => l.id === lgaId)
}

export function getWard(stateId: string, lgaId: string, wardId: string) {
  return getLga(stateId, lgaId)?.wards.find((w) => w.id === wardId)
}

export function locationPath(loc: GeoPath): string {
  const parts = [loc.stateName, loc.lgaName, loc.wardName]
  if (loc.puName) parts.push(loc.puName)
  return parts.join(' / ')
}

export function shortPath(loc: GeoPath): string {
  return `${loc.stateName} › ${loc.lgaName} › ${loc.wardName}`
}

export function allWards() {
  const wards: { state: State; lga: ReturnType<typeof getLga>; ward: NonNullable<ReturnType<typeof getWard>> }[] = []
  for (const state of geography) {
    for (const lga of state.lgas) {
      for (const ward of lga.wards) {
        wards.push({ state, lga, ward })
      }
    }
  }
  return wards
}

export function allPollingUnits() {
  const pus: {
    state: State
    lga: NonNullable<ReturnType<typeof getLga>>
    ward: NonNullable<ReturnType<typeof getWard>>
    pu: { id: string; name: string; code: string }
  }[] = []
  for (const state of geography) {
    for (const lga of state.lgas) {
      for (const ward of lga.wards) {
        for (const pu of ward.pollingUnits) {
          pus.push({ state, lga, ward, pu })
        }
      }
    }
  }
  return pus
}

export function countHierarchy() {
  let lgas = 0
  let wards = 0
  let pus = 0
  for (const s of geography) {
    lgas += s.lgas.length
    for (const l of s.lgas) {
      wards += l.wards.length
      for (const w of l.wards) pus += w.pollingUnits.length
    }
  }
  return { states: geography.length, lgas, wards, pus }
}

/** Approximate SVG positions for choropleth (normalized 0–100) */
export const statePositions: Record<string, { x: number; y: number; w: number; h: number }> = {
  kd: { x: 35, y: 8, w: 28, h: 32 },
  la: { x: 18, y: 55, w: 22, h: 28 },
  ri: { x: 48, y: 58, w: 26, h: 30 },
}

export const lgaOffsets: Record<string, { dx: number; dy: number }> = {
  'kd-north': { dx: 0, dy: -8 },
  'kd-south': { dx: 0, dy: 8 },
  'kd-chikun': { dx: 10, dy: 4 },
  'la-ikeja': { dx: -6, dy: -6 },
  'la-alimosho': { dx: 6, dy: 6 },
  'ri-phc': { dx: -6, dy: -4 },
  'ri-obio': { dx: 6, dy: 6 },
}
