/**
 * DEMO SEED DATA — clearly labelled placeholder content.
 *
 * Used (1) for the in-memory demo preview before Supabase is connected and
 * (2) to generate supabase/seed.sql via `pnpm seed:generate`.
 * Partner guesthouses, rooms, rates, fees, menu items, durations and opening
 * hours are DEMO values and must be replaced with verified information.
 * Legacy prices/specials from the previous website are stored as DRAFT only.
 */

export const demoId = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

const now = '2026-01-01T00:00:00.000Z'

const img = (n: number, file: string, alt: string, caption: string | null = null) => ({
  id: demoId(n),
  url: `/images/${file}`,
  storage_path: null,
  alt,
  caption,
  width: null,
  height: null,
  is_demo: true,
  created_at: now,
})

export const MEDIA = {
  hero: demoId(1),
  village: demoId(2),
  beach: demoId(3),
  harbour: demoId(4),
  surfReef: demoId(5),
  surfBoat: demoId(6),
  surfPaddle: demoId(7),
  snorkel: demoId(8),
  sandbank: demoId(9),
  fishing: demoId(10),
  diving: demoId(11),
  restaurant: demoId(12),
  curry: demoId(13),
  grill: demoId(14),
  breakfast: demoId(15),
  stayExterior: demoId(16),
  stayRoom: demoId(17),
  stayTerrace: demoId(18),
  mangrove: demoId(19),
} as const

const media = [
  img(1, 'hero-huraa.png', 'Aerial view of Huraa island with its harbour, palms and turquoise lagoon', 'Huraa, North Malé Atoll'),
  img(2, 'huraa-village.png', 'Sandy lane on Huraa lined with coral-stone walls, bougainvillea and bicycles', 'Everyday island life'),
  img(3, 'huraa-beach.png', 'Quiet white sand beach with a leaning palm and clear shallow water', 'Huraa beach'),
  img(4, 'huraa-harbour.png', 'Wooden dhoni boats moored in the harbour at sunset', 'The harbour at dusk'),
  img(5, 'surf-reef.png', 'Surfer riding a glassy right-hand reef wave over clear turquoise water', 'North Malé reef break'),
  img(6, 'surf-boat.png', 'Surfboards stacked on a boat anchored in a channel beside a reef break', 'Boat trips to the breaks'),
  img(7, 'surf-paddle.png', 'Aerial view of two surfers paddling over turquoise water and reef', 'Paddling out'),
  img(8, 'snorkel.png', 'Snorkeller floating above a colourful coral reef with tropical fish', 'House reef snorkelling'),
  img(9, 'sandbank.png', 'Tiny white sandbank in a turquoise lagoon with a shade umbrella and boat', 'Sandbank picnic'),
  img(10, 'fishing.png', 'Silhouetted hands holding a fishing line over the ocean at sunset', 'Traditional handline fishing'),
  img(11, 'diving.png', 'Scuba diver beside a coral wall as a manta ray glides overhead', 'Diving North Malé Atoll'),
  img(12, 'restaurant.png', 'Open-air restaurant tables on the sand under palms and string lights at dusk', 'Sea Shine restaurant (demo photo)'),
  img(13, 'food-curry.png', 'Tuna curry with roshi flatbread, rice, lime and chilli', 'Island-style curry (demo photo)'),
  img(14, 'food-grill.png', 'Whole grilled reef fish with lime, chilli and coconut sambal', 'Grilled catch (demo photo)'),
  img(15, 'food-breakfast.png', 'Mas huni with roshi flatbread, black tea and fresh papaya', 'Maldivian breakfast (demo photo)'),
  img(16, 'stay-exterior.png', 'Small white two-storey guesthouse with a wooden balcony and palms', 'Demo partner guesthouse'),
  img(17, 'stay-room.png', 'Bright double bedroom with white linen and a palm-view window', 'Demo partner room'),
  img(18, 'stay-terrace.png', 'Rooftop terrace with bean bags overlooking palms and the lagoon at sunset', 'Demo rooftop terrace'),
  img(19, 'huraa-mangrove.png', 'Calm mangrove lagoon with trees reflected in still water', 'Huraa mangroves'),
]

const guesthouses = [
  {
    id: demoId(101),
    slug: 'demo-lagoon-house',
    name: 'Lagoon House (Demo Partner)',
    summary: 'DEMO LISTING — replace with a verified partner guesthouse. A short walk to the beach.',
    description:
      'This is placeholder content showing how a partner guesthouse appears on the site. Replace the name, photos, description, rooms and rates with verified details supplied by the partner property before publishing.\n\nSea Shine Travel & Tours handles your booking request and confirms availability directly with the guesthouse.',
    location: 'Huraa, North Malé Atoll',
    map_link: null,
    amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast available', 'Airport transfer on request'],
    house_rules: 'Local island etiquette applies: modest dress in the village, bikini beach for swimwear. No alcohol on local islands.',
    cover_media_id: MEDIA.stayExterior,
    status: 'published',
    is_demo: true,
    sort: 1,
  },
  {
    id: demoId(102),
    slug: 'demo-harbour-view',
    name: 'Harbour View Rooms (Demo Partner)',
    summary: 'DEMO LISTING — replace with a verified partner guesthouse. Rooftop terrace over the lagoon.',
    description:
      'Placeholder partner property for the demo preview. Use the admin portal to replace every detail and photo with verified information, or set the listing to draft.',
    location: 'Huraa, North Malé Atoll',
    map_link: null,
    amenities: ['Air conditioning', 'Wi-Fi', 'Rooftop terrace', 'Surfboard storage'],
    house_rules: 'Quiet hours after 22:00. Local island etiquette applies.',
    cover_media_id: MEDIA.stayTerrace,
    status: 'published',
    is_demo: true,
    sort: 2,
  },
]

const room = (
  n: number,
  gh: number,
  name: string,
  base_rate: number,
  max_adults: number,
  max_children: number,
  max_occupancy: number,
  inventory: number,
  bed_config: string,
  sort: number,
) => ({
  id: demoId(n),
  guesthouse_id: demoId(gh),
  name,
  description: 'Demo room type — replace with verified room details from the partner.',
  bed_config,
  size_sqm: null,
  max_adults,
  max_children,
  max_occupancy,
  inventory,
  base_rate,
  min_nights: 2,
  amenities: ['Air conditioning', 'Private bathroom', 'Wi-Fi'],
  cover_media_id: MEDIA.stayRoom,
  status: 'published',
  sort,
})

const room_types = [
  room(201, 101, 'Double Room (Demo)', 70, 2, 1, 3, 4, '1 double bed', 1),
  room(202, 101, 'Triple Room (Demo)', 90, 3, 1, 3, 2, '1 double + 1 single bed', 2),
  room(203, 102, 'Standard Double (Demo)', 65, 2, 0, 2, 3, '1 double bed', 1),
  room(204, 102, 'Family Room (Demo)', 110, 2, 2, 4, 1, '1 double + 2 single beds', 2),
]

const seasonal_rates = [
  {
    id: demoId(301),
    room_type_id: demoId(201),
    label: 'Festive season (demo)',
    start_date: '2026-12-20',
    end_date: '2027-01-05',
    nightly_rate: 95,
    min_nights: 4,
  },
  {
    id: demoId(302),
    room_type_id: demoId(203),
    label: 'Peak surf season (demo)',
    start_date: '2027-03-01',
    end_date: '2027-04-30',
    nightly_rate: 80,
    min_nights: null,
  },
]

const fees = [
  { id: demoId(401), name: 'Service charge (demo — verify)', kind: 'percent', amount: 10, active: true, sort: 1, note: 'Applied to accommodation.' },
  { id: demoId(402), name: 'T-GST (demo — verify current rate)', kind: 'percent_compound', amount: 17, active: true, sort: 2, note: 'Applied to accommodation plus prior charges.' },
  { id: demoId(403), name: 'Green tax (demo — verify)', kind: 'per_person_night', amount: 6, active: true, sort: 3, note: 'Per guest per night.' },
]

const surf_packages = [
  {
    id: demoId(501),
    slug: 'north-male-surf-week',
    title: 'North Malé Surf Week',
    summary: 'Seven nights on Huraa with daily boat trips to the North Malé Atoll reef breaks.',
    description:
      'If you grew up looking at surf magazines with double-page spreads of perfect reef breaks peeling around empty tropical islands, start packing. Surfers from around the world make the pilgrimage to the Maldives every year — and Huraa puts you a short boat ride from some of the best-known breaks in North Malé Atoll.\n\nWe arrange your stay at a partner guesthouse, daily surf trips with a local boat crew and help choosing the right break for the swell and wind.',
    duration_label: '7 nights (demo — confirm)',
    duration_nights: 7,
    inclusions: ['Partner guesthouse accommodation', 'Daily boat surf trips', 'Local crew who know the breaks', 'Meal plan options on request'],
    accommodation_options: ['Double room', 'Triple room (shared)'],
    price_from: null,
    price_note: 'Rates confirmed on enquiry',
    cover_media_id: MEDIA.surfReef,
    status: 'published',
    is_legacy: false,
    is_demo: true,
    sort: 1,
  },
  {
    id: demoId(502),
    slug: 'flexible-surf-stay',
    title: 'Flexible Surf Stay',
    summary: 'Choose your dates and nights — we build a surf trip around the swell.',
    description:
      'Not sure how many nights you need? Tell us your dates and level, and we will put together accommodation and boat trips that suit you. Ideal for surfers combining Huraa with time elsewhere in the Maldives.',
    duration_label: 'Flexible (demo — confirm)',
    duration_nights: null,
    inclusions: ['Partner guesthouse accommodation', 'Boat surf trips (per session or daily)', 'Board storage'],
    accommodation_options: ['Double room', 'Triple room (shared)', 'Family room'],
    price_from: null,
    price_note: 'Rates confirmed on enquiry',
    cover_media_id: MEDIA.surfBoat,
    status: 'published',
    is_legacy: false,
    is_demo: true,
    sort: 2,
  },
  {
    id: demoId(503),
    slug: 'legacy-double-room-surf-package',
    title: 'LEGACY — Double Room Surf Package',
    summary: 'Imported from the previous website for review. Not published.',
    description:
      'Previous website listing: "Surf Package includes: Room, Full Board and Daily Surf Trips — $100 per person, per night." This referred to the former Sea Shine guesthouse and must be reviewed before any use.',
    duration_label: 'Per night',
    duration_nights: null,
    inclusions: ['Room', 'Full board', 'Daily surf trips'],
    accommodation_options: ['Double room'],
    price_from: 100,
    price_note: 'Legacy price per person, per night — pending review',
    cover_media_id: MEDIA.surfPaddle,
    status: 'draft',
    is_legacy: true,
    is_demo: false,
    sort: 10,
  },
  {
    id: demoId(504),
    slug: 'legacy-triple-room-surf-package',
    title: 'LEGACY — Triple Room Surf Package',
    summary: 'Imported from the previous website for review. Not published.',
    description:
      'Previous website listing: "Surf Package includes: Room, Full Board and Daily Surf Trips — $85 per person, per night." Previous free-night specials: 7+ nights 1 night free, 14+ nights 2 nights free. Pending review.',
    duration_label: 'Per night',
    duration_nights: null,
    inclusions: ['Room', 'Full board', 'Daily surf trips'],
    accommodation_options: ['Triple room'],
    price_from: 85,
    price_note: 'Legacy price per person, per night — pending review',
    cover_media_id: MEDIA.surfPaddle,
    status: 'draft',
    is_legacy: true,
    is_demo: false,
    sort: 11,
  },
]

const brk = (n: number, name: string, wave: string, description: string, status: 'published' | 'draft', sort: number) => ({
  id: demoId(n),
  name,
  wave,
  description,
  status,
  sort,
})

const surf_breaks = [
  brk(601, 'Sultans', 'Right-hand reef', 'An exposed reef break with consistent surf that picks up distant groundswell from the south. Good at all stages of the tide, popular and can get crowded. Watch out for rocks.', 'published', 1),
  brk(602, "Honky's", 'Left-hand reef', 'A reliable, exposed left-hand reef that favours clean south groundswells and north-easterly offshores. Surfable through the tide; take care with urchins and rocks.', 'published', 2),
  brk(603, 'Jailbreaks', 'Right-hand reef', 'A reasonably consistent right-hander that works best with south swell and south-south-west offshores. Good through the tide. Watch for rocks and dead coral.', 'published', 3),
  brk(604, 'Chickens', 'Left-hand reef', 'A long left-hand reef break in North Malé Atoll. Conditions and access details to be confirmed by the Sea Shine team.', 'published', 4),
  brk(605, 'Cokes (Colas)', 'Right-hand reef', 'A fairly consistent right-hander that likes south-west groundswell and north-west offshores. Rocks are a hazard.', 'published', 5),
  brk(606, "Ninja's", 'Right-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 6),
  brk(607, "Lohi's", 'Left-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 7),
  brk(608, 'Pasta Point', 'Left-hand reef', 'Imported from the previous website. Access arrangements unverified — pending review before publishing.', 'draft', 8),
]

const activity = (
  n: number,
  slug: string,
  title: string,
  summary: string,
  description: string,
  inclusions: string[],
  cover: string,
  sort: number,
) => ({
  id: demoId(n),
  slug,
  title,
  summary,
  description,
  duration_label: 'Duration confirmed on enquiry',
  inclusions,
  price_from: null,
  price_note: 'Price on enquiry',
  cover_media_id: cover,
  status: 'published',
  is_demo: true,
  sort,
})

const activities = [
  activity(701, 'snorkelling', 'Snorkelling trips', 'Float over coral gardens and reef edges a short boat ride from Huraa.', 'Join a boat trip to nearby reefs to snorkel among reef fish, turtles and coral. Our crew picks spots that suit the conditions and your confidence in the water.', ['Boat transport', 'Local guide', 'Snorkel equipment on request'], MEDIA.snorkel, 1),
  activity(702, 'sandbank-picnic', 'Sandbank picnic', 'A day out on a tiny strip of white sand in the middle of the lagoon.', 'Spend a few hours on a sandbank surrounded by turquoise water — swim, snorkel and relax. A perfect half-day between surf sessions.', ['Boat transport', 'Shade on request', 'Snacks or picnic on request'], MEDIA.sandbank, 2),
  activity(703, 'sunset-fishing', 'Traditional sunset fishing', 'Try Maldivian handline fishing as the sun goes down.', 'Head out on a local boat at dusk and learn the traditional handline technique used by island fishermen for generations.', ['Boat transport', 'Handlines and bait', 'Local crew'], MEDIA.fishing, 3),
  activity(704, 'diving', 'Diving', 'Explore North Malé Atoll reefs, channels and walls.', 'We can arrange dives with a licensed dive centre for certified divers and beginners. Dive sites and schedules depend on conditions and are confirmed on enquiry.', ['Arranged with a licensed dive centre', 'Equipment options on request'], MEDIA.diving, 4),
  activity(705, 'fish-feeding-trip', 'Fish feeding trip', 'A short boat trip to watch reef life up close.', 'A relaxed outing suited to families and non-swimmers. Details are confirmed by our team on enquiry.', ['Boat transport', 'Local crew'], MEDIA.harbour, 5),
]

const menuItem = (n: number, category: string, name: string, description: string, dietary: string[], sort: number) => ({
  id: demoId(n),
  category,
  name,
  description,
  price: null,
  dietary,
  status: 'published',
  is_demo: true,
  sort,
})

const menu_items = [
  menuItem(801, 'Breakfast', 'Mas huni & roshi (demo)', 'Demo menu item — tuna, coconut, onion and chilli with warm flatbread.', [], 1),
  menuItem(802, 'Breakfast', 'Fresh fruit plate (demo)', 'Demo menu item — seasonal tropical fruit.', ['Vegan'], 2),
  menuItem(803, 'Mains', 'Island fish curry (demo)', 'Demo menu item — replace with the real menu.', [], 3),
  menuItem(804, 'Mains', 'Grilled catch of the day (demo)', 'Demo menu item — replace with the real menu.', ['Gluten free'], 4),
  menuItem(805, 'Mains', 'Vegetable curry (demo)', 'Demo menu item — replace with the real menu.', ['Vegetarian'], 5),
  menuItem(806, 'Drinks', 'Fresh coconut (demo)', 'Demo menu item.', ['Vegan'], 6),
]

const g = (n: number, key: string, mediaId: string, position: number) => ({
  id: demoId(n),
  gallery_key: key,
  media_id: mediaId,
  position,
  caption: null,
  status: 'published',
})

const gallery_items = [
  g(901, 'huraa', MEDIA.village, 1),
  g(902, 'huraa', MEDIA.beach, 2),
  g(903, 'huraa', MEDIA.harbour, 3),
  g(904, 'huraa', MEDIA.mangrove, 4),
  g(910, 'restaurant', MEDIA.restaurant, 1),
  g(911, 'restaurant', MEDIA.breakfast, 2),
  g(912, 'restaurant', MEDIA.curry, 3),
  g(913, 'restaurant', MEDIA.grill, 4),
  g(920, 'gallery', MEDIA.hero, 1),
  g(921, 'gallery', MEDIA.surfReef, 2),
  g(922, 'gallery', MEDIA.village, 3),
  g(923, 'gallery', MEDIA.sandbank, 4),
  g(924, 'gallery', MEDIA.snorkel, 5),
  g(925, 'gallery', MEDIA.harbour, 6),
  g(926, 'gallery', MEDIA.surfPaddle, 7),
  g(927, 'gallery', MEDIA.beach, 8),
  g(928, 'gallery', MEDIA.mangrove, 9),
  g(929, 'gallery', MEDIA.fishing, 10),
  g(930, `guesthouse:${demoId(101)}`, MEDIA.stayExterior, 1),
  g(931, `guesthouse:${demoId(101)}`, MEDIA.stayRoom, 2),
  g(932, `guesthouse:${demoId(101)}`, MEDIA.beach, 3),
  g(933, `guesthouse:${demoId(102)}`, MEDIA.stayTerrace, 1),
  g(934, `guesthouse:${demoId(102)}`, MEDIA.stayRoom, 2),
  g(935, `guesthouse:${demoId(102)}`, MEDIA.harbour, 3),
  g(940, `surf:${demoId(501)}`, MEDIA.surfReef, 1),
  g(941, `surf:${demoId(501)}`, MEDIA.surfBoat, 2),
  g(942, `surf:${demoId(501)}`, MEDIA.surfPaddle, 3),
  g(943, `surf:${demoId(502)}`, MEDIA.surfBoat, 1),
  g(944, `surf:${demoId(502)}`, MEDIA.surfReef, 2),
]

export const DEMO_SEED = {
  media,
  guesthouses,
  room_types,
  seasonal_rates,
  date_blocks: [] as Record<string, unknown>[],
  fees,
  bookings: [] as Record<string, unknown>[],
  surf_packages,
  surf_breaks,
  activities,
  menu_items,
  enquiries: [] as Record<string, unknown>[],
  content_blocks: [] as Record<string, unknown>[],
  gallery_items,
}

export type DemoTable = keyof typeof DEMO_SEED
