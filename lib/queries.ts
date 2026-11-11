import { cache } from 'react'
import type { Db } from '@/lib/db'
import { getPublicDb } from '@/lib/dbs'
import { PAGE_DEF_MAP } from '@/lib/content-defs'
import type {
  Activity,
  ContentBlock,
  Fee,
  GalleryItem,
  Guesthouse,
  Media,
  MenuItem,
  RoomType,
  SeasonalRate,
  SiteSettings,
  SurfBreak,
  SurfPackage,
} from '@/lib/types'

export type ResolvedImage = { url: string; alt: string; caption: string | null }
export type PageContent = { text: Record<string, string>; images: Record<string, ResolvedImage | null> }

const published = { status: 'published' } as const

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error('[v0] Data load failed:', (error as Error).message)
    return fallback
  }
}

export async function loadMediaMap(db: Db) {
  const rows = await safe(() => db.list<Media>('media'), [])
  return new Map(rows.map((m) => [m.id, m]))
}

export const getMediaMap = cache(() => loadMediaMap(getPublicDb()))

export function toImage(map: Map<string, Media>, id: string | null | undefined): ResolvedImage | null {
  if (!id) return null
  const m = map.get(id)
  return m ? { url: m.url, alt: m.alt, caption: m.caption } : null
}

export async function loadContent(page: string, db: Db, mediaMap?: Map<string, Media>): Promise<PageContent> {
  const def = PAGE_DEF_MAP[page]
  const [blocks, media] = await Promise.all([
    safe(() => db.list<ContentBlock>('content_blocks', { page }), []),
    mediaMap ?? getMediaMap(),
  ])
  const byKey = new Map(blocks.map((b) => [b.key, b]))
  const text: Record<string, string> = {}
  const images: Record<string, ResolvedImage | null> = {}
  for (const field of def?.fields ?? []) {
    const block = byKey.get(field.key)
    if (field.type === 'image') {
      images[field.key] = toImage(media, block ? block.media_id : field.default)
    } else {
      text[field.key] = block?.value ?? field.default
    }
  }
  return { text, images }
}

export const getContent = cache((page: string) => loadContent(page, getPublicDb()))

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const { text } = await getContent('settings')
  return text as unknown as SiteSettings
})

export const getGallery = cache(async (key: string) => {
  const db = getPublicDb()
  const [items, media] = await Promise.all([
    safe(() => db.list<GalleryItem>('gallery_items', { gallery_key: key, ...published }), []),
    getMediaMap(),
  ])
  return items
    .map((item) => {
      const image = toImage(media, item.media_id)
      return image ? { ...image, id: item.id, caption: item.caption ?? image.caption } : null
    })
    .filter((x): x is ResolvedImage & { id: string } => x !== null)
})

export const listGuesthouses = cache(async () => safe(() => getPublicDb().list<Guesthouse>('guesthouses', published), []))

export const getGuesthouse = cache(async (slug: string) =>
  safe(() => getPublicDb().findOne<Guesthouse>('guesthouses', { slug, ...published }), null),
)

export const listRooms = cache(async () => safe(() => getPublicDb().list<RoomType>('room_types', published), []))

export const listSeasonalRates = cache(async () => safe(() => getPublicDb().list<SeasonalRate>('seasonal_rates'), []))

export const listFees = cache(async () => safe(() => getPublicDb().list<Fee>('fees', { active: true }), []))

export const listSurfPackages = cache(async () => safe(() => getPublicDb().list<SurfPackage>('surf_packages', published), []))

export const getSurfPackage = cache(async (slug: string) =>
  safe(() => getPublicDb().findOne<SurfPackage>('surf_packages', { slug, ...published }), null),
)

export const listSurfBreaks = cache(async () => safe(() => getPublicDb().list<SurfBreak>('surf_breaks', published), []))

export const listActivities = cache(async () => safe(() => getPublicDb().list<Activity>('activities', published), []))

export const getActivity = cache(async (slug: string) =>
  safe(() => getPublicDb().findOne<Activity>('activities', { slug, ...published }), null),
)

export const listMenu = cache(async () => safe(() => getPublicDb().list<MenuItem>('menu_items', published), []))

/** Lowest nightly rate across a guesthouse’s published rooms. */
export function fromRate(rooms: RoomType[]) {
  return rooms.length ? Math.min(...rooms.map((r) => Number(r.base_rate))) : null
}
