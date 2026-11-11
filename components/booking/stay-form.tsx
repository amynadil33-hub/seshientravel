import { Input } from '@/components/ui/input'
import { Field, nativeSelect } from '@/components/site/field'
import { cta } from '@/components/site/cta'
import { MAX_UNITS, addDays, todayIso } from '@/lib/booking/engine'
import type { RoomType } from '@/lib/types'
import type { StayInput } from '@/lib/booking/engine'

/** Plain GET form → /book/[roomId]; the price is always computed on the server. */
export function StayForm({ room, stay, submitLabel = 'Check price & availability' }: { room: RoomType; stay?: Partial<StayInput>; submitLabel?: string }) {
  const today = todayIso()
  const p = `stay-${room.id.slice(-6)}`
  const checkIn = stay?.checkIn || addDays(today, 14)
  const checkOut = stay?.checkOut || addDays(checkIn, Math.max(room.min_nights, 2))
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  return (
    <form action={`/book/${room.id}`} method="get" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
      <Field id={`${p}-in`} label="Check-in">
        <Input id={`${p}-in`} name="checkIn" type="date" min={addDays(today, 1)} defaultValue={checkIn} required />
      </Field>
      <Field id={`${p}-out`} label="Check-out">
        <Input id={`${p}-out`} name="checkOut" type="date" min={addDays(today, 2)} defaultValue={checkOut} required />
      </Field>
      <Field id={`${p}-adults`} label="Adults">
        <select id={`${p}-adults`} name="adults" defaultValue={String(stay?.adults ?? Math.min(2, room.max_adults))} className={nativeSelect}>
          {range(1, room.max_adults * MAX_UNITS).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${p}-children`} label="Children">
        <select id={`${p}-children`} name="children" defaultValue={String(stay?.children ?? 0)} className={nativeSelect}>
          {range(0, room.max_children * MAX_UNITS).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${p}-rooms`} label="Rooms">
        <select id={`${p}-rooms`} name="rooms" defaultValue={String(stay?.units ?? 1)} className={nativeSelect}>
          {range(1, Math.min(MAX_UNITS, room.inventory)).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <button type="submit" className={cta('navy', 'md', 'sm:col-span-2 lg:col-span-5 lg:justify-self-start')}>
        {submitLabel}
      </button>
    </form>
  )
}
