import { CURRENCY } from '@/lib/site'
import type { Booking, DateBlock, Fee, PriceBreakdown, RoomType, SeasonalRate } from '@/lib/types'

export const MAX_NIGHTS = 60
export const MAX_UNITS = 6
const ISO = /^\d{4}-\d{2}-\d{2}$/

const toUtc = (iso: string) => new Date(`${iso}T00:00:00Z`)
const toIso = (d: Date) => d.toISOString().slice(0, 10)
const round2 = (n: number) => Math.round(n * 100) / 100

export function todayIso() {
  return toIso(new Date())
}

export function addDays(iso: string, days: number) {
  const d = toUtc(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return toIso(d)
}

export function isValidIso(iso: unknown): iso is string {
  return typeof iso === 'string' && ISO.test(iso) && !Number.isNaN(toUtc(iso).getTime()) && toIso(toUtc(iso)) === iso
}

/** Nights of a stay: check-in inclusive, check-out exclusive. */
export function eachNight(checkIn: string, checkOut: string): string[] {
  const nights: string[] = []
  for (let d = checkIn; d < checkOut && nights.length <= MAX_NIGHTS + 1; d = addDays(d, 1)) nights.push(d)
  return nights
}

export type StayInput = {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  units: number
}

export function validateStay(input: StayInput, room: RoomType, seasonal: SeasonalRate[]): string | null {
  const { checkIn, checkOut, adults, children, units } = input
  if (!isValidIso(checkIn) || !isValidIso(checkOut)) return 'Please choose valid check-in and check-out dates.'
  if (checkIn < todayIso()) return 'Check-in cannot be in the past.'
  if (checkOut <= checkIn) return 'Check-out must be after check-in.'
  const nights = eachNight(checkIn, checkOut)
  if (nights.length > MAX_NIGHTS) return `Stays longer than ${MAX_NIGHTS} nights need a direct enquiry.`
  for (const n of [adults, children, units]) {
    if (!Number.isInteger(n) || n < 0) return 'Guest and room numbers must be whole numbers.'
  }
  if (adults < 1) return 'At least one adult is required.'
  if (units < 1 || units > MAX_UNITS) return `You can request between 1 and ${MAX_UNITS} rooms.`
  if (units > room.inventory) return `This property has ${room.inventory} of this room type.`
  if (adults > room.max_adults * units) return `Maximum ${room.max_adults} adults per room — add another room.`
  if (children > room.max_children * units) return `Maximum ${room.max_children} children per room for this room type.`
  if (adults + children > room.max_occupancy * units) return `Maximum ${room.max_occupancy} guests per room — add another room.`

  const seasonalMin = seasonal
    .filter((s) => s.min_nights && nights.some((n) => n >= s.start_date && n <= s.end_date))
    .reduce((m, s) => Math.max(m, s.min_nights ?? 0), 0)
  const minNights = Math.max(room.min_nights, seasonalMin)
  if (nights.length < minNights) return `Minimum stay for these dates is ${minNights} nights.`
  return null
}

export function quote(input: StayInput, room: RoomType, seasonal: SeasonalRate[], fees: Fee[]): PriceBreakdown {
  const nightList = eachNight(input.checkIn, input.checkOut)
  const nights = nightList.map((date) => {
    const season = seasonal.find((s) => date >= s.start_date && date <= s.end_date)
    return {
      date,
      rate: Number(season ? season.nightly_rate : room.base_rate),
      label: season ? season.label : 'Standard rate',
    }
  })
  const accommodation = round2(nights.reduce((sum, n) => sum + n.rate, 0) * input.units)
  const guests = input.adults + input.children

  let running = accommodation
  const lines = fees
    .filter((f) => f.active)
    .sort((a, b) => a.sort - b.sort)
    .map((fee) => {
      const amount = Number(fee.amount)
      let value = 0
      switch (fee.kind) {
        case 'percent':
          value = (accommodation * amount) / 100
          break
        case 'percent_compound':
          value = (running * amount) / 100
          break
        case 'per_person_night':
          value = amount * guests * nights.length
          break
        case 'per_room_night':
          value = amount * input.units * nights.length
          break
        case 'per_stay':
          value = amount
          break
      }
      value = round2(value)
      running = round2(running + value)
      return { label: fee.name, amount: value }
    })

  const feesTotal = round2(lines.reduce((s, l) => s + l.amount, 0))
  return {
    nights,
    units: input.units,
    accommodation,
    fees: lines,
    feesTotal,
    total: round2(accommodation + feesTotal),
    currency: CURRENCY,
  }
}

export type Availability = {
  /** Rooms still free on the tightest night, counting confirmed bookings and blocks. */
  minFree: number
  /** Nights where the requested units exceed free inventory. */
  unavailableNights: string[]
  /** Pending requests overlapping the stay (do not hold inventory). */
  pendingOverlaps: number
}

export function availability(
  room: RoomType,
  bookings: Pick<Booking, 'id' | 'check_in' | 'check_out' | 'units' | 'status'>[],
  blocks: DateBlock[],
  checkIn: string,
  checkOut: string,
  units: number,
  excludeBookingId?: string,
): Availability {
  const nights = eachNight(checkIn, checkOut)
  let minFree = room.inventory
  const unavailableNights: string[] = []
  for (const night of nights) {
    const used =
      bookings
        .filter((b) => b.status === 'confirmed' && b.id !== excludeBookingId && b.check_in <= night && b.check_out > night)
        .reduce((s, b) => s + b.units, 0) +
      blocks.filter((x) => x.start_date <= night && x.end_date >= night).reduce((s, x) => s + x.units, 0)
    const free = Math.max(0, room.inventory - used)
    minFree = Math.min(minFree, free)
    if (free < units) unavailableNights.push(night)
  }
  const pendingOverlaps = bookings.filter(
    (b) => b.status === 'pending' && b.id !== excludeBookingId && b.check_in < checkOut && b.check_out > checkIn,
  ).length
  return { minFree, unavailableNights, pendingOverlaps }
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function generateReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return `SSH-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')}`
}
