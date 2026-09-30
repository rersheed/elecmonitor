import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function fmtDateTime(iso: string) {
  try {
    return format(parseISO(iso), 'dd MMM yyyy HH:mm')
  } catch {
    return iso
  }
}

export function fmtTime(iso: string) {
  try {
    return format(parseISO(iso), 'HH:mm')
  } catch {
    return iso
  }
}

export function fmtRelative(iso: string) {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return iso
  }
}

export function fmtClock(d: Date) {
  return format(d, 'dd MMM yyyy HH:mm:ss')
}
