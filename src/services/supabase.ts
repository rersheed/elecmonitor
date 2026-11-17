import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Public anon key only — never put the service-role key in the browser.
 * Override with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY when needed.
 * Must match CB-EMR SupabaseConfig defaults for shared backend demos.
 */
const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://sullcpwiddjrbzhlqfrn.supabase.co'

const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bGxjcHdpZGRqcmJ6aGxxZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODcxMjEsImV4cCI6MjEwNjQ2MzEyMX0.OSm02u4jORZ4zWJZd6JDSXIR3NByS4uTMupYGqAjI6c'

export const SUPABASE_URL = url
export const SUPABASE_CONFIGURED = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_CONFIGURED) return null
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 20 } },
    })
  }
  return client
}

/** Tables shared with CB-EMR (see cb-emr/supabase/migrations). */
export const LIVE_TABLES = [
  'polling_results',
  'incidents',
  'opening_reports',
  'approvals',
  'profiles',
  'result_details',
] as const

export type LiveTable = (typeof LIVE_TABLES)[number]
