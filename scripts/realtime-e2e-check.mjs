/**
 * Smoke-check CB-EMR ↔ Supabase ↔ ElecMonitor path.
 * Run: node scripts/realtime-e2e-check.mjs
 *
 * PASS requires network reachability to the shared Supabase project.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || 'https://sullcpwiddjrbzhlqfrn.supabase.co'
const key =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bGxjcHdpZGRqcmJ6aGxxZnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODcxMjEsImV4cCI6MjEwNjQ2MzEyMX0.OSm02u4jORZ4zWJZd6JDSXIR3NByS4uTMupYGqAjI6c'

const client = createClient(url, key, { auth: { persistSession: false } })

const results = []
function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(ok ? 'PASS' : 'FAIL', name, detail || '')
}

try {
  const probe = await client.from('parties').select('id').limit(1)
  if (probe.error) throw probe.error
  record('Supabase connectivity', true, 'parties readable')
} catch (e) {
  record('Supabase connectivity', false, String(e.message || e))
  console.log('\nRealtime E2E cannot proceed without backend. ElecMonitor will show DEMO MODE.')
  process.exit(1)
}

const electionId = '11111111-1111-1111-1111-111111111111'
const marker = `e2e-${Date.now()}`

// These writes may fail if demo profiles/geography/election are not seeded — still report honestly.
try {
  const { error } = await client.from('incidents').insert({
    election_id: electionId,
    polling_unit_id: 'kd-kaduna-north-shaba-pu001',
    reporter_id: '00000000-0000-0000-0000-000000000001',
    category: 'Security',
    description: `ElecMonitor E2E ${marker}`,
    severity: 'high',
    status: 'open',
  })
  record('Insert HIGH incident', !error, error?.message)
} catch (e) {
  record('Insert HIGH incident', false, String(e.message || e))
}

console.log('\nSummary')
for (const r of results) console.log(`- ${r.name}: ${r.ok ? 'PASS' : 'FAIL'}`)
process.exit(results.every((r) => r.ok) ? 0 : 2)
