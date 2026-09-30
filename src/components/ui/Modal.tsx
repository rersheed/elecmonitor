import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function Modal({
  open,
  title,
  children,
  onClose,
  actions,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  actions?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  )
}

export function ArchiveConfirm({
  open,
  recordLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean
  recordLabel: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Modal
      open={open}
      title="Archive record?"
      onClose={onCancel}
      actions={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Archive
          </button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)' }}>
        ElecMonitor does not permanently delete operational records. Archiving{' '}
        <strong style={{ color: 'var(--text)' }}>{recordLabel}</strong> will hide it from active
        lists. This is a demo confirmation only.
      </p>
    </Modal>
  )
}
