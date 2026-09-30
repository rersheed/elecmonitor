import { Inbox, AlertCircle, ShieldOff, Loader2 } from 'lucide-react'

export function EmptyState({ title = 'No records', message }: { title?: string; message: string }) {
  return (
    <div className="empty-state" role="status">
      <Inbox size={28} style={{ marginBottom: 8, opacity: 0.6 }} aria-hidden />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Loader2 size={24} className="spin" style={{ marginBottom: 8 }} aria-hidden />
      <p>{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong loading this view.' }: { message?: string }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={28} style={{ marginBottom: 8, color: 'var(--danger)' }} aria-hidden />
      <h3>Error</h3>
      <p>{message}</p>
    </div>
  )
}

export function PermissionDenied({ message = 'Your role does not have access to this resource in the demo.' }: { message?: string }) {
  return (
    <div className="denied-state" role="alert">
      <ShieldOff size={28} style={{ marginBottom: 8, color: 'var(--warning)' }} aria-hidden />
      <h3>Permission denied</h3>
      <p>{message}</p>
    </div>
  )
}
