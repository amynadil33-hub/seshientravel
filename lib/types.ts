export type PublishStatus = 'draft' | 'published'

export type Media = {
  id: string
  url: string
  storage_path: string | null
  alt: string
  caption: string | null
  width: number | null
  height: number | null
  is_demo: boolean
  created_at: string
}

export type SiteSettings = {
  business_name: string
  tagline: string
  phone: string
  whatsapp: string
  email: string
  address: string
  map_link: string
  instagram: string
  facebook: string
  booking_notice: string
}

export type FeeKind =
  | 'percent'
  | 'percent_compound'
  | 'per_person_night'
  | 'per_room_night'
  | 'per_stay'

export type Fee = {
  id: string
  name: string
  kind: FeeKind
  amount: number
  active: boolean
  sort: number
  note: string | null
}

export type Guesthouse = {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  location: string
  map_link: string | null
  amenities: string[]
  house_rules: string | null
  cover_media_id: string | null
  status: PublishStatus
  is_demo: boolean
  sort: number
}

export type RoomType = {
  id: string
  guesthouse_id: string
  name: string
  description: string
  bed_config: string
  size_sqm: number | null
  max_adults: number
  max_children: number
  max_occupancy: number
  inventory: number
  base_rate: number
  min_nights: number
  amenities: string[]
  cover_media_id: string | null
  status: PublishStatus
  sort: number
}

export type SeasonalRate = {
  id: string
  room_type_id: string
  label: string
  start_date: string
  end_date: string
  nightly_rate: number
  min_nights: number | null
}

export type DateBlock = {
  id: string
  room_type_id: string
  start_date: string
  end_date: string
  units: number
  reason: string | null
}

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'paid' | 'refunded'

export type PriceLine = { label: string; amount: number }

export type PriceBreakdown = {
  nights: { date: string; rate: number; label: string }[]
  units: number
  accommodation: number
  fees: PriceLine[]
  feesTotal: number
  total: number
  currency: string
}

export type Booking = {
  id: string
  reference: string
  guesthouse_id: string
  room_type_id: string
  check_in: string
  check_out: string
  adults: number
  children: number
  units: number
  guest_name: string
  email: string
  phone: string
  country: string | null
  arrival_notes: string | null
  price_breakdown: PriceBreakdown
  total: number
  currency: string
  status: BookingStatus
  payment_status: PaymentStatus
  admin_notes: string | null
  cancellation_reason: string | null
  created_at: string
  decided_at: string | null
}

export type SurfPackage = {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  duration_label: string
  duration_nights: number | null
  inclusions: string[]
  accommodation_options: string[]
  price_from: number | null
  price_note: string | null
  cover_media_id: string | null
  status: PublishStatus
  is_legacy: boolean
  is_demo: boolean
  sort: number
}

export type SurfBreak = {
  id: string
  name: string
  description: string
  wave: string
  status: PublishStatus
  sort: number
}

export type Activity = {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  duration_label: string
  inclusions: string[]
  price_from: number | null
  price_note: string | null
  cover_media_id: string | null
  status: PublishStatus
  is_demo: boolean
  sort: number
}

export type MenuItem = {
  id: string
  category: string
  name: string
  description: string
  price: number | null
  dietary: string[]
  status: PublishStatus
  is_demo: boolean
  sort: number
}

export type EnquiryKind = 'surf' | 'activity' | 'restaurant' | 'contact' | 'guesthouse'
export type EnquiryStatus = 'new' | 'in_progress' | 'closed'

export type Enquiry = {
  id: string
  kind: EnquiryKind
  subject_id: string | null
  subject_title: string | null
  name: string
  email: string
  phone: string | null
  preferred_date: string | null
  party_size: number | null
  message: string
  status: EnquiryStatus
  created_at: string
}

export type ContentBlock = {
  id: string
  page: string
  key: string
  value: string | null
  media_id: string | null
}

export type GalleryItem = {
  id: string
  gallery_key: string
  media_id: string
  position: number
  caption: string | null
  status: PublishStatus
}
