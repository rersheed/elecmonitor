import type { RealtimeStatus } from '../../services/realtime'
import type { DataSourceMode } from '../../services/liveTypes'

export function ConnectionBadge({
  status,
  mode,
  lastDataAt,
}: {
  status: RealtimeStatus
  mode: DataSourceMode
  lastDataAt: number | null
}) {
  const display =
    status === 'LIVE'
      ? 'LIVE'
      : status === 'CONNECTING'
        ? 'CONNECTING'
        : status === 'RECONNECTING'
          ? 'RECONNECTING'
          : status === 'DEMO MODE' || mode === 'DEMO DATA'
            ? 'DEMO MODE'
            : 'OFFLINE'

  const cls =
    display === 'LIVE'
      ? 'conn live'
      : display === 'DEMO MODE'
        ? 'conn demo'
        : display === 'CONNECTING' || display === 'RECONNECTING'
          ? 'conn connecting'
          : 'conn offline'

  const last =
    lastDataAt != null
      ? new Date(lastDataAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Africa/Lagos',
        })
      : '—'

  const stale =
    lastDataAt != null && Date.now() - lastDataAt > 10 * 60 * 1000
      ? ' · No new data for 10+ min'
      : ''

  return (
    <div className="connection-badge" title={`${mode} · connection ${status}`}>
      <span className={cls}>
        <span className="conn-dot" aria-hidden />
        {display}
      </span>
      <span className="conn-meta">
        Last update: {last}
        {stale}
      </span>
      <span className="conn-mode">{mode}</span>
    </div>
  )
}
