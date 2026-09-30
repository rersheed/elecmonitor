import { useEffect, useState } from 'react'

/** Fake "last updated" that ticks every few seconds for live-feeling demo sections. */
export function useDataFreshness(intervalMs = 4000) {
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [lastTick, setLastTick] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now()
      const elapsed = Math.floor((now - lastTick) / 1000)
      if (elapsed >= 8 + Math.floor(Math.random() * 6)) {
        setLastTick(now)
        setSecondsAgo(0)
      } else {
        setSecondsAgo(elapsed)
      }
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, lastTick])

  const label =
    secondsAgo < 2 ? 'Updated just now' : `Updated ${secondsAgo}s ago`

  return { secondsAgo, label, lastTick }
}

export function useLiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
