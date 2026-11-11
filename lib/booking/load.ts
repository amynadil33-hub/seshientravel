import 'server-only'
import { getPublicDb, getServiceDb } from '@/lib/dbs'
import { availability, quote, validateStay, type Availability, type StayInput } from '@/lib/booking/engine'
import type { Booking, DateBlock, Fee, Guesthouse, PriceBreakdown, RoomType, SeasonalRate } from '@/lib/types'

export type RoomContext = {
  room: RoomType
  guesthouse: Guesthouse
  seasonal: SeasonalRate[]
  fees: Fee[]
}

export async function loadRoomContext(roomId: string): Promise<RoomContext | null> {
  if (!/^[0-9a-f-]{36}$/i.test(roomId)) return null
  const db = getPublicDb()
  const room = await db.get<RoomType>('room_types', roomId).catch(() => null)
  if (!room || room.status !== 'published') return null
  const [guesthouse, seasonal, fees] = await Promise.all([
    db.get<Guesthouse>('guesthouses', room.guesthouse_id),
    db.list<SeasonalRate>('seasonal_rates', { room_type_id: room.id }),
    db.list<Fee>('fees', { active: true }),
  ])
  if (!guesthouse || guesthouse.status !== 'published') return null
  return { room, guesthouse, seasonal, fees }
}

/** Reads confirmed/pending bookings and blocks through the server-only service client. */
export async function loadAvailability(room: RoomType, stay: StayInput): Promise<Availability | null> {
  const db = getServiceDb()
  if (!db) return null
  try {
    const [bookings, blocks] = await Promise.all([
      db.list<Booking>('bookings', { room_type_id: room.id }),
      db.list<DateBlock>('date_blocks', { room_type_id: room.id }),
    ])
    const relevant = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')
    return availability(room, relevant, blocks, stay.checkIn, stay.checkOut, stay.units)
  } catch (error) {
    console.error('[v0] Availability lookup failed:', (error as Error).message)
    return null
  }
}

export type QuoteResult =
  | { ok: true; ctx: RoomContext; stay: StayInput; breakdown: PriceBreakdown; availability: Availability | null }
  | { ok: false; error: string; ctx: RoomContext | null }

export function parseStay(params: Record<string, string | string[] | undefined>): StayInput {
  const one = (k: string) => {
    const v = params[k]
    return Array.isArray(v) ? v[0] : v
  }
  const int = (k: string, d: number) => {
    const n = Number(one(k) ?? d)
    return Number.isFinite(n) ? n : NaN
  }
  return {
    checkIn: one('checkIn') ?? '',
    checkOut: one('checkOut') ?? '',
    adults: int('adults', 2),
    children: int('children', 0),
    units: int('rooms', 1),
  }
}

export async function computeQuote(roomId: string, stay: StayInput): Promise<QuoteResult> {
  const ctx = await loadRoomContext(roomId)
  if (!ctx) return { ok: false, error: 'This room is not available for booking requests.', ctx: null }
  const error = validateStay(stay, ctx.room, ctx.seasonal)
  if (error) return { ok: false, error, ctx }
  const breakdown = quote(stay, ctx.room, ctx.seasonal, ctx.fees)
  const avail = await loadAvailability(ctx.room, stay)
  return { ok: true, ctx, stay, breakdown, availability: avail }
}
