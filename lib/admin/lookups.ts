import type { Db } from '@/lib/db'
import type { Guesthouse, Media, RoomType } from '@/lib/types'

export async function loadNames(db: Db) {
  const [guesthouses, rooms] = await Promise.all([db.list<Guesthouse>('guesthouses'), db.list<RoomType>('room_types')])
  const guesthouseName = new Map(guesthouses.map((g) => [g.id, g.name]))
  const roomName = new Map(rooms.map((r) => [r.id, r.name]))
  return { guesthouses, rooms, guesthouseName, roomName }
}

export async function loadMediaOptions(db: Db) {
  const media = await db.list<Media>('media')
  return media
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((m) => ({ id: m.id, url: m.url, alt: m.alt }))
}
