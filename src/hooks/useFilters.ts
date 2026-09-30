import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export type FilterKey = 'state' | 'lga' | 'ward' | 'category' | 'status' | 'date' | 'q' | 'tab'

export function useFilters(keys: FilterKey[] = ['state', 'lga', 'ward', 'category', 'status', 'date', 'q']) {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(() => {
    const f: Record<string, string> = {}
    for (const k of keys) {
      const v = params.get(k)
      if (v) f[k] = v
    }
    return f
  }, [params, keys])

  const setFilter = useCallback(
    (key: FilterKey, value: string) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (!value) next.delete(key)
        else next.set(key, value)
        // cascade clears
        if (key === 'state') {
          next.delete('lga')
          next.delete('ward')
        }
        if (key === 'lga') next.delete('ward')
        return next
      }, { replace: true })
    },
    [setParams],
  )

  const clearFilters = useCallback(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const k of keys) next.delete(k)
      return next
    }, { replace: true })
  }, [setParams, keys])

  const activeCount = Object.keys(filters).length

  return { filters, setFilter, clearFilters, activeCount, params, setParams }
}
