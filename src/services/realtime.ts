import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { LIVE_TABLES, type LiveTable } from './supabase'

export type RealtimeStatus = 'LIVE' | 'CONNECTING' | 'RECONNECTING' | 'OFFLINE' | 'DEMO MODE'

export type RowChange = {
  table: LiveTable
  event: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, unknown> | null
  old: Record<string, unknown> | null
  at: number
}

type Listener = (change: RowChange) => void
type StatusListener = (status: RealtimeStatus) => void

const CHANNEL_NAME = 'elecmonitor-situation-room'

/**
 * Singleton realtime hub — one channel for the Situation Room.
 * Prevents duplicate subscriptions across dashboard components.
 */
class RealtimeHub {
  private channel: RealtimeChannel | null = null
  private client: SupabaseClient | null = null
  private listeners = new Set<Listener>()
  private statusListeners = new Set<StatusListener>()
  private status: RealtimeStatus = 'OFFLINE'
  private started = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  getStatus() {
    return this.status
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => this.statusListeners.delete(listener)
  }

  private setStatus(s: RealtimeStatus) {
    if (this.status === s) return
    this.status = s
    this.statusListeners.forEach((l) => l(s))
  }

  private emit(change: RowChange) {
    this.listeners.forEach((l) => {
      try {
        l(change)
      } catch (e) {
        console.error('[realtime] listener error', e)
      }
    })
  }

  async start(client: SupabaseClient) {
    if (this.started && this.client === client && this.channel) return
    this.stop()
    this.client = client
    this.started = true
    this.setStatus('CONNECTING')
    this.attachChannel()
  }

  private attachChannel() {
    const client = this.client
    if (!client) return

    let ch = client.channel(CHANNEL_NAME)
    for (const table of LIVE_TABLES) {
      ch = ch.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          const event = payload.eventType as RowChange['event']
          this.emit({
            table: table as LiveTable,
            event,
            new: (payload.new as Record<string, unknown>) || null,
            old: (payload.old as Record<string, unknown>) || null,
            at: Date.now(),
          })
        },
      )
    }

    this.channel = ch.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        this.setStatus('LIVE')
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer)
          this.reconnectTimer = null
        }
        return
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        console.warn('[realtime] channel status', status, err?.message)
        this.setStatus('RECONNECTING')
        this.scheduleReconnect()
      }
    })
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || !this.started) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (!this.client || !this.started) return
      try {
        if (this.channel) this.client.removeChannel(this.channel)
      } catch {
        /* ignore */
      }
      this.channel = null
      this.setStatus('RECONNECTING')
      this.attachChannel()
    }, 2500)
  }

  /** Soft reconnect after prolonged disconnect — caller should re-fetch rows. */
  requestReconnect() {
    if (!this.client || !this.started) return
    this.setStatus('RECONNECTING')
    this.scheduleReconnect()
  }

  stop() {
    this.started = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.client && this.channel) {
      try {
        this.client.removeChannel(this.channel)
      } catch {
        /* ignore */
      }
    }
    this.channel = null
    this.setStatus('OFFLINE')
  }

  markDemo() {
    this.stop()
    this.setStatus('DEMO MODE')
  }
}

export const realtimeHub = new RealtimeHub()
