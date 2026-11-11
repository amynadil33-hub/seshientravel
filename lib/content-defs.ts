import { MEDIA } from '@/lib/demo-data'

export type ContentField = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image'
  default: string
  help?: string
}

export type PageDef = { page: string; title: string; path: string | null; fields: ContentField[] }

const t = (key: string, label: string, def: string, help?: string): ContentField => ({ key, label, type: 'text', default: def, help })
const ta = (key: string, label: string, def: string, help?: string): ContentField => ({ key, label, type: 'textarea', default: def, help })
const im = (key: string, label: string, def: string | null): ContentField => ({ key, label, type: 'image', default: def ?? '' })

export const PAGE_DEFS: PageDef[] = [
  {
    page: 'settings',
    title: 'Contact details & business info',
    path: null,
    fields: [
      t('business_name', 'Business name', 'Sea Shine Travel & Tours'),
      t('tagline', 'Tagline', 'Stays, surf and island adventures on Huraa'),
      t('phone', 'Phone', '+960 772 0325'),
      t('whatsapp', 'WhatsApp number (digits only, with country code)', '9607720325'),
      t('email', 'Email', 'stay@maldivesseashine.com'),
      t('address', 'Address', 'Madheena, Huraa, North Malé Atoll, Maldives'),
      t('map_link', 'Map link (URL)', 'https://www.google.com/maps/search/?api=1&query=Huraa+Maldives'),
      t('instagram', 'Instagram URL', ''),
      t('facebook', 'Facebook URL', ''),
      ta('booking_notice', 'Booking notice (shown during booking)', 'This is a booking request, not a confirmed reservation. Our team checks availability with the partner guesthouse and replies by email, usually within 24 hours. No payment is taken online.'),
    ],
  },
  {
    page: 'home',
    title: 'Home',
    path: '/',
    fields: [
      t('hero_title', 'Hero title', 'Your Huraa adventure starts here'),
      ta('hero_subtitle', 'Hero subtitle', 'Partner guesthouse stays, surf trips to North Malé’s reef breaks, island excursions and a table at our restaurant — arranged by a local team on Huraa.'),
      im('hero_image', 'Hero image', MEDIA.hero),
      t('intro_title', 'Island intro title', 'A real island, a short boat ride from Malé'),
      ta('intro_body', 'Island intro text', 'Huraa is a local inhabited island in North Malé Atoll. Sandy lanes, fishing boats in the harbour, a quiet mangrove lagoon and a bikini beach for swimming — with world-famous surf breaks on the horizon. We live here, and we help you experience it properly.'),
      im('intro_image', 'Island intro image', MEDIA.village),
      t('restaurant_title', 'Restaurant feature title', 'Eat with us on Huraa'),
      ta('restaurant_body', 'Restaurant feature text', 'Our restaurant is open to everyone on the island — guests of every partner guesthouse, surfers back from the boat, and visitors passing through. Menu and opening hours are kept up to date on the restaurant page.'),
      im('restaurant_image', 'Restaurant feature image', MEDIA.restaurant),
    ],
  },
  {
    page: 'discover',
    title: 'Discover Huraa',
    path: '/discover-huraa',
    fields: [
      t('hero_title', 'Hero title', 'Discover Huraa'),
      ta('hero_subtitle', 'Hero subtitle', 'Local island life in North Malé Atoll — beaches, boats, mangroves and the people who call it home.'),
      im('hero_image', 'Hero image', MEDIA.village),
      t('life_title', 'Island life title', 'Island life'),
      ta('life_body', 'Island life text', 'Huraa is a living community, not a resort. Mornings start with the call to prayer and fishing boats heading out; afternoons slow down under the breadfruit trees; evenings bring families to the waterfront. Walking the sandy streets is the best way to get to know it.'),
      im('life_image', 'Island life image', MEDIA.harbour),
      t('beaches_title', 'Beaches title', 'Beaches & lagoon'),
      ta('beaches_body', 'Beaches text', 'A designated tourist beach lets you swim and sunbathe in swimwear, with clear shallow water and soft white sand. Beyond the reef, sandbanks and snorkel spots are a short boat trip away.'),
      im('beaches_image', 'Beaches image', MEDIA.beach),
      t('culture_title', 'Culture title', 'Culture & etiquette'),
      ta('culture_body', 'Culture text', 'Huraa is a Muslim community. In the village, please cover shoulders and knees; swimwear is for the tourist beach. Alcohol is not available on local islands. Fridays are quieter, with shops closing around midday prayers.'),
      im('culture_image', 'Culture image', MEDIA.mangrove),
      ta('travel_info', 'Travel information (one item per line, “Label: details”)', 'Location: North Malé Atoll, Maldives\nGetting here: Speedboat or public ferry from Malé / Velana International Airport — transfer details are confirmed with your booking\nCurrency: Maldivian Rufiyaa (MVR); US dollars widely accepted\nDress code: Modest dress in the village; swimwear on the tourist beach\nBest surf season: Ask our team — depends on swell and wind', 'Transfer schedules and prices should only be added once verified.'),
    ],
  },
  {
    page: 'guesthouses',
    title: 'Guesthouses',
    path: '/guesthouses',
    fields: [
      t('hero_title', 'Hero title', 'Partner guesthouses on Huraa'),
      ta('hero_subtitle', 'Hero subtitle', 'We work with local guesthouses across the island. Send a booking request and we confirm availability for you.'),
      im('hero_image', 'Hero image', MEDIA.beach),
    ],
  },
  {
    page: 'surf',
    title: 'Surf packages',
    path: '/surf',
    fields: [
      t('hero_title', 'Hero title', 'Surf North Malé Atoll'),
      ta('hero_subtitle', 'Hero subtitle', 'Stay on Huraa and take the boat to the reef breaks. We match the trip to the swell, the wind and your level.'),
      im('hero_image', 'Hero image', MEDIA.surfReef),
      t('breaks_title', 'Breaks section title', 'The breaks'),
      ta('breaks_intro', 'Breaks intro', 'Conditions change daily. Our crew chooses the break that is working best and suits your experience.'),
    ],
  },
  {
    page: 'activities',
    title: 'Activities',
    path: '/activities',
    fields: [
      t('hero_title', 'Hero title', 'Island & ocean activities'),
      ta('hero_subtitle', 'Hero subtitle', 'Snorkelling, sandbanks, fishing and diving — arranged with local crews.'),
      im('hero_image', 'Hero image', MEDIA.snorkel),
    ],
  },
  {
    page: 'restaurant',
    title: 'Restaurant',
    path: '/restaurant',
    fields: [
      t('hero_title', 'Hero title', 'The Sea Shine restaurant'),
      ta('hero_subtitle', 'Hero subtitle', 'Island cooking, fresh fish and a relaxed table on Huraa.'),
      im('hero_image', 'Hero image', MEDIA.restaurant),
      t('story_title', 'Story title', 'Our story'),
      ta('story_body', 'Story text', 'Placeholder — replace with the restaurant’s own story: who cooks, what you are known for and what makes a meal here special. Avoid listing dishes or details here until verified.'),
      ta('hours', 'Opening hours (one per line)', 'Opening hours to be confirmed\nPlease contact us before visiting'),
      t('location', 'Location', 'Huraa, North Malé Atoll'),
      ta('reservation_note', 'Reservation note', 'Send a reservation enquiry and we will confirm your table by email or WhatsApp.'),
    ],
  },
  {
    page: 'about',
    title: 'About us',
    path: '/about',
    fields: [
      t('hero_title', 'Hero title', 'A local team on Huraa'),
      im('hero_image', 'Hero image', MEDIA.harbour),
      ta('body', 'About text', 'Sea Shine Travel & Tours is based on Huraa in North Malé Atoll. We no longer operate our own guesthouse. Instead, we promote the island, arrange stays at trusted partner guesthouses, organise surf trips and excursions, and run our restaurant.\n\nBecause we live here, we can match you with the right place to stay, the right boat on the right day, and the island experiences that make a trip memorable.'),
      ta('values', 'What we do (one per line)', 'Partner guesthouse bookings, confirmed personally\nSurf trips with local boat crews\nSnorkelling, sandbank and fishing excursions\nOur restaurant, open to everyone on the island'),
      im('side_image', 'Secondary image', MEDIA.village),
    ],
  },
  {
    page: 'gallery',
    title: 'Gallery',
    path: '/gallery',
    fields: [
      t('hero_title', 'Title', 'Gallery'),
      ta('hero_subtitle', 'Subtitle', 'Moments from Huraa — on the island, in the water and at the table.'),
    ],
  },
  {
    page: 'contact',
    title: 'Contact',
    path: '/contact',
    fields: [
      t('hero_title', 'Title', 'Get in touch'),
      ta('body', 'Intro text', 'Questions about stays, surf or activities? Send us a message and our team on Huraa will reply.'),
    ],
  },
  {
    page: 'privacy',
    title: 'Privacy policy',
    path: '/privacy',
    fields: [
      ta('body', 'Policy text (blank line between paragraphs; lines starting with “# ” become headings)', '# What we collect\nWhen you send a booking request or enquiry we collect your name, email, phone number, country, travel dates, party size and any notes you provide.\n\n# How we use it\nWe use this information only to respond to you, check availability with partner guesthouses and service providers, and manage your booking. We share the details needed to fulfil your request with the relevant partner.\n\n# Storage\nYour data is stored securely with our hosting and database providers. We keep booking records for as long as needed for accounting and legal purposes.\n\n# Your rights\nYou can ask us to access, correct or delete your personal data by emailing us.\n\n# Review required\nThis policy is a template and should be reviewed for your legal requirements before publishing.'),
    ],
  },
  {
    page: 'terms',
    title: 'Booking terms',
    path: '/booking-terms',
    fields: [
      ta('body', 'Terms text (blank line between paragraphs; lines starting with “# ” become headings)', '# Booking requests\nSubmitting a request does not confirm a reservation. A booking is only confirmed when you receive written confirmation from Sea Shine Travel & Tours.\n\n# Prices\nPrices shown are estimates calculated from current rates, taxes and fees and are confirmed with your booking. Rates may change until confirmation.\n\n# Payment\nNo payment is taken online. Payment arrangements are agreed with you on confirmation.\n\n# Changes and cancellations\nCancellation and change conditions depend on the partner guesthouse and are provided with your confirmation.\n\n# Review required\nThese terms are a template and should be reviewed before publishing.'),
    ],
  },
]

export const PAGE_DEF_MAP = Object.fromEntries(PAGE_DEFS.map((p) => [p.page, p])) as Record<string, PageDef>
