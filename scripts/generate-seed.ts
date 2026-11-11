import { writeFileSync } from 'node:fs'
import { DEMO_SEED } from '../lib/demo-data.ts'

const ORDER = [
  'media',
  'guesthouses',
  'room_types',
  'seasonal_rates',
  'fees',
  'surf_packages',
  'surf_breaks',
  'activities',
  'menu_items',
  'gallery_items',
] as const

function literal(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return `array[${value.map(literal).join(', ')}]::text[]`
  }
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`
  return `'${String(value).replace(/'/g, "''")}'`
}

let sql = `-- ============================================================
-- DEMO SEED DATA — clearly labelled placeholder content.
-- Generated from lib/demo-data.ts by \`pnpm seed:generate\`.
-- Partner guesthouses, rooms, rates, fees, menu items and durations
-- are DEMO values. Replace them with verified details before launch.
-- Legacy prices from the previous website are inserted as DRAFT.
-- Image URLs point to /images/* bundled with the site; replace them
-- through Admin → Media.
-- Safe to re-run: existing rows with the same id are skipped.
-- ============================================================\n\n`

for (const table of ORDER) {
  const rows = DEMO_SEED[table] as Record<string, unknown>[]
  if (!rows.length) continue
  const cols = Object.keys(rows[0])
  sql += `-- ${table}\ninsert into public.${table} (${cols.join(', ')}) values\n`
  sql += rows.map((r) => `  (${cols.map((c) => literal(r[c])).join(', ')})`).join(',\n')
  sql += `\non conflict (id) do nothing;\n\n`
}

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log('Wrote supabase/seed.sql')
