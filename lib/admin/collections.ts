import type { TableName } from '@/lib/db'

export type FieldType =
  | 'text'
  | 'slug'
  | 'textarea'
  | 'int'
  | 'money'
  | 'date'
  | 'list'
  | 'bool'
  | 'select'
  | 'media'
  | 'relation'

export type AdminField = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  options?: { value: string; label: string }[]
  /** For relation fields. */
  relation?: { table: TableName; labelKey: string }
  min?: number
  max?: number
  /** Field is shown at full width in the form grid. */
  wide?: boolean
}

export type Collection = {
  key: string
  table: TableName
  title: string
  singular: string
  group: 'Stays' | 'Experiences' | 'Restaurant'
  description: string
  /** Column used as the row title in lists. */
  titleKey: string
  /** Extra columns shown in the list table. */
  columns: { key: string; label: string }[]
  fields: AdminField[]
  /** Galleries attached to each record, e.g. 'guesthouse:<id>'. */
  galleryPrefix?: string
  defaults?: Record<string, unknown>
}

const status: AdminField = {
  key: 'status',
  label: 'Status',
  type: 'select',
  required: true,
  options: [
    { value: 'draft', label: 'Draft (hidden)' },
    { value: 'published', label: 'Published' },
  ],
  help: 'Only published items appear on the public site.',
}
const sort: AdminField = { key: 'sort', label: 'Sort order', type: 'int', help: 'Lower numbers show first.', min: 0, max: 10000 }
const isDemo: AdminField = {
  key: 'is_demo',
  label: 'Marked as demo content',
  type: 'bool',
  help: 'Shows a "Demo" label on the public site. Untick once real details are confirmed.',
}
const cover: AdminField = { key: 'cover_media_id', label: 'Cover photo', type: 'media' }

export const COLLECTIONS: Collection[] = [
  {
    key: 'guesthouses',
    table: 'guesthouses',
    title: 'Guesthouses',
    singular: 'guesthouse',
    group: 'Stays',
    description: 'Partner guesthouses on Huraa. Each has its own room types and gallery.',
    titleKey: 'name',
    columns: [
      { key: 'location', label: 'Location' },
      { key: 'status', label: 'Status' },
    ],
    galleryPrefix: 'guesthouse',
    defaults: { location: 'Huraa, North Malé Atoll', status: 'draft', sort: 0, amenities: [], is_demo: false },
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', required: true, help: 'Lowercase letters, numbers and dashes.' },
      { key: 'summary', label: 'Short summary', type: 'textarea', wide: true, help: 'One or two sentences for listing cards.' },
      { key: 'description', label: 'Full description', type: 'textarea', wide: true, help: 'Blank line between paragraphs.' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'map_link', label: 'Map link', type: 'text', help: 'Google Maps URL.' },
      { key: 'amenities', label: 'Amenities', type: 'list', wide: true, help: 'One per line.' },
      { key: 'house_rules', label: 'House rules', type: 'textarea', wide: true },
      cover,
      status,
      sort,
      isDemo,
    ],
  },
  {
    key: 'rooms',
    table: 'room_types',
    title: 'Room types',
    singular: 'room type',
    group: 'Stays',
    description: 'Bookable room types. Inventory is the number of identical rooms you can sell per night.',
    titleKey: 'name',
    columns: [
      { key: 'guesthouse_id', label: 'Guesthouse' },
      { key: 'base_rate', label: 'Base rate' },
      { key: 'inventory', label: 'Rooms' },
      { key: 'status', label: 'Status' },
    ],
    defaults: { max_adults: 2, max_children: 0, max_occupancy: 2, inventory: 1, min_nights: 1, status: 'draft', sort: 0, amenities: [] },
    fields: [
      { key: 'guesthouse_id', label: 'Guesthouse', type: 'relation', required: true, relation: { table: 'guesthouses', labelKey: 'name' } },
      { key: 'name', label: 'Room name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', wide: true },
      { key: 'bed_config', label: 'Beds', type: 'text', help: 'e.g. 1 king or 2 singles' },
      { key: 'size_sqm', label: 'Size (m²)', type: 'int', min: 1, max: 1000 },
      { key: 'base_rate', label: 'Base nightly rate (USD)', type: 'money', required: true, help: 'Per room, per night, before taxes and fees.' },
      { key: 'min_nights', label: 'Minimum nights', type: 'int', required: true, min: 1, max: 60 },
      { key: 'inventory', label: 'Rooms available', type: 'int', required: true, min: 0, max: 100 },
      { key: 'max_adults', label: 'Max adults', type: 'int', required: true, min: 1, max: 20 },
      { key: 'max_children', label: 'Max children', type: 'int', required: true, min: 0, max: 20 },
      { key: 'max_occupancy', label: 'Max total guests', type: 'int', required: true, min: 1, max: 30 },
      { key: 'amenities', label: 'Room amenities', type: 'list', wide: true, help: 'One per line.' },
      cover,
      status,
      sort,
    ],
  },
  {
    key: 'seasonal-rates',
    table: 'seasonal_rates',
    title: 'Seasonal rates',
    singular: 'seasonal rate',
    group: 'Stays',
    description: 'Overrides the base rate for nights inside the date range (inclusive). The most recently added overlapping rate wins.',
    titleKey: 'label',
    columns: [
      { key: 'room_type_id', label: 'Room' },
      { key: 'start_date', label: 'From' },
      { key: 'end_date', label: 'To' },
      { key: 'nightly_rate', label: 'Rate' },
    ],
    fields: [
      { key: 'room_type_id', label: 'Room type', type: 'relation', required: true, relation: { table: 'room_types', labelKey: 'name' } },
      { key: 'label', label: 'Label', type: 'text', required: true, help: 'e.g. Peak season, Festive' },
      { key: 'start_date', label: 'First night', type: 'date', required: true },
      { key: 'end_date', label: 'Last night', type: 'date', required: true },
      { key: 'nightly_rate', label: 'Nightly rate (USD)', type: 'money', required: true },
      { key: 'min_nights', label: 'Minimum nights (optional)', type: 'int', min: 1, max: 60 },
    ],
  },
  {
    key: 'blocks',
    table: 'date_blocks',
    title: 'Closed dates',
    singular: 'date block',
    group: 'Stays',
    description: 'Take rooms out of sale for maintenance or bookings made elsewhere. Dates are inclusive nights.',
    titleKey: 'reason',
    columns: [
      { key: 'room_type_id', label: 'Room' },
      { key: 'start_date', label: 'From' },
      { key: 'end_date', label: 'To' },
      { key: 'units', label: 'Rooms' },
    ],
    defaults: { units: 1 },
    fields: [
      { key: 'room_type_id', label: 'Room type', type: 'relation', required: true, relation: { table: 'room_types', labelKey: 'name' } },
      { key: 'start_date', label: 'First night', type: 'date', required: true },
      { key: 'end_date', label: 'Last night', type: 'date', required: true },
      { key: 'units', label: 'Rooms blocked', type: 'int', required: true, min: 1, max: 100 },
      { key: 'reason', label: 'Reason (internal)', type: 'text', wide: true },
    ],
  },
  {
    key: 'fees',
    table: 'fees',
    title: 'Taxes & fees',
    singular: 'fee',
    group: 'Stays',
    description:
      'Applied to every quote in sort order. "Percent" applies to accommodation; "Percent (compound)" applies to accommodation plus earlier fees.',
    titleKey: 'name',
    columns: [
      { key: 'kind', label: 'Type' },
      { key: 'amount', label: 'Amount' },
      { key: 'active', label: 'Active' },
    ],
    defaults: { kind: 'percent', active: true, sort: 0 },
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true, help: 'Shown to guests in the price breakdown.' },
      {
        key: 'kind',
        label: 'How it is charged',
        type: 'select',
        required: true,
        options: [
          { value: 'percent', label: 'Percent of accommodation' },
          { value: 'percent_compound', label: 'Percent of accommodation + earlier fees' },
          { value: 'per_person_night', label: 'Per person, per night' },
          { value: 'per_room_night', label: 'Per room, per night' },
          { value: 'per_stay', label: 'Flat, per stay' },
        ],
      },
      { key: 'amount', label: 'Amount', type: 'money', required: true, help: 'Percent (e.g. 10) or USD amount.' },
      { key: 'active', label: 'Active', type: 'bool' },
      { key: 'note', label: 'Internal note', type: 'text', wide: true },
      sort,
    ],
  },
  {
    key: 'surf-packages',
    table: 'surf_packages',
    title: 'Surf packages',
    singular: 'surf package',
    group: 'Experiences',
    description: 'Surf packages are enquiry-based. Guests send a request and you reply with a tailored quote.',
    titleKey: 'title',
    columns: [
      { key: 'duration_label', label: 'Duration' },
      { key: 'price_from', label: 'From' },
      { key: 'status', label: 'Status' },
    ],
    galleryPrefix: 'surf',
    defaults: { status: 'draft', sort: 0, inclusions: [], accommodation_options: [], is_legacy: false, is_demo: false },
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', required: true },
      { key: 'summary', label: 'Short summary', type: 'textarea', wide: true },
      { key: 'description', label: 'Full description', type: 'textarea', wide: true },
      { key: 'duration_label', label: 'Duration label', type: 'text', help: 'e.g. 7 nights / 6 surf days' },
      { key: 'duration_nights', label: 'Nights', type: 'int', min: 1, max: 60 },
      { key: 'inclusions', label: 'Inclusions', type: 'list', wide: true, help: 'One per line.' },
      { key: 'accommodation_options', label: 'Accommodation options', type: 'list', wide: true, help: 'One per line.' },
      { key: 'price_from', label: 'Price from (USD)', type: 'money', help: 'Leave empty to show "Price on request".' },
      { key: 'price_note', label: 'Price note', type: 'text', help: 'e.g. per person, twin share' },
      cover,
      status,
      sort,
      { key: 'is_legacy', label: 'Carried over from the old website', type: 'bool' },
      isDemo,
    ],
  },
  {
    key: 'surf-breaks',
    table: 'surf_breaks',
    title: 'Surf breaks',
    singular: 'surf break',
    group: 'Experiences',
    description: 'Breaks listed on the Surf page.',
    titleKey: 'name',
    columns: [
      { key: 'wave', label: 'Wave' },
      { key: 'status', label: 'Status' },
    ],
    defaults: { status: 'draft', sort: 0 },
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'wave', label: 'Wave type', type: 'text', help: 'e.g. Right-hand reef, intermediate' },
      { key: 'description', label: 'Description', type: 'textarea', wide: true },
      status,
      sort,
    ],
  },
  {
    key: 'activities',
    table: 'activities',
    title: 'Activities & excursions',
    singular: 'activity',
    group: 'Experiences',
    description: 'Excursions guests can enquire about.',
    titleKey: 'title',
    columns: [
      { key: 'duration_label', label: 'Duration' },
      { key: 'price_from', label: 'From' },
      { key: 'status', label: 'Status' },
    ],
    galleryPrefix: 'activity',
    defaults: { status: 'draft', sort: 0, inclusions: [], is_demo: false },
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'URL slug', type: 'slug', required: true },
      { key: 'summary', label: 'Short summary', type: 'textarea', wide: true },
      { key: 'description', label: 'Full description', type: 'textarea', wide: true },
      { key: 'duration_label', label: 'Duration', type: 'text', help: 'e.g. Half day' },
      { key: 'inclusions', label: 'Inclusions', type: 'list', wide: true, help: 'One per line.' },
      { key: 'price_from', label: 'Price from (USD)', type: 'money' },
      { key: 'price_note', label: 'Price note', type: 'text' },
      cover,
      status,
      sort,
      isDemo,
    ],
  },
  {
    key: 'menu',
    table: 'menu_items',
    title: 'Menu',
    singular: 'menu item',
    group: 'Restaurant',
    description: 'Restaurant menu items, grouped by category on the public page.',
    titleKey: 'name',
    columns: [
      { key: 'category', label: 'Category' },
      { key: 'price', label: 'Price' },
      { key: 'status', label: 'Status' },
    ],
    defaults: { status: 'draft', sort: 0, dietary: [], is_demo: false },
    fields: [
      { key: 'category', label: 'Category', type: 'text', required: true, help: 'e.g. Breakfast, Mains, Drinks' },
      { key: 'name', label: 'Dish name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', wide: true },
      { key: 'price', label: 'Price (USD)', type: 'money' },
      { key: 'dietary', label: 'Dietary tags', type: 'list', help: 'One per line, e.g. Vegetarian' },
      status,
      sort,
      isDemo,
    ],
  },
]

export const COLLECTION_MAP = Object.fromEntries(COLLECTIONS.map((c) => [c.key, c])) as Record<string, Collection>

export const STATIC_GALLERIES = [
  { key: 'gallery', label: 'Gallery page' },
  { key: 'huraa', label: 'Discover Huraa page' },
  { key: 'restaurant', label: 'Restaurant page' },
] as const
