import type { SupabaseClient } from '@supabase/supabase-js'
import { DEMO_SEED, type DemoTable } from '@/lib/demo-data'

export type TableName = DemoTable
type Row = Record<string, unknown>
type Filter = Record<string, string | number | boolean | null>

export type Db = {
  mode: 'supabase' | 'demo'
  list<T = Row>(table: TableName, eq?: Filter): Promise<T[]>
  get<T = Row>(table: TableName, id: string): Promise<T | null>
  findOne<T = Row>(table: TableName, eq: Filter): Promise<T | null>
  insert<T = Row>(table: TableName, row: Row): Promise<T>
  update<T = Row>(table: TableName, id: string, patch: Row): Promise<T>
  remove(table: TableName, id: string): Promise<void>
}

function sortRows<T>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const ra = a as Row
    const rb = b as Row
    for (const key of ['sort', 'position']) {
      if (typeof ra[key] === 'number' && typeof rb[key] === 'number' && ra[key] !== rb[key]) {
        return (ra[key] as number) - (rb[key] as number)
      }
    }
    if (typeof ra.created_at === 'string' && typeof rb.created_at === 'string') {
      return rb.created_at.localeCompare(ra.created_at)
    }
    return 0
  })
}

export function supabaseDb(client: SupabaseClient): Db {
  const fail = (table: string, message: string): never => {
    throw new Error(`[${table}] ${message}`)
  }
  return {
    mode: 'supabase',
    async list(table, eq = {}) {
      let q = client.from(table).select('*')
      for (const [k, v] of Object.entries(eq)) q = v === null ? q.is(k, null) : q.eq(k, v)
      const { data, error } = await q.limit(2000)
      if (error) fail(table, error.message)
      return sortRows(data ?? []) as never
    },
    async get(table, id) {
      const { data, error } = await client.from(table).select('*').eq('id', id).maybeSingle()
      if (error) fail(table, error.message)
      return data as never
    },
    async findOne(table, eq) {
      let q = client.from(table).select('*')
      for (const [k, v] of Object.entries(eq)) q = v === null ? q.is(k, null) : q.eq(k, v)
      const { data, error } = await q.limit(1).maybeSingle()
      if (error) fail(table, error.message)
      return data as never
    },
    async insert(table, row) {
      const { data, error } = await client.from(table).insert(row).select('*').single()
      if (error) fail(table, error.message)
      return data as never
    },
    async update(table, id, patch) {
      const { data, error } = await client.from(table).update(patch).eq('id', id).select('*').single()
      if (error) fail(table, error.message)
      return data as never
    },
    async remove(table, id) {
      const { error } = await client.from(table).delete().eq('id', id)
      if (error) fail(table, error.message)
    },
  }
}

type DemoStore = Record<TableName, Row[]>
const globalStore = globalThis as unknown as { __seaShineDemo?: DemoStore }

function demoStore(): DemoStore {
  if (!globalStore.__seaShineDemo) {
    globalStore.__seaShineDemo = structuredClone(DEMO_SEED) as unknown as DemoStore
  }
  return globalStore.__seaShineDemo
}

const matches = (row: Row, eq: Filter) => Object.entries(eq).every(([k, v]) => (row[k] ?? null) === v)

export function demoDb(): Db {
  const store = demoStore()
  return {
    mode: 'demo',
    async list(table, eq = {}) {
      return sortRows(store[table].filter((r) => matches(r, eq))).map((r) => ({ ...r })) as never
    },
    async get(table, id) {
      const row = store[table].find((r) => r.id === id)
      return (row ? { ...row } : null) as never
    },
    async findOne(table, eq) {
      const row = store[table].find((r) => matches(r, eq))
      return (row ? { ...row } : null) as never
    },
    async insert(table, row) {
      const full = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row }
      store[table].push(full)
      return { ...full } as never
    },
    async update(table, id, patch) {
      const idx = store[table].findIndex((r) => r.id === id)
      if (idx === -1) throw new Error(`[${table}] Row not found`)
      store[table][idx] = { ...store[table][idx], ...patch }
      return { ...store[table][idx] } as never
    },
    async remove(table, id) {
      store[table] = store[table].filter((r) => r.id !== id)
      if (table === 'media') {
        store.gallery_items = store.gallery_items.filter((g) => g.media_id !== id)
        for (const t of Object.keys(store) as TableName[]) {
          for (const r of store[t]) {
            for (const k of ['cover_media_id', 'media_id']) if (r[k] === id) r[k] = null
          }
        }
      }
      if (table === 'guesthouses') store.room_types = store.room_types.filter((r) => r.guesthouse_id !== id)
      if (table === 'room_types') {
        store.seasonal_rates = store.seasonal_rates.filter((r) => r.room_type_id !== id)
        store.date_blocks = store.date_blocks.filter((r) => r.room_type_id !== id)
      }
    },
  }
}
