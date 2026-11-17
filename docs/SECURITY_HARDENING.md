# Security hardening still required (City Boy Movement North West)

## Current demo posture

CB-EMR migration `002_demo_anon_policies.sql` enables permissive anon RLS (`using (true)`) for local/demo wiring. That is **not** production-ready.

## Rules for ElecMonitor (browser)

- Only the **anon / publishable** Supabase key may ship in the frontend (`VITE_SUPABASE_ANON_KEY`).
- Never embed the **service-role** key in ElecMonitor, CB-EMR mobile builds, or any public artifact.
- Realtime + REST reads must be constrained by RLS once demo policies are removed.

## Before production

1. Replace `anon_all_demo` policies with role-scoped policies (agent / ward / LGA / state / situation room).
2. Situation Room should typically **read** verified + operational queues — not write arbitrary rows.
3. Enable Auth; stop using shared demo profile UUIDs as identity.
4. Confirm Realtime publication includes only required tables (`003_realtime_publication.sql`).
5. Rotate keys if any service-role material was ever committed or shared.
